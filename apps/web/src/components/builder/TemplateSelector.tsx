'use client';

import { ResumeTemplate } from '@/types/resume';
import { Check } from 'lucide-react';

const templates: { id: ResumeTemplate; name: string; description: string }[] = [
    { id: 'classic', name: 'Classic', description: 'Clean & traditional' },
    { id: 'modern', name: 'Modern', description: 'Sleek with color accents' },
    { id: 'executive', name: 'Executive', description: 'Bold, high-impact layout' },
    { id: 'creative', name: 'Creative', description: 'Eye-catching & unique' },
    { id: 'minimal', name: 'Minimal', description: 'Ultra-clean, content-first' },
    { id: 'minimal_image', name: 'Minimal + Photo', description: 'Clean with profile photo' },
];

interface Props {
    current: ResumeTemplate;
    onSelect: (template: ResumeTemplate) => void;
}

export default function TemplateSelector({ current, onSelect }: Props) {
    return (
        <div className="p-4">
            <h3 className="font-bold text-slate-900 text-sm mb-3">Choose Template</h3>
            <div className="grid grid-cols-2 gap-2">
                {templates.map((t) => (
                    <button
                        key={t.id}
                        onClick={() => onSelect(t.id)}
                        className={`relative rounded-xl border-2 p-3 text-left transition-all duration-200 ${current === t.id
                                ? 'border-primary bg-blue-50'
                                : 'border-slate-200 hover:border-primary/40 bg-white'
                            }`}
                    >
                        {current === t.id && (
                            <span className="absolute top-2 right-2 w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                                <Check className="w-2.5 h-2.5 text-white" />
                            </span>
                        )}
                        {/* Mini preview */}
                        <div className="w-full aspect-[3/4] bg-slate-100 rounded-lg mb-2 overflow-hidden">
                            <div className="w-full h-1/4 bg-primary/20" />
                            <div className="p-1.5 space-y-0.5">
                                {[100, 80, 90, 70].map((w, i) => (
                                    <div key={i} className="h-1 rounded-full bg-slate-200" style={{ width: `${w}%` }} />
                                ))}
                            </div>
                        </div>
                        <div className="font-semibold text-slate-900 text-xs">{t.name}</div>
                        <div className="text-slate-400 text-xs">{t.description}</div>
                    </button>
                ))}
            </div>
        </div>
    );
}
