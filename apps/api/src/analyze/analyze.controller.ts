import {
    Controller, Post, UploadedFile, UseInterceptors,
    UseGuards, Body, BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { AnalyzeService } from './analyze.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api/analyze')
@UseGuards(JwtAuthGuard)
export class AnalyzeController {
    constructor(private readonly analyzeService: AnalyzeService) { }

    @Post('resume')
    @UseInterceptors(
        FileInterceptor('file', {
            storage: memoryStorage(),
            limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
            fileFilter: (_req, file, cb) => {
                const allowed = [
                    'application/pdf',
                    'application/msword',
                    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                    'text/plain',
                ];
                if (allowed.includes(file.mimetype)) {
                    cb(null, true);
                } else {
                    cb(new BadRequestException('Only PDF, DOCX, or TXT files are allowed'), false);
                }
            },
        }),
    )
    async analyze(
        @UploadedFile() file: Express.Multer.File,
        @Body('jobRole') jobRole: string,
    ) {
        if (!file) throw new BadRequestException('No file uploaded');
        if (!jobRole?.trim()) throw new BadRequestException('Job role is required');
        return this.analyzeService.analyzeResume(file.buffer, file.mimetype, jobRole.trim());
    }
}
