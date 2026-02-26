'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function CTASection() {
    return (
        <section className="section-padding bg-background">
            <div className="container-custom">
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-accent p-12 text-center shadow-2xl">
                    {/* Decorative circles */}
                    <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/10" />
                    <div className="absolute -bottom-10 -left-10 w-64 h-64 rounded-full bg-white/5" />

                    <div className="relative z-10">
                        <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4 leading-tight">
                            Build a Professional Resume
                            <br />
                            That Helps You Stand Out
                        </h2>
                        <p className="text-blue-100 text-lg mb-8 max-w-xl mx-auto">
                            Join 10,000+ professionals who use ResumeAI to land their dream jobs.
                            Start for free — no credit card required.
                        </p>
                        <Link
                            href="/signup"
                            className="inline-flex items-center gap-2 bg-white text-primary font-bold px-8 py-4 rounded-2xl hover:bg-blue-50 transition-all duration-200 shadow-lg text-base"
                        >
                            Get Started Free <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
