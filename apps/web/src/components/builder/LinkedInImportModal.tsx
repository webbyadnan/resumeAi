'use client';

import { useState, useRef } from 'react';
import { X, Upload, Loader2, Linkedin, Check, AlertCircle } from 'lucide-react';
import { ResumeData } from '@/types/resume';
import apiClient from '@/lib/api';
import toast from 'react-hot-toast';

interface Props {
    onImport: (data: Partial<ResumeData>) => void;
    onClose: () => void;
}

export default function LinkedInImportModal({ onImport, onClose }: Props) {
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [parsed, setParsed] = useState<Partial<ResumeData> | null>(null);
    const fileRef = useRef<HTMLInputElement>(null);

    const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0];
        if (!f) return;
        setFile(f);
        setParsed(null);
    };

    const handleParse = async () => {
        if (!file) return;
        setLoading(true);
        try {
            const text = await file.text();
            const { data } = await apiClient.post<Record<string, unknown>>('/api/linkedin/import', { rawText: text });

            // Map parsed fields to ResumeData
            const resume: Partial<ResumeData> = {
                personalInfo: data.personalInfo as ResumeData['personalInfo'],
                professionalSummary: data.professionalSummary as string,
                experience: (data.experience as ResumeData['experience']) ?? [],
                education: (data.education as ResumeData['education']) ?? [],
                skills: (data.skills as string[]) ?? [],
                certifications: (data.certifications as ResumeData['certifications']) ?? [],
            };
            setParsed(resume);
        } catch {
            toast.error('Failed to parse LinkedIn data — please check the file format');
        } finally {
            setLoading(false);
        }
    };

    const handleApply = () => {
        if (!parsed) return;
        onImport(parsed);
        toast.success('LinkedIn data imported!');
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-[#0077B5]/5">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-[#0077B5] flex items-center justify-center">
                            <Linkedin className="w-4 h-4 text-white" />
                        </div>
                        <div>
                            <h2 className="font-bold text-slate-900 text-sm">Import from LinkedIn</h2>
                            <p className="text-xs text-slate-400">Use your LinkedIn data export</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <div className="p-6 space-y-4">
                    {/* How to export instructions */}
                    <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-xs text-blue-700 space-y-1">
                        <p className="font-semibold text-blue-800 mb-2">📥 How to get your LinkedIn export:</p>
                        <ol className="list-decimal list-inside space-y-0.5 text-blue-600">
                            <li>Go to LinkedIn → Settings &amp; Privacy</li>
                            <li>Data privacy → Get a copy of your data</li>
                            <li>Select <strong>"Profile"</strong> only → Request archive</li>
                            <li>Download &amp; extract the ZIP — upload any <code>.csv</code> or <code>.json</code> file</li>
                        </ol>
                    </div>

                    {/* File drop zone */}
                    <div
                        className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center cursor-pointer hover:border-primary/40 hover:bg-blue-50/30 transition-all"
                        onClick={() => fileRef.current?.click()}
                    >
                        <input
                            ref={fileRef}
                            type="file"
                            accept=".json,.csv,.txt"
                            className="hidden"
                            onChange={handleFile}
                        />
                        <Upload className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                        {file ? (
                            <p className="text-sm font-medium text-primary">{file.name}</p>
                        ) : (
                            <>
                                <p className="text-sm text-slate-500">Click to upload LinkedIn export file</p>
                                <p className="text-xs text-slate-400 mt-1">Supports .json, .csv, .txt</p>
                            </>
                        )}
                    </div>

                    {/* Parse / Apply buttons */}
                    {!parsed ? (
                        <button
                            onClick={handleParse}
                            disabled={!file || loading}
                            className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {loading ? (
                                <><Loader2 className="w-4 h-4 animate-spin" /> Parsing with AI…</>
                            ) : (
                                <><Linkedin className="w-4 h-4" /> Parse LinkedIn Data</>
                            )}
                        </button>
                    ) : (
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-100 rounded-xl p-3">
                                <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                                <span>Found: <strong>{(parsed.personalInfo as { fullName?: string })?.fullName || 'Profile'}</strong> — {(parsed.experience ?? []).length} jobs, {(parsed.education ?? []).length} education, {(parsed.skills ?? []).length} skills</span>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => setParsed(null)} className="flex-1 py-2 border border-slate-200 rounded-xl text-sm text-slate-500 hover:bg-slate-50 transition-colors">
                                    Try Again
                                </button>
                                <button onClick={handleApply} className="flex-1 btn-primary flex items-center justify-center gap-1.5">
                                    <Check className="w-4 h-4" /> Apply to Resume
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="flex items-start gap-2 text-xs text-slate-400">
                        <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                        <span>Your data is processed privately and never stored. You can edit all fields after importing.</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
