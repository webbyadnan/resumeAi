'use client';

import { AccentColor } from '@/types/resume';
import { Check } from 'lucide-react';

const accents: { id: AccentColor; label: string; hex: string }[] = [
    { id: 'blue', label: 'Blue', hex: '#4F6EF7' },
    { id: 'indigo', label: 'Indigo', hex: '#6366F1' },
    { id: 'teal', label: 'Teal', hex: '#0EA5E9' },
    { id: 'emerald', label: 'Emerald', hex: '#10B981' },
    { id: 'rose', label: 'Rose', hex: '#F43F5E' },
    { id: 'violet', label: 'Violet', hex: '#8B5CF6' },
    { id: 'orange', label: 'Orange', hex: '#F97316' },
    { id: 'slate', label: 'Slate', hex: '#475569' },
];

interface Props {
    current: AccentColor;
    onSelect: (color: AccentColor) => void;
}

export default function AccentPicker({ current, onSelect }: Props) {
    return (
        <div>
            <h3 className="font-bold text-slate-900 text-sm mb-3">Accent Color</h3>
            <div className="grid grid-cols-4 gap-2">
                {accents.map((accent) => (
                    <button
                        key={accent.id}
                        onClick={() => onSelect(accent.id)}
                        title={accent.label}
                        className={`relative group flex flex-col items-center gap-1 p-2 rounded-xl border-2 transition-all duration-200 ${current === accent.id ? 'border-primary' : 'border-transparent hover:border-slate-200'
                            }`}
                    >
                        <div
                            className="w-9 h-9 rounded-full shadow-sm flex items-center justify-center"
                            style={{ backgroundColor: accent.hex }}
                        >
                            {current === accent.id && <Check className="w-4 h-4 text-white" />}
                        </div>
                        <span className="text-xs text-slate-500">{accent.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}
