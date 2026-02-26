import Navbar from '@/components/Navbar';
import HeroSection from '@/components/landing/HeroSection';
import FeaturesSection from '@/components/landing/FeaturesSection';
import HowItWorksSection from '@/components/landing/HowItWorksSection';
import TemplatesSection from '@/components/landing/TemplatesSection';
import TestimonialsSection from '@/components/landing/TestimonialsSection';
import CTASection from '@/components/landing/CTASection';
import Footer from '@/components/landing/Footer';

export default function HomePage() {
    return (
        <main>
            {/* Announcement Bar */}
            <div className="announcement-bar text-center py-2 text-sm text-primary font-medium">
                <span className="inline-flex items-center gap-2">
                    <span className="bg-primary text-white text-xs font-bold px-2 py-0.5 rounded-full">Free</span>
                    AI-Powered Resume Builder — Free for Everyone 🎉
                </span>
            </div>
            <Navbar />
            <HeroSection />
            <HowItWorksSection />
            <FeaturesSection />
            <TemplatesSection />
            <TestimonialsSection />
            <CTASection />
            <Footer />
        </main>
    );
}
