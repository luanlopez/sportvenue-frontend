"use client";

import { Header } from "@/components/ui/Header";
import { Footer } from "@/components/ui/Footer";
import { usePathname } from "next/navigation";

const authRoutes = [
  "/",
  "/register",
  "/forgot-password",
  "/register/verification",
];

const validRoutes = [
  ...authRoutes,
  "/home",
  "/bookings",
  "/courts/new",
  "/courts",
  "/profile",
];

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isPublicPage = authRoutes.includes(pathname);

  const isValidRoute = validRoutes.some((route) => pathname === route);

  if (!isValidRoute) {
    return children;
  }

  return (
    <>
      {!isPublicPage && <Header />}
      <main className={!isPublicPage ? "mt-16" : ""}>{children}</main>
      {!isPublicPage && <Footer />}
    </>
  );
}
