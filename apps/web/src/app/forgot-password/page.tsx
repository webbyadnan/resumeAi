'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FileText, ArrowLeft, Loader2, Mail } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import toast from 'react-hot-toast';

export default function ForgotPasswordPage() {
    const supabase = createClient();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) {
            toast.error(error.message);
        } else {
            setSent(true);
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-hero-gradient flex items-center justify-center p-6">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center gap-2 mb-6">
                        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                            <FileText className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-bold text-lg text-slate-900">Resume<span className="text-primary">AI</span></span>
                    </Link>
                </div>

                <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8">
                    {sent ? (
                        <div className="text-center">
                            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                                <Mail className="w-8 h-8 text-primary" />
                            </div>
                            <h2 className="text-2xl font-extrabold text-slate-900 mb-2">Check your inbox</h2>
                            <p className="text-slate-500 text-sm mb-6">
                                We sent a password reset link to <strong>{email}</strong>
                            </p>
                            <Link href="/login" className="btn-primary w-full block text-center">
                                Back to login
                            </Link>
                        </div>
                    ) : (
                        <>
                            <h2 className="text-2xl font-extrabold text-slate-900 mb-2">Reset your password</h2>
                            <p className="text-slate-500 text-sm mb-6">
                                Enter your email and we&apos;ll send you a link to reset your password.
                            </p>
                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Email address</label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        placeholder="you@example.com"
                                        className="input-field"
                                    />
                                </div>
                                <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
                                    {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</> : 'Send reset link'}
                                </button>
                            </form>
                            <Link href="/login" className="flex items-center justify-center gap-2 text-sm text-slate-500 hover:text-primary mt-6 transition-colors">
                                <ArrowLeft className="w-4 h-4" />
                                Back to login
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
