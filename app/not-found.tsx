"use client";

import Link from "next/link";
import Image from "next/image";
import { AnimatedBackground } from "@/components/background/AnimatedBackground";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <AnimatedBackground />
      <div className="relative z-10 text-center">
        <div className="mb-8">
          <Image
            src="/logo.png"
            alt="SportVenue"
            width={150}
            height={150}
            className="mx-auto"
          />
        </div>

        <h1 className="text-6xl sm:text-8xl font-bold text-primary-50 mb-4">
          404
        </h1>

        <h2 className="text-2xl sm:text-3xl font-semibold text-primary-50 mb-4">
          Página não encontrada
        </h2>

        <p className="text-primary-50 mb-8 max-w-md mx-auto">
          A página que você está procurando não existe ou foi removida.
        </p>

        <Link
          href="/"
          className="inline-flex items-center px-6 py-3 text-primary-50  rounded-lg
            border-2 border-primary-500
            hover:bg-primary-50 hover:text-primary-500
            transition-all duration-300 ease-in-out
            focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Voltar para o início
        </Link>
      </div>
    </div>
  );
}
