'use client';

import { ResumeData } from '@/types/resume';
import { Mail, Phone, MapPin, Linkedin, Globe } from 'lucide-react';

interface Props {
    resume: ResumeData;
    accentColor: string;
}

export default function MinimalImageTemplate({ resume, accentColor }: Props) {
    const p = resume.personalInfo;
    const fmt = (d: string) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '';

    return (
        <div className="text-slate-900 text-[12px]" style={{ fontFamily: 'Inter, sans-serif' }}>
            <div className="grid grid-cols-3 gap-0 min-h-0">
                {/* Sidebar */}
                <div className="col-span-1 p-5 space-y-5 text-white" style={{ backgroundColor: accentColor }}>
                    {/* Avatar */}
                    <div className="flex justify-center">
                        {p.avatarUrl ? (
                            <img src={p.avatarUrl} alt="Profile" className="w-20 h-20 rounded-full object-cover border-4 border-white/30" />
                        ) : (
                            <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center text-3xl font-bold text-white">
                                {(p.fullName || 'U')[0]}
                            </div>
                        )}
                    </div>
                    <div>
                        <h3 className="text-[10px] font-extrabold uppercase tracking-widest text-white/60 mb-2">Contact</h3>
                        <div className="space-y-1.5 text-[11px] text-white/80">
                            {p.email && <p className="flex items-center gap-1.5"><Mail className="w-3 h-3 flex-shrink-0" /> {p.email}</p>}
                            {p.phone && <p className="flex items-center gap-1.5"><Phone className="w-3 h-3 flex-shrink-0" /> {p.phone}</p>}
                            {p.location && <p className="flex items-center gap-1.5"><MapPin className="w-3 h-3 flex-shrink-0" /> {p.location}</p>}
                            {p.linkedIn && <p className="flex items-center gap-1.5"><Linkedin className="w-3 h-3 flex-shrink-0" /> {p.linkedIn}</p>}
                            {p.website && <p className="flex items-center gap-1.5"><Globe className="w-3 h-3 flex-shrink-0" /> {p.website}</p>}
                        </div>
                    </div>

                    {(resume.skills || []).length > 0 && (
                        <div>
                            <h3 className="text-[10px] font-extrabold uppercase tracking-widest text-white/60 mb-2">Skills</h3>
                            <div className="flex flex-wrap gap-1.5">
                                {(resume.skills || []).map((skill, i) => (
                                    <span key={i} className="bg-white/20 text-white text-[10px] font-medium px-2 py-0.5 rounded-full">{skill}</span>
                                ))}
                            </div>
                        </div>
                    )}

                    {(resume.languages || []).length > 0 && (
                        <div>
                            <h3 className="text-[10px] font-extrabold uppercase tracking-widest text-white/60 mb-2">Languages</h3>
                            {(resume.languages || []).map((lang, i) => (
                                <div key={i} className="flex justify-between text-[11px] text-white/80 mb-1">
                                    <span>{lang.language}</span>
                                    <span className="text-white/50">{lang.proficiency}</span>
                                </div>
                            ))}
                        </div>
                    )}

                    {(resume.certifications || []).length > 0 && (
                        <div>
                            <h3 className="text-[10px] font-extrabold uppercase tracking-widest text-white/60 mb-2">Certifications</h3>
                            {(resume.certifications || []).map((cert, i) => (
                                <div key={i} className="mb-1.5 text-white/80">
                                    <p className="text-[11px] font-medium">{cert.name}</p>
                                    <p className="text-[10px] text-white/50">{cert.issuer}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Main content */}
                <div className="col-span-2 px-6 py-5 space-y-4">
                    <div className="border-b border-slate-100 pb-4">
                        <h1 className="text-[24px] font-extrabold text-slate-900">{p.fullName || 'Your Name'}</h1>
                        {p.profession && <p className="text-[13px] font-medium mt-0.5" style={{ color: accentColor }}>{p.profession}</p>}
                    </div>

                    {resume.professionalSummary && (
                        <div>
                            <SectionTitle color={accentColor}>Summary</SectionTitle>
                            <p className="text-slate-600 leading-relaxed">{resume.professionalSummary}</p>
                        </div>
                    )}

                    {(resume.experience || []).length > 0 && (
                        <div>
                            <SectionTitle color={accentColor}>Experience</SectionTitle>
                            {(resume.experience || []).map((exp, i) => (
                                <div key={exp.id || i} className="mb-3">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="font-bold text-[13px]">{exp.jobTitle}</h4>
                                            <p className="font-medium text-[11px]" style={{ color: accentColor }}>{exp.companyName}</p>
                                        </div>
                                        <span className="text-slate-400 text-[10px]">{fmt(exp.startDate)} – {exp.currentlyWorking ? 'Present' : fmt(exp.endDate)}</span>
                                    </div>
                                    {exp.description && <p className="text-slate-600 text-[11px] mt-1">{exp.description}</p>}
                                </div>
                            ))}
                        </div>
                    )}

                    {(resume.education || []).length > 0 && (
                        <div>
                            <SectionTitle color={accentColor}>Education</SectionTitle>
                            {(resume.education || []).map((edu, i) => (
                                <div key={edu.id || i} className="flex justify-between mb-1.5">
                                    <div>
                                        <h4 className="font-bold text-[13px]">{edu.degree}</h4>
                                        <p className="text-[11px] text-slate-500">{edu.institution}</p>
                                    </div>
                                    <span className="text-[10px] text-slate-400">{fmt(edu.graduationDate)}</span>
                                </div>
                            ))}
                        </div>
                    )}

                    {(resume.projects || []).length > 0 && (
                        <div>
                            <SectionTitle color={accentColor}>Projects</SectionTitle>
                            {(resume.projects || []).map((proj, i) => (
                                <div key={proj.id || i} className="mb-2">
                                    <h4 className="font-bold text-[12px]">{proj.name} {proj.type && <span className="text-slate-400 font-normal">· {proj.type}</span>}</h4>
                                    {proj.description && <p className="text-slate-600 text-[11px] mt-0.5">{proj.description}</p>}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function SectionTitle({ color, children }: { color: string; children: React.ReactNode }) {
    return (
        <h3 className="text-[11px] font-extrabold uppercase tracking-widest mb-2" style={{ color }}>
            {children}
        </h3>
    );
}
