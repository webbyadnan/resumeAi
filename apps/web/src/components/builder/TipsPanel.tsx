'use client';

import { useState, useEffect, useRef } from 'react';
import { Lightbulb, ChevronDown, ChevronUp, Loader2, RefreshCw } from 'lucide-react';
import { aiApi } from '@/lib/api';

interface Props {
    sectionName: string;
    sectionData: unknown;
}

export default function TipsPanel({ sectionName, sectionData }: Props) {
    const [tips, setTips] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(true);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const lastSection = useRef('');

    const fetchTips = async (section: string, data: unknown) => {
        setLoading(true);
        try {
            const { data: res } = await aiApi.sectionTips(section, data);
            setTips(res.tips ?? []);
        } catch {
            setTips(['Fill in your details to get personalized tips.']);
        } finally {
            setLoading(false);
        }
    };

    // Re-fetch when step changes, debounced so rapid navigation doesn't spam
    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            if (sectionName !== lastSection.current) {
                lastSection.current = sectionName;
                fetchTips(sectionName, sectionData);
            }
        }, 800);
        return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
    }, [sectionName]);

    return (
        <div className="border border-amber-100 bg-amber-50/60 rounded-xl overflow-hidden text-sm">
            {/* Header */}
            <button
                onClick={() => setOpen(!open)}
                className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-amber-100/50 transition-colors"
            >
                <span className="flex items-center gap-2 font-semibold text-amber-700">
                    <Lightbulb className="w-4 h-4 text-amber-500" />
                    AI Tips — {sectionName}
                </span>
                <div className="flex items-center gap-2">
                    {!loading && tips.length > 0 && (
                        <button
                            onClick={(e) => { e.stopPropagation(); fetchTips(sectionName, sectionData); }}
                            className="p-1 text-amber-400 hover:text-amber-600 transition-colors"
                            title="Refresh tips"
                        >
                            <RefreshCw className="w-3 h-3" />
                        </button>
                    )}
                    {open ? <ChevronUp className="w-4 h-4 text-amber-500" /> : <ChevronDown className="w-4 h-4 text-amber-500" />}
                </div>
            </button>

            {/* Tips list */}
            {open && (
                <div className="px-4 pb-3">
                    {loading ? (
                        <div className="flex items-center gap-2 text-amber-500 py-2">
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span className="text-xs">Getting tips for {sectionName}…</span>
                        </div>
                    ) : tips.length > 0 ? (
                        <ul className="space-y-2 pt-1">
                            {tips.map((tip, i) => (
                                <li key={i} className="flex gap-2 text-xs text-amber-800 leading-relaxed">
                                    <span className="flex-shrink-0 w-4 h-4 rounded-full bg-amber-200 text-amber-700 flex items-center justify-center text-[10px] font-bold mt-0.5">
                                        {i + 1}
                                    </span>
                                    {tip}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-xs text-amber-500 pt-1">No tips yet — start filling in the section.</p>
                    )}
                </div>
            )}
        </div>
    );
}
