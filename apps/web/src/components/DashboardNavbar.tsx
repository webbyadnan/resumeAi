'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FileText, LogOut, ChevronDown } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import toast from 'react-hot-toast';

interface DashboardNavbarProps {
    userName?: string;
}

export default function DashboardNavbar({ userName }: DashboardNavbarProps) {
    const router = useRouter();
    const supabase = createClient();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        toast.success('Logged out successfully');
        router.push('/');
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-slate-200 shadow-sm">
            <div className="container-custom">
                <div className="flex items-center justify-between h-14">
                    <Link href="/dashboard" className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
                            <FileText className="w-3.5 h-3.5 text-white" />
                        </div>
                        <span className="font-bold text-base text-slate-900">
                            Resume<span className="text-primary">AI</span>
                        </span>
                    </Link>

                    <div className="flex items-center gap-3">
                        {userName && (
                            <span className="text-sm text-slate-600">
                                Hi, <span className="font-semibold text-slate-900">{userName}</span>
                            </span>
                        )}
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 text-sm text-slate-600 hover:text-red-500 border border-slate-200 hover:border-red-200 px-3 py-1.5 rounded-lg transition-all duration-200"
                        >
                            <LogOut className="w-3.5 h-3.5" />
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}
