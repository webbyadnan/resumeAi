'use client';

import { useState, KeyboardEvent } from 'react';
import { X, Plus } from 'lucide-react';

interface SkillInputProps {
    skills: string[];
    onChange: (skills: string[]) => void;
}

export default function SkillInput({ skills, onChange }: SkillInputProps) {
    const [input, setInput] = useState('');

    const addSkill = () => {
        const trimmed = input.trim();
        if (trimmed && !skills.includes(trimmed)) {
            onChange([...skills, trimmed]);
        }
        setInput('');
    };

    const removeSkill = (skill: string) => {
        onChange(skills.filter((s) => s !== skill));
    };

    const handleKey = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            addSkill();
        }
        if (e.key === 'Backspace' && !input && skills.length > 0) {
            onChange(skills.slice(0, -1));
        }
    };

    return (
        <div>
            <div className="flex gap-2 mb-3">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKey}
                    placeholder="Enter a skill (e.g., JavaScript, Project Management)"
                    className="input-field flex-1"
                />
                <button
                    type="button"
                    onClick={addSkill}
                    className="btn-primary px-4 py-2 text-sm flex items-center gap-1"
                >
                    <Plus className="w-4 h-4" />
                    Add
                </button>
            </div>

            {skills.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                    {skills.map((skill) => (
                        <span key={skill} className="skill-tag">
                            {skill}
                            <button
                                type="button"
                                onClick={() => removeSkill(skill)}
                                className="ml-1 hover:text-red-500 transition-colors"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </span>
                    ))}
                </div>
            )}

            {skills.length === 0 && (
                <p className="text-xs text-slate-400 mt-1">
                    Press Enter or comma to add a skill
                </p>
            )}
        </div>
    );
}
