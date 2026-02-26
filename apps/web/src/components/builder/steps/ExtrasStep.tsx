'use client';

import { ResumeData, LanguageItem, CertificationItem } from '@/types/resume';
import { Plus, Trash2 } from 'lucide-react';

interface Props {
    resume: ResumeData;
    onSave: (updates: Partial<ResumeData>) => void;
    onUpdate: (updates: Partial<ResumeData>) => void;
}

function generateId() {
    return Math.random().toString(36).slice(2);
}

export default function ExtrasStep({ resume, onSave, onUpdate }: Props) {
    const languages = resume.languages || [];
    const certifications = resume.certifications || [];

    const addLanguage = () => {
        onUpdate({ languages: [...languages, { id: generateId(), language: '', proficiency: 'Intermediate' }] });
    };

    const removeLanguage = (idx: number) => onUpdate({ languages: languages.filter((_, i) => i !== idx) });

    const updateLanguage = (idx: number, field: string, value: string) => {
        onUpdate({ languages: languages.map((item, i) => i === idx ? { ...item, [field]: value } : item) });
    };

    const addCert = () => {
        onUpdate({ certifications: [...certifications, { id: generateId(), name: '', issuer: '', date: '', url: '' }] });
    };

    const removeCert = (idx: number) => onUpdate({ certifications: certifications.filter((_, i) => i !== idx) });

    const updateCert = (idx: number, field: string, value: string) => {
        onUpdate({ certifications: certifications.map((item, i) => i === idx ? { ...item, [field]: value } : item) });
    };

    return (
        <div className="space-y-6 pb-4">
            {/* Languages */}
            <div>
                <div className="flex items-center justify-between mb-3">
                    <div>
                        <h2 className="text-base font-bold text-slate-900">Languages</h2>
                        <p className="text-xs text-slate-500 mt-0.5">Languages you speak</p>
                    </div>
                    <button onClick={addLanguage} className="flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary-dark">
                        <Plus className="w-3.5 h-3.5" /> Add
                    </button>
                </div>

                <div className="space-y-2">
                    {languages.map((lang, idx) => (
                        <div key={lang.id} className="flex items-center gap-2 bg-slate-50 rounded-lg p-2 border border-slate-200">
                            {/* Language name — takes remaining space */}
                            <input
                                value={lang.language}
                                onChange={(e) => updateLanguage(idx, 'language', e.target.value)}
                                placeholder="e.g. English"
                                className="flex-1 min-w-0 text-sm px-2 py-1.5 border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-primary/40"
                            />
                            {/* Proficiency — fixed narrow width */}
                            <select
                                value={lang.proficiency}
                                onChange={(e) => updateLanguage(idx, 'proficiency', e.target.value)}
                                className="w-28 text-sm px-2 py-1.5 border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-primary/40 flex-shrink-0"
                            >
                                {['Beginner', 'Elementary', 'Intermediate', 'Advanced', 'Native'].map((p) => (
                                    <option key={p}>{p}</option>
                                ))}
                            </select>
                            <button onClick={() => removeLanguage(idx)} className="text-red-400 hover:text-red-600 flex-shrink-0">
                                <Trash2 className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    ))}
                    {languages.length === 0 && (
                        <p className="text-xs text-slate-400 text-center py-3">No languages added yet</p>
                    )}
                </div>
            </div>

            {/* Certifications */}
            <div>
                <div className="flex items-center justify-between mb-3">
                    <div>
                        <h2 className="text-base font-bold text-slate-900">Certifications</h2>
                        <p className="text-xs text-slate-500 mt-0.5">Professional certifications</p>
                    </div>
                    <button onClick={addCert} className="flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary-dark">
                        <Plus className="w-3.5 h-3.5" /> Add
                    </button>
                </div>

                <div className="space-y-2">
                    {certifications.map((cert, idx) => (
                        <div key={cert.id} className="bg-slate-50 rounded-xl p-3 border border-slate-200 space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-semibold text-slate-600">Certification #{idx + 1}</span>
                                <button onClick={() => removeCert(idx)} className="text-red-400 hover:text-red-600">
                                    <Trash2 className="w-3.5 h-3.5" />
                                </button>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <input value={cert.name} onChange={(e) => updateCert(idx, 'name', e.target.value)} placeholder="Certificate Name" className="input-field text-sm py-1.5" />
                                <input value={cert.issuer} onChange={(e) => updateCert(idx, 'issuer', e.target.value)} placeholder="Issuer (e.g., Google)" className="input-field text-sm py-1.5" />
                                <input type="date" value={cert.date} onChange={(e) => updateCert(idx, 'date', e.target.value)} className="input-field text-sm py-1.5" />
                                <input value={cert.url || ''} onChange={(e) => updateCert(idx, 'url', e.target.value)} placeholder="Credential URL (optional)" className="input-field text-sm py-1.5" />
                            </div>
                        </div>
                    ))}
                    {certifications.length === 0 && (
                        <p className="text-xs text-slate-400 text-center py-3">No certifications added yet</p>
                    )}
                </div>
            </div>

            <button onClick={() => onSave({ languages, certifications })} className="btn-primary w-full">
                Save Changes
            </button>
        </div>
    );
}
