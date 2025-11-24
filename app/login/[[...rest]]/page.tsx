'use client';

import { SignIn } from '@clerk/nextjs';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-[#FF6B00] via-[#FF7A1F] to-[#FF8C3A] flex items-center justify-center p-4 relative overflow-hidden">
            {/* Animated Background Pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC40Ij48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00em0wLTEwYzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHptMTAgMTBjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00eiIvPjwvZz48L2c+PC9zdmc+')] animate-pulse"></div>
            </div>

            {/* Back Button */}
            <Link 
                href="/" 
                className="absolute top-6 left-6 z-20 p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/30 transition-all hover:scale-105 active:scale-95"
            >
                <ArrowLeft size={24} />
            </Link>

            <div className="relative z-10 w-full max-w-md flex justify-center">
                <SignIn 
                    appearance={{
                        elements: {
                            rootBox: "w-full",
                            card: "rounded-3xl shadow-2xl border-0",
                            headerTitle: "text-[#FF6B00]",
                            headerSubtitle: "text-gray-500",
                            formButtonPrimary: "bg-[#FF6B00] hover:bg-[#FF8C3A] text-white",
                            footerActionLink: "text-[#FF6B00] hover:text-[#FF8C3A]"
                        }
                    }}
                    signUpUrl="/signup"
                    forceRedirectUrl="/"
                    fallbackRedirectUrl="/"
                />
            </div>
        </div>
    );
}
