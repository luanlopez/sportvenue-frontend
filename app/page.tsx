"use client";

import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Input } from "@/components/form/input";
import { Card } from "@/components/form/card";
import Image from "next/image";
import { Password } from "@/components/form/password";
import Link from "next/link";
import { AnimatedBackground } from "@/components/background/AnimatedBackground";
import { Spinner } from "@/components/ui/Spinner";
import { showToast } from "@/components/ui/Toast";
import { useAuth } from "@/hooks/useAuth";

const validationSchema = Yup.object({
  email: Yup.string().required("Email é obrigatório").email("Email inválido"),
  password: Yup.string()
    .required("Senha é obrigatória")
    .min(6, "Senha deve ter no mínimo 6 caracteres"),
});

interface FormValues {
  email: string;
  password: string;
}

function LoginPage() {
  const { signIn } = useAuth();

  const handleSubmit = async (
    values: FormValues,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
  ) => {
    try {
      await signIn(values);
    } catch {
      showToast.error(
        "Login falhou",
        "Verifique suas credenciais e tente novamente"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen p-4 sm:p-8 flex justify-center items-center flex-col relative">
      <AnimatedBackground />
      <div className="relative z-10 w-full max-w-md px-2 sm:px-0">
        <div className="flex flex-col items-center justify-center mb-6 sm:mb-8">
          <Image 
            src="/logo.png" 
            alt="SportVenue" 
            width={150} 
            height={150}
            className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48"
          />
        </div>
        <Card variant="modal">
          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-4 sm:space-y-6">
                <Input
                  name="email"
                  type="email"
                  label="Email"
                  placeholder="Digite seu email"
                  disabled={isSubmitting}
                />
                <div className="w-full">
                  <Password
                    name="password"
                    label="Senha"
                    placeholder="Digite sua senha"
                    disabled={isSubmitting}
                  />
                  <div className="flex justify-end w-full">
                    <Link
                      href="/forgot-password"
                      className="text-xs sm:text-sm text-primary-500 hover:text-primary-600 
                        transition-colors mt-2 sm:mt-4"
                    >
                      Esqueci minha senha
                    </Link>
                  </div>
                </div>

                <div className="w-full space-y-3 sm:space-y-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full px-4 py-2.5 sm:py-3 text-sm sm:text-base text-white rounded-md
                      bg-gradient-to-r from-primary-600 to-primary-500
                      hover:from-primary-700 hover:to-primary-500
                      transition-all duration-300 ease-in-out
                      focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
                      shadow-lg hover:shadow-xl
                      disabled:opacity-70 disabled:cursor-not-allowed
                      flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Spinner />
                        <span>Entrando...</span>
                      </>
                    ) : (
                      "Entrar"
                    )}
                  </button>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-secondary-200"></div>
                    </div>
                    <div className="relative flex justify-center text-xs sm:text-sm">
                      <span className="px-2 bg-white text-secondary-500">
                        ou
                      </span>
                    </div>
                  </div>

                  <Link
                    href="/register"
                    className="w-full px-4 py-2.5 sm:py-3 text-sm sm:text-base text-primary-500 rounded-md
                      border-2 border-primary-500
                      hover:bg-primary-50
                      transition-all duration-300 ease-in-out
                      focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
                      shadow-lg hover:shadow-xl
                      flex items-center justify-center"
                  >
                    Criar conta
                  </Link>
                </div>
              </Form>
            )}
          </Formik>
        </Card>
      </div>
    </main>
  );
}

export default LoginPage;
