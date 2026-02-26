'use client';

import Link from 'next/link';
import { useState } from 'react';
import { FileText, Menu, X, Sparkles } from 'lucide-react';

export default function Navbar() {
    const [open, setOpen] = useState(false);

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/60">
            <div className="container-custom">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                            <FileText className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-bold text-lg text-slate-900">
                            Resume<span className="text-primary">AI</span>
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-1">
                        {['Features', 'Templates', 'Testimonials'].map((item) => (
                            <Link
                                key={item}
                                href={`#${item.toLowerCase()}`}
                                className="btn-ghost text-sm"
                            >
                                {item}
                            </Link>
                        ))}
                    </div>

                    {/* CTA Buttons */}
                    <div className="hidden md:flex items-center gap-3">
                        <Link href="/login" className="btn-ghost text-sm">
                            Login
                        </Link>
                        <Link href="/signup" className="btn-primary text-sm py-2 px-5">
                            Get started →
                        </Link>
                    </div>

                    {/* Mobile toggle */}
                    <button
                        className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-blue-50"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>
            </div>

            {/* Mobile menu */}
            {open && (
                <div className="md:hidden glass border-t border-white/60 px-4 py-4 flex flex-col gap-2">
                    {['Features', 'Templates', 'Testimonials'].map((item) => (
                        <Link
                            key={item}
                            href={`#${item.toLowerCase()}`}
                            className="text-slate-700 font-medium py-2 px-3 rounded-lg hover:bg-blue-50"
                            onClick={() => setOpen(false)}
                        >
                            {item}
                        </Link>
                    ))}
                    <hr className="border-slate-200 my-1" />
                    <Link href="/login" className="text-slate-700 font-medium py-2 px-3 rounded-lg hover:bg-blue-50">
                        Login
                    </Link>
                    <Link href="/signup" className="btn-primary text-center text-sm">
                        Get started →
                    </Link>
                </div>
            )}
        </nav>
    );
}
