'use client';

import { useState } from 'react';
import { ResumeData, ExperienceItem } from '@/types/resume';
import AIButton from '@/components/ui/AIButton';
import { aiApi } from '@/lib/api';
import { Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface Props {
    resume: ResumeData;
    onSave: (updates: Partial<ResumeData>) => void;
    onUpdate: (updates: Partial<ResumeData>) => void;
}

function generateId() {
    return Math.random().toString(36).slice(2);
}

export default function ExperienceStep({ resume, onSave, onUpdate }: Props) {
    const [enhancingIdx, setEnhancingIdx] = useState<number | null>(null);
    const items = resume.experience || [];

    const addItem = () => {
        onUpdate({
            experience: [
                ...items,
                { id: generateId(), companyName: '', jobTitle: '', startDate: '', endDate: '', currentlyWorking: false, description: '' },
            ],
        });
    };

    const removeItem = (idx: number) => {
        onUpdate({ experience: items.filter((_, i) => i !== idx) });
    };

    const updateItem = (idx: number, field: string, value: string | boolean) => {
        const updated = items.map((item, i) =>
            i === idx ? { ...item, [field]: value } : item
        );
        onUpdate({ experience: updated });
    };

    const handleEnhance = async (idx: number) => {
        const item = items[idx];
        if (!item.description?.trim()) { toast.error('Add a description first'); return; }
        setEnhancingIdx(idx);
        try {
            const { data } = await aiApi.enhanceExperience(item.description, item.jobTitle);
            updateItem(idx, 'description', data.enhanced);
            toast.success('Experience enhanced!');
        } catch {
            toast.error('AI enhancement failed');
        } finally {
            setEnhancingIdx(null);
        }
    };

    return (
        <div className="space-y-5">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-bold text-slate-900">Professional Experience</h2>
                    <p className="text-sm text-slate-500 mt-0.5">Add your job experience</p>
                </div>
                <button onClick={addItem} className="flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary-dark">
                    <Plus className="w-4 h-4" /> Add Experience
                </button>
            </div>

            {items.length === 0 && (
                <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                    <p className="text-slate-400 text-sm">No experience added yet</p>
                    <button onClick={addItem} className="mt-2 text-primary text-sm font-medium hover:underline">+ Add your first experience</button>
                </div>
            )}

            {items.map((item, idx) => (
                <div key={item.id} className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-slate-700">Experience #{idx + 1}</span>
                        <button onClick={() => removeItem(idx)} className="text-red-400 hover:text-red-600 p-1">
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <input value={item.companyName} onChange={(e) => updateItem(idx, 'companyName', e.target.value)} placeholder="Company Name" className="input-field" />
                        <input value={item.jobTitle} onChange={(e) => updateItem(idx, 'jobTitle', e.target.value)} placeholder="Job Title" className="input-field" />
                        <input type="date" value={item.startDate} onChange={(e) => updateItem(idx, 'startDate', e.target.value)} className="input-field" />
                        <input type="date" value={item.endDate} onChange={(e) => updateItem(idx, 'endDate', e.target.value)} disabled={item.currentlyWorking} className="input-field disabled:opacity-40" />
                    </div>

                    <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                        <input type="checkbox" checked={item.currentlyWorking} onChange={(e) => updateItem(idx, 'currentlyWorking', e.target.checked)} className="rounded accent-primary" />
                        Currently working here
                    </label>

                    <div>
                        <div className="flex items-center justify-between mb-1.5">
                            <label className="text-sm font-medium text-slate-700">Job Description</label>
                            <AIButton onClick={() => handleEnhance(idx)} loading={enhancingIdx === idx} label="Enhance with AI" />
                        </div>
                        <textarea
                            value={item.description}
                            onChange={(e) => updateItem(idx, 'description', e.target.value)}
                            placeholder="Describe your key responsibilities and achievements..."
                            rows={4}
                            className="input-field resize-none"
                        />
                    </div>
                </div>
            ))}

            <button onClick={() => onSave({ experience: items })} className="btn-primary w-full">
                Save Changes
            </button>
        </div>
    );
}
