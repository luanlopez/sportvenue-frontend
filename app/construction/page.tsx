"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatedBackground } from "@/components/background/AnimatedBackground";
import { LuConstruction } from "react-icons/lu";

export default function UnderConstruction() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative">
      <AnimatedBackground />
      <div className="max-w-lg w-full text-center space-y-8 relative z-10">
        <div className="flex justify-center">
          <LuConstruction className="w-32 h-32 text-white animate-float-1" />
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-white mb-4">
            Oops! Página em Construção
          </h1>
          <p className="text-lg text-white/80 mb-8">
            Estamos trabalhando duro para trazer novidades. 
            Volte em breve para conferir!
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => router.back()}
            className="px-6 py-3 text-white rounded-lg
              border-2 border-white/80
              hover:bg-white/10
              transition-all duration-300 ease-in-out
              focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2
              focus:ring-offset-primary-500"
          >
            Voltar
          </button>
          
          <Link
            href="/"
            className="px-6 py-3 text-primary-500 rounded-lg
              bg-white hover:bg-white/90
              transition-all duration-300 ease-in-out
              focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2
              focus:ring-offset-primary-500"
          >
            Ir para o Início
          </Link>
        </div>
      </div>
    </div>
  );
} 