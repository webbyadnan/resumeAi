'use client';

import { useState } from 'react';
import { ResumeData } from '@/types/resume';
import SkillInput from '@/components/ui/SkillInput';
import AIButton from '@/components/ui/AIButton';
import { aiApi } from '@/lib/api';
import toast from 'react-hot-toast';

interface Props {
    resume: ResumeData;
    onSave: (updates: Partial<ResumeData>) => void;
    onUpdate: (updates: Partial<ResumeData>) => void;
}

export default function SkillsStep({ resume, onSave, onUpdate }: Props) {
    const [suggesting, setSuggesting] = useState(false);

    const handleSuggest = async () => {
        setSuggesting(true);
        try {
            const { data } = await aiApi.suggestSkills(
                resume.experience as unknown as Record<string, unknown>[],
                resume.skills
            );
            const newSkills = Array.from(new Set([...resume.skills, ...data.suggestions]));
            onUpdate({ skills: newSkills });
            toast.success(`Added ${data.suggestions.length} AI-suggested skills!`);
        } catch {
            toast.error('Failed to get skill suggestions');
        } finally {
            setSuggesting(false);
        }
    };

    return (
        <div className="space-y-5">
            <div>
                <h2 className="text-lg font-bold text-slate-900">Skills</h2>
                <p className="text-sm text-slate-500 mt-0.5">Add your technical and soft skills</p>
            </div>

            <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-slate-700">Your Skills</label>
                <AIButton onClick={handleSuggest} loading={suggesting} label="AI Suggest" />
            </div>

            <SkillInput
                skills={resume.skills || []}
                onChange={(skills) => onUpdate({ skills })}
            />

            <div className="bg-blue-50 rounded-xl p-3.5 border border-blue-100">
                <p className="text-xs text-primary font-medium">
                    💡 <strong>Tip:</strong> Add 8–12 relevant skills. Include both technical skills (programming languages, tools) and soft skills (leadership, communication).
                </p>
            </div>

            <button onClick={() => onSave({ skills: resume.skills })} className="btn-primary w-full">
                Save Changes
            </button>
        </div>
    );
}
