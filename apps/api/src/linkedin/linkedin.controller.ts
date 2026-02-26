import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { LinkedInService } from './linkedin.service';

@Controller('api/linkedin')
@UseGuards(JwtAuthGuard)
export class LinkedInController {
    constructor(private readonly linkedin: LinkedInService) { }

    @Post('import')
    import(@Body() body: { rawText: string }) {
        return this.linkedin.parseLinkedInData(body.rawText);
    }
}
