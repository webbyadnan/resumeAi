'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, X, Briefcase, Star, CheckCircle, XCircle, Lightbulb, Zap, ChevronRight, Loader2, FileText, Target, TrendingUp, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';

interface SectionRatings {
    contactInfo: number;
    summary: number;
    experience: number;
    education: number;
    skills: number;
    overall: number;
}

interface AnalysisResult {
    score: number;
    jobRole: string;
    strengths: string[];
    weaknesses: string[];
    missingKeywords: string[];
    suggestions: string[];
    skillsToAdd: string[];
    sectionRatings: SectionRatings;
    verdict: string;
}

interface Props {
    onClose: () => void;
}

type Step = 'upload' | 'role' | 'loading' | 'results';

function ScoreGauge({ score }: { score: number }) {
    const color = score >= 75 ? '#22c55e' : score >= 50 ? '#f59e0b' : '#ef4444';
    const label = score >= 75 ? 'Strong Match' : score >= 50 ? 'Moderate Match' : 'Needs Work';
    return (
        <div className="flex flex-col items-center gap-2">
            <div className="relative w-36 h-36">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                    <circle cx="50" cy="50" r="42" fill="none" stroke="#e2e8f0" strokeWidth="10" />
                    <circle
                        cx="50" cy="50" r="42" fill="none"
                        stroke={color} strokeWidth="10"
                        strokeDasharray={`${(score / 100) * 264} 264`}
                        strokeLinecap="round"
                        style={{ transition: 'stroke-dasharray 1s ease' }}
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-black" style={{ color }}>{score}</span>
                    <span className="text-xs text-slate-400 font-medium">/ 100</span>
                </div>
            </div>
            <span className="text-sm font-bold px-3 py-1 rounded-full" style={{ background: `${color}20`, color }}>
                {label}
            </span>
        </div>
    );
}

