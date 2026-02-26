'use client';

import { Sparkles, FileDown, Link2, BarChart3, FileText, CheckCircle2 } from 'lucide-react';

const features = [
    {
        icon: Sparkles,
        title: 'AI-Powered Writing',
        description:
            'Let AI enhance your bullet points, summary, and experience descriptions to be compelling and professional.',
        color: 'bg-primary/10 text-primary',
    },
    {
        icon: FileText,
        title: '6+ Premium Templates',
        description:
            'Choose from Classic, Modern, Executive, Creative, Minimal, and more professionally designed templates.',
        color: 'bg-accent/10 text-accent',
    },
    {
        icon: CheckCircle2,
        title: 'ATS Score Checker',
        description:
            'Get a real-time ATS compatibility score and actionable suggestions to beat applicant tracking systems.',
        color: 'bg-green-100 text-green-600',
    },
    {
        icon: FileDown,
        title: 'One-Click PDF Export',
        description:
            'Download your resume as a pixel-perfect PDF anytime, ready to send to employers.',
        color: 'bg-purple-100 text-purple-600',
    },
    {
        icon: Link2,
        title: 'Public Share Link',
        description:
            'Share your resume online with a unique URL. Track how many times it has been viewed.',
        color: 'bg-amber-100 text-amber-600',
    },
    {
        icon: BarChart3,
        title: 'Resume Analytics',
        description:
            'See who is viewing your public resume. Get insights on views by date to optimize your job search.',
        color: 'bg-rose-100 text-rose-500',
    },
];

export default function FeaturesSection() {
    return (
        <section id="features" className="section-padding bg-white">
            <div className="container-custom">
                <div className="text-center mb-14">
                    <span className="inline-block text-xs font-semibold text-primary uppercase tracking-widest mb-3">
                        Features
                    </span>
                    <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">
                        Everything you need to get hired
                    </h2>
                    <p className="text-lg text-slate-500 max-w-2xl mx-auto">
                        From AI-enhanced content to ATS optimization — we give you every tool to build the perfect resume.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((feature) => {
                        const Icon = feature.icon;
                        return (
                            <div
                                key={feature.title}
                                className="bg-card-gradient rounded-2xl p-6 border border-slate-100 card-hover group"
                            >
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${feature.color} group-hover:scale-110 transition-transform duration-200`}>
                                    <Icon className="w-6 h-6" />
                                </div>
                                <h3 className="font-bold text-slate-900 text-lg mb-2">{feature.title}</h3>
                                <p className="text-slate-500 text-sm leading-relaxed">{feature.description}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
