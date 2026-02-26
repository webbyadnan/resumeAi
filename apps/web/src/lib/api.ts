import axios from 'axios';
import { createClient } from '@/lib/supabase/client';
import { ResumeData } from '@/types/resume';

const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add auth token to every request
apiClient.interceptors.request.use(async (config) => {
    const supabase = createClient();
    const { data } = await supabase.auth.getSession();
    if (data.session?.access_token) {
        config.headers.Authorization = `Bearer ${data.session.access_token}`;
    }
    return config;
});

// ─── Snake_case → camelCase normalizer ────────────────────────────────────────
// The API stores data with snake_case column names; the frontend uses camelCase.
function normalizeResume(raw: Record<string, unknown>): ResumeData {
    return {
        id: (raw.id as string) ?? '',
        userId: (raw.user_id as string) ?? '',
        title: (raw.title as string) ?? 'Untitled',
        isPublic: (raw.is_public as boolean) ?? false,
        slug: (raw.slug as string | undefined),
        viewCount: (raw.view_count as number) ?? 0,
        template: (raw.template as ResumeData['template']) ?? 'classic',
        accentColor: (raw.accent_color as ResumeData['accentColor']) ?? 'blue',
        personalInfo: ((raw.personal_info ?? {}) as ResumeData['personalInfo']),
        professionalSummary: (raw.professional_summary as string) ?? '',
        experience: (raw.experience as ResumeData['experience']) ?? [],
        education: (raw.education as ResumeData['education']) ?? [],
        projects: (raw.projects as ResumeData['projects']) ?? [],
        skills: (raw.skills as string[]) ?? [],
        languages: (raw.languages as ResumeData['languages']) ?? [],
        certifications: (raw.certifications as ResumeData['certifications']) ?? [],
        createdAt: (raw.created_at as string) ?? '',
        updatedAt: (raw.updated_at as string) ?? '',
    };
}

// ─── camelCase → snake_case for PATCH/POST bodies ────────────────────────────
function serializeResume(updates: Partial<ResumeData>): Record<string, unknown> {
    const out: Record<string, unknown> = {};
    if (updates.title !== undefined) out.title = updates.title;
    if (updates.template !== undefined) out.template = updates.template;
    if (updates.accentColor !== undefined) out.accent_color = updates.accentColor;
    if (updates.isPublic !== undefined) out.is_public = updates.isPublic;
    if (updates.personalInfo !== undefined) out.personal_info = updates.personalInfo;
    if (updates.professionalSummary !== undefined) out.professional_summary = updates.professionalSummary;
    if (updates.experience !== undefined) out.experience = updates.experience;
    if (updates.education !== undefined) out.education = updates.education;
    if (updates.projects !== undefined) out.projects = updates.projects;
    if (updates.skills !== undefined) out.skills = updates.skills;
    if (updates.languages !== undefined) out.languages = updates.languages;
    if (updates.certifications !== undefined) out.certifications = updates.certifications;
    return out;
}

export default apiClient;

// ─── Resume API ───────────────────────────────────────────────────────────────
export const resumeApi = {
    list: async () => {
        const res = await apiClient.get<Record<string, unknown>[]>('/api/resumes');
        return { data: (res.data ?? []).map(normalizeResume) };
    },
    get: async (id: string) => {
        const res = await apiClient.get<Record<string, unknown>>(`/api/resumes/${id}`);
        return { data: normalizeResume(res.data) };
    },
    create: async (body: { title: string }) => {
        const res = await apiClient.post<Record<string, unknown>>('/api/resumes', body);
        return { data: normalizeResume(res.data) };
    },
    update: async (id: string, updates: Partial<ResumeData>) => {
        const res = await apiClient.patch<Record<string, unknown>>(
            `/api/resumes/${id}`,
            serializeResume(updates),
        );
        return { data: normalizeResume(res.data) };
    },
    delete: (id: string) => apiClient.delete(`/api/resumes/${id}`),
    togglePublic: async (id: string) => {
        const res = await apiClient.post<Record<string, unknown>>(`/api/resumes/${id}/toggle-public`);
        return { data: normalizeResume(res.data) };
    },
    duplicate: async (id: string) => {
        const res = await apiClient.post<Record<string, unknown>>(`/api/resumes/${id}/duplicate`);
        return { data: normalizeResume(res.data) };
    },
    getPublic: async (slug: string) => {
        const res = await apiClient.get<Record<string, unknown>>(`/api/public/${slug}`);
        return { data: normalizeResume(res.data) };
    },
};

// ─── AI API ───────────────────────────────────────────────────────────────────
export const aiApi = {
    enhanceSummary: (summary: string, jobTitle?: string) =>
        apiClient.post('/api/ai/enhance-summary', { summary, jobTitle }),
    enhanceExperience: (description: string, jobTitle: string) =>
        apiClient.post('/api/ai/enhance-experience', { description, jobTitle }),
    generateCoverLetter: (resumeData: Record<string, unknown>, jobDescription: string) =>
        apiClient.post<{ coverLetter: string }>('/api/ai/generate-cover-letter', { resumeData, jobDescription }),
    atsScore: (resumeData: Record<string, unknown>, jobDescription?: string) =>
        apiClient.post('/api/ai/ats-score', { resumeData, jobDescription }),
    suggestSkills: (experience: Record<string, unknown>[], currentSkills: string[]) =>
        apiClient.post('/api/ai/suggest-skills', { experience, currentSkills }),
    sectionTips: (sectionName: string, sectionData: unknown) =>
        apiClient.post<{ tips: string[] }>('/api/ai/section-tips', { sectionName, sectionData }),
};

// ─── Upload API ───────────────────────────────────────────────────────────────
export const uploadApi = {
    avatar: (file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        return apiClient.post('/api/upload/avatar', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    },
};

// ─── Export API ───────────────────────────────────────────────────────────────
export const exportApi = {
    pdf: (resumeId: string) =>
        apiClient.post(`/api/export/pdf/${resumeId}`, {}, { responseType: 'blob' }),
};
