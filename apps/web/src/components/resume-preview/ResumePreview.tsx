'use client';

import { ResumeData } from '@/types/resume';
import ClassicTemplate from './templates/ClassicTemplate';
import ModernTemplate from './templates/ModernTemplate';
import ExecutiveTemplate from './templates/ExecutiveTemplate';
import CreativeTemplate from './templates/CreativeTemplate';
import MinimalTemplate from './templates/MinimalTemplate';
import MinimalImageTemplate from './templates/MinimalImageTemplate';

const ACCENT_HEX: Record<string, string> = {
    blue: '#4F6EF7',
    indigo: '#6366F1',
    teal: '#0EA5E9',
    emerald: '#10B981',
    rose: '#F43F5E',
    violet: '#8B5CF6',
    orange: '#F97316',
    slate: '#475569',
};

interface Props {
    resume: ResumeData;
    className?: string;
}

export default function ResumePreview({ resume, className = '' }: Props) {
    const accentColor = ACCENT_HEX[resume.accentColor] || ACCENT_HEX.blue;

    const props = { resume, accentColor };

    const TemplateMap: Record<string, React.ComponentType<{ resume: ResumeData; accentColor: string }>> = {
        classic: ClassicTemplate,
        modern: ModernTemplate,
        executive: ExecutiveTemplate,
        creative: CreativeTemplate,
        minimal: MinimalTemplate,
        minimal_image: MinimalImageTemplate,
    };

    const TemplateComponent = TemplateMap[resume.template] || ClassicTemplate;

    return (
        <div className={`resume-preview bg-white shadow-2xl rounded-lg overflow-hidden ${className}`} style={{ fontFamily: 'Inter, sans-serif' }}>
            <TemplateComponent {...props} />
        </div>
    );
}
