'use client';

import { ResumeData } from '@/types/resume';
import AvatarUpload from '@/components/ui/AvatarUpload';
import { User, Mail, Phone, MapPin, Briefcase, Linkedin, Globe } from 'lucide-react';

interface Props {
    resume: ResumeData;
    onSave: (updates: Partial<ResumeData>) => void;
    onUpdate: (updates: Partial<ResumeData>) => void;
}

export default function PersonalStep({ resume, onSave, onUpdate }: Props) {
    const info = resume.personalInfo ?? {
        fullName: '', email: '', phone: '', location: '',
        profession: '', linkedIn: '', website: '', avatarUrl: '',
    };


    const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
        onUpdate({ personalInfo: { ...info, [field]: e.target.value } });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ personalInfo: info });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <div>
                <h2 className="text-lg font-bold text-slate-900">Personal Information</h2>
                <p className="text-sm text-slate-500 mt-0.5">Get started with your personal information</p>
            </div>

            <AvatarUpload
                currentUrl={info.avatarUrl}
                onUpload={(_file, url) => onUpdate({ personalInfo: { ...info, avatarUrl: url } })}
            />

            <div className="grid grid-cols-1 gap-4">
                {[
                    { label: 'Full Name', field: 'fullName', placeholder: 'Enter your full name', icon: User, required: true },
                    { label: 'Email Address', field: 'email', placeholder: 'Enter your email address', icon: Mail, required: true, type: 'email' },
                    { label: 'Phone Number', field: 'phone', placeholder: 'Enter your phone number', icon: Phone },
                    { label: 'Location', field: 'location', placeholder: 'City, Country', icon: MapPin },
                    { label: 'Profession', field: 'profession', placeholder: 'e.g. Software Engineer', icon: Briefcase },
                    { label: 'LinkedIn Profile', field: 'linkedIn', placeholder: 'linkedin.com/in/yourname', icon: Linkedin },
                    { label: 'Personal Website', field: 'website', placeholder: 'yourwebsite.com', icon: Globe },
                ].map(({ label, field, placeholder, icon: Icon, required, type }) => (
                    <div key={field}>
                        <label className="flex items-center gap-1.5 text-sm font-medium text-slate-700 mb-1.5">
                            <Icon className="w-3.5 h-3.5 text-slate-400" />
                            {label} {required && <span className="text-red-500">*</span>}
                        </label>
                        <input
                            type={type || 'text'}
                            value={(info as unknown as Record<string, string>)[field] || ''}
                            onChange={set(field)}
                            required={required}
                            placeholder={placeholder}
                            className="input-field"
                        />
                    </div>
                ))}
            </div>

            <button type="submit" className="btn-primary w-full">
                Save Changes
            </button>
        </form>
    );
}
