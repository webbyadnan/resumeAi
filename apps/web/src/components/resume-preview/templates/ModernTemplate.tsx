'use client';

import { ResumeData } from '@/types/resume';
import { Mail, Phone, MapPin, Linkedin, Globe } from 'lucide-react';

interface Props {
    resume: ResumeData;
    accentColor: string;
}

export default function ModernTemplate({ resume, accentColor }: Props) {
    const p = resume.personalInfo;
    const fmt = (d: string) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '';

    return (
        <div className="text-slate-900 text-[12px]" style={{ fontFamily: 'Inter, sans-serif' }}>
            {/* Color bar header */}
            <div className="px-8 py-6 text-white" style={{ backgroundColor: accentColor }}>
                <h1 className="text-[28px] font-extrabold tracking-tight">{p.fullName || 'Your Name'}</h1>
                {p.profession && <p className="text-white/80 mt-1 text-[13px] font-medium">{p.profession}</p>}
                <div className="flex flex-wrap gap-3 mt-3 text-white/70 text-[11px]">
                    {p.email && <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {p.email}</span>}
                    {p.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {p.phone}</span>}
                    {p.location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {p.location}</span>}
                </div>
            </div>

            <div className="grid grid-cols-3 gap-0 min-h-0">
                {/* Left Column */}
                <div className="col-span-1 p-5 space-y-5 bg-slate-50">
                    {(resume.skills || []).length > 0 && (
                        <div>
                            <h3 className="text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-2">Skills</h3>
                            <div className="space-y-1.5">
                                {(resume.skills || []).map((skill, i) => (
                                    <div key={i} className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: accentColor }} />
                                        <span className="text-slate-700 text-[11px]">{skill}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    {(resume.languages || []).length > 0 && (
                        <div>
                            <h3 className="text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-2">Languages</h3>
                            {(resume.languages || []).map((lang, i) => (
                                <div key={i} className="flex justify-between text-[11px] mb-1">
                                    <span className="text-slate-700">{lang.language}</span>
                                    <span className="text-slate-400">{lang.proficiency}</span>
                                </div>
                            ))}
                        </div>
                    )}
                    {(p.linkedIn || p.website) && (
                        <div>
                            <h3 className="text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-2">Links</h3>
                            {p.linkedIn && <p className="flex items-center gap-1 text-[11px] text-slate-600 mb-1"><Linkedin className="w-3 h-3" /> {p.linkedIn}</p>}
                            {p.website && <p className="flex items-center gap-1 text-[11px] text-slate-600"><Globe className="w-3 h-3" /> {p.website}</p>}
                        </div>
                    )}
                    {(resume.certifications || []).length > 0 && (
                        <div>
                            <h3 className="text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-2">Certifications</h3>
                            {(resume.certifications || []).map((cert, i) => (
                                <div key={i} className="mb-1.5">
                                    <p className="text-[11px] font-semibold text-slate-800">{cert.name}</p>
                                    <p className="text-[10px] text-slate-400">{cert.issuer}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Right Column */}
                <div className="col-span-2 p-5 space-y-5">
                    {resume.professionalSummary && (
                        <div>
                            <h3 className="text-[11px] font-bold uppercase tracking-widest mb-2" style={{ color: accentColor }}>About</h3>
                            <p className="text-slate-600 leading-relaxed">{resume.professionalSummary}</p>
                        </div>
                    )}

                    {(resume.experience || []).length > 0 && (
                        <div>
                            <h3 className="text-[11px] font-bold uppercase tracking-widest mb-3" style={{ color: accentColor }}>Experience</h3>
                            {(resume.experience || []).map((exp, i) => (
                                <div key={exp.id || i} className="mb-3 relative pl-4 border-l-2" style={{ borderColor: `${accentColor}40` }}>
                                    <div className="absolute -left-[5px] top-1 w-2 h-2 rounded-full" style={{ backgroundColor: accentColor }} />
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="font-bold text-slate-900 text-[13px]">{exp.jobTitle}</h4>
                                            <p className="font-medium" style={{ color: accentColor }}>{exp.companyName}</p>
                                        </div>
                                        <span className="text-slate-400 text-[10px] whitespace-nowrap ml-3">
                                            {fmt(exp.startDate)} – {exp.currentlyWorking ? 'Present' : fmt(exp.endDate)}
                                        </span>
                                    </div>
                                    {exp.description && <p className="text-slate-600 mt-1 text-[11px]">{exp.description}</p>}
                                </div>
                            ))}
                        </div>
                    )}

                    {(resume.education || []).length > 0 && (
                        <div>
                            <h3 className="text-[11px] font-bold uppercase tracking-widest mb-3" style={{ color: accentColor }}>Education</h3>
                            {(resume.education || []).map((edu, i) => (
                                <div key={edu.id || i} className="flex justify-between mb-2">
                                    <div>
                                        <h4 className="font-bold text-slate-900 text-[13px]">{edu.degree}</h4>
                                        <p className="text-slate-500 text-[11px]">{edu.institution} {edu.fieldOfStudy && `• ${edu.fieldOfStudy}`}</p>
                                    </div>
                                    <span className="text-slate-400 text-[10px] whitespace-nowrap ml-3">{fmt(edu.graduationDate)}</span>
                                </div>
                            ))}
                        </div>
                    )}

                    {(resume.projects || []).length > 0 && (
                        <div>
                            <h3 className="text-[11px] font-bold uppercase tracking-widest mb-3" style={{ color: accentColor }}>Projects</h3>
                            {(resume.projects || []).map((proj, i) => (
                                <div key={proj.id || i} className="mb-2">
                                    <h4 className="font-bold text-slate-900 text-[12px]">{proj.name} {proj.type && <span className="font-normal text-slate-400">• {proj.type}</span>}</h4>
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
