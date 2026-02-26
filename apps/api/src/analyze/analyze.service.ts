import { Injectable, BadRequestException } from '@nestjs/common';
import Groq from 'groq-sdk';
import * as mammoth from 'mammoth';

export interface AnalysisResult {
    score: number;
    jobRole: string;
    strengths: string[];
    weaknesses: string[];
    missingKeywords: string[];
    suggestions: string[];
    skillsToAdd: string[];
    sectionRatings: {
        contactInfo: number;
        summary: number;
        experience: number;
        education: number;
        skills: number;
        overall: number;
    };
    verdict: string;
}

/**
 * Extracts readable text from a PDF buffer without any npm library.
 * Reads the raw PDF content stream and picks out readable ASCII/UTF-8 strings.
 * Works well for text-based PDFs (not scanned images).
 */
function extractPdfTextRaw(buffer: Buffer): string {
    const raw = buffer.toString('latin1');

    const texts: string[] = [];

    // Extract text from PDF string literals inside content streams
    // Matches (text) and <hex> encoded strings within BT...ET blocks
    const btEtBlocks = raw.match(/BT[\s\S]*?ET/g) || [];
    for (const block of btEtBlocks) {
        // Parentheses-encoded strings: (Hello World)
        const parenMatches = block.match(/\(([^)\\]*(?:\\.[^)\\]*)*)\)/g) || [];
        for (const m of parenMatches) {
            const inner = m.slice(1, -1)
                .replace(/\\n/g, '\n')
                .replace(/\\r/g, '\r')
                .replace(/\\t/g, '\t')
                .replace(/\\\(/g, '(')
                .replace(/\\\)/g, ')')
                .replace(/\\\\/g, '\\');
            texts.push(inner);
        }
    }

    // Fallback: extract all printable strings >= 4 chars from entire PDF
    if (texts.join('').trim().length < 100) {
        const fallback = raw.match(/[^\x00-\x08\x0b\x0c\x0e-\x1f\x7f-\xff]{4,}/g) || [];
        // Filter out PDF structural noise
        const clean = fallback
            .filter(s => !/^(<<|>>|obj|endobj|stream|endstream|xref|trailer|startxref|PDF-\d|%%EOF)/.test(s))
            .filter(s => /[a-zA-Z]{2,}/.test(s));
        return clean.join(' ');
    }

    return texts.join(' ');
}

@Injectable()
export class AnalyzeService {
    private groq: Groq;
    private model: string;

    constructor() {
        this.groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
        this.model = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';
    }

    private async extractText(buffer: Buffer, mimetype: string): Promise<string> {
        console.log(`[AnalyzeService] Extracting — mimetype: ${mimetype}, size: ${buffer.length}B`);

        if (mimetype === 'application/pdf') {
            const text = extractPdfTextRaw(buffer);
            console.log(`[AnalyzeService] PDF extracted, length: ${text.length}`);
            return text;
        }

        if (
            mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
            mimetype === 'application/msword'
        ) {
            try {
                const buf = Buffer.isBuffer(buffer) ? buffer : Buffer.from(buffer);
                const result = await mammoth.extractRawText({ buffer: buf });
                console.log(`[AnalyzeService] DOCX extracted, length: ${result.value.length}`);
                return result.value;
            } catch (err) {
                console.error('[AnalyzeService] mammoth error:', err);
                throw err;
            }
        }

        // Plain text fallback
        return buffer.toString('utf8');
    }

    async analyzeResume(
        fileBuffer: Buffer,
        mimetype: string,
        jobRole: string,
    ): Promise<AnalysisResult> {
        let resumeText: string;
        try {
            resumeText = await this.extractText(fileBuffer, mimetype);
        } catch (err) {
            console.error('[AnalyzeService] Text extraction failed:', err);
            throw new BadRequestException('Could not read the uploaded file. Please upload a valid PDF or DOCX.');
        }

        console.log(`[AnalyzeService] Extracted text preview: ${resumeText.slice(0, 200)}`);

        if (!resumeText || resumeText.trim().length < 50) {
            throw new BadRequestException('The file appears to be empty or is a scanned image PDF. Please upload a text-based PDF or DOCX.');
        }

        const prompt = `You are an expert recruiter and career coach. Analyze the following resume for a candidate applying for the role of "${jobRole}".

RESUME TEXT:
---
${resumeText.slice(0, 6000)}
---

Provide a detailed analysis and return ONLY a valid JSON object with this exact structure:
{
  "score": <number 0-100, overall match score for this role>,
  "jobRole": "${jobRole}",
  "strengths": [<3-5 specific strengths this resume has for this role>],
  "weaknesses": [<3-5 specific gaps or weaknesses for this role>],
  "missingKeywords": [<6-10 important keywords/skills missing that recruiters look for in "${jobRole}">],
  "suggestions": [<5-7 specific, actionable improvements they should make to the resume>],
  "skillsToAdd": [<5-8 skills they should learn or add to be more competitive for "${jobRole}">],
  "sectionRatings": {
    "contactInfo": <number 0-10>,
    "summary": <number 0-10>,
    "experience": <number 0-10>,
    "education": <number 0-10>,
    "skills": <number 0-10>,
    "overall": <number 0-10>
  },
  "verdict": "<2-3 sentence honest overall assessment for this specific role>"
}

Be specific, honest, and role-focused. Return ONLY the JSON, no extra text.`;

        const raw = await this.groq.chat.completions.create({
            model: this.model,
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.4,
            max_tokens: 2048,
        });

        const content = raw.choices[0]?.message?.content?.trim() || '';

        try {
            const match = content.match(/\{[\s\S]*\}/);
            if (!match) throw new Error('No JSON found');
            return JSON.parse(match[0]) as AnalysisResult;
        } catch {
            throw new BadRequestException('AI analysis failed. Please try again.');
        }
    }
}
