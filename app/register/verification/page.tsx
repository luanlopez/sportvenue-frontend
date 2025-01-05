"use client";

import { useState } from "react";
import { Card } from "@/components/form/card";
import Image from "next/image";
import { AnimatedBackground } from "@/components/background/AnimatedBackground";
import { showToast } from "@/components/ui/Toast";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth";

export default function VerificationCode() {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return;
    
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Move to next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const verificationCode = code.join('');

    if (verificationCode.length !== 6) {
      showToast.error("Erro", "Por favor, preencha o código completo");
      return;
    }

    try {
      setIsSubmitting(true);
      await authService.completeRegistration({ code: verificationCode });
      
      showToast.success(
        "Cadastro finalizado!",
        "Você será redirecionado para o login."
      );
      router.push("/");
    } catch {
      showToast.error(
        "Código inválido",
        "Por favor, verifique o código e tente novamente."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen p-8 flex justify-center items-center flex-col relative">
      <AnimatedBackground />
      <div className="relative z-10">
        <div className="flex flex-col items-center justify-center">
          <Image src="/logo.png" alt="SportVenue" width={200} height={200} />
        </div>
        <Card>
          <div className="max-w-md mx-auto text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Verificação de Email
            </h1>
            <p className="text-gray-600 mb-8">
              Digite o código de 6 dígitos enviado para seu email
            </p>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="flex justify-center gap-2">
                {code.map((digit, index) => (
                  <input
                    key={index}
                    id={`code-${index}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-12 h-12 text-center text-2xl font-bold rounded-lg border-2 border-gray-300 
                      focus:border-primary-500 focus:ring-primary-500 text-gray-900"
                    disabled={isSubmitting}
                  />
                ))}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-4 py-2 text-white rounded-md
                  bg-gradient-to-r from-primary-600 to-primary-500
                  hover:from-primary-700 hover:to-primary-500
                  transition-all duration-300 ease-in-out
                  focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
                  shadow-lg hover:shadow-xl
                  disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Verificando..." : "Verificar"}
              </button>
            </form>
          </div>
        </Card>
      </div>
    </main>
  );
} 