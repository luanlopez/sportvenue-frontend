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
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth";

enum UserType {
  USER = "USER",
  HOUSE_OWNER = "HOUSE_OWNER",
}

interface FormValues {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
}

const validationSchema = Yup.object({
  firstName: Yup.string()
    .required("Nome é obrigatório")
    .min(2, "Nome deve ter no mínimo 2 caracteres"),
  lastName: Yup.string()
    .required("Sobrenome é obrigatório")
    .min(2, "Sobrenome deve ter no mínimo 2 caracteres"),
  email: Yup.string().required("Email é obrigatório").email("Email inválido"),
  password: Yup.string()
    .required("Senha é obrigatória")
    .min(6, "Senha deve ter no mínimo 6 caracteres"),
  confirmPassword: Yup.string()
    .required("Confirmação de senha é obrigatória")
    .oneOf([Yup.ref("password")], "As senhas não conferem"),
  phone: Yup.string()
    .required("Telefone é obrigatório")
    .matches(/^\d{10,11}$/, "Telefone inválido"),
});

export default function Register() {
  const router = useRouter();

  const handleSubmit = async (
    values: FormValues,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
  ) => {
    try {
      const registerData = {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        password: values.password,
        phone: values.phone,
      };

      await authService.preRegister(registerData);

      showToast.success(
        "Código enviado!",
        "Verifique seu email para continuar o cadastro."
      );

      router.push("/register/verification");
    } catch (error: unknown) {
      console.error("Erro no registro:", error);
      const err = error as { response?: { data?: { message?: string } } };
      showToast.error(
        "Erro ao realizar cadastro",
        err?.response?.data?.message || "Verifique os dados e tente novamente."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen p-8 flex justify-center items-center flex-col relative">
      <AnimatedBackground />
      <div className="relative z-10">
        <div className="flex flex-col items-center justify-center">
          <Image src="/logo.png" alt="SportMap" width={200} height={200} />
        </div>
        <Card>
          <Formik
            initialValues={{
              firstName: "",
              lastName: "",
              email: "",
              password: "",
              confirmPassword: "",
              phone: "",
              userType: UserType.HOUSE_OWNER,
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="max-w-md mx-auto space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    name="firstName"
                    label="Nome"
                    placeholder="Digite seu nome"
                    disabled={isSubmitting}
                  />
                  <Input
                    name="lastName"
                    label="Sobrenome"
                    placeholder="Digite seu sobrenome"
                    disabled={isSubmitting}
                  />
                </div>

                <Input
                  name="email"
                  type="email"
                  label="Email"
                  placeholder="Digite seu email"
                  disabled={isSubmitting}
                />

                <Password
                  name="password"
                  label="Senha"
                  placeholder="Digite sua senha"
                  disabled={isSubmitting}
                />

                <Password
                  name="confirmPassword"
                  label="Confirmar Senha"
                  placeholder="Confirme sua senha"
                  disabled={isSubmitting}
                />

                <Input
                  name="phone"
                  label="Telefone"
                  placeholder="Digite seu telefone"
                  disabled={isSubmitting}
                />

                <div className="w-full space-y-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full px-4 py-2 text-white rounded-md
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
                        <span>Cadastrando...</span>
                      </>
                    ) : (
                      "Cadastrar"
                    )}
                  </button>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-secondary-200"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-secondary-500">
                        ou
                      </span>
                    </div>
                  </div>

                  <Link
                    href="/"
                    className="w-full px-4 py-2 text-primary-500 rounded-md
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
              </Form>
            )}
          </Formik>
        </Card>
      </div>
    </main>
  );
}
