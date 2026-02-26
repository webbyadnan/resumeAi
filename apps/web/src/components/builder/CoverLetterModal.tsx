'use client';

import { useState } from 'react';
import { X, Loader2, Copy, Check, Mail } from 'lucide-react';
import { aiApi } from '@/lib/api';
import { ResumeData } from '@/types/resume';
import toast from 'react-hot-toast';

interface Props {
    resume: ResumeData;
    onClose: () => void;
}

export default function CoverLetterModal({ resume, onClose }: Props) {
    const [jobDescription, setJobDescription] = useState('');
    const [coverLetter, setCoverLetter] = useState('');
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    const generate = async () => {
        if (!jobDescription.trim()) {
            toast.error('Paste a job description first');
            return;
        }
        setLoading(true);
        setCoverLetter('');
        try {
            const { data } = await aiApi.generateCoverLetter(
                resume as unknown as Record<string, unknown>,
                jobDescription,
            );
            setCoverLetter(data.coverLetter ?? '');
        } catch {
            toast.error('Failed to generate cover letter');
        } finally {
            setLoading(false);
        }
    };

    const copy = async () => {
        await navigator.clipboard.writeText(coverLetter);
        setCopied(true);
        toast.success('Copied to clipboard!');
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center">
                            <Mail className="w-4 h-4 text-violet-500" />
                        </div>
                        <div>
                            <h2 className="font-bold text-slate-900 text-sm">Cover Letter Generator</h2>
                            <p className="text-xs text-slate-400">AI-powered, tailored to your resume</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {/* Job Description Input */}
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                            Job Description <span className="text-slate-400 font-normal">(paste the full JD)</span>
                        </label>
                        <textarea
                            value={jobDescription}
                            onChange={(e) => setJobDescription(e.target.value)}
                            rows={6}
                            placeholder="Paste the job description here…"
                            className="w-full text-sm border border-slate-200 rounded-xl p-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 resize-none transition-all"
                        />
                    </div>

                    {/* Generate Button */}
                    <button
                        onClick={generate}
                        disabled={loading || !jobDescription.trim()}
                        className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {loading ? (
                            <><Loader2 className="w-4 h-4 animate-spin" /> Generating…</>
                        ) : (
                            <><Mail className="w-4 h-4" /> Generate Cover Letter</>
                        )}
                    </button>

                    {/* Output */}
                    {coverLetter && (
                        <div className="relative">
                            <div className="flex items-center justify-between mb-1.5">
                                <span className="text-xs font-semibold text-slate-700">Your Cover Letter</span>
                                <button
                                    onClick={copy}
                                    className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 font-medium transition-colors"
                                >
                                    {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                                    {copied ? 'Copied!' : 'Copy'}
                                </button>
                            </div>
                            <div className="border border-slate-200 rounded-xl p-4 text-sm text-slate-700 whitespace-pre-wrap leading-relaxed bg-slate-50 max-h-72 overflow-y-auto">
                                {coverLetter}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
