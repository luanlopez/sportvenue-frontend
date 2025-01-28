"use client";

import Image from "next/image";
import Link from "next/link";

export default function ForgotPassword() {
  return (
    <main className="min-h-screen p-8 flex justify-center items-center flex-col relative bg-gray-50">
      <div className="relative z-10">
        <div className="flex flex-col items-center justify-center mb-8">
          <Image src="/logo.png" alt="SportMap" width={200} height={200} />
        </div>
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-4 text-center">
            Esqueci a Senha
          </h1>
          <p className="text-gray-600 text-center mb-6">
            Esta funcionalidade está em construção. Em breve, você poderá redefinir sua senha por aqui.
          </p>
          <div className="flex justify-center">
            <Link
              href="/"
              className="px-4 py-2 text-primary-500 rounded-md
                border-2 border-primary-500
                hover:bg-primary-50
                transition-all duration-300 ease-in-out
                focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
                shadow-lg hover:shadow-xl
                flex items-center justify-center"
            >
              Voltar para login
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
} 