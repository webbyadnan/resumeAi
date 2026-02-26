'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    ArrowLeft, Download, Eye, EyeOff, Loader2,
    ChevronLeft, ChevronRight, Layers, Palette, Share2, Check, Mail, Linkedin
} from 'lucide-react';
import { resumeApi, aiApi } from '@/lib/api';
import { ResumeData, ResumeTemplate, AccentColor, BuilderStep } from '@/types/resume';
import PersonalStep from '@/components/builder/steps/PersonalStep';
import SummaryStep from '@/components/builder/steps/SummaryStep';
import ExperienceStep from '@/components/builder/steps/ExperienceStep';
import EducationStep from '@/components/builder/steps/EducationStep';
import ProjectsStep from '@/components/builder/steps/ProjectsStep';
import SkillsStep from '@/components/builder/steps/SkillsStep';
import ExtrasStep from '@/components/builder/steps/ExtrasStep';
import TemplateSelector from '@/components/builder/TemplateSelector';
import AccentPicker from '@/components/builder/AccentPicker';
import ResumePreview from '@/components/resume-preview/ResumePreview';
import TipsPanel from '@/components/builder/TipsPanel';
import CoverLetterModal from '@/components/builder/CoverLetterModal';
import LinkedInImportModal from '@/components/builder/LinkedInImportModal';
import toast from 'react-hot-toast';

// Suppress unused import warning — used dynamically
void aiApi;

const STEPS: { key: BuilderStep; label: string }[] = [
    { key: 'personal', label: 'Personal Info' },
    { key: 'summary', label: 'Summary' },
    { key: 'experience', label: 'Experience' },
    { key: 'education', label: 'Education' },
    { key: 'projects', label: 'Projects' },
    { key: 'skills', label: 'Skills' },
    { key: 'extras', label: 'Extras' },
];

function formatLastSaved(date: Date | null) {
    if (!date) return null;
    const diff = Math.floor((Date.now() - date.getTime()) / 1000);
    if (diff < 10) return 'Just saved';
    if (diff < 60) return `Saved ${diff}s ago`;
    if (diff < 3600) return `Saved ${Math.floor(diff / 60)}m ago`;
    return `Saved at ${date.toLocaleTimeString()}`;
}

