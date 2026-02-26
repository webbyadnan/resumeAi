import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { randomUUID as uuid } from 'crypto';

@Injectable()
export class ResumesService {
    constructor(private readonly supabase: SupabaseService) { }

    async listByUser(userId: string) {
        const { data, error } = await this.supabase.admin
            .from('resumes')
            .select('*')
            .eq('user_id', userId)
            .order('updated_at', { ascending: false });

        if (error) {
            console.error('[ResumesService.listByUser] Supabase error:', error);
            throw new InternalServerErrorException(error.message);
        }
        return data ?? [];
    }

    async create(userId: string, title: string) {
        const { data, error } = await this.supabase.admin
            .from('resumes')
            .insert({
                id: uuid(),
                user_id: userId,
                title,
                template: 'classic',
                accent_color: 'blue',
                personal_info: {},
                professional_summary: '',
                experience: [],
                education: [],
                projects: [],
                skills: [],
                languages: [],
                certifications: [],
                is_public: false,
            })
            .select()
            .single();

        if (error) {
            console.error('[ResumesService.create] Supabase error:', error);
            throw new InternalServerErrorException(error.message);
        }
        return data;
    }

    async duplicate(id: string, userId: string) {
        const original = await this.findOne(id, userId);
        const { data, error } = await this.supabase.admin
            .from('resumes')
            .insert({
                id: uuid(),
                user_id: userId,
                title: `Copy of ${original.title}`,
                template: original.template,
                accent_color: original.accent_color,
                personal_info: original.personal_info,
                professional_summary: original.professional_summary,
                experience: original.experience,
                education: original.education,
                projects: original.projects,
                skills: original.skills,
                languages: original.languages,
                certifications: original.certifications,
                is_public: false,   // always private on clone
                slug: null,
            })
            .select()
            .single();

        if (error) {
            console.error('[ResumesService.duplicate] Supabase error:', error);
            throw new InternalServerErrorException(error.message);
        }
        return data;
    }

    async findOne(id: string, userId: string) {
        const { data, error } = await this.supabase.admin
            .from('resumes')
            .select('*')
            .eq('id', id)
            .eq('user_id', userId)
            .single();

        if (error || !data) throw new NotFoundException('Resume not found');
        return data;
    }

    async update(id: string, userId: string, updates: any) {
        const { data, error } = await this.supabase.admin
            .from('resumes')
            .update({ ...updates, updated_at: new Date().toISOString() })
            .eq('id', id)
            .eq('user_id', userId)
            .select()
            .single();

        if (error) {
            console.error('[ResumesService.update] Supabase error:', error);
            throw new InternalServerErrorException(error.message);
        }
        return data;
    }

    async remove(id: string, userId: string) {
        const { error } = await this.supabase.admin
            .from('resumes')
            .delete()
            .eq('id', id)
            .eq('user_id', userId);

        if (error) {
            console.error('[ResumesService.remove] Supabase error:', error);
            throw new InternalServerErrorException(error.message);
        }
        return { success: true };
    }

    async togglePublic(id: string, userId: string) {
        const resume = await this.findOne(id, userId);
        const makingPublic = !resume.is_public;

        // Generate a slug if making public and none exists yet
        const slug = makingPublic && !resume.slug ? uuid().replace(/-/g, '').slice(0, 12) : resume.slug;

        const { data, error } = await this.supabase.admin
            .from('resumes')
            .update({
                is_public: makingPublic,
                slug: makingPublic ? slug : resume.slug,
            })
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error('[ResumesService.togglePublic] Supabase error:', error);
            throw new InternalServerErrorException(error.message);
        }
        return data;
    }
}
