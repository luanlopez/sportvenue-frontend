"use client";

import { Header } from "@/components/ui/Header";
import { Footer } from "@/components/ui/Footer";
import { usePathname } from "next/navigation";

const authRoutes = [
  "",
  "/register",
  "/forgot-password",
  "/register/verification",
  "/auth/google/callback",
];

const validRoutes = [
  ...authRoutes,
  "/",
  "/bookings",
  "/courts/new",
  "/courts",
  "/courts/[id]",
  "/courts/[id]/edit",
  "/profile",
  "/payments",
  "/dashboards",
];

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isPublicPage = authRoutes.includes(pathname);

  const isValidRoute = validRoutes.some((route) => {
    if (route.includes("[id]")) {
      return pathname.startsWith("/courts/") && pathname !== "/courts/new";
    }
    return pathname === route;
  });

  if (!isValidRoute) {
    return children;
  }

  return (
    <>
      {!isPublicPage && <Header />}
      <main>
        {children}
      </main>
      {!isPublicPage && <Footer />}
    </>
  );
}
