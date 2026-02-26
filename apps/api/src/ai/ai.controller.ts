import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AiService } from './ai.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api/ai')
@UseGuards(JwtAuthGuard)
export class AiController {
    constructor(private readonly ai: AiService) { }

    @Post('enhance-summary')
    enhanceSummary(@Body() body: { summary: string; jobTitle?: string }) {
        return this.ai.enhanceSummary(body.summary, body.jobTitle);
    }

    @Post('enhance-experience')
    enhanceExperience(@Body() body: { description: string; jobTitle: string }) {
        return this.ai.enhanceExperience(body.description, body.jobTitle);
    }

    @Post('suggest-skills')
    suggestSkills(@Body() body: { experience: any[]; currentSkills: string[] }) {
        return this.ai.suggestSkills(body.experience, body.currentSkills);
    }

    @Post('generate-cover-letter')
    generateCoverLetter(@Body() body: { resumeData: any; jobDescription: string }) {
        return this.ai.generateCoverLetter(body.resumeData, body.jobDescription);
    }

    @Post('ats-score')
    atsScore(@Body() body: { resumeData: any; jobDescription?: string }) {
        return this.ai.atsScore(body.resumeData, body.jobDescription);
    }

    @Post('section-tips')
    sectionTips(@Body() body: { sectionName: string; sectionData: any }) {
        return this.ai.getSectionTips(body.sectionName, body.sectionData);
    }
}
