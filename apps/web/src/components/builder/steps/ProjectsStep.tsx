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

export default function ProjectsStep({ resume, onSave, onUpdate }: Props) {
    const items = resume.projects || [];

    const addItem = () => {
        onUpdate({ projects: [...items, { id: generateId(), name: '', type: '', description: '', link: '' }] });
    };

    const removeItem = (idx: number) => onUpdate({ projects: items.filter((_, i) => i !== idx) });

    const updateItem = (idx: number, field: string, value: string) => {
        onUpdate({ projects: items.map((item, i) => i === idx ? { ...item, [field]: value } : item) });
    };

    return (
        <div className="space-y-5">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-bold text-slate-900">Projects</h2>
                    <p className="text-sm text-slate-500 mt-0.5">Add your projects</p>
                </div>
                <button onClick={addItem} className="flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary-dark">
                    <Plus className="w-4 h-4" /> Add Project
                </button>
            </div>

            {items.length === 0 && (
                <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                    <p className="text-slate-400 text-sm">No projects added yet</p>
                    <button onClick={addItem} className="mt-2 text-primary text-sm font-medium hover:underline">+ Add your first project</button>
                </div>
            )}

            {items.map((item, idx) => (
                <div key={item.id} className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-slate-700">Project #{idx + 1}</span>
                        <button onClick={() => removeItem(idx)} className="text-red-400 hover:text-red-600 p-1">
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>

                    <input value={item.name} onChange={(e) => updateItem(idx, 'name', e.target.value)} placeholder="Project Name" className="input-field" />
                    <input value={item.type} onChange={(e) => updateItem(idx, 'type', e.target.value)} placeholder="Project Type (e.g., Web App, API)" className="input-field" />
                    <input value={item.link || ''} onChange={(e) => updateItem(idx, 'link', e.target.value)} placeholder="Project Link (optional)" className="input-field" />
                    <textarea
                        value={item.description}
                        onChange={(e) => updateItem(idx, 'description', e.target.value)}
                        placeholder="Describe your project..."
                        rows={3}
                        className="input-field resize-none"
                    />
                </div>
            ))}

            <button onClick={() => onSave({ projects: items })} className="btn-primary w-full">
                Save Changes
            </button>
        </div>
    );
}
