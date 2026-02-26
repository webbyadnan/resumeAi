import { Controller, Post, Param, UseGuards, Request, Res } from '@nestjs/common';
import { Response } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ExportService } from './export.service';

@Controller('api/export')
@UseGuards(JwtAuthGuard)
export class ExportController {
    constructor(private readonly export_: ExportService) { }

    @Post('pdf/:resumeId')
    async exportPdf(
        @Param('resumeId') resumeId: string,
        @Request() req,
        @Res() res: Response,
    ) {
        const pdf = await this.export_.generatePdf(resumeId, req.user.id);
        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="resume.pdf"`,
            'Content-Length': pdf.length,
        });
        res.end(pdf);
    }
}
