import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

// UUID v4 pattern
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

@Controller('api/public')
export class PublicController {
    constructor(private readonly supabase: SupabaseService) { }

    @Get(':slug')
    async getPublicResume(@Param('slug') slug: string) {
        // Always search by slug column first (share links always use the slug)
        let query = this.supabase.admin
            .from('resumes')
            .select('*')
            .eq('is_public', true)
            .eq('slug', slug);

        let { data, error } = await query.maybeSingle();

        // If not found by slug AND value looks like a full UUID, also try by id
        if (!data && !error && UUID_RE.test(slug)) {
            const res = await this.supabase.admin
                .from('resumes')
                .select('*')
                .eq('is_public', true)
                .eq('id', slug)
                .maybeSingle();
            data = res.data;
            error = res.error;
        }

        if (error || !data) throw new NotFoundException('Resume not found or not public');

        // Non-blocking view count increment — never delays the response
        void this.supabase.admin
            .from('resumes')
            .update({ view_count: (data.view_count ?? 0) + 1 })
            .eq('id', data.id);

        return data;
    }
}
