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
import CryptoJS from "crypto-js";

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

  const encryptData = (data: FormValues) => {
    const secretKey = process.env.NEXT_PUBLIC_ENCRYPTION_KEY;
    if (!secretKey) {
      throw new Error("Chave de criptografia não definida");
    }

    const jsonString = JSON.stringify(data);
    return CryptoJS.AES.encrypt(jsonString, secretKey).toString();
  };

  const handleSubmit = async (
    values: FormValues,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
  ) => {
    try {
      const encryptedData = encryptData(values);
      await signIn({ encryptedData });
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
            alt="SportMap"
            width={300}
            height={300}
            className="w-32 h-32 sm:w-40 sm:h-40 md:w-52 md:h-52 bg-tertiary-500 rounded-full"
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

                  <a
                    href={`${process.env.NEXT_PUBLIC_API_URL}/auth/google`}
                    className="w-full px-4 py-2.5 sm:py-3 text-sm sm:text-base text-gray-700 rounded-md
                      bg-white border border-gray-300
                      hover:bg-gray-50
                      transition-all duration-300 ease-in-out
                      focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
                      shadow-lg hover:shadow-xl
                      flex items-center justify-center gap-3"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      width="24"
                      height="24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                        <path
                          fill="#4285F4"
                          d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"
                        />
                        <path
                          fill="#34A853"
                          d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"
                        />
                        <path
                          fill="#EA4335"
                          d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"
                        />
                      </g>
                    </svg>
                    Entrar com Google
                  </a>

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
