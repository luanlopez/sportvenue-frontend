"use client";

import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Input } from "@/components/form/input";
import { Card } from "@/components/form/card";
import Image from "next/image";
import { AnimatedBackground } from "@/components/background/AnimatedBackground";
import { Spinner } from "@/components/ui/Spinner";
import { showToast } from "@/components/ui/Toast";
import { useRouter, useSearchParams } from "next/navigation";
import { authService } from "@/services/auth";
import { Password } from "@/components/form/password";

const validationSchema = Yup.object({
  code: Yup.string()
    .required("Código é obrigatório")
    .length(6, "Código deve ter 6 dígitos"),
  newPassword: Yup.string()
    .required("Nova senha é obrigatória")
    .min(8, "Senha deve ter no mínimo 8 caracteres")
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)/,
      "Senha deve conter pelo menos uma letra e um número"
    ),
  confirmPassword: Yup.string()
    .required("Confirmação de senha é obrigatória")
    .oneOf([Yup.ref("newPassword")], "As senhas não conferem"),
});

interface FormValues {
  code: string;
  newPassword: string;
  confirmPassword: string;
}

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  if (!email) {
    router.push("/forgot-password");
    return null;
  }

  const handleSubmit = async (
    values: FormValues,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
  ) => {
    try {
      await authService.resetPassword({
        code: values.code,
        newPassword: values.newPassword,
      });
      showToast.success(
        "Senha alterada",
        "Sua senha foi alterada com sucesso"
      );
      router.push("/login");
    } catch {
      showToast.error(
        "Erro",
        "Não foi possível alterar sua senha. Verifique o código e tente novamente."
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
            <h1 className="text-2xl font-bold text-primary-500">Redefinir Senha</h1>
            <p className="text-sm text-primary-500/70 mt-2">
              Digite o código recebido no email {email} e sua nova senha
            </p>
          </div>

          <Formik
            initialValues={{ code: "", newPassword: "", confirmPassword: "" }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-6">
                <Input
                  name="code"
                  type="text"
                  label="Código de verificação"
                  placeholder="Digite o código recebido"
                  disabled={isSubmitting}
                  maxLength={6}
                />

                <Password
                  name="newPassword"
                  label="Nova senha"
                  placeholder="Digite sua nova senha"
                  disabled={isSubmitting}
                />

                <Password
                  name="confirmPassword"
                  label="Confirmar senha"
                  placeholder="Confirme sua nova senha"
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
                        <span>Alterando senha...</span>
                      </>
                    ) : (
                      "Alterar senha"
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => router.push("/forgot-password")}
                    className="w-full px-4 py-2.5 sm:py-3 text-sm sm:text-base text-primary-500 rounded-md
                      border-2 border-primary-500
                      hover:bg-primary-50
                      transition-all duration-300 ease-in-out
                      focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
                      shadow-lg hover:shadow-xl
                      flex items-center justify-center"
                  >
                    Reenviar código
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