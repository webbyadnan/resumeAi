import type { Metadata } from 'next';
import { Toaster } from 'react-hot-toast';
import './globals.css';

export const metadata: Metadata = {
    title: 'ResumeAI — Build Your Dream Resume with AI',
    description:
        'Create professional, ATS-optimized resumes in minutes using AI-powered tools. Choose from premium templates, get AI suggestions, and download as PDF.',
    keywords: 'resume builder, AI resume, CV maker, professional resume, ATS resume',
    openGraph: {
        title: 'ResumeAI — Build Your Dream Resume with AI',
        description: 'Create professional, ATS-optimized resumes in minutes using AI-powered tools.',
        type: 'website',
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link
                    href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
                    rel="stylesheet"
                />
            </head>
            <body>
                <Toaster
                    position="top-right"
                    toastOptions={{
                        style: {
                            borderRadius: '12px',
                            background: '#0F172A',
                            color: '#fff',
                            fontSize: '14px',
                        },
                        success: {
                            iconTheme: {
                                primary: '#4F6EF7',
                                secondary: '#fff',
                            },
                        },
                    }}
                />
                {children}
            </body>
        </html>
    );
}
