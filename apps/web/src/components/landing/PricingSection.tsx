'use client';

import Link from 'next/link';
import { Check, Zap } from 'lucide-react';

const plans = [
    {
        name: 'Free',
        price: '$0',
        period: 'forever',
        description: 'Perfect for getting started with a professional resume.',
        features: [
            '1 Resume',
            '3 Templates (Classic, Minimal, Modern)',
            'PDF Export',
            'AI Enhance (5 uses/month)',
            'Public Share Link',
        ],
        cta: 'Start for free',
        href: '/signup',
        highlighted: false,
    },
    {
        name: 'Pro',
        price: '$9',
        period: 'per month',
        description: 'For serious job seekers who want every advantage.',
        features: [
            'Unlimited Resumes',
            'All 6+ Templates',
            'PDF Export (High Quality)',
            'Unlimited AI Enhancement',
            'ATS Score Checker',
            'Cover Letter Generator',
            'Resume Analytics & Views',
            'Priority Support',
            'Custom Domain for Public Resume',
        ],
        cta: 'Get Pro',
        href: '/signup?plan=pro',
        highlighted: true,
        badge: 'Most Popular',
    },
];

export default function PricingSection() {
    return (
        <section id="pricing" className="section-padding bg-white">
            <div className="container-custom">
                <div className="text-center mb-14">
                    <span className="inline-block text-xs font-semibold text-primary uppercase tracking-widest mb-3">
                        Pricing
                    </span>
                    <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">
                        Simple, transparent pricing
                    </h2>
                    <p className="text-lg text-slate-500 max-w-2xl mx-auto">
                        Start for free. Upgrade when you need more power to land that dream job.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                    {plans.map((plan) => (
                        <div
                            key={plan.name}
                            className={`rounded-2xl p-7 border-2 relative ${plan.highlighted
                                    ? 'border-primary bg-gradient-to-b from-blue-50 to-indigo-50 shadow-lg shadow-primary/10'
                                    : 'border-slate-100 bg-white'
                                }`}
                        >
                            {plan.badge && (
                                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-bold px-4 py-1 rounded-full flex items-center gap-1">
                                    <Zap className="w-3 h-3" />
                                    {plan.badge}
                                </span>
                            )}
                            <div className="mb-6">
                                <h3 className="font-bold text-xl text-slate-900 mb-1">{plan.name}</h3>
                                <div className="flex items-end gap-1 mb-2">
                                    <span className="text-4xl font-extrabold text-slate-900">{plan.price}</span>
                                    <span className="text-slate-400 text-sm mb-1.5">/{plan.period}</span>
                                </div>
                                <p className="text-slate-500 text-sm">{plan.description}</p>
                            </div>
                            <ul className="space-y-3 mb-8">
                                {plan.features.map((feature) => (
                                    <li key={feature} className="flex items-center gap-2 text-sm text-slate-700">
                                        <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${plan.highlighted ? 'bg-primary' : 'bg-slate-200'
                                            }`}>
                                            <Check className={`w-2.5 h-2.5 ${plan.highlighted ? 'text-white' : 'text-slate-600'}`} />
                                        </div>
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                            <Link
                                href={plan.href}
                                className={plan.highlighted ? 'btn-primary w-full text-center block' : 'btn-secondary w-full text-center block'}
                            >
                                {plan.cta}
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
