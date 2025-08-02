import { ReactNode } from "react";

interface PageLayoutProps {
  children: ReactNode;
  className?: string;
}

interface PageHeaderProps {
  children: ReactNode;
  className?: string;
}

interface SectionProps {
  children: ReactNode;
  className?: string;
}

interface TitleProps {
  children: ReactNode;
  className?: string;
}

interface SubtitleProps {
  children: ReactNode;
  className?: string;
}

interface ContentProps {
  children: ReactNode;
  className?: string;
}

export function PageLayout({ children, className = "" }: PageLayoutProps) {
  return (
    <div className={`min-h-screen bg-slate-50 py-8 ${className}`}>
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 3xl:px-20">
        {children}
      </div>
    </div>
  );
}

export function PageHeader({ children, className = "" }: PageHeaderProps) {
  return (
    <div className={`mb-8 ${className}`}>
      {children}
    </div>
  );
}

export function Section({ children, className = "" }: SectionProps) {
  return (
    <div className={`bg-white rounded-lg shadow-sm border border-slate-200 ${className}`}>
      {children}
    </div>
  );
}

export function Title({ children, className = "" }: TitleProps) {
  return (
    <h1 className={`text-2xl font-semibold text-slate-900 ${className}`}>
      {children}
    </h1>
  );
}

export function Subtitle({ children, className = "" }: SubtitleProps) {
  return (
    <p className={`text-slate-600 mt-1 ${className}`}>
      {children}
    </p>
  );
}

export function Content({ children, className = "" }: ContentProps) {
  return (
    <div className={`p-6 ${className}`}>
      {children}
    </div>
  );
} 