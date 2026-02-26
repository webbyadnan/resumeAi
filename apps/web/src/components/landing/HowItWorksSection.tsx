'use client';

const steps = [
    {
        number: '01',
        title: 'Create your resume',
        description:
            'Start from scratch or upload an existing resume. Choose from 6+ premium templates that match your style.',
        icon: '📄',
    },
    {
        number: '02',
        title: 'Let AI enhance it',
        description:
            'Use AI to polish your summary, bullet points, and skills. Get ATS score feedback and improvement tips.',
        icon: '✨',
    },
    {
        number: '03',
        title: 'Download & share',
        description:
            'Export as a pixel-perfect PDF or share a public link with a unique URL. Track views in real-time.',
        icon: '🚀',
    },
];

export default function HowItWorksSection() {
    return (
        <section id="how-it-works" className="section-padding bg-background">
            <div className="container-custom">
                <div className="text-center mb-14">
                    <span className="inline-flex items-center gap-2 text-xs font-semibold text-primary uppercase tracking-widest mb-3">
                        <span className="w-4 h-px bg-primary" />
                        Simple Process
                        <span className="w-4 h-px bg-primary" />
                    </span>
                    <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">
                        Build your resume
                    </h2>
                    <p className="text-lg text-slate-500 max-w-2xl mx-auto">
                        Our streamlined process helps you create a professional resume in minutes with
                        intelligent AI-powered tools and features.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                    {/* Connector line */}
                    <div className="hidden md:block absolute top-16 left-1/6 right-1/6 h-px bg-gradient-to-r from-primary/10 via-primary/40 to-primary/10" />

                    {steps.map((step, i) => (
                        <div key={step.number} className="flex flex-col items-center text-center group">
                            <div className="relative mb-6">
                                <div className="w-16 h-16 rounded-2xl bg-white border-2 border-primary/20 shadow-lg flex items-center justify-center text-3xl group-hover:border-primary/50 group-hover:shadow-primary/10 transition-all duration-300">
                                    {step.icon}
                                </div>
                                <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center">
                                    {i + 1}
                                </span>
                            </div>
                            <h3 className="font-bold text-xl text-slate-900 mb-3">{step.title}</h3>
                            <p className="text-slate-500 text-sm leading-relaxed max-w-xs">{step.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
