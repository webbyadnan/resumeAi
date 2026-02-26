'use client';

import { ResumeData } from '@/types/resume';
import { Plus, Trash2 } from 'lucide-react';

interface Props {
    resume: ResumeData;
    onSave: (updates: Partial<ResumeData>) => void;
    onUpdate: (updates: Partial<ResumeData>) => void;
}

function generateId() {
    return Math.random().toString(36).slice(2);
}

export default function EducationStep({ resume, onSave, onUpdate }: Props) {
    const items = resume.education || [];

    const addItem = () => {
        onUpdate({
            education: [...items, { id: generateId(), institution: '', degree: '', fieldOfStudy: '', graduationDate: '', gpa: '' }],
        });
    };

    const removeItem = (idx: number) => onUpdate({ education: items.filter((_, i) => i !== idx) });

    const updateItem = (idx: number, field: string, value: string) => {
        onUpdate({ education: items.map((item, i) => i === idx ? { ...item, [field]: value } : item) });
    };

    return (
        <div className="space-y-5">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-bold text-slate-900">Education</h2>
                    <p className="text-sm text-slate-500 mt-0.5">Add your education details</p>
                </div>
                <button onClick={addItem} className="flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary-dark">
                    <Plus className="w-4 h-4" /> Add Education
                </button>
            </div>

            {items.length === 0 && (
                <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                    <p className="text-slate-400 text-sm">No education added yet</p>
                    <button onClick={addItem} className="mt-2 text-primary text-sm font-medium hover:underline">+ Add your education</button>
                </div>
            )}

            {items.map((item, idx) => (
                <div key={item.id} className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-slate-700">Education #{idx + 1}</span>
                        <button onClick={() => removeItem(idx)} className="text-red-400 hover:text-red-600 p-1">
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <input value={item.institution} onChange={(e) => updateItem(idx, 'institution', e.target.value)} placeholder="Institution Name" className="input-field" />
                        <input value={item.degree} onChange={(e) => updateItem(idx, 'degree', e.target.value)} placeholder="Degree (e.g., Bachelor's, Master's)" className="input-field" />
                        <input value={item.fieldOfStudy} onChange={(e) => updateItem(idx, 'fieldOfStudy', e.target.value)} placeholder="Field of Study" className="input-field" />
                        <input type="date" value={item.graduationDate} onChange={(e) => updateItem(idx, 'graduationDate', e.target.value)} className="input-field" />
                        <input value={item.gpa || ''} onChange={(e) => updateItem(idx, 'gpa', e.target.value)} placeholder="GPA (optional)" className="input-field" />
                    </div>
                </div>
            ))}

            <button onClick={() => onSave({ education: items })} className="btn-primary w-full">
                Save Changes
            </button>
        </div>
    );
}
