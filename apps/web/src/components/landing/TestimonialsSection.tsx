'use client';

const testimonials = [
    {
        name: 'Sarah Chen',
        role: 'Software Engineer @ Google',
        avatar: 'https://i.pravatar.cc/48?img=9',
        text: 'ResumeAI helped me land my dream job at Google. The AI-enhanced bullet points were incredible — I had 3x more callbacks after using it.',
        stars: 5,
    },
    {
        name: 'Marcus Williams',
        role: 'Product Manager @ Stripe',
        avatar: 'https://i.pravatar.cc/48?img=11',
        text: 'The ATS score checker was a game-changer. My applications went from ghosted to getting responses in 48 hours. Highly recommend!',
        stars: 5,
    },
    {
        name: 'Priya Patel',
        role: 'UX Designer @ Figma',
        avatar: 'https://i.pravatar.cc/48?img=16',
        text: 'The Creative template is stunning. I got compliments from every recruiter on how professional and unique my resume looked.',
        stars: 5,
    },
    {
        name: 'Alex Rodriguez',
        role: 'Data Scientist @ Meta',
        avatar: 'https://i.pravatar.cc/48?img=7',
        text: 'I was skeptical about AI writing help, but this actually saved me hours of work and the results were better than what I wrote myself.',
        stars: 5,
    },
    {
        name: 'Emma Johnson',
        role: 'Marketing Lead @ HubSpot',
        avatar: 'https://i.pravatar.cc/48?img=23',
        text: 'Super intuitive to use. I built my complete resume in 25 minutes. The public share link is a great feature for networking.',
        stars: 5,
    },
    {
        name: 'David Kim',
        role: 'Backend Developer @ Shopify',
        avatar: 'https://i.pravatar.cc/48?img=13',
        text: 'ResumeAI made undercutting all of my competitors an absolute breeze. I got 5 offers in 2 weeks after rebuilding my resume here.',
        stars: 5,
    },
];

function StarRating({ count }: { count: number }) {
    return (
        <div className="flex gap-0.5">
            {Array.from({ length: count }).map((_, i) => (
                <span key={i} className="text-amber-400 text-sm">★</span>
            ))}
        </div>
    );
}

export default function TestimonialsSection() {
    const mid = Math.ceil(testimonials.length / 2);
    const col1 = testimonials.slice(0, mid);
    const col2 = testimonials.slice(mid);

    return (
        <section id="testimonials" className="section-padding bg-background">
            <div className="container-custom">
                <div className="text-center mb-14">
                    <span className="inline-block text-xs font-semibold text-primary uppercase tracking-widest mb-3">
                        Testimonials
                    </span>
                    <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">
                        Don&apos;t just take our word for it
                    </h2>
                    <p className="text-lg text-slate-500 max-w-2xl mx-auto">
                        Hear what our users say. We&apos;re always looking for ways to improve. If you have a
                        positive experience, leave a review.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[col1, col2].map((col, ci) => (
                        <div key={ci} className="flex flex-col gap-4">
                            {col.map((t) => (
                                <div
                                    key={t.name}
                                    className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm card-hover"
                                >
                                    <StarRating count={t.stars} />
                                    <p className="text-slate-600 text-sm leading-relaxed mt-3 mb-4">&quot;{t.text}&quot;</p>
                                    <div className="flex items-center gap-3">
                                        <img src={t.avatar} alt={t.name} className="w-9 h-9 rounded-full object-cover" />
                                        <div>
                                            <div className="font-semibold text-slate-900 text-sm flex items-center gap-1">
                                                {t.name}
                                                <span className="text-primary text-xs">✓</span>
                                            </div>
                                            <div className="text-xs text-slate-400">{t.role}</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
