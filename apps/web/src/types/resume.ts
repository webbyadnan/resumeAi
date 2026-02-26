// Resume data types
export interface PersonalInfo {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    profession: string;
    linkedIn: string;
    website: string;
    avatarUrl?: string;
}

export interface ExperienceItem {
    id: string;
    companyName: string;
    jobTitle: string;
    startDate: string;
    endDate: string;
    currentlyWorking: boolean;
    description: string;
}

export interface EducationItem {
    id: string;
    institution: string;
    degree: string;
    fieldOfStudy: string;
    graduationDate: string;
    gpa?: string;
}

export interface ProjectItem {
    id: string;
    name: string;
    type: string;
    description: string;
    link?: string;
    technologies?: string[];
}

export interface LanguageItem {
    id: string;
    language: string;
    proficiency: 'Beginner' | 'Elementary' | 'Intermediate' | 'Advanced' | 'Native';
}

export interface CertificationItem {
    id: string;
    name: string;
    issuer: string;
    date: string;
    url?: string;
}

export type ResumeTemplate = 'classic' | 'modern' | 'minimal_image' | 'minimal' | 'executive' | 'creative';

export type AccentColor =
    | 'blue'
    | 'indigo'
    | 'teal'
    | 'emerald'
    | 'rose'
    | 'violet'
    | 'orange'
    | 'slate';

export interface ResumeData {
    id: string;
    userId: string;
    title: string;
    isPublic: boolean;
    slug?: string;
    template: ResumeTemplate;
    accentColor: AccentColor;
    personalInfo: PersonalInfo;
    professionalSummary: string;
    experience: ExperienceItem[];
    education: EducationItem[];
    projects: ProjectItem[];
    skills: string[];
    languages: LanguageItem[];
    certifications: CertificationItem[];
    viewCount?: number;
    createdAt: string;
    updatedAt: string;
}

export interface UserProfile {
    id: string;
    fullName: string;
    avatarUrl?: string;
    plan: 'free' | 'pro';
    email?: string;
}

export type BuilderStep =
    | 'personal'
    | 'summary'
    | 'experience'
    | 'education'
    | 'projects'
    | 'skills'
    | 'extras'
    | 'cover-letter';

export interface ATSScore {
    score: number;
    suggestions: string[];
    missingKeywords: string[];
    strengths: string[];
}
