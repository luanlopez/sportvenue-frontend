"use client";

import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Input } from "@/components/form/input";
import { Card } from "@/components/form/card";
import Image from "next/image";
import { AnimatedBackground } from "@/components/background/AnimatedBackground";
import { Spinner } from "@/components/ui/Spinner";
import { showToast } from "@/components/ui/Toast";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth";

const validationSchema = Yup.object({
  email: Yup.string().required("Email é obrigatório").email("Email inválido"),
});

interface FormValues {
  email: string;
}

export default function ForgotPasswordPage() {
  const router = useRouter();

  const handleSubmit = async (
    values: FormValues,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
  ) => {
    try {
      await authService.forgotPassword(values.email);
      showToast.success(
        "Código enviado",
        "Verifique seu email para redefinir sua senha"
      );
      router.push(`/reset-password?email=${values.email}`);
    } catch {
      showToast.error(
        "Erro",
        "Não foi possível enviar o código. Tente novamente."
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
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-primary-500">Esqueceu sua senha?</h1>
            <p className="text-sm text-primary-500/70 mt-2">
              Digite seu email para receber um código de recuperação
            </p>
          </div>

          <Formik
            initialValues={{ email: "" }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-6">
                <Input
                  name="email"
                  type="email"
                  label="Email"
                  placeholder="Digite seu email"
                  disabled={isSubmitting}
                />

                <div className="space-y-4">
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
                        <span>Enviando...</span>
                      </>
                    ) : (
                      "Enviar código"
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => router.push("/login")}
                    className="w-full px-4 py-2.5 sm:py-3 text-sm sm:text-base text-primary-500 rounded-md
                      border-2 border-primary-500
                      hover:bg-primary-50
                      transition-all duration-300 ease-in-out
                      focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
                      shadow-lg hover:shadow-xl
                      flex items-center justify-center"
                  >
                    Voltar para login
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </Card>
      </div>
    </main>
  );
} 