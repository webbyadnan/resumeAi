'use client';

import { useState } from 'react';
import { ResumeData } from '@/types/resume';
import AIButton from '@/components/ui/AIButton';
import { aiApi } from '@/lib/api';
import toast from 'react-hot-toast';

interface Props {
    resume: ResumeData;
    onSave: (updates: Partial<ResumeData>) => void;
    onUpdate: (updates: Partial<ResumeData>) => void;
}

export default function SummaryStep({ resume, onSave, onUpdate }: Props) {
    const [enhancing, setEnhancing] = useState(false);

    const handleEnhance = async () => {
        if (!resume.professionalSummary?.trim()) {
            toast.error('Please write a summary first');
            return;
        }
        setEnhancing(true);
        try {
            const { data } = await aiApi.enhanceSummary(
                resume.professionalSummary,
                resume.personalInfo.profession
            );
            onUpdate({ professionalSummary: data.enhanced });
            toast.success('Summary enhanced by AI!');
        } catch {
            toast.error('AI enhancement failed');
        } finally {
            setEnhancing(false);
        }
    };

    return (
        <div className="space-y-5">
            <div>
                <h2 className="text-lg font-bold text-slate-900">Professional Summary</h2>
                <p className="text-sm text-slate-500 mt-0.5">Add a summary for your resume here</p>
            </div>

            <div>
                <div className="flex items-center justify-between mb-1.5">
                    <label className="text-sm font-medium text-slate-700">Your Summary</label>
                    <AIButton onClick={handleEnhance} loading={enhancing} />
                </div>
                <textarea
                    value={resume.professionalSummary || ''}
                    onChange={(e) => onUpdate({ professionalSummary: e.target.value })}
                    placeholder="Write a compelling professional summary that highlights your key strengths and career objectives..."
                    rows={7}
                    className="input-field resize-none"
                />
                <p className="text-xs text-slate-400 mt-1.5">
                    💡 Tip: Keep it concise (3–4 sentences) and focus on your most relevant achievements and skills.
                </p>
            </div>

            <button
                onClick={() => onSave({ professionalSummary: resume.professionalSummary })}
                className="btn-primary w-full"
            >
                Save Changes
            </button>
        </div>
    );
}
