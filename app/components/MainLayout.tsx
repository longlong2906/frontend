"use client";

import Navbar from "./Navbar";
import { AuthProvider } from "../context/AuthContext";
import { usePathname } from "next/navigation";

export default function MainLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isDashboard = pathname === '/dashboard';

    return (
        <AuthProvider>
            {!isDashboard && <Navbar />}
            <main className={`${!isDashboard ? 'pt-16' : ''} min-h-screen`}>
                {children}
            </main>
        </AuthProvider>
    );
}
