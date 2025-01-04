"use client";

import { Header } from "@/components/ui/Header";
import { Footer } from "@/components/ui/Footer";
import { usePathname } from "next/navigation";

const authRoutes = ["/", "/register", "/forgot-password"];

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isPublicPage = authRoutes.includes(pathname);

  return (
    <>
      {!isPublicPage && <Header />}
      <main className={!isPublicPage ? "mt-16" : ""}>
        {children}
      </main>
      {!isPublicPage && <Footer />}
    </>
  );
} 