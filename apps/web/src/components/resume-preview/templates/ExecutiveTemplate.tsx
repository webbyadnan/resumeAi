'use client';

import { ResumeData } from '@/types/resume';
import { Mail, Phone, MapPin, Linkedin, Globe } from 'lucide-react';

interface Props {
    resume: ResumeData;
    accentColor: string;
}

export default function ExecutiveTemplate({ resume, accentColor }: Props) {
    const p = resume.personalInfo;
    const fmt = (d: string) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '';

    return (
        <div className="text-slate-900 text-[12px]" style={{ fontFamily: 'Georgia, serif' }}>
            {/* Bold header bar */}
            <div className="px-8 py-7 bg-slate-900 text-white">
                <h1 className="text-[30px] font-bold tracking-tight">{p.fullName || 'Your Name'}</h1>
                {p.profession && <p className="mt-1 text-[14px] font-light text-slate-300 uppercase tracking-[0.15em]">{p.profession}</p>}
                <div className="flex flex-wrap gap-4 mt-4 text-slate-400 text-[11px]">
                    {p.email && <span className="flex items-center gap-1.5"><Mail className="w-3 h-3" /> {p.email}</span>}
                    {p.phone && <span className="flex items-center gap-1.5"><Phone className="w-3 h-3" /> {p.phone}</span>}
                    {p.location && <span className="flex items-center gap-1.5"><MapPin className="w-3 h-3" /> {p.location}</span>}
                    {p.linkedIn && <span className="flex items-center gap-1.5"><Linkedin className="w-3 h-3" /> {p.linkedIn}</span>}
                </div>
            </div>

            <div className="px-8 py-5 space-y-5">
                {resume.professionalSummary && (
                    <div className="border-l-4 pl-4" style={{ borderColor: accentColor }}>
                        <p className="text-slate-600 italic leading-relaxed">{resume.professionalSummary}</p>
                    </div>
                )}

                {(resume.experience || []).length > 0 && (
                    <ExecSection title="Career History" accentColor={accentColor}>
                        {(resume.experience || []).map((exp, i) => (
                            <div key={exp.id || i} className="mb-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h4 className="font-bold text-slate-900 text-[14px]">{exp.jobTitle}</h4>
                                        <p className="text-[13px]" style={{ color: accentColor }}>{exp.companyName}</p>
                                    </div>
                                    <span className="text-slate-400 text-[11px] whitespace-nowrap ml-4 font-light">
                                        {fmt(exp.startDate)} – {exp.currentlyWorking ? 'Present' : fmt(exp.endDate)}
                                    </span>
                                </div>
                                {exp.description && <p className="text-slate-600 mt-1.5 leading-relaxed">{exp.description}</p>}
                            </div>
                        ))}
                    </ExecSection>
                )}

                {(resume.education || []).length > 0 && (
                    <ExecSection title="Education" accentColor={accentColor}>
                        {(resume.education || []).map((edu, i) => (
                            <div key={edu.id || i} className="flex justify-between mb-2">
                                <div>
                                    <h4 className="font-bold text-slate-900 text-[13px]">{edu.degree} {edu.fieldOfStudy && `in ${edu.fieldOfStudy}`}</h4>
                                    <p className="text-slate-500">{edu.institution}</p>
                                </div>
                                <span className="text-slate-400 text-[11px] whitespace-nowrap">{fmt(edu.graduationDate)}</span>
                            </div>
                        ))}
                    </ExecSection>
                )}

                {(resume.skills || []).length > 0 && (
                    <ExecSection title="Core Competencies" accentColor={accentColor}>
                        <div className="grid grid-cols-3 gap-2">
                            {(resume.skills || []).map((skill, i) => (
                                <div key={i} className="text-[11px] text-slate-700 flex items-center gap-1.5">
                                    <span className="w-1 h-1 rounded-full flex-shrink-0" style={{ backgroundColor: accentColor }} />
                                    {skill}
                                </div>
                            ))}
                        </div>
                    </ExecSection>
                )}

                {(resume.projects || []).length > 0 && (
                    <ExecSection title="Key Projects" accentColor={accentColor}>
                        {(resume.projects || []).map((proj, i) => (
                            <div key={proj.id || i} className="mb-2">
                                <h4 className="font-bold text-[13px] text-slate-900">{proj.name} {proj.type && <span className="font-light text-slate-400">· {proj.type}</span>}</h4>
                                {proj.description && <p className="text-slate-600 text-[11px] mt-0.5">{proj.description}</p>}
                            </div>
                        ))}
                    </ExecSection>
                )}
            </div>
        </div>
    );
}

function ExecSection({ title, accentColor, children }: { title: string; accentColor: string; children: React.ReactNode }) {
    return (
        <div>
            <div className="flex items-center gap-2 mb-3">
                <h3 className="text-[12px] font-bold uppercase tracking-[0.12em] text-slate-900">{title}</h3>
                <div className="flex-1 h-0.5" style={{ backgroundColor: accentColor }} />
            </div>
            {children}
        </div>
    );
}
