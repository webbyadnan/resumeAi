'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { resumeApi } from '@/lib/api';
import { ResumeData } from '@/types/resume';
import ResumePreview from '@/components/resume-preview/ResumePreview';

export default function PrintResumePage() {
    const params = useParams();
    const router = useRouter();
    const id = params?.id as string;

    const [resume, setResume] = useState<ResumeData | null>(null);
    const [loading, setLoading] = useState(true);
    const hasPrinted = useRef(false);

    useEffect(() => {
        resumeApi.get(id)
            .then(({ data }) => setResume(data))
            .catch(() => router.push(`/builder/${id}`))
            .finally(() => setLoading(false));
    }, [id]);

    // Auto-trigger print once the resume has loaded and rendered
    useEffect(() => {
        if (!resume || hasPrinted.current) return;
        hasPrinted.current = true;
        // Small delay lets the browser finish painting the template
        const t = setTimeout(() => window.print(), 600);
        return () => clearTimeout(t);
    }, [resume]);

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center bg-white">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!resume) return null;

    return (
        <>
            {/* Print instructions bar — hidden when printing */}
            <div className="print:hidden flex items-center justify-between bg-slate-800 text-white px-6 py-3 text-sm sticky top-0 z-50">
                <span className="font-medium">
                    📄 Print dialog should appear automatically. If not — press
                    <kbd className="mx-1.5 px-2 py-0.5 bg-slate-600 rounded text-xs font-mono">Ctrl+P</kbd>
                    (or <kbd className="px-2 py-0.5 bg-slate-600 rounded text-xs font-mono">⌘P</kbd> on Mac).
                    Choose <strong>"Save as PDF"</strong> as the destination.
                </span>
                <button
                    onClick={() => window.print()}
                    className="ml-4 px-4 py-1.5 bg-primary rounded-lg text-white font-semibold text-xs hover:bg-opacity-90 transition-all flex-shrink-0"
                >
                    🖨 Print / Save PDF
                </button>
            </div>

            {/* Resume — this is what gets printed */}
            <div className="print:m-0 print:p-0 p-8 bg-slate-100 min-h-screen">
                <div className="max-w-[800px] mx-auto print:max-w-none print:mx-0">
                    <ResumePreview resume={resume} />
                </div>
            </div>

            {/* Print-specific global styles */}
            <style jsx global>{`
                @media print {
                    * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
                    body { margin: 0 !important; padding: 0 !important; background: white !important; }
                    @page { size: A4; margin: 0; }
                }
            `}</style>
        </>
    );
}
