import { Injectable } from '@nestjs/common';
import Groq from 'groq-sdk';

@Injectable()
export class LinkedInService {
    private groq: Groq;
    private model: string;

    constructor() {
        this.groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
        this.model = process.env.GROQ_MODEL || 'llama3-70b-8192';
    }

    async parseLinkedInData(rawText: string): Promise<Record<string, unknown>> {
        const prompt = `You are a resume data extractor. Parse the following LinkedIn profile data (CSV or JSON export) and extract the resume information.

LinkedIn data:
${rawText.slice(0, 8000)}

Return a JSON object with EXACTLY this structure (use empty strings/arrays for missing fields):
{
  "personalInfo": {
    "fullName": "",
    "email": "",
    "phone": "",
    "location": "",
    "profession": "",
    "website": "",
    "linkedin": ""
  },
  "professionalSummary": "",
  "experience": [
    {
      "id": "1",
      "company": "",
      "position": "",
      "startDate": "",
      "endDate": "",
      "current": false,
      "description": ""
    }
  ],
  "education": [
    {
      "id": "1",
      "institution": "",
      "degree": "",
      "field": "",
      "startDate": "",
      "endDate": "",
      "description": ""
    }
  ],
  "skills": [],
  "certifications": [
    {
      "id": "1",
      "name": "",
      "issuer": "",
      "date": "",
      "url": ""
    }
  ]
}

Return ONLY the JSON, no extra text. Generate UUIDs as simple incrementing numbers for ids.`;

        const res = await this.groq.chat.completions.create({
            model: this.model,
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.2,
            max_tokens: 3000,
        });

        const raw = res.choices[0]?.message?.content?.trim() || '';
        const match = raw.match(/\{[\s\S]*\}/);
        if (!match) throw new Error('Failed to parse LinkedIn data');

        return JSON.parse(match[0]);
    }
}
