'use client';

import { ResumeData } from '@/types/resume';
import { Mail, Phone, MapPin, Linkedin, Globe } from 'lucide-react';

interface Props {
    resume: ResumeData;
    accentColor: string;
}

export default function CreativeTemplate({ resume, accentColor }: Props) {
    const p = resume.personalInfo;
    const fmt = (d: string) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '';

    return (
        <div className="text-slate-900 text-[12px]" style={{ fontFamily: 'Inter, sans-serif' }}>
            {/* Creative diagonal header */}
            <div className="relative px-8 pt-7 pb-12 text-white overflow-hidden" style={{ background: `linear-gradient(135deg, ${accentColor}, ${accentColor}cc)` }}>
                <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-white/10 -translate-y-1/2 translate-x-1/4" />
                <div className="relative">
                    <div className="w-14 h-1 rounded-full bg-white/50 mb-3" />
                    <h1 className="text-[28px] font-extrabold tracking-tight">{p.fullName || 'Your Name'}</h1>
                    {p.profession && <p className="text-[13px] text-white/80 mt-1 font-medium uppercase tracking-widest">{p.profession}</p>}
                    <div className="flex flex-wrap gap-3 mt-4 text-white/70 text-[11px]">
                        {p.email && <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {p.email}</span>}
                        {p.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {p.phone}</span>}
                        {p.location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {p.location}</span>}
                    </div>
                </div>
                {/* angled bottom */}
                <div className="absolute bottom-0 left-0 right-0 h-6 bg-white" style={{ clipPath: 'polygon(0 100%, 100% 0, 100% 100%)' }} />
            </div>

            <div className="grid grid-cols-3 gap-0">
                {/* Left sidebar */}
                <div className="col-span-1 p-4 space-y-4">
                    {(resume.skills || []).length > 0 && (
                        <div>
                            <h3 className="text-[10px] font-extrabold uppercase tracking-widest mb-2" style={{ color: accentColor }}>Skills</h3>
                            <div className="space-y-1">
                                {(resume.skills || []).map((skill, i) => (
                                    <div key={i} className="flex items-center gap-1.5 text-[11px] text-slate-600">
                                        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accentColor }} />
                                        {skill}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    {(resume.languages || []).length > 0 && (
                        <div>
                            <h3 className="text-[10px] font-extrabold uppercase tracking-widest mb-2" style={{ color: accentColor }}>Languages</h3>
                            {(resume.languages || []).map((lang, i) => (
                                <div key={i} className="text-[11px] text-slate-600 mb-1">
                                    {lang.language} <span className="text-slate-400">({lang.proficiency})</span>
                                </div>
                            ))}
                        </div>
                    )}
                    {(p.linkedIn || p.website) && (
                        <div>
                            <h3 className="text-[10px] font-extrabold uppercase tracking-widest mb-2" style={{ color: accentColor }}>Links</h3>
                            {p.linkedIn && <p className="flex items-center gap-1 text-[11px] text-slate-600 mb-1"><Linkedin className="w-3 h-3 flex-shrink-0" /> {p.linkedIn}</p>}
                            {p.website && <p className="flex items-center gap-1 text-[11px] text-slate-600"><Globe className="w-3 h-3 flex-shrink-0" /> {p.website}</p>}
                        </div>
                    )}
                    {(resume.certifications || []).length > 0 && (
                        <div>
                            <h3 className="text-[10px] font-extrabold uppercase tracking-widest mb-2" style={{ color: accentColor }}>Certifications</h3>
                            {(resume.certifications || []).map((cert, i) => (
                                <div key={i} className="mb-1.5">
                                    <p className="text-[11px] font-semibold text-slate-800">{cert.name}</p>
                                    <p className="text-[10px] text-slate-400">{cert.issuer}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Right main content */}
                <div className="col-span-2 px-5 py-4 space-y-4 border-l border-slate-100">
                    {resume.professionalSummary && (
                        <div>
                            <h3 className="text-[10px] font-extrabold uppercase tracking-widest mb-2" style={{ color: accentColor }}>About Me</h3>
                            <p className="text-slate-600 leading-relaxed">{resume.professionalSummary}</p>
                        </div>
                    )}
                    {(resume.experience || []).length > 0 && (
                        <div>
                            <h3 className="text-[10px] font-extrabold uppercase tracking-widest mb-3" style={{ color: accentColor }}>Experience</h3>
                            {(resume.experience || []).map((exp, i) => (
                                <div key={exp.id || i} className="mb-3">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="font-bold text-[13px]">{exp.jobTitle}</h4>
                                            <p className="font-medium text-[11px]" style={{ color: accentColor }}>{exp.companyName}</p>
                                        </div>
                                        <span className="text-[10px] text-slate-400">{fmt(exp.startDate)} – {exp.currentlyWorking ? 'Present' : fmt(exp.endDate)}</span>
                                    </div>
                                    {exp.description && <p className="text-slate-600 text-[11px] mt-1">{exp.description}</p>}
                                </div>
                            ))}
                        </div>
                    )}
                    {(resume.education || []).length > 0 && (
                        <div>
                            <h3 className="text-[10px] font-extrabold uppercase tracking-widest mb-3" style={{ color: accentColor }}>Education</h3>
                            {(resume.education || []).map((edu, i) => (
                                <div key={edu.id || i} className="flex justify-between mb-2">
                                    <div>
                                        <h4 className="font-bold text-[13px]">{edu.degree}</h4>
                                        <p className="text-[11px] text-slate-500">{edu.institution}</p>
                                    </div>
                                    <span className="text-[10px] text-slate-400">{fmt(edu.graduationDate)}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
