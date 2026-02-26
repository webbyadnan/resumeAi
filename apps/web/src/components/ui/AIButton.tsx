'use client';

import { Sparkles, Loader2 } from 'lucide-react';

interface AIButtonProps {
    onClick: () => void;
    loading?: boolean;
    label?: string;
    className?: string;
}

export default function AIButton({
    onClick,
    loading = false,
    label = 'AI Enhance',
    className = '',
}: AIButtonProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={loading}
            className={`ai-badge cursor-pointer hover:scale-105 active:scale-95 transition-transform disabled:opacity-60 disabled:cursor-not-allowed ${className}`}
        >
            {loading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
                <Sparkles className="w-3.5 h-3.5" />
            )}
            {loading ? 'Enhancing...' : label}
        </button>
    );
}
