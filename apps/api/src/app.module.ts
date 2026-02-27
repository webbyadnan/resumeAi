import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ResumesModule } from './resumes/resumes.module';
import { AiModule } from './ai/ai.module';
import { UploadModule } from './upload/upload.module';
import { ExportModule } from './export/export.module';
import { PublicModule } from './public/public.module';
import { SupabaseModule } from './supabase/supabase.module';
import { AuthModule } from './auth/auth.module';
import { AnalyzeModule } from './analyze/analyze.module';
import { LinkedInModule } from './linkedin/linkedin.module';
import { AppController } from './app.controller';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        SupabaseModule,
        AuthModule,
        ResumesModule,
        AiModule,
        UploadModule,
        ExportModule,
        AnalyzeModule,
        PublicModule,
        LinkedInModule,
    ],
    controllers: [AppController],
})
export class AppModule { }
