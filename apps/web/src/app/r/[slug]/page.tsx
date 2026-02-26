'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Loader2, FileText, AlertCircle, Eye } from 'lucide-react';
import { resumeApi } from '@/lib/api';
import { ResumeData } from '@/types/resume';
import ResumePreview from '@/components/resume-preview/ResumePreview';

export default function PublicResumePage() {
    const params = useParams();
    const slug = params?.slug as string;

    const [resume, setResume] = useState<ResumeData | null>(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        if (!slug) return;
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
        fetch(`${apiUrl}/api/public/${slug}`)
            .then(async (res) => {
                if (!res.ok) throw new Error('Not found');
                const raw = await res.json();
                // Normalize snake_case → camelCase
                setResume({
                    id: raw.id,
                    userId: raw.user_id,
                    title: raw.title,
                    isPublic: raw.is_public,
                    slug: raw.slug,
                    viewCount: raw.view_count ?? 0,
                    template: raw.template ?? 'classic',
                    accentColor: raw.accent_color ?? 'blue',
                    personalInfo: raw.personal_info ?? {},
                    professionalSummary: raw.professional_summary ?? '',
                    experience: raw.experience ?? [],
                    education: raw.education ?? [],
                    projects: raw.projects ?? [],
                    skills: raw.skills ?? [],
                    languages: raw.languages ?? [],
                    certifications: raw.certifications ?? [],
                    createdAt: raw.created_at ?? '',
                    updatedAt: raw.updated_at ?? '',
                });
            })
            .catch(() => setNotFound(true))
            .finally(() => setLoading(false));
    }, [slug]);

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (notFound || !resume) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4 p-6">
                <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center">
                    <AlertCircle className="w-8 h-8 text-red-400" />
                </div>
                <h1 className="text-2xl font-extrabold text-slate-900">Resume not found</h1>
                <p className="text-slate-500 text-sm text-center max-w-xs">
                    This resume is either private or the link is no longer valid.
                </p>
                <Link href="/" className="btn-primary mt-2">
                    Go to ResumeAI
                </Link>
            </div>
        );
    }

    const name = resume.personalInfo?.fullName || 'Resume';
    const title = resume.personalInfo?.profession || '';

    return (
        <div className="min-h-screen bg-slate-100">
            {/* Minimal top bar */}
            <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
                <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
                            <FileText className="w-3.5 h-3.5 text-white" />
                        </div>
                        <div>
                            <span className="font-bold text-slate-900 text-sm">{name}</span>
                            {title && <span className="text-slate-400 text-xs ml-2">{title}</span>}
                        </div>
                        {(resume.viewCount ?? 0) > 0 && (
                            <span className="flex items-center gap-1 text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                                <Eye className="w-3 h-3" />
                                {resume.viewCount} {resume.viewCount === 1 ? 'view' : 'views'}
                            </span>
                        )}
                    </div>
                    <Link
                        href="/signup"
                        className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-primary text-white hover:bg-primary-dark transition-colors"
                    >
                        Build yours free →
                    </Link>
                </div>
            </header>

            {/* Resume content */}
            <main className="max-w-4xl mx-auto px-4 py-10">
                <ResumePreview resume={resume} />
            </main>

            {/* Footer CTA */}
            <footer className="border-t border-slate-200 bg-white py-8 mt-4">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <p className="text-slate-500 text-sm">
                        Built with{' '}
                        <Link href="/" className="text-primary font-semibold hover:underline">
                            ResumeAI
                        </Link>{' '}
                        — Create your professional resume for free
                    </p>
                    <Link href="/signup" className="btn-primary inline-flex mt-4 text-sm">
                        Get started for free →
                    </Link>
                </div>
            </footer>
        </div>
    );
}
