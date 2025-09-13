"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatedBackground } from "@/components/background/AnimatedBackground";
import { LuConstruction } from "react-icons/lu";
import { FaArrowLeft, FaHome } from "react-icons/fa";

export default function UnderConstruction() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative bg-[#1345BA]">
      <AnimatedBackground />
      
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-[-8vw] top-8 w-[70vw] h-10 bg-[#0A3B8A] opacity-30 rotate-12 rounded-full" />
        <div className="absolute right-[-12vw] top-1/3 w-[60vw] h-10 bg-[#0A3B8A] opacity-20 -rotate-18 rounded-full" />
        <div className="absolute left-[-10vw] bottom-12 w-[80vw] h-10 bg-[#0A3B8A] opacity-15 rotate-[-8deg] rounded-full" />
        <div className="absolute right-[-8vw] top-0 w-[50vw] h-10 bg-[#0A3B8A] opacity-25 rotate-6 rounded-full" />
      </div>

      <div className="max-w-md sm:max-w-lg w-full text-center space-y-6 sm:space-y-8 relative z-10">
        <div className="flex justify-center">
          <div className="relative">
            <div className="w-24 h-24 sm:w-32 sm:h-32 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20">
              <LuConstruction className="w-12 h-12 sm:w-16 sm:h-16 text-white animate-bounce" />
            </div>
            <div className="absolute -top-2 -right-2 w-6 h-6 sm:w-8 sm:h-8 bg-yellow-400 rounded-full flex items-center justify-center">
              <span className="text-xs sm:text-sm font-bold text-yellow-900">!</span>
            </div>
          </div>
        </div>

          <div className="space-y-4 sm:space-y-6">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4 leading-tight">
            Página em Construção
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-white/90 mb-6 sm:mb-8 leading-relaxed px-4">
            Estamos trabalhando duro para trazer novidades incríveis! 
            <br className="hidden sm:block" />
            Volte em breve para conferir as melhorias.
          </p>
        </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
          <button
            onClick={() => router.back()}
            className="flex items-center justify-center gap-2 px-6 py-3 text-white rounded-xl
              border-2 border-white/30 bg-white/10 backdrop-blur-sm
              hover:bg-white/20 hover:border-white/50
              transition-all duration-300 ease-in-out
              focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-[#1345BA]
              font-medium text-sm sm:text-base"
          >
            <FaArrowLeft className="w-4 h-4" />
            Voltar
          </button>
          
          <Link
            href="/"
            className="flex items-center justify-center gap-2 px-6 py-3 text-[#1345BA] rounded-xl
              bg-white hover:bg-white/90 shadow-lg
              transition-all duration-300 ease-in-out
              focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#1345BA]
              font-semibold text-sm sm:text-base"
          >
            <FaHome className="w-4 h-4" />
            Ir para o Início
          </Link>
        </div>
    
        <div className="mt-8 sm:mt-12 px-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/20">
            <h3 className="text-sm sm:text-base font-semibold text-white mb-2">
              O que está por vir?
            </h3>
            <ul className="text-xs sm:text-sm text-white/80 space-y-1 text-left">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full"></span>
                Novas funcionalidades
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full"></span>
                Interface melhorada
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full"></span>
                Melhor experiência do usuário
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 