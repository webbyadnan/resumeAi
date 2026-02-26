'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, FileText, ArrowRight, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import toast from 'react-hot-toast';

export default function SignupPage() {
    const router = useRouter();
    const supabase = createClient();
    const [formData, setFormData] = useState({ fullName: '', email: '', password: '', confirmPassword: '' });
    const [showPw, setShowPw] = useState(false);
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);

    const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
        setFormData((prev) => ({ ...prev, [field]: e.target.value }));

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }
        if (formData.password.length < 8) {
            toast.error('Password must be at least 8 characters');
            return;
        }
        setLoading(true);
        const { error } = await supabase.auth.signUp({
            email: formData.email,
            password: formData.password,
            options: {
                data: { full_name: formData.fullName },
                emailRedirectTo: `${window.location.origin}/dashboard`,
            },
        });
        if (error) {
            toast.error(error.message);
        } else {
            toast.success('Account created! Check your email to verify.');
            router.push('/dashboard');
        }
        setLoading(false);
    };

    const handleGoogle = async () => {
        setGoogleLoading(true);
        await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: { redirectTo: `${window.location.origin}/dashboard` },
        });
    };

    return (
        <div className="min-h-screen bg-hero-gradient flex">
            {/* Left panel */}
            <div className="hidden lg:flex flex-col justify-center items-center w-1/2 bg-gradient-to-br from-primary to-accent relative overflow-hidden p-12">
                <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/10 -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-white/10 translate-y-1/2 -translate-x-1/2" />
                <div className="relative z-10 text-center text-white">
                    <div className="text-5xl mb-6">🚀</div>
                    <h1 className="text-3xl font-extrabold mb-4">Start building your future today</h1>
                    <p className="text-blue-100 text-lg max-w-sm mb-8">
                        Join 10,000+ professionals who use ResumeAI to create resumes that get noticed.
                    </p>
                    <div className="flex justify-center gap-2 flex-wrap">
                        {['Free Forever', 'No Credit Card', 'AI-Powered', 'ATS Optimized'].map((tag) => (
                            <span key={tag} className="bg-white/20 text-white text-xs font-semibold px-3 py-1.5 rounded-full">
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right form panel */}
            <div className="flex-1 flex items-center justify-center p-6">
                <div className="w-full max-w-md">
                    <div className="text-center mb-8">
                        <Link href="/" className="inline-flex items-center gap-2 mb-6">
                            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                                <FileText className="w-4 h-4 text-white" />
                            </div>
                            <span className="font-bold text-lg text-slate-900">Resume<span className="text-primary">AI</span></span>
                        </Link>
                        <h2 className="text-3xl font-extrabold text-slate-900">Create your account</h2>
                        <p className="text-slate-500 mt-2">
                            Already have an account?{' '}
                            <Link href="/login" className="text-primary font-semibold hover:underline">Sign in</Link>
                        </p>
                    </div>

                    <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8">
                        <button
                            onClick={handleGoogle}
                            disabled={googleLoading}
                            className="w-full flex items-center justify-center gap-3 border border-slate-200 rounded-xl py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-all duration-200 mb-6"
                        >
                            {googleLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                                <svg className="w-4 h-4" viewBox="0 0 24 24">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                </svg>
                            )}
                            Continue with Google
                        </button>

                        <div className="flex items-center gap-3 mb-6">
                            <div className="flex-1 h-px bg-slate-200" />
                            <span className="text-xs text-slate-400">or sign up with email</span>
                            <div className="flex-1 h-px bg-slate-200" />
                        </div>

                        <form onSubmit={handleSignup} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name</label>
                                <input type="text" value={formData.fullName} onChange={set('fullName')} required placeholder="Adnan Khan" className="input-field" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">Email address</label>
                                <input type="email" value={formData.email} onChange={set('email')} required placeholder="you@example.com" className="input-field" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
                                <div className="relative">
                                    <input type={showPw ? 'text' : 'password'} value={formData.password} onChange={set('password')} required placeholder="Min. 8 characters" className="input-field pr-10" />
                                    <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                                        {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">Confirm Password</label>
                                <input type="password" value={formData.confirmPassword} onChange={set('confirmPassword')} required placeholder="••••••••" className="input-field" />
                            </div>
                            <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 mt-2">
                                {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating account...</> : <>Create account <ArrowRight className="w-4 h-4" /></>}
                            </button>
                            <p className="text-xs text-slate-400 text-center pt-1">
                                By signing up, you agree to our{' '}
                                <a href="#" className="text-primary hover:underline">Terms</a> and{' '}
                                <a href="#" className="text-primary hover:underline">Privacy Policy</a>.
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