function SectionBar({ label, value }: { label: string; value: number }) {
    const color = value >= 7 ? '#22c55e' : value >= 5 ? '#f59e0b' : '#ef4444';
    return (
        <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500 w-24 shrink-0">{label}</span>
            <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${value * 10}%`, background: color }}
                />
            </div>
            <span className="text-xs font-bold w-6 text-right" style={{ color }}>{value}</span>
        </div>
    );
}

export default function ResumeAnalyzerModal({ onClose }: Props) {
    const [step, setStep] = useState<Step>('upload');
    const [file, setFile] = useState<File | null>(null);
    const [dragging, setDragging] = useState(false);
    const [jobRole, setJobRole] = useState('');
    const [result, setResult] = useState<AnalysisResult | null>(null);
    const router = useRouter();

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setDragging(false);
        const dropped = e.dataTransfer.files[0];
        if (dropped) handleFileSelect(dropped);
    }, []);

    const handleFileSelect = (f: File) => {
        const allowed = ['application/pdf', 'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
        if (!allowed.includes(f.type)) {
            toast.error('Please upload a PDF, DOCX, or TXT file');
            return;
        }
        if (f.size > 10 * 1024 * 1024) {
            toast.error('File must be under 10MB');
            return;
        }
        setFile(f);
        setStep('role');
    };

    const handleAnalyze = async () => {
        if (!file || !jobRole.trim()) return;
        setStep('loading');

        try {
            const { createClient } = await import('@/lib/supabase/client');
            const supabase = createClient();
            const { data: sessionData } = await supabase.auth.getSession();
            const token = sessionData.session?.access_token;

            const formData = new FormData();
            formData.append('file', file);
            formData.append('jobRole', jobRole.trim());

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/analyze/resume`, {
                method: 'POST',
                headers: token ? { Authorization: `Bearer ${token}` } : {},
                body: formData,
            });

            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                throw new Error(err.message || 'Analysis failed');
            }

            const data: AnalysisResult = await res.json();
            setResult(data);
            setStep('results');
        } catch (err: unknown) {
            toast.error(err instanceof Error ? err.message : 'Analysis failed. Please try again.');
            setStep('role');
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-primary flex items-center justify-center">
                            <Zap className="w-4.5 h-4.5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-base font-bold text-slate-900">AI Resume Analyzer</h2>
                            <p className="text-xs text-slate-400">Upload your CV · Get role-specific feedback</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Step indicators */}
                {step !== 'loading' && step !== 'results' && (
                    <div className="flex items-center gap-2 px-6 py-3 border-b border-slate-100 bg-slate-50">
                        {[
                            { key: 'upload', label: 'Upload CV' },
                            { key: 'role', label: 'Target Role' },
                        ].map((s, i) => (
                            <div key={s.key} className="flex items-center gap-2">
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${step === s.key ? 'bg-primary text-white' : (step === 'role' && i === 0) ? 'bg-green-500 text-white' : 'bg-slate-200 text-slate-400'}`}>
                                    {step === 'role' && i === 0 ? <CheckCircle className="w-3.5 h-3.5" /> : i + 1}
                                </div>
                                <span className={`text-xs font-medium ${step === s.key ? 'text-primary' : 'text-slate-400'}`}>{s.label}</span>
                                {i === 0 && <ChevronRight className="w-3.5 h-3.5 text-slate-300" />}
                            </div>
                        ))}
                    </div>
                )}

                {/* Body */}
                <div className="flex-1 overflow-y-auto">

                    {/* Step 1: Upload */}
                    {step === 'upload' && (
                        <div className="p-6">
                            <div
                                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                                onDragLeave={() => setDragging(false)}
                                onDrop={handleDrop}
                                className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all ${dragging ? 'border-primary bg-blue-50 scale-[1.01]' : 'border-slate-200 hover:border-primary/40 hover:bg-slate-50'}`}
                                onClick={() => document.getElementById('resume-file-input')?.click()}
                            >
                                <input
                                    id="resume-file-input" type="file" className="hidden"
                                    accept=".pdf,.doc,.docx,.txt"
                                    onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                                />
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-100 to-blue-100 flex items-center justify-center mx-auto mb-4">
                                    <Upload className="w-7 h-7 text-primary" />
                                </div>
                                <p className="text-base font-semibold text-slate-700 mb-1">Drop your resume here</p>
                                <p className="text-sm text-slate-400 mb-4">or click to browse files</p>
                                <div className="flex items-center justify-center gap-2">
                                    {['PDF', 'DOCX', 'TXT'].map((f) => (
                                        <span key={f} className="px-2.5 py-1 bg-slate-100 text-slate-500 text-xs font-medium rounded-lg">{f}</span>
                                    ))}
                                    <span className="text-slate-300 text-xs">· max 10MB</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Job role */}
                    {step === 'role' && (
                        <div className="p-6 space-y-5">
                            <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-xl">
                                <FileText className="w-5 h-5 text-green-600 shrink-0" />
                                <div>
                                    <p className="text-sm font-semibold text-green-800">{file?.name}</p>
                                    <p className="text-xs text-green-600">{file ? `${(file.size / 1024).toFixed(0)} KB · Ready to analyze` : ''}</p>
                                </div>
                                <button onClick={() => { setFile(null); setStep('upload'); }} className="ml-auto text-green-400 hover:text-green-600">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            <div>
                                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-3">
                                    <Target className="w-4 h-4 text-primary" />
                                    What role are you applying for?
                                </label>
                                <input
                                    type="text"
                                    value={jobRole}
                                    onChange={(e) => setJobRole(e.target.value)}
                                    placeholder="e.g. Senior React Developer, Product Manager, Data Scientist..."
                                    className="input-field text-sm"
                                    onKeyDown={(e) => e.key === 'Enter' && jobRole.trim() && handleAnalyze()}
                                    autoFocus
                                />
                                <p className="text-xs text-slate-400 mt-2">Be specific for a better analysis — include level and domain</p>
                            </div>

                            <div>
                                <p className="text-xs font-medium text-slate-500 mb-2">Quick picks:</p>
                                <div className="flex flex-wrap gap-2">
                                    {['Frontend Developer', 'Full Stack Engineer', 'Data Scientist', 'Product Manager', 'UX Designer', 'DevOps Engineer', 'Backend Developer', 'ML Engineer'].map((role) => (
                                        <button key={role} onClick={() => setJobRole(role)}
                                            className={`text-xs px-3 py-1.5 rounded-lg border transition-all font-medium ${jobRole === role ? 'bg-primary text-white border-primary' : 'border-slate-200 text-slate-600 hover:border-primary/40 hover:bg-blue-50'}`}>
                                            {role}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <button
                                onClick={handleAnalyze}
                                disabled={!jobRole.trim()}
                                className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Zap className="w-4 h-4" />
                                Analyze My Resume
                            </button>
                        </div>
                    )}

                    {/* Loading */}
                    {step === 'loading' && (
                        <div className="flex flex-col items-center justify-center py-20 gap-4">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-primary flex items-center justify-center animate-pulse">
                                <Zap className="w-7 h-7 text-white" />
                            </div>
                            <div className="text-center">
                                <p className="text-base font-semibold text-slate-700">Analyzing your resume…</p>
                                <p className="text-sm text-slate-400 mt-1">AI is reviewing for <span className="font-medium text-primary">{jobRole}</span></p>
                            </div>
                            <div className="flex gap-1.5 mt-2">
                                {[0, 1, 2].map((i) => (
                                    <div key={i} className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                                ))}
                            </div>
                            <div className="text-xs text-slate-400 mt-2">This may take 10–20 seconds</div>
                        </div>
                    )}

                    {/* Results */}
                    {step === 'results' && result && (
                        <div className="p-6 space-y-6">
                            {/* Score + verdict */}
                            <div className="flex gap-5 items-center p-5 bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl border border-slate-100">
                                <ScoreGauge score={result.score} />
                                <div className="flex-1">
                                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">For role</p>
                                    <p className="text-sm font-bold text-slate-800 mb-3">{result.jobRole}</p>
                                    <p className="text-sm text-slate-600 leading-relaxed">{result.verdict}</p>
                                </div>
                            </div>

                            {/* Section ratings */}
                            <div className="space-y-3">
                                <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                    <TrendingUp className="w-4 h-4 text-primary" /> Section Ratings
                                </h3>
                                <div className="space-y-2.5">
                                    {Object.entries(result.sectionRatings).filter(([k]) => k !== 'overall').map(([key, val]) => (
                                        <SectionBar key={key} label={key.replace(/([A-Z])/g, ' $1').replace(/^\w/, c => c.toUpperCase())} value={val as number} />
                                    ))}
                                </div>
                            </div>

                            {/* Strengths */}
                            <div className="space-y-2.5">
                                <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4 text-green-500" /> Strengths
                                </h3>
                                <ul className="space-y-1.5">
                                    {result.strengths.map((s, i) => (
                                        <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                                            <Star className="w-3.5 h-3.5 text-green-500 shrink-0 mt-0.5" /> {s}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Weaknesses */}
                            <div className="space-y-2.5">
                                <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                    <XCircle className="w-4 h-4 text-red-400" /> Gaps & Weaknesses
                                </h3>
                                <ul className="space-y-1.5">
                                    {result.weaknesses.map((w, i) => (
                                        <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                                            <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" /> {w}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Missing keywords */}
                            <div className="space-y-2.5">
                                <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                    <Briefcase className="w-4 h-4 text-amber-500" /> Missing Keywords
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {result.missingKeywords.map((kw, i) => (
                                        <span key={i} className="px-2.5 py-1 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-medium rounded-lg">{kw}</span>
                                    ))}
                                </div>
                            </div>

                            {/* Suggestions */}
                            <div className="space-y-2.5">
                                <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                    <Lightbulb className="w-4 h-4 text-violet-500" /> Improvement Suggestions
                                </h3>
                                <ul className="space-y-2">
                                    {result.suggestions.map((s, i) => (
                                        <li key={i} className="flex items-start gap-2 p-3 bg-violet-50 border border-violet-100 rounded-xl text-sm text-slate-700">
                                            <span className="font-bold text-violet-500 shrink-0">{i + 1}.</span> {s}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Skills to add */}
                            <div className="space-y-2.5">
                                <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                    <Zap className="w-4 h-4 text-blue-500" /> Skills to Add
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {result.skillsToAdd.map((sk, i) => (
                                        <span key={i} className="px-2.5 py-1 bg-blue-50 border border-blue-200 text-blue-700 text-xs font-medium rounded-lg">{sk}</span>
                                    ))}
                                </div>
                            </div>

                            {/* CTA */}
                            <div className="flex gap-3 pt-2 border-t border-slate-100">
                                <button onClick={() => { setStep('upload'); setFile(null); setResult(null); setJobRole(''); }}
                                    className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-all">
                                    Analyze Another
                                </button>
                                <button onClick={() => { onClose(); router.push('/dashboard'); }}
                                    className="flex-1 btn-primary py-2.5 text-sm">
                                    Build Your Resume
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
