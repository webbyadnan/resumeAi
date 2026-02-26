'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const templates = [
    {
        id: 'classic',
        name: 'Classic',
        description: 'A clean, traditional format with clear sections and professional typography.',
        tag: 'Most Popular',
        tagColor: 'bg-primary text-white',
    },
    {
        id: 'modern',
        name: 'Modern',
        description: 'Sleek design with strategic use of color and contemporary font choices.',
        tag: 'Trending',
        tagColor: 'bg-accent text-white',
    },
    {
        id: 'executive',
        name: 'Executive',
        description: 'Bold, high-impact layout for senior professionals and executives.',
        tag: 'Premium',
        tagColor: 'bg-slate-800 text-white',
    },
    {
        id: 'creative',
        name: 'Creative',
        description: 'Eye-catching design with unique layout for creative professionals.',
        tag: 'New',
        tagColor: 'bg-purple-500 text-white',
    },
    {
        id: 'minimal_image',
        name: 'Minimal Image',
        description: 'Clean design with a profile photo and elegant sidebar layout.',
        tag: '',
        tagColor: '',
    },
    {
        id: 'minimal',
        name: 'Minimal',
        description: 'Ultra-clean design that puts your content front and center.',
        tag: '',
        tagColor: '',
    },
];

// Simple template preview SVGs
const TemplatePreview = ({ id }: { id: string }) => {
    const colors: Record<string, string> = {
        classic: '#4F6EF7',
        modern: '#0EA5E9',
        executive: '#1E293B',
        creative: '#8B5CF6',
        minimal_image: '#4F6EF7',
        minimal: '#64748B',
    };
    const color = colors[id] || '#4F6EF7';

    return (
        <div className="w-full aspect-[3/4] bg-white rounded-lg border border-slate-200 p-3 shadow-sm">
            {id === 'minimal_image' && (
                <div className="flex gap-2 h-full">
                    <div className="w-1/3 bg-slate-50 rounded p-2">
                        <div className="w-10 h-10 rounded-full mx-auto mb-2" style={{ backgroundColor: `${color}20` }} />
                        <div className="space-y-1">
                            {[3, 4, 3, 2].map((w, i) => (
                                <div key={i} className={`h-1.5 rounded-full`} style={{ width: `${w * 25}%`, backgroundColor: `${color}30` }} />
                            ))}
                        </div>
                    </div>
                    <div className="flex-1 space-y-2">
                        <div className="h-2.5 rounded-full" style={{ backgroundColor: color, width: '70%' }} />
                        <div className="h-1.5 rounded-full bg-slate-100 w-1/2" />
                        {[100, 85, 90].map((w, i) => (
                            <div key={i} className="h-1.5 rounded-full bg-slate-100" style={{ width: `${w}%` }} />
                        ))}
                    </div>
                </div>
            )}
            {id !== 'minimal_image' && (
                <div className="space-y-2">
                    <div className={`${id === 'modern' || id === 'creative' ? 'rounded-lg p-2' : ''}`}
                        style={id === 'modern' || id === 'creative' ? { backgroundColor: `${color}15` } : {}}>
                        <div className="h-3 rounded-full mx-auto mb-1" style={{ backgroundColor: color, width: id === 'executive' ? '60%' : '50%' }} />
                        <div className="h-1.5 rounded-full bg-slate-100 mx-auto" style={{ width: '40%' }} />
                    </div>
                    <div className="border-t border-slate-100 pt-2 space-y-1.5">
                        {[1, 2, 3].map((section) => (
                            <div key={section}>
                                <div className="h-1.5 rounded-full mb-1" style={{ backgroundColor: color, width: '30%' }} />
                                <div className="space-y-1">
                                    {[100, 85, 70].map((w, i) => (
                                        <div key={i} className="h-1.5 rounded-full bg-slate-100" style={{ width: `${w}%` }} />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default function TemplatesSection() {
    return (
        <section id="templates" className="section-padding bg-white">
            <div className="container-custom">
                <div className="text-center mb-14">
                    <span className="inline-block text-xs font-semibold text-primary uppercase tracking-widest mb-3">
                        Templates
                    </span>
                    <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">
                        6 Professional Templates
                    </h2>
                    <p className="text-lg text-slate-500 max-w-2xl mx-auto">
                        Every template is carefully designed to impress recruiters and pass ATS systems.
                        Fully customizable with accent colors.
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    {templates.map((template) => (
                        <div
                            key={template.id}
                            className="group cursor-pointer rounded-2xl border border-slate-100 bg-background p-4 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/8 transition-all duration-300 card-hover"
                        >
                            <div className="relative mb-4">
                                <TemplatePreview id={template.id} />
                                {template.tag && (
                                    <span className={`absolute top-2 right-2 text-xs font-bold px-2 py-0.5 rounded-full ${template.tagColor}`}>
                                        {template.tag}
                                    </span>
                                )}
                            </div>
                            <h3 className="font-bold text-slate-900 mb-1">{template.name}</h3>
                            <p className="text-xs text-slate-500 leading-relaxed">{template.description}</p>
                        </div>
                    ))}
                </div>

                <div className="text-center mt-10">
                    <Link href="/signup" className="btn-primary inline-flex items-center gap-2">
                        Use a template <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
