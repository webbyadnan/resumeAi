'use client';

import Link from 'next/link';
import { ArrowRight, PlayCircle, Star, Zap } from 'lucide-react';

const avatars = [
    'https://i.pravatar.cc/40?img=1',
    'https://i.pravatar.cc/40?img=2',
    'https://i.pravatar.cc/40?img=3',
    'https://i.pravatar.cc/40?img=4',
    'https://i.pravatar.cc/40?img=5',
];

export default function HeroSection() {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-hero-gradient pt-24 pb-16">
            {/* Decorative blobs */}
            <div
                className="hero-blob w-96 h-96 bg-primary/20"
                style={{ top: '-5%', right: '-5%' }}
            />
            <div
                className="hero-blob w-80 h-80 bg-accent/15"
                style={{ bottom: '10%', left: '-5%', animationDelay: '3s' }}
            />
            <div
                className="hero-blob w-64 h-64 bg-purple-400/10"
                style={{ top: '30%', left: '5%', animationDelay: '1.5s' }}
            />

            <div className="container-custom relative z-10 text-center">
                {/* Social Proof Row */}
                <div className="flex items-center justify-center gap-3 mb-8">
                    <div className="flex -space-x-2">
                        {avatars.map((src, i) => (
                            <img
                                key={i}
                                src={src}
                                alt="User"
                                className="w-8 h-8 rounded-full border-2 border-white object-cover"
                            />
                        ))}
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="flex">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                            ))}
                        </div>
                        <span className="text-sm font-medium text-slate-600">Used by 10,000+ users</span>
                    </div>
                </div>

                {/* Headline */}
                <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 leading-tight mb-6 tracking-tight">
                    Land your dream job with
                    <br />
                    <span className="gradient-text">AI-powered</span> resumes.
                </h1>

                <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed">
                    Create, edit and download professional resumes with AI-powered assistance.
                    From ATS optimization to AI-written bullet points — get hired faster.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
                    <Link
                        href="/signup"
                        className="btn-primary text-base px-8 py-4 flex items-center gap-2 shadow-lg shadow-primary/25"
                    >
                        Get started <ArrowRight className="w-5 h-5" />
                    </Link>
                    <button className="flex items-center gap-2 text-slate-600 font-semibold text-base px-6 py-4 rounded-2xl border border-slate-200 hover:border-primary/30 hover:text-primary transition-all duration-200 bg-white shadow-sm">
                        <PlayCircle className="w-5 h-5" />
                        Try demo
                    </button>
                </div>

                {/* Feature pills */}
                <div className="flex flex-wrap items-center justify-center gap-3">
                    {[
                        '⚡ AI-Powered Writing',
                        '📄 6+ Premium Templates',
                        '✅ ATS Optimized',
                        '📊 Resume Analytics',
                        '🔗 Public Share Link',
                    ].map((pill) => (
                        <span
                            key={pill}
                            className="bg-white/80 text-slate-600 text-sm font-medium px-4 py-1.5 rounded-full border border-slate-200 shadow-sm"
                        >
                            {pill}
                        </span>
                    ))}
                </div>

                {/* Hero image mockup */}
                <div className="mt-16 relative mx-auto max-w-4xl">
                    <div className="rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden">
                        <div className="bg-slate-50 border-b border-slate-200 px-4 py-3 flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-400" />
                            <div className="w-3 h-3 rounded-full bg-amber-400" />
                            <div className="w-3 h-3 rounded-full bg-green-400" />
                            <div className="flex-1 bg-white rounded-full h-5 mx-4 border border-slate-200" />
                        </div>
                        <div className="grid grid-cols-5 gap-0 min-h-[320px]">
                            {/* Form panel */}
                            <div className="col-span-2 border-r border-slate-100 p-5 space-y-4">
                                <div className="h-4 w-3/4 bg-slate-200 rounded-full shimmer" />
                                <div className="space-y-2">
                                    <div className="h-9 bg-slate-100 rounded-lg shimmer" />
                                    <div className="h-9 bg-slate-100 rounded-lg shimmer" />
                                    <div className="h-9 bg-slate-100 rounded-lg shimmer" />
                                </div>
                                <div className="h-9 w-1/2 bg-primary/20 rounded-lg shimmer" />
                            </div>
                            {/* Preview panel */}
                            <div className="col-span-3 p-5 space-y-3">
                                <div className="text-center space-y-1.5">
                                    <div className="h-6 w-1/3 bg-primary/20 rounded-full mx-auto shimmer" />
                                    <div className="h-3 w-1/2 bg-slate-100 rounded-full mx-auto shimmer" />
                                </div>
                                <div className="border-t border-slate-200 pt-3 space-y-2">
                                    <div className="h-3 w-1/4 bg-primary/30 rounded-full shimmer" />
                                    <div className="h-2.5 w-full bg-slate-100 rounded-full shimmer" />
                                    <div className="h-2.5 w-5/6 bg-slate-100 rounded-full shimmer" />
                                    <div className="h-2.5 w-4/6 bg-slate-100 rounded-full shimmer" />
                                </div>
                                <div className="space-y-2">
                                    <div className="h-3 w-1/4 bg-primary/30 rounded-full shimmer" />
                                    <div className="h-2.5 w-full bg-slate-100 rounded-full shimmer" />
                                    <div className="h-2.5 w-5/6 bg-slate-100 rounded-full shimmer" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Floating badges */}
                    <div className="absolute -right-6 top-8 bg-white rounded-xl shadow-lg border border-slate-100 p-3 flex items-center gap-2 animate-float">
                        <div className="w-7 h-7 rounded-lg bg-green-100 flex items-center justify-center">
                            <Zap className="w-4 h-4 text-green-600" />
                        </div>
                        <div>
                            <div className="text-xs font-bold text-slate-900">ATS Score</div>
                            <div className="text-xs text-green-600 font-semibold">95/100 ✓</div>
                        </div>
                    </div>
                    <div
                        className="absolute -left-6 bottom-8 bg-white rounded-xl shadow-lg border border-slate-100 p-3 flex items-center gap-2 animate-float"
                        style={{ animationDelay: '2s' }}
                    >
                        <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center text-base">
                            ✨
                        </div>
                        <div>
                            <div className="text-xs font-bold text-slate-900">AI Enhanced</div>
                            <div className="text-xs text-primary font-semibold">Just now</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
