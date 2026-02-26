import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';
import { SupabaseModule } from '../supabase/supabase.module';

@Module({
    imports: [
        SupabaseModule,
        MulterModule.register({ storage: memoryStorage() }),
    ],
    controllers: [UploadController],
    providers: [UploadService],
})
export class UploadModule { }
