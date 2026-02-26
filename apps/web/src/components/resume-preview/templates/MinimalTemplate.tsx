'use client';

import { ResumeData } from '@/types/resume';
import { Mail, Phone, MapPin, Linkedin, Globe } from 'lucide-react';

interface Props {
    resume: ResumeData;
    accentColor: string;
}

export default function MinimalTemplate({ resume, accentColor }: Props) {
    const p = resume.personalInfo;
    const fmt = (d: string) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '';

    return (
        <div className="px-10 py-8 text-slate-800 text-[12px]" style={{ fontFamily: 'Inter, sans-serif' }}>
            {/* Minimal header */}
            <div className="mb-6">
                <h1 className="text-[26px] font-extrabold tracking-tight text-slate-900">{p.fullName || 'Your Name'}</h1>
                {p.profession && <p className="text-[13px] text-slate-500 font-medium mt-0.5">{p.profession}</p>}
                <div className="flex flex-wrap gap-4 mt-2 text-slate-500 text-[11px]">
                    {p.email && <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {p.email}</span>}
                    {p.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {p.phone}</span>}
                    {p.location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {p.location}</span>}
                    {p.linkedIn && <span className="flex items-center gap-1"><Linkedin className="w-3 h-3" /> {p.linkedIn}</span>}
                    {p.website && <span className="flex items-center gap-1"><Globe className="w-3 h-3" /> {p.website}</span>}
                </div>
            </div>

            {/* Thin accent rule */}
            <div className="h-px mb-6" style={{ backgroundColor: accentColor }} />

            <div className="space-y-5">
                {resume.professionalSummary && (
                    <p className="text-slate-600 leading-relaxed">{resume.professionalSummary}</p>
                )}

                {(resume.experience || []).length > 0 && (
                    <MinSection title="Experience" accentColor={accentColor}>
                        {(resume.experience || []).map((exp, i) => (
                            <div key={exp.id || i} className="mb-3">
                                <div className="flex justify-between items-baseline">
                                    <h4 className="font-semibold text-[13px]">{exp.jobTitle} <span className="text-slate-400 font-normal">at {exp.companyName}</span></h4>
                                    <span className="text-slate-400 text-[11px]">{fmt(exp.startDate)} – {exp.currentlyWorking ? 'Present' : fmt(exp.endDate)}</span>
                                </div>
                                {exp.description && <p className="text-slate-600 mt-0.5">{exp.description}</p>}
                            </div>
                        ))}
                    </MinSection>
                )}

                {(resume.education || []).length > 0 && (
                    <MinSection title="Education" accentColor={accentColor}>
                        {(resume.education || []).map((edu, i) => (
                            <div key={edu.id || i} className="flex justify-between items-baseline mb-1.5">
                                <h4 className="font-semibold text-[13px]">{edu.degree} {edu.fieldOfStudy && `in ${edu.fieldOfStudy}`} <span className="text-slate-400 font-normal">· {edu.institution}</span></h4>
                                <span className="text-slate-400 text-[11px]">{fmt(edu.graduationDate)}</span>
                            </div>
                        ))}
                    </MinSection>
                )}

                {(resume.skills || []).length > 0 && (
                    <MinSection title="Skills" accentColor={accentColor}>
                        <p className="text-slate-600">{(resume.skills || []).join(' · ')}</p>
                    </MinSection>
                )}

                {(resume.projects || []).length > 0 && (
                    <MinSection title="Projects" accentColor={accentColor}>
                        {(resume.projects || []).map((proj, i) => (
                            <div key={proj.id || i} className="mb-2">
                                <h4 className="font-semibold text-[13px]">{proj.name} {proj.type && <span className="text-slate-400 font-normal">· {proj.type}</span>}</h4>
                                {proj.description && <p className="text-slate-600 mt-0.5">{proj.description}</p>}
                            </div>
                        ))}
                    </MinSection>
                )}
            </div>
        </div>
    );
}

function MinSection({ title, accentColor, children }: { title: string; accentColor: string; children: React.ReactNode }) {
    return (
        <div>
            <h3 className="text-[11px] font-bold uppercase tracking-widest mb-2" style={{ color: accentColor }}>{title}</h3>
            {children}
        </div>
    );
}
