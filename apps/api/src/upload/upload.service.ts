import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class UploadService {
    constructor(private readonly supabase: SupabaseService) { }

    async uploadAvatar(file: Express.Multer.File, userId: string): Promise<{ url: string }> {
        const ext = file.mimetype.split('/')[1] || 'jpg';
        const path = `avatars/${userId}/${Date.now()}.${ext}`;

        const { error } = await this.supabase.admin.storage
            .from('resume-assets')
            .upload(path, file.buffer, {
                contentType: file.mimetype,
                upsert: true,
            });

        if (error) throw new Error(error.message);

        const { data } = this.supabase.admin.storage
            .from('resume-assets')
            .getPublicUrl(path);

        return { url: data.publicUrl };
    }
}
