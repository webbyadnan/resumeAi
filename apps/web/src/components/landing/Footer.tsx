import Link from 'next/link';
import { FileText, Twitter, Linkedin, Github, Heart } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-slate-900 text-slate-400">
            <div className="container-custom py-12">
                <div className="flex flex-col md:flex-row items-start justify-between gap-10 mb-10">
                    {/* Brand */}
                    <div className="max-w-xs">
                        <Link href="/" className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                                <FileText className="w-4 h-4 text-white" />
                            </div>
                            <span className="font-bold text-lg text-white">
                                Resume<span className="text-primary">AI</span>
                            </span>
                        </Link>
                        <p className="text-sm leading-relaxed text-slate-400">
                            Create professional, ATS-optimized resumes in minutes with AI-powered tools. Free for everyone.
                        </p>
                        <div className="flex items-center gap-3 mt-6">
                            {[Twitter, Linkedin, Github].map((Icon, i) => (
                                <a
                                    key={i}
                                    href="#"
                                    className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center hover:bg-primary/20 hover:text-primary transition-all duration-200"
                                >
                                    <Icon className="w-4 h-4" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick links only - relevant pages */}
                    <div>
                        <h4 className="font-semibold text-white mb-4 text-sm">Quick Links</h4>
                        <ul className="space-y-2.5">
                            {[
                                { label: 'Dashboard', href: '/dashboard' },
                                { label: 'Login', href: '/login' },
                                { label: 'Sign Up', href: '/signup' },
                            ].map(({ label, href }) => (
                                <li key={label}>
                                    <Link href={href} className="text-sm hover:text-white transition-colors duration-200">
                                        {label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-slate-500">
                        © {new Date().getFullYear()} ResumeAI. All rights reserved.
                    </p>
                    <p className="text-xs text-slate-500 flex items-center gap-1.5">
                        Crafted with <Heart className="w-3 h-3 text-red-400 fill-red-400" /> by{' '}
                        <span className="text-primary font-semibold">Adnan Dev</span>
                        {' '}· Next.js · NestJS · Supabase
                    </p>
                </div>
            </div>
        </footer>
    );
}
