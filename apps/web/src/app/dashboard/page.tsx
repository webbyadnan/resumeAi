'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    Plus, FileText, Trash2, Eye, EyeOff, MoreVertical,
    Clock, Loader2, Link2, Zap, Copy, Pencil, Check, X
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { resumeApi } from '@/lib/api';
import { ResumeData } from '@/types/resume';
import DashboardNavbar from '@/components/DashboardNavbar';
import ResumeAnalyzerModal from '@/components/analyzer/ResumeAnalyzerModal';
import ResumePreview from '@/components/resume-preview/ResumePreview';
import toast from 'react-hot-toast';

export default function DashboardPage() {
    const router = useRouter();
    const supabase = createClient();
    const [user, setUser] = useState<{ email?: string; user_metadata?: { full_name?: string } } | null>(null);
    const [resumes, setResumes] = useState<ResumeData[]>([]);
    const [loading, setLoading] = useState(true);
    const [createModal, setCreateModal] = useState(false);
    const [analyzerModal, setAnalyzerModal] = useState(false);
    const [newTitle, setNewTitle] = useState('');
    const [creating, setCreating] = useState(false);
    const [openMenu, setOpenMenu] = useState<string | null>(null);
    const [duplicating, setDuplicating] = useState<string | null>(null);
    const [hoveredId, setHoveredId] = useState<string | null>(null);
    const [hoverPos, setHoverPos] = useState({ top: 0, left: 0 });

    // Inline rename state
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editingTitle, setEditingTitle] = useState('');
    const renameInputRef = useRef<HTMLInputElement>(null);

    const menuJustOpened = useRef(false);

    useEffect(() => {
        supabase.auth.getUser().then(({ data }) => setUser(data.user));
        loadResumes();
    }, []);

    // Focus rename input when editing starts
    useEffect(() => {
        if (editingId) renameInputRef.current?.focus();
    }, [editingId]);

    const loadResumes = async () => {
        try {
            const { data } = await resumeApi.list();
            setResumes(data || []);
        } catch {
            toast.error('Failed to load resumes');
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTitle.trim()) return;
        setCreating(true);
        try {
            const { data } = await resumeApi.create({ title: newTitle.trim() });
            toast.success('Resume created!');
            router.push(`/builder/${data.id}`);
        } catch {
            toast.error('Failed to create resume');
        } finally {
            setCreating(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this resume? This cannot be undone.')) return;
        try {
            await resumeApi.delete(id);
            setResumes((prev) => prev.filter((r) => r.id !== id));
            toast.success('Resume deleted');
        } catch {
            toast.error('Failed to delete resume');
        }
    };

    const handleDuplicate = async (resume: ResumeData) => {
        setDuplicating(resume.id);
        try {
            const { data } = await resumeApi.duplicate(resume.id);
            setResumes((prev) => [data, ...prev]);
            toast.success(`"${data.title}" created!`);
        } catch {
            toast.error('Failed to duplicate resume');
        } finally {
            setDuplicating(null);
        }
    };

    const handleTogglePublic = async (resume: ResumeData) => {
        try {
            const { data } = await resumeApi.togglePublic(resume.id);
            setResumes((prev) =>
                prev.map((r) => (r.id === resume.id ? { ...r, isPublic: !r.isPublic, slug: data?.slug || r.slug } : r))
            );
            toast.success(resume.isPublic ? 'Resume set to private' : 'Resume is now public');
            return data;
        } catch {
            toast.error('Failed to update visibility');
        }
    };

    const handleShare = async (resume: ResumeData) => {
        let slug = resume.slug;
        if (!resume.isPublic || !slug) {
            try {
                const { data } = await resumeApi.togglePublic(resume.id);
                slug = data?.slug;
                setResumes((prev) =>
                    prev.map((r) => r.id === resume.id ? { ...r, isPublic: true, slug: data?.slug } : r)
                );
                toast.success('Resume is now public!');
            } catch {
                toast.error('Failed to make resume public');
                return;
            }
        }
        if (!slug || slug === 'null') {
            toast.error('Share link not available. Try again.');
            return;
        }
        try {
            await navigator.clipboard.writeText(`${window.location.origin}/r/${slug}`);
            toast.success('Share link copied to clipboard! 🔗');
        } catch {
            toast.error(`Share link: ${window.location.origin}/r/${slug}`);
        }
    };

    // ── Inline Rename ──────────────────────────────────────────────
    const startRename = (resume: ResumeData) => {
        setEditingId(resume.id);
        setEditingTitle(resume.title);
        setOpenMenu(null);
    };

    const commitRename = async (id: string) => {
        const trimmed = editingTitle.trim();
        if (!trimmed) { cancelRename(); return; }
        const resume = resumes.find((r) => r.id === id);
        if (trimmed === resume?.title) { cancelRename(); return; }

        try {
            await resumeApi.update(id, { title: trimmed });
            setResumes((prev) => prev.map((r) => r.id === id ? { ...r, title: trimmed } : r));
            toast.success('Renamed!');
        } catch {
            toast.error('Failed to rename');
        } finally {
            cancelRename();
        }
    };

    const cancelRename = () => {
        setEditingId(null);
        setEditingTitle('');
    };

    const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';

    return (
        <div className="min-h-screen bg-background" onClick={() => {
            if (menuJustOpened.current) { menuJustOpened.current = false; return; }
            setOpenMenu(null);
        }}>
            <DashboardNavbar userName={userName} />

            <main className="container-custom pt-20 pb-12">
                <div className="mb-8">
                    <h1 className="text-2xl font-extrabold text-slate-900">My Resumes</h1>
                    <p className="text-slate-500 text-sm mt-1">Create, manage, and share your professional resumes.</p>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                        {/* Create Resume Card */}
                        <button
                            onClick={(e) => { e.stopPropagation(); setCreateModal(true); }}
                            className="group aspect-[3/4] max-h-72 rounded-2xl border-2 border-dashed border-slate-200 hover:border-primary/40 hover:bg-blue-50/50 transition-all duration-200 flex flex-col items-center justify-center gap-3 text-slate-400 hover:text-primary"
                        >
                            <div className="w-12 h-12 rounded-full bg-slate-100 group-hover:bg-primary/10 flex items-center justify-center transition-all duration-200">
                                <Plus className="w-6 h-6" />
                            </div>
                            <span className="font-semibold text-sm">Create Resume</span>
                        </button>

                        {/* AI Analyzer Card */}
                        <button
                            onClick={(e) => { e.stopPropagation(); setAnalyzerModal(true); }}
                            className="group aspect-[3/4] max-h-72 rounded-2xl border-2 border-dashed border-slate-200 hover:border-violet-400/60 hover:bg-violet-50/50 transition-all duration-200 flex flex-col items-center justify-center gap-3 text-slate-400 hover:text-violet-600"
                        >
                            <div className="w-12 h-12 rounded-full bg-slate-100 group-hover:bg-violet-100 flex items-center justify-center transition-all duration-200">
                                <Zap className="w-6 h-6" />
                            </div>
                            <span className="font-semibold text-sm">Analyze with AI</span>
                            <span className="text-[10px] text-slate-400 group-hover:text-violet-400 font-medium -mt-1">Rate · Score · Improve</span>
                        </button>

                        {/* Resume Cards */}
                        {resumes.map((resume) => (
                            <div
                                key={resume.id}
                                className="group relative bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-200"
                                onMouseEnter={(e) => {
                                    const rect = e.currentTarget.getBoundingClientRect();
                                    // Position popup to the right; flip left if too close to screen edge
                                    const spaceRight = window.innerWidth - rect.right;
                                    const left = spaceRight > 310
                                        ? rect.right + 8
                                        : rect.left - 296;
                                    setHoverPos({ top: rect.top, left });
                                    setHoveredId(resume.id);
                                }}
                                onMouseLeave={() => setHoveredId(null)}
                            >
                                {/* Preview area */}
                                <Link
                                    href={`/builder/${resume.id}`}
                                    className="block aspect-[3/4] max-h-56 bg-card-gradient relative overflow-hidden rounded-t-2xl"
                                >
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <FileText className="w-16 h-16 text-primary/20" />
                                    </div>
                                    <div className="absolute inset-4 bg-white rounded-lg shadow p-3 space-y-1.5">
                                        <div className="h-2.5 w-1/2 bg-primary/30 rounded-full mx-auto" />
                                        <div className="h-1.5 w-1/3 bg-slate-100 rounded-full mx-auto" />
                                        <div className="border-t border-slate-100 pt-1.5 space-y-1">
                                            {[1, 2, 3].map((i) => (
                                                <div key={i} className="h-1.5 bg-slate-100 rounded-full" style={{ width: `${90 - i * 10}%` }} />
                                            ))}
                                        </div>
                                    </div>
                                    {/* Duplicate spinner overlay */}
                                    {duplicating === resume.id && (
                                        <div className="absolute inset-0 bg-white/70 flex items-center justify-center rounded-t-2xl">
                                            <Loader2 className="w-7 h-7 animate-spin text-primary" />
                                        </div>
                                    )}
                                </Link>

                                {/* Info row */}
                                <div className="p-3 border-t border-slate-100">
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="flex-1 min-w-0">
                                            {/* Inline rename */}
                                            {editingId === resume.id ? (
                                                <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                                                    <input
                                                        ref={renameInputRef}
                                                        value={editingTitle}
                                                        onChange={(e) => setEditingTitle(e.target.value)}
                                                        onKeyDown={(e) => {
                                                            if (e.key === 'Enter') commitRename(resume.id);
                                                            if (e.key === 'Escape') cancelRename();
                                                        }}
                                                        className="flex-1 min-w-0 text-sm font-semibold text-slate-900 border-b border-primary outline-none bg-transparent pb-0.5"
                                                    />
                                                    <button onClick={() => commitRename(resume.id)} className="text-green-500 hover:text-green-700 flex-shrink-0"><Check className="w-3.5 h-3.5" /></button>
                                                    <button onClick={cancelRename} className="text-slate-400 hover:text-slate-600 flex-shrink-0"><X className="w-3.5 h-3.5" /></button>
                                                </div>
                                            ) : (
                                                <h3
                                                    className="font-semibold text-slate-900 text-sm truncate cursor-text hover:text-primary transition-colors group/title"
                                                    title="Click to rename"
                                                    onClick={(e) => { e.stopPropagation(); startRename(resume); }}
                                                >
                                                    {resume.title}
                                                    <Pencil className="inline w-3 h-3 ml-1 text-slate-300 opacity-0 group-hover/title:opacity-100 transition-opacity" />
                                                </h3>
                                            )}
                                            <div className="flex items-center gap-1.5 mt-0.5">
                                                <Clock className="w-3 h-3 text-slate-300" />
                                                <span className="text-xs text-slate-400">
                                                    {new Date(resume.updatedAt).toLocaleDateString()}
                                                </span>
                                                {resume.isPublic && (
                                                    <span className="flex items-center gap-0.5 text-xs text-green-600 font-medium">
                                                        <Eye className="w-3 h-3" />
                                                        {resume.viewCount || 0} views
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Actions dropdown */}
                                        <div className="relative">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    menuJustOpened.current = true;
                                                    setOpenMenu(openMenu === resume.id ? null : resume.id);
                                                }}
                                                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                                            >
                                                <MoreVertical className="w-4 h-4" />
                                            </button>
                                            {openMenu === resume.id && (
                                                <div className="absolute right-0 top-9 bg-white rounded-xl shadow-2xl border border-slate-100 w-48 z-[999] py-1 text-sm">
                                                    <Link
                                                        href={`/builder/${resume.id}`}
                                                        className="flex items-center gap-2 px-3 py-2 text-slate-700 hover:bg-blue-50 hover:text-primary"
                                                        onClick={() => setOpenMenu(null)}
                                                    >
                                                        <FileText className="w-3.5 h-3.5" /> Edit
                                                    </Link>
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); startRename(resume); }}
                                                        className="w-full flex items-center gap-2 px-3 py-2 text-slate-700 hover:bg-blue-50 hover:text-primary text-left"
                                                    >
                                                        <Pencil className="w-3.5 h-3.5" /> Rename
                                                    </button>
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); handleDuplicate(resume); setOpenMenu(null); }}
                                                        className="w-full flex items-center gap-2 px-3 py-2 text-slate-700 hover:bg-blue-50 hover:text-primary text-left"
                                                    >
                                                        <Copy className="w-3.5 h-3.5" /> Duplicate
                                                    </button>
                                                    <div className="border-t border-slate-100 my-1" />
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); handleTogglePublic(resume); setOpenMenu(null); }}
                                                        className="w-full flex items-center gap-2 px-3 py-2 text-slate-700 hover:bg-blue-50 hover:text-primary text-left"
                                                    >
                                                        {resume.isPublic ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                                                        {resume.isPublic ? 'Make Private' : 'Make Public'}
                                                    </button>
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); handleShare(resume); setOpenMenu(null); }}
                                                        className="w-full flex items-center gap-2 px-3 py-2 text-slate-700 hover:bg-blue-50 hover:text-primary text-left"
                                                    >
                                                        <Link2 className="w-3.5 h-3.5" /> Share Resume
                                                    </button>
                                                    <div className="border-t border-slate-100 my-1" />
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); handleDelete(resume.id); setOpenMenu(null); }}
                                                        className="w-full flex items-center gap-2 px-3 py-2 text-red-500 hover:bg-red-50 text-left"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" /> Delete
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {/* Create Resume Modal */}
            {createModal && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 p-8 w-full max-w-sm animate-slide-up">
                        <h2 className="text-xl font-extrabold text-slate-900 mb-6">Create a Resume</h2>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <input
                                type="text"
                                value={newTitle}
                                onChange={(e) => setNewTitle(e.target.value)}
                                placeholder="Enter resume title"
                                required
                                autoFocus
                                className="input-field"
                            />
                            <button type="submit" disabled={creating} className="btn-primary w-full flex items-center justify-center gap-2">
                                {creating ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating...</> : 'Create Resume'}
                            </button>
                            <button
                                type="button"
                                onClick={() => { setCreateModal(false); setNewTitle(''); }}
                                className="w-full text-sm text-slate-400 hover:text-slate-600 transition-colors"
                            >
                                Cancel
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* AI Resume Analyzer Modal */}
            {analyzerModal && (
                <ResumeAnalyzerModal onClose={() => setAnalyzerModal(false)} />
            )}

            {/* ─── Hover Preview Popup ─────────────────────────────── */}
            {hoveredId && (() => {
                const r = resumes.find((x) => x.id === hoveredId);
                if (!r) return null;
                return (
                    <div
                        className="fixed z-[9998] pointer-events-none"
                        style={{ top: hoverPos.top, left: hoverPos.left }}
                    >
                        <div className="w-72 rounded-2xl shadow-2xl border border-slate-200 bg-white overflow-hidden animate-fade-in">
                            {/* Popup header */}
                            <div className="px-3 py-2 border-b border-slate-100 flex items-center justify-between">
                                <span className="text-xs font-semibold text-slate-700 truncate">{r.title}</span>
                                <span className="text-[10px] text-slate-400 capitalize ml-2 shrink-0">{r.template}</span>
                            </div>
                            {/* Scaled resume preview */}
                            <div className="overflow-hidden bg-slate-50" style={{ height: 370 }}>
                                <div style={{
                                    transform: 'scale(0.38)',
                                    transformOrigin: 'top left',
                                    width: `${100 / 0.38}%`,
                                    pointerEvents: 'none',
                                }}>
                                    <ResumePreview resume={r} />
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })()}
        </div>
    );
}