export default function BuilderPage({ params }: { params: { id: string } }) {
    const { id } = params;
    const router = useRouter();
    const [resume, setResume] = useState<ResumeData | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);
    const [lastSavedLabel, setLastSavedLabel] = useState<string | null>(null);
    const [currentStep, setCurrentStep] = useState(0);
    const [showTemplates, setShowTemplates] = useState(false);
    const [showAccent, setShowAccent] = useState(false);
    const [downloading, setDownloading] = useState(false);
    const [showPrintPreview, setShowPrintPreview] = useState(false);
    const [showCoverLetter, setShowCoverLetter] = useState(false);
    const [showLinkedIn, setShowLinkedIn] = useState(false);
    const [togglingPublic, setTogglingPublic] = useState(false);
    const [copied, setCopied] = useState(false);

    const autoSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const pendingUpdates = useRef<Partial<ResumeData> | null>(null);

    // Update "last saved X ago" label every 30s
    useEffect(() => {
        const interval = setInterval(() => {
            setLastSavedLabel(formatLastSaved(lastSaved));
        }, 30000);
        return () => clearInterval(interval);
    }, [lastSaved]);

    useEffect(() => {
        setLastSavedLabel(formatLastSaved(lastSaved));
    }, [lastSaved]);

    useEffect(() => {
        loadResume();
    }, [id]);

    const loadResume = async () => {
        try {
            const { data } = await resumeApi.get(id);
            setResume(data);
        } catch {
            toast.error('Resume not found');
            router.push('/dashboard');
        } finally {
            setLoading(false);
        }
    };

    const persistSave = useCallback(async (updates: Partial<ResumeData>) => {
        setSaving(true);
        try {
            const { data } = await resumeApi.update(id, updates as Record<string, unknown>);
            setResume(data);
            setLastSaved(new Date());
            setLastSavedLabel('Just saved');
        } catch {
            toast.error('Auto-save failed');
        } finally {
            setSaving(false);
            pendingUpdates.current = null;
        }
    }, [id]);

    /** Call this for any field change — debounces 1.5s then auto-saves */
    const handleUpdate = useCallback((updates: Partial<ResumeData>) => {
        setResume((prev) => prev ? { ...prev, ...updates } : prev);
        pendingUpdates.current = { ...(pendingUpdates.current || {}), ...updates };

        if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
        autoSaveTimer.current = setTimeout(() => {
            if (pendingUpdates.current) {
                persistSave(pendingUpdates.current);
            }
        }, 1500);
    }, [persistSave]);

    /** Explicit save (e.g. from Save button in a step) — saves immediately */
    const saveChanges = useCallback(async (updates: Partial<ResumeData>) => {
        if (!resume) return;
        if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
        pendingUpdates.current = { ...(pendingUpdates.current || {}), ...updates };
        setResume((prev) => prev ? { ...prev, ...updates } : prev);
        await persistSave({ ...resume, ...updates });
    }, [resume, persistSave]);

    /** Apply LinkedIn imported data to the resume */
    const handleLinkedInImport = useCallback((imported: Partial<ResumeData>) => {
        handleUpdate(imported);
    }, [handleUpdate]);

    const handleTemplateChange = (template: ResumeTemplate) => {
        setShowTemplates(false);
        handleUpdate({ template });
    };

    const handleAccentChange = (accentColor: AccentColor) => {
        setShowAccent(false);
        handleUpdate({ accentColor });
    };

    const handleTogglePublic = async () => {
        if (!resume) return;
        setTogglingPublic(true);
        try {
            const { data } = await resumeApi.togglePublic(id);
            setResume((prev) => prev ? { ...prev, isPublic: data.isPublic, slug: data.slug } : prev);
            toast.success(resume.isPublic ? 'Set to private' : 'Resume is now public!');
        } catch {
            toast.error('Failed to toggle visibility');
        } finally {
            setTogglingPublic(false);
        }
    };

    const handleShare = async () => {
        if (!resume) return;
        let slug = resume.slug;

        // If not yet public (or no slug yet), make it public first and get the slug from the API response
        if (!resume.isPublic || !slug) {
            setTogglingPublic(true);
            try {
                const { data } = await resumeApi.togglePublic(id);
                slug = data.slug;
                setResume((prev) => prev ? { ...prev, isPublic: data.isPublic, slug: data.slug } : prev);
                if (!resume.isPublic) toast.success('Resume is now public!');
            } catch {
                toast.error('Failed to make resume public');
                setTogglingPublic(false);
                return;
            } finally {
                setTogglingPublic(false);
            }
        }

        if (!slug || slug === 'null') {
            toast.error('Share link not available yet. Try again.');
            return;
        }

        const url = `${window.location.origin}/r/${slug}`;
        await navigator.clipboard.writeText(url);
        setCopied(true);
        toast.success('Share link copied!');
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDownload = () => {
        setShowPrintPreview(true);
    };

    const progress = Math.round(((currentStep + 1) / STEPS.length) * 100);
    const StepComponents: Record<BuilderStep, React.ComponentType<any>> = {
        personal: PersonalStep,
        summary: SummaryStep,
        experience: ExperienceStep,
        education: EducationStep,
        projects: ProjectsStep,
        skills: SkillsStep,
        extras: ExtrasStep,
        'cover-letter': ExtrasStep,
    };
    const CurrentStepComponent = StepComponents[STEPS[currentStep].key];

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!resume) return null;

    return (
        <div className="min-h-screen bg-background">
            {/* Top Navbar */}
            <nav className="fixed top-0 left-0 right-0 z-40 bg-white border-b border-slate-200 shadow-sm">
                <div className="flex items-center justify-between h-14 px-4">
                    <Link href="/dashboard" className="flex items-center gap-2 text-slate-600 hover:text-primary text-sm font-medium transition-colors">
                        <ArrowLeft className="w-4 h-4" />
                        Back
                    </Link>

                    <div className="flex items-center gap-2">
                        {/* Last saved indicator */}
                        {saving ? (
                            <span className="text-xs text-slate-400 flex items-center gap-1">
                                <Loader2 className="w-3 h-3 animate-spin" /> Saving...
                            </span>
                        ) : lastSavedLabel ? (
                            <span className="text-xs text-green-500 flex items-center gap-1">
                                <Check className="w-3 h-3" /> {lastSavedLabel}
                            </span>
                        ) : null}

                        {/* Public/Private toggle */}
                        <button
                            onClick={handleTogglePublic}
                            disabled={togglingPublic}
                            className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all ${resume.isPublic
                                ? 'border-green-200 text-green-600 bg-green-50'
                                : 'border-slate-200 text-slate-500 bg-white hover:border-primary/30'
                                }`}
                        >
                            {resume.isPublic ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                            {resume.isPublic ? 'Public' : 'Private'}
                        </button>

                        {/* Cover Letter button */}
                        <button
                            onClick={() => setShowCoverLetter(true)}
                            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border border-violet-200 text-violet-600 bg-violet-50 hover:bg-violet-100 transition-all"
                        >
                            <Mail className="w-3.5 h-3.5" />
                            Cover Letter
                        </button>

                        {/* LinkedIn Import button */}
                        <button
                            onClick={() => setShowLinkedIn(true)}
                            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border border-[#0077B5]/30 text-[#0077B5] bg-[#0077B5]/5 hover:bg-[#0077B5]/10 transition-all"
                        >
                            <Linkedin className="w-3.5 h-3.5" />
                            LinkedIn
                        </button>

                        {/* Share button */}
                        <button
                            onClick={handleShare}
                            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border border-violet-200 text-violet-600 bg-violet-50 hover:bg-violet-100 transition-all"
                        >
                            {copied ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
                            {copied ? 'Copied!' : 'Share'}
                        </button>

                        {/* Download PDF */}
                        <button
                            onClick={handleDownload}
                            disabled={downloading}
                            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border border-primary/20 text-primary bg-blue-50 hover:bg-primary hover:text-white transition-all"
                        >
                            {downloading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
                            Download
                        </button>
                    </div>
                </div>
                {/* Progress bar */}
                <div className="h-0.5 bg-slate-100">
                    <div className="progress-bar-fill h-full transition-all duration-300" style={{ width: `${progress}%` }} />
                </div>
            </nav>

            <div className="flex pt-14 min-h-screen">
                {/* LEFT: Form Panel */}
                <div className="w-full lg:w-2/5 xl:w-1/3 flex flex-col border-r border-slate-200 bg-white relative">
                    {/* Step controls header */}
                    <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100 bg-slate-50 flex-shrink-0">
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => { setShowTemplates(!showTemplates); setShowAccent(false); }}
                                className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${showTemplates ? 'bg-primary text-white' : 'bg-white border border-slate-200 text-slate-600 hover:border-primary/30'}`}
                            >
                                <Layers className="w-3.5 h-3.5" />
                                Template
                            </button>
                            <button
                                onClick={() => { setShowAccent(!showAccent); setShowTemplates(false); }}
                                className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${showAccent ? 'bg-primary text-white' : 'bg-white border border-slate-200 text-slate-600 hover:border-primary/30'}`}
                            >
                                <Palette className="w-3.5 h-3.5" />
                                Accent
                            </button>
                        </div>
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => setCurrentStep((s) => Math.max(0, s - 1))}
                                disabled={currentStep === 0}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-primary hover:bg-blue-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            <span className="text-xs text-slate-400 font-medium">
                                {currentStep + 1} / {STEPS.length}
                            </span>
                            <button
                                onClick={() => setCurrentStep((s) => Math.min(STEPS.length - 1, s + 1))}
                                disabled={currentStep === STEPS.length - 1}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-primary hover:bg-blue-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Step navigation tabs */}
                    <div className="flex overflow-x-auto gap-1 px-3 py-2 border-b border-slate-100 flex-shrink-0 scrollbar-none">
                        {STEPS.map((step, idx) => (
                            <button
                                key={step.key}
                                onClick={() => setCurrentStep(idx)}
                                className={`whitespace-nowrap text-xs font-medium px-2.5 py-1.5 rounded-lg transition-all ${idx === currentStep
                                    ? 'bg-primary text-white'
                                    : 'text-slate-500 hover:bg-blue-50 hover:text-primary'
                                    }`}
                            >
                                {step.label}
                            </button>
                        ))}
                    </div>

                    {/* Template / Accent Overlays */}
                    {showTemplates && (
                        <div className="absolute left-0 z-30 w-80 shadow-xl bg-white border border-slate-200 rounded-br-2xl overflow-y-auto max-h-96" style={{ top: '120px' }}>
                            <TemplateSelector current={resume.template} onSelect={handleTemplateChange} />
                        </div>
                    )}
                    {showAccent && (
                        <div className="absolute left-0 z-30 w-72 shadow-xl bg-white border border-slate-200 rounded-br-2xl p-4" style={{ top: '120px' }}>
                            <AccentPicker current={resume.accentColor} onSelect={handleAccentChange} />
                        </div>
                    )}

                    {/* Step content */}
                    <div className="flex-1 overflow-y-auto">
                        <div className="p-5">
                            <CurrentStepComponent
                                resume={resume}
                                onSave={saveChanges}
                                onUpdate={handleUpdate}
                            />
                        </div>
                        {/* AI Tips Panel – below form, inside scroll */}
                        <div className="px-5 pb-6">
                            <TipsPanel
                                sectionName={STEPS[currentStep]?.label ?? 'Resume'}
                                sectionData={(() => {
                                    const key = STEPS[currentStep]?.key;
                                    if (key === 'personal') return resume.personalInfo;
                                    if (key === 'summary') return resume.professionalSummary;
                                    if (key === 'experience') return resume.experience;
                                    if (key === 'education') return resume.education;
                                    if (key === 'projects') return resume.projects;
                                    if (key === 'skills') return resume.skills;
                                    if (key === 'extras') return { languages: resume.languages, certifications: resume.certifications };
                                    return {};
                                })()}
                            />
                        </div>
                    </div>
                </div>

                {/* RIGHT: Live Preview Panel — auto-height, scrollable */}
                <div className="hidden lg:flex flex-1 bg-slate-100 overflow-auto items-start justify-center p-8">
                    <div className="w-full max-w-[700px]">
                        <ResumePreview resume={resume} />
                    </div>
                </div>
            </div>
            {/* ─── Print Preview Modal ─────────────────────────────── */}
            {showPrintPreview && (
                <div className="fixed inset-0 z-[9999] flex flex-col print:block print:inset-auto print:relative">
                    {/* Dark overlay backdrop */}
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm print:hidden"
                        onClick={() => setShowPrintPreview(false)}
                    />

                    {/* Top bar — only visible on screen, hidden during print */}
                    <div className="relative z-10 flex items-center justify-between bg-slate-900 text-white px-6 py-3 flex-shrink-0 print:hidden">
                        <div className="flex items-center gap-3">
                            <span className="font-semibold text-sm">📄 Print Preview</span>
                            <span className="text-slate-400 text-xs">
                                Press
                                <kbd className="mx-1 px-1.5 py-0.5 bg-slate-700 rounded text-xs font-mono">Ctrl+P</kbd>
                                or click the button to save as PDF
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => window.print()}
                                className="flex items-center gap-1.5 px-4 py-2 bg-primary rounded-lg text-white font-semibold text-sm hover:bg-primary/90 transition-all"
                            >
                                <Download className="w-4 h-4" />
                                Print / Save as PDF
                            </button>
                            <button
                                onClick={() => setShowPrintPreview(false)}
                                className="px-3 py-2 text-slate-400 hover:text-white text-sm rounded-lg hover:bg-slate-700 transition-all"
                            >
                                ✕ Close
                            </button>
                        </div>
                    </div>

                    {/* Resume content — scrollable on screen, fills page during print */}
                    <div
                        id="print-resume"
                        className="relative z-10 flex-1 overflow-auto bg-slate-200 p-8 print:p-0 print:bg-white print:overflow-visible"
                    >
                        <div className="max-w-[820px] mx-auto print:max-w-none print:mx-0">
                            <ResumePreview resume={resume} />
                        </div>
                    </div>
                </div>
            )}

            {/* Cover Letter Modal */}
            {showCoverLetter && (
                <CoverLetterModal resume={resume} onClose={() => setShowCoverLetter(false)} />
            )}

            {/* LinkedIn Import Modal */}
            {showLinkedIn && (
                <LinkedInImportModal
                    onImport={handleLinkedInImport}
                    onClose={() => setShowLinkedIn(false)}
                />
            )}

            {/* Global print styles — only active when window.print() is called */}
            <style jsx global>{`
                @media print {
                    * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
                    body > * { visibility: hidden !important; }
                    #print-resume, #print-resume * { visibility: visible !important; }
                    #print-resume {
                        position: fixed !important;
                        top: 0 !important; left: 0 !important;
                        width: 100vw !important;
                        padding: 0 !important;
                        margin: 0 !important;
                        background: white !important;
                        overflow: visible !important;
                    }
                    @page { size: A4; margin: 10mm; }
                }
            `}</style>
        </div>
    );
}
