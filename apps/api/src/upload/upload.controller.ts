import {
    Controller, Post, UploadedFile, UseInterceptors, UseGuards, Request, BadRequestException
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UploadService } from './upload.service';

@Controller('api/upload')
@UseGuards(JwtAuthGuard)
export class UploadController {
    constructor(private readonly upload: UploadService) { }

    @Post('avatar')
    @UseInterceptors(FileInterceptor('file'))
    async uploadAvatar(@UploadedFile() file: Express.Multer.File, @Request() req) {
        if (!file) throw new BadRequestException('No file uploaded');
        return this.upload.uploadAvatar(file, req.user.id);
    }
}
