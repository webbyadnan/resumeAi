import { Injectable } from '@nestjs/common';
import Groq from 'groq-sdk';

@Injectable()
export class AiService {
    private groq: Groq;
    private model: string;

    constructor() {
        this.groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
        this.model = process.env.GROQ_MODEL || 'llama3-70b-8192';
    }

    private async complete(prompt: string): Promise<string> {
        const res = await this.groq.chat.completions.create({
            model: this.model,
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.7,
            max_tokens: 1024,
        });
        return res.choices[0]?.message?.content?.trim() || '';
    }

    async enhanceSummary(summary: string, jobTitle?: string): Promise<{ enhanced: string }> {
        const prompt = `You are a professional resume writer. Enhance the following professional summary for ${jobTitle || 'a professional'}.

Make it:
- Compelling and achievement-focused
- 3-4 sentences max
- ATS-friendly
- Start with a strong action or identity statement

Original summary: "${summary}"

Return ONLY the enhanced summary text, no explanations.`;

        const enhanced = await this.complete(prompt);
        return { enhanced };
    }

    async enhanceExperience(description: string, jobTitle: string): Promise<{ enhanced: string }> {
        const prompt = `You are a professional resume writer. Enhance the following job description for a ${jobTitle} role.

Guidelines:
- Use strong action verbs (Led, Built, Increased, Optimized, etc.)
- Include quantifiable results where possible
- Keep to 3-4 bullet points or a concise paragraph
- Make it ATS-friendly

Original description: "${description}"

Return ONLY the enhanced description, no extra commentary.`;

        const enhanced = await this.complete(prompt);
        return { enhanced };
    }

    async suggestSkills(experience: any[], currentSkills: string[]): Promise<{ suggestions: string[] }> {
        const expSummary = experience
            .map((e) => `${e.jobTitle || e.job_title} at ${e.companyName || e.company_name}: ${e.description || ''}`)
            .join('\n');

        const prompt = `Based on this work experience, suggest 8-12 relevant skills for a resume.

Experience:
${expSummary}

Current skills (don't repeat these): ${currentSkills.join(', ')}

Return ONLY a JSON array of skill strings, like: ["Skill1", "Skill2", ...]
No explanations, just the JSON array.`;

        const raw = await this.complete(prompt);
        try {
            const match = raw.match(/\[[\s\S]*\]/);
            const suggestions: string[] = match ? JSON.parse(match[0]) : [];
            return { suggestions: suggestions.slice(0, 12) };
        } catch {
            return { suggestions: [] };
        }
    }

    async generateCoverLetter(resumeData: any, jobDescription: string): Promise<{ coverLetter: string }> {
        const name = resumeData?.personalInfo?.fullName || resumeData?.personal_info?.full_name || 'Candidate';
        const role = resumeData?.personalInfo?.profession || resumeData?.personal_info?.profession || 'professional';

        const prompt = `Write a professional cover letter for ${name}, a ${role}, for this job:

${jobDescription}

Key points from their experience:
${JSON.stringify(resumeData?.experience?.slice(0, 2) || [], null, 2)}

Skills: ${(resumeData?.skills || []).join(', ')}

Write a 3-paragraph cover letter: introduction, why they're a great fit, closing call-to-action.
Return ONLY the cover letter text.`;

        const coverLetter = await this.complete(prompt);
        return { coverLetter };
    }

    async atsScore(resumeData: any, jobDescription?: string): Promise<{ score: number; suggestions: string[]; strengths: string[]; missingKeywords: string[] }> {
        const prompt = `Analyze this resume data and provide an ATS (Applicant Tracking System) score.

Resume data: ${JSON.stringify(resumeData, null, 2)}
${jobDescription ? `\nJob description: ${jobDescription}` : ''}

Return a JSON object with:
{
  "score": <number 0-100>,
  "strengths": [<3-5 things done well>],
  "suggestions": [<3-5 improvements>],
  "missingKeywords": [<keywords missing from resume>]
}

Return ONLY the JSON, no extra text.`;

        const raw = await this.complete(prompt);
        try {
            const match = raw.match(/\{[\s\S]*\}/);
            return match ? JSON.parse(match[0]) : { score: 70, strengths: [], suggestions: [], missingKeywords: [] };
        } catch {
            return { score: 70, strengths: [], suggestions: ['Add more detail to your experience'], missingKeywords: [] };
        }
    }

    async getSectionTips(sectionName: string, sectionData: any): Promise<{ tips: string[] }> {
        const prompt = `You are an expert resume career coach. A user is filling the "${sectionName}" section of their resume.

Section data: ${JSON.stringify(sectionData, null, 2)}

Give exactly 3 short, specific, actionable tips to improve this section for maximum impact and ATS performance.
Each tip should be 1 sentence max.

Return ONLY a JSON array of 3 strings, e.g.:
["Tip 1", "Tip 2", "Tip 3"]

No extra text, no markdown.`;

        const raw = await this.complete(prompt);
        try {
            const match = raw.match(/\[[\s\S]*\]/);
            const tips = match ? JSON.parse(match[0]) : [];
            return { tips: tips.slice(0, 3) };
        } catch {
            return { tips: ['Add quantifiable achievements', 'Use strong action verbs', 'Keep entries concise and relevant'] };
        }
    }
}
