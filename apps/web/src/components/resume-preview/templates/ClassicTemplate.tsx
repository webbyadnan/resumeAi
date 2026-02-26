'use client';

import { ResumeData } from '@/types/resume';
import { Mail, Phone, MapPin, Linkedin, Globe } from 'lucide-react';

interface Props {
    resume: ResumeData;
    accentColor: string;
}

export default function ClassicTemplate({ resume, accentColor }: Props) {
    const p = resume.personalInfo;
    const fmt = (d: string) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '';

    return (
        <div className="text-slate-900 text-[12px] leading-relaxed" style={{ fontFamily: 'Georgia, serif' }}>
            {/* Header */}
            <div className="text-center py-6 px-8 border-b-4" style={{ borderColor: accentColor }}>
                <h1 className="text-[26px] font-bold tracking-wide uppercase" style={{ color: accentColor }}>
                    {p.fullName || 'Your Name'}
                </h1>
                {p.profession && <p className="text-slate-500 text-[13px] mt-1 tracking-widest uppercase">{p.profession}</p>}
                <div className="flex flex-wrap items-center justify-center gap-4 mt-3 text-slate-500">
                    {p.email && <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {p.email}</span>}
                    {p.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {p.phone}</span>}
                    {p.location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {p.location}</span>}
                    {p.linkedIn && <span className="flex items-center gap-1"><Linkedin className="w-3 h-3" /> {p.linkedIn}</span>}
                    {p.website && <span className="flex items-center gap-1"><Globe className="w-3 h-3" /> {p.website}</span>}
                </div>
            </div>

            <div className="px-8 py-4 space-y-4">
                {/* Summary */}
                {resume.professionalSummary && (
                    <ResumeSection title="Professional Summary" accentColor={accentColor}>
                        <p className="text-slate-600">{resume.professionalSummary}</p>
                    </ResumeSection>
                )}

                {/* Experience */}
                {(resume.experience || []).length > 0 && (
                    <ResumeSection title="Work Experience" accentColor={accentColor}>
                        {(resume.experience || []).map((exp, i) => (
                            <div key={exp.id || i} className="mb-3">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h4 className="font-bold text-slate-900 text-[13px]">{exp.jobTitle}</h4>
                                        <p className="text-slate-500">{exp.companyName}</p>
                                    </div>
                                    <span className="text-slate-400 text-[11px] whitespace-nowrap ml-4">
                                        {fmt(exp.startDate)} – {exp.currentlyWorking ? 'Present' : fmt(exp.endDate)}
                                    </span>
                                </div>
                                {exp.description && <p className="text-slate-600 mt-1">{exp.description}</p>}
                            </div>
                        ))}
                    </ResumeSection>
                )}

                {/* Education */}
                {(resume.education || []).length > 0 && (
                    <ResumeSection title="Education" accentColor={accentColor}>
                        {(resume.education || []).map((edu, i) => (
                            <div key={edu.id || i} className="flex justify-between items-start mb-2">
                                <div>
                                    <h4 className="font-bold text-slate-900 text-[13px]">{edu.degree} {edu.fieldOfStudy && `in ${edu.fieldOfStudy}`}</h4>
                                    <p className="text-slate-500">{edu.institution}</p>
                                    {edu.gpa && <p className="text-slate-400">GPA: {edu.gpa}</p>}
                                </div>
                                <span className="text-slate-400 text-[11px] whitespace-nowrap ml-4">{fmt(edu.graduationDate)}</span>
                            </div>
                        ))}
                    </ResumeSection>
                )}

                {/* Skills */}
                {(resume.skills || []).length > 0 && (
                    <ResumeSection title="Skills" accentColor={accentColor}>
                        <div className="flex flex-wrap gap-2">
                            {(resume.skills || []).map((skill, i) => (
                                <span key={i} className="px-2 py-1 rounded text-[11px] font-medium" style={{ backgroundColor: `${accentColor}15`, color: accentColor }}>
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </ResumeSection>
                )}

                {/* Projects */}
                {(resume.projects || []).length > 0 && (
                    <ResumeSection title="Projects" accentColor={accentColor}>
                        {(resume.projects || []).map((proj, i) => (
                            <div key={proj.id || i} className="mb-2">
                                <div className="flex items-center gap-2">
                                    <h4 className="font-bold text-slate-900 text-[13px]">{proj.name}</h4>
                                    {proj.type && <span className="text-slate-400 text-[11px]">• {proj.type}</span>}
                                </div>
                                {proj.description && <p className="text-slate-600 mt-0.5">{proj.description}</p>}
                            </div>
                        ))}
                    </ResumeSection>
                )}

                {/* Languages & Certifications */}
                <div className="grid grid-cols-2 gap-4">
                    {(resume.languages || []).length > 0 && (
                        <ResumeSection title="Languages" accentColor={accentColor}>
                            {(resume.languages || []).map((lang, i) => (
                                <div key={i} className="flex justify-between text-[11px]">
                                    <span className="text-slate-800">{lang.language}</span>
                                    <span className="text-slate-400">{lang.proficiency}</span>
                                </div>
                            ))}
                        </ResumeSection>
                    )}
                    {(resume.certifications || []).length > 0 && (
                        <ResumeSection title="Certifications" accentColor={accentColor}>
                            {(resume.certifications || []).map((cert, i) => (
                                <div key={i} className="mb-1">
                                    <div className="font-medium text-slate-900">{cert.name}</div>
                                    <div className="text-slate-400 text-[11px]">{cert.issuer} {cert.date && `• ${fmt(cert.date)}`}</div>
                                </div>
                            ))}
                        </ResumeSection>
                    )}
                </div>
            </div>
        </div>
    );
}

function ResumeSection({ title, accentColor, children }: { title: string; accentColor: string; children: React.ReactNode }) {
    return (
        <div>
            <div className="flex items-center gap-2 mb-2">
                <h3 className="text-[13px] font-bold uppercase tracking-widest" style={{ color: accentColor }}>{title}</h3>
                <div className="flex-1 h-px" style={{ backgroundColor: `${accentColor}30` }} />
            </div>
            {children}
        </div>
    );
}
