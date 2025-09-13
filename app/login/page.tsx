"use client";

import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Input } from "@/components/form/input";
import Image from "next/image";
import { Password } from "@/components/form/password";
import { Spinner } from "@/components/ui/Spinner";
import { showToast } from "@/components/ui/Toast";
import CryptoJS from "crypto-js";
import { useState } from "react";
import { authService } from "@/services/auth";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";

const loginValidationSchema = Yup.object({
  email: Yup.string().required("Email é obrigatório").email("Email inválido"),
  password: Yup.string()
    .required("Senha é obrigatória")
    .min(6, "Senha deve ter no mínimo 6 caracteres"),
});

const registerValidationSchema = Yup.object({
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

interface FormValues {
  email: string;
  password: string;
}

enum UserType {
  USER = "USER",
  HOUSE_OWNER = "HOUSE_OWNER",
}

function LoginPage() {
  const { signIn } = useAuth();
  const [isRegistering, setIsRegistering] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [isResetCode, setIsResetCode] = useState(false);
  const [isResetPassword, setIsResetPassword] = useState(false);
  const [code, setCode] = useState("");
  const [forgotEmail, setForgotEmail] = useState("");
  const [isSubmittingCode, setIsSubmittingCode] = useState(false);

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

  const handleRegister = async (
    values: {
      firstName: string;
      lastName: string;
      email: string;
      password: string;
      confirmPassword: string;
      phone: string;
    },
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
  ) => {
    try {
      const registerData = {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        password: values.password,
        phone: values.phone,
        userType: UserType.USER,
      };
      
      const secretKey = process.env.NEXT_PUBLIC_ENCRYPTION_KEY;
      if (!secretKey) throw new Error("Chave de criptografia não definida");
      
      const jsonString = JSON.stringify(registerData);
      const encryptedData = CryptoJS.AES.encrypt(jsonString, secretKey).toString();
      
      await authService.preRegister({ encryptedData });
      
      showToast.success("Cadastro realizado!", "Verifique seu email para ativar a conta.");
      setIsRegistering(false);
      setIsVerifying(true);
    } catch {
      showToast.error("Erro ao cadastrar", "Verifique os dados e tente novamente.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleChangeCode = (value: string) => {
    const cleanValue = value.replace(/[^0-9]/g, '').slice(0, 6);
    setCode(cleanValue);
  };

  const handleSubmitCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== 6) {
      showToast.error("Erro", "Por favor, preencha o código completo");
      return;
    }
    try {
      setIsSubmittingCode(true);
      await authService.completeRegistration({ code });
      showToast.success("Cadastro finalizado!", "Você já pode fazer login.");
      setIsVerifying(false);
      setCode("");
    } catch {
      showToast.error("Código inválido", "Por favor, verifique o código e tente novamente.");
    } finally {
      setIsSubmittingCode(false);
    }
  };

  const handleForgotPassword = async (
    values: { email: string },
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
  ) => {
    try {
      await authService.forgotPassword(values.email);
      showToast.success("Código enviado", "Verifique seu email para redefinir sua senha");
      setForgotEmail(values.email);
      setIsForgotPassword(false);
      setIsResetCode(true);
    } catch {
      showToast.error("Erro", "Não foi possível enviar o código. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleValidateCode = async (
    values: { code: string },
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
  ) => {
    try {   
      setCode(values.code);
      setIsResetCode(false);
      setIsResetPassword(true);
    } catch {
      showToast.error("Erro", "Código inválido. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetPassword = async (
    values: { newPassword: string; confirmPassword: string },
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
  ) => {
    try {
      await authService.resetPassword({ code, newPassword: values.newPassword });
      showToast.success("Senha alterada", "Sua senha foi alterada com sucesso");
      setIsResetPassword(false);
      setCode("");
      setForgotEmail("");
    } catch {
      showToast.error("Erro", "Não foi possível alterar sua senha. Verifique o código e tente novamente.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="font-poppins min-h-screen w-full flex flex-col lg:flex-row bg-[#1345BA] relative overflow-hidden">
      <div className="hidden lg:block absolute z-0 w-full h-full pointer-events-none">
        <div className="absolute left-[-8vw] top-8 w-[70vw] h-10 bg-[#0A3B8A] opacity-30 rotate-12 rounded-full" />
        <div className="absolute right-[-12vw] top-1/3 w-[60vw] h-10 bg-[#0A3B8A] opacity-20 -rotate-18 rounded-full" />
        <div className="absolute left-[-10vw] bottom-12 w-[80vw] h-10 bg-[#0A3B8A] opacity-15 rotate-[-8deg] rounded-full" />
        <div className="absolute right-[-8vw] top-0 w-[50vw] h-10 bg-[#0A3B8A] opacity-25 rotate-6 rounded-full" />
        <div className="absolute left-[8vw] top-[38vh] w-[28vw] h-10 bg-[#0A3B8A] opacity-35 rotate-[60deg] rounded-full" />
        <div className="absolute left-[-12vw] bottom-[-4vw] w-[50vw] h-10 bg-[#0A3B8A] opacity-30 rotate-[70deg] rounded-full" />
      </div>
      
        <div className="flex lg:hidden flex-col justify-center items-center w-full relative z-10 py-6">
        <Image
          src="/logo-white.svg"
          alt="Sportmap Logo"
          width={200}
          height={80}
          className="mb-4 max-w-[200px] w-full h-auto"
          priority
        />
      </div>
      
      <div className="hidden lg:flex flex-col justify-center items-center w-1/2 relative z-10">
        <Image
          src="/logo-white.svg"
          alt="Sportmap Logo"
          width={340}
          height={160}
          className="mb-0 max-w-[340px] w-full h-auto"
          priority
        />
      </div>
      
      <div className="flex flex-1 flex-col justify-center items-center w-full lg:w-1/2 bg-transparent z-10 px-4 lg:px-8">
        <div className="w-full max-w-sm lg:max-w-md bg-white rounded-2xl shadow-xl px-6 lg:px-8 py-8 lg:py-10 flex flex-col items-center mx-auto">
          <div className="w-full relative">
            <AnimatePresence mode="wait">
              {isVerifying ? (
                <motion.div
                  key="verify"
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.35 }}
                  className="flex flex-col justify-center items-center w-full"
                >
                  <h2 className="text-2xl font-bold text-slate-900 mb-2 text-center">Verificação de Email</h2>
                  <p className="text-slate-500 text-sm mb-2 text-center">Digite o código de 6 dígitos enviado para seu email</p>
                  <p className="text-slate-400 text-xs mb-6 text-center">Verifique sua caixa de entrada e spam.</p>
                  <form onSubmit={handleSubmitCode} className="flex flex-col items-center gap-6 w-full">
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={6}
                      value={code}
                      onChange={e => handleChangeCode(e.target.value)}
                      className="w-full max-w-xs text-center text-3xl font-bold rounded-2xl border-2 border-slate-200 focus:border-[#1345BA] focus:ring-[#1345BA] text-slate-900 transition-all outline-none py-4 tracking-widest bg-slate-50"
                      placeholder="______"
                      disabled={isSubmittingCode}
                      autoFocus
                    />
                    <button
                      type="submit"
                      disabled={isSubmittingCode}
                      className="w-full max-w-xs px-6 py-3 text-white rounded-2xl bg-[#1345BA] transition font-bold text-base shadow-sm disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isSubmittingCode ? "Verificando..." : "Verificar"}
                    </button>
                    <button
                      type="button"
                      className="text-[#1345BA] hover:underline font-medium mt-2 text-sm"
                      onClick={() => { setIsVerifying(false); setIsRegistering(true); }}
                    >
                      Voltar para cadastro
                    </button>
                  </form>
                </motion.div>
              ) : isRegistering ? (
                <motion.div
                  key="register"
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.35 }}
                  className="w-full"
                >
                  <h2 className="text-xl lg:text-2xl font-bold text-slate-900 mb-1">Crie sua conta</h2>
                  <p className="text-slate-500 text-sm mb-6">Aproveite todos os recursos do SportMap</p>
                  <Formik
                    initialValues={{
                      firstName: "",
                      lastName: "",
                      email: "",
                      password: "",
                      confirmPassword: "",
                      phone: "",
                    }}
                    validationSchema={registerValidationSchema}
                    onSubmit={handleRegister}
                  >
                    {({ isSubmitting }) => (
                      <Form className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <Input
                            name="firstName"
                            label="Nome"
                            placeholder="Nome"
                            disabled={isSubmitting}
                            className="text-sm px-4 py-3 rounded-lg border border-slate-200 focus:border-sky-500"
                          />
                          <Input
                            name="lastName"
                            label="Sobrenome"
                            placeholder="Sobrenome"
                            disabled={isSubmitting}
                            className="text-sm px-4 py-3 rounded-lg border border-slate-200 focus:border-sky-500"
                          />
                        </div>
                        <Input
                          name="email"
                          type="email"
                          label="Email"
                          placeholder="Email"
                          disabled={isSubmitting}
                          className="text-sm px-4 py-3 rounded-lg border border-slate-200 focus:border-sky-500"
                        />
                        <Password
                          name="password"
                          label="Senha"
                          placeholder="Senha"
                          disabled={isSubmitting}
                          className="text-sm px-4 py-3 rounded-lg border border-slate-200 focus:border-sky-500"
                        />
                        <Password
                          name="confirmPassword"
                          label="Confirmar Senha"
                          placeholder="Confirmar Senha"
                          disabled={isSubmitting}
                          className="text-sm px-4 py-3 rounded-lg border border-slate-200 focus:border-sky-500"
                        />
                        <Input
                          name="phone"
                          label="Telefone"
                          placeholder="Telefone"
                          disabled={isSubmitting}
                          className="text-sm px-4 py-3 rounded-lg border border-slate-200 focus:border-sky-500"
                        />
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full px-6 py-3 text-white rounded-lg flex items-center justify-center gap-2 text-sm"
                          style={{ background: '#1345BA' }}
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
                        <div className="w-full flex justify-center mt-4">
                          <span className="text-slate-500 text-sm">Já tem conta?{' '}
                            <button type="button" className="text-sky-600 hover:underline font-medium" onClick={() => setIsRegistering(false)}>Entrar</button>
                          </span>
                        </div>
                      </Form>
                    )}
                  </Formik>
                </motion.div>
              ) : isForgotPassword ? (
                <motion.div
                  key="forgot-password"
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.35 }}
                  className="w-full"
                >
                  <h2 className="text-xl lg:text-2xl font-bold text-slate-900 mb-1">Recuperar senha</h2>
                  <p className="text-slate-500 text-sm mb-6">Digite seu e-mail para receber o código de recuperação</p>
                  <Formik
                    initialValues={{ email: "" }}
                    validationSchema={Yup.object({ email: Yup.string().required("Email é obrigatório").email("Email inválido") })}
                    onSubmit={handleForgotPassword}
                  >
                    {({ isSubmitting }) => (
                      <Form className="space-y-4">
                        <Input
                          name="email"
                          type="email"
                          label="Email"
                          placeholder="Email"
                          disabled={isSubmitting}
                          className="text-sm px-4 py-3 rounded-lg border border-slate-200 focus:border-sky-500"
                        />
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full px-6 py-3 text-white rounded-lg flex items-center justify-center gap-2 text-sm"
                          style={{ background: '#1345BA' }}
                        >
                          {isSubmitting ? <><Spinner /><span>Enviando...</span></> : "Enviar código"}
                        </button>
                        <div className="w-full flex justify-center mt-4">
                          <span className="text-slate-500 text-sm">
                            Lembrou a senha?{' '}
                            <button type="button" className="text-sky-600 hover:underline font-medium" onClick={() => setIsForgotPassword(false)}>Voltar para login</button>
                          </span>
                        </div>
                      </Form>
                    )}
                  </Formik>
                </motion.div>
              ) : isResetCode ? (
                <motion.div
                  key="reset-code"
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.35 }}
                  className="w-full"
                >
                  <h2 className="text-xl lg:text-2xl font-bold text-slate-900 mb-1">Digite o código</h2>
                  <p className="text-slate-500 text-sm mb-6">Enviamos um código para o e-mail <span className='font-bold'>{forgotEmail}</span></p>
                  <Formik
                    initialValues={{ code: "" }}
                    validationSchema={Yup.object({ code: Yup.string().required("Código é obrigatório").length(6, "Código deve ter 6 dígitos") })}
                    onSubmit={handleValidateCode}
                  >
                    {({ isSubmitting }) => (
                      <Form className="space-y-4">
                        <Input
                          name="code"
                          type="text"
                          label="Código"
                          placeholder="______"
                          disabled={isSubmitting}
                          className="text-sm px-4 py-3 rounded-lg border border-slate-200 focus:border-sky-500 text-center tracking-widest text-xl"
                          maxLength={6}
                        />
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full px-6 py-3 text-white rounded-lg flex items-center justify-center gap-2 text-sm"
                          style={{ background: '#1345BA' }}
                        >
                          {isSubmitting ? <><Spinner /><span>Validando...</span></> : "Validar código"}
                        </button>
                        <div className="w-full flex justify-center mt-4">
                          <span className="text-slate-500 text-sm">
                            Não recebeu?{' '}
                            <button type="button" className="text-sky-600 hover:underline font-medium" onClick={() => setIsForgotPassword(true)}>Reenviar código</button>
                          </span>
                        </div>
                      </Form>
                    )}
                  </Formik>
                </motion.div>
              ) : isResetPassword ? (
                <motion.div
                  key="reset-password"
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.35 }}
                  className="w-full"
                >
                  <h2 className="text-xl lg:text-2xl font-bold text-slate-900 mb-1">Nova senha</h2>
                  <p className="text-slate-500 text-sm mb-6">Digite sua nova senha abaixo</p>
                  <Formik
                    initialValues={{ newPassword: "", confirmPassword: "" }}
                    validationSchema={Yup.object({
                      newPassword: Yup.string().required("Senha obrigatória").min(6, "Mínimo 6 caracteres"),
                      confirmPassword: Yup.string().required("Confirme a senha").oneOf([Yup.ref("newPassword")], "As senhas não conferem"),
                    })}
                    onSubmit={handleResetPassword}
                  >
                    {({ isSubmitting }) => (
                      <Form className="space-y-4">
                        <Password
                          name="newPassword"
                          label="Nova senha"
                          placeholder="Nova senha"
                          disabled={isSubmitting}
                          className="text-sm px-4 py-3 rounded-lg border border-slate-200 focus:border-sky-500"
                        />
                        <Password
                          name="confirmPassword"
                          label="Confirmar nova senha"
                          placeholder="Confirmar nova senha"
                          disabled={isSubmitting}
                          className="text-sm px-4 py-3 rounded-lg border border-slate-200 focus:border-sky-500"
                        />
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full px-6 py-3 text-white rounded-lg flex items-center justify-center gap-2 text-sm"
                          style={{ background: '#1345BA' }}
                        >
                          {isSubmitting ? <><Spinner /><span>Salvando...</span></> : "Salvar nova senha"}
                        </button>
                        <div className="w-full flex justify-center mt-4">
                          <span className="text-slate-500 text-sm">
                            Lembrou a senha?{' '}
                            <button type="button" className="text-sky-600 hover:underline font-medium" onClick={() => { setIsResetPassword(false); setIsForgotPassword(false); }}>Voltar para login</button>
                          </span>
                        </div>
                      </Form>
                    )}
                  </Formik>
                </motion.div>
              ) : (
                <motion.div
                  key="login"
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.35 }}
                  className="w-full"
                >
                  <h2 className="text-xl lg:text-2xl font-bold text-slate-900 mb-1">Bem vindo,</h2>
                  <p className="text-slate-500 text-sm mb-6">faça o login para sua conta.</p>
                  <a
                    href={`${process.env.NEXT_PUBLIC_API_URL}/auth/google`}
                    className="w-full px-4 py-3 mb-4 text-gray-700 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 transition font-medium text-sm flex items-center justify-center gap-3 shadow-sm"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      width="20"
                      height="20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                        <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z" />
                        <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z" />
                        <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z" />
                        <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z" />
                      </g>
                    </svg>
                    Entrar com o Google
                  </a>
                  <div className="relative w-full my-4">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-slate-200"></div>
                    </div>
                    <div className="relative flex justify-center text-xs">
                      <span className="px-2 bg-white text-slate-400">ou</span>
                    </div>
                  </div>
                  <div className="w-full">
                    <Formik
                      initialValues={{ email: "", password: "" }}
                      validationSchema={loginValidationSchema}
                      onSubmit={handleSubmit}
                    >
                      {({ isSubmitting }) => (
                        <Form className="space-y-4">
                          <Input
                            name="email"
                            type="email"
                            label="Email"
                            placeholder="Email"
                            disabled={isSubmitting}
                            className="text-sm px-4 py-3 rounded-lg border border-slate-200 focus:border-sky-500"
                          />
                          <Password
                            name="password"
                            label="Senha"
                            placeholder="Senha"
                            disabled={isSubmitting}
                            className="text-sm px-4 py-3 rounded-lg border border-slate-200 focus:border-sky-500"
                          />
                          <div className="flex justify-end w-full mb-2">
                            <button
                              type="button"
                              className="text-xs text-sky-600 hover:text-sky-700 transition-colors"
                              onClick={() => setIsForgotPassword(true)}
                            >
                              Esqueceu a senha?
                            </button>
                          </div>
                          <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full px-6 py-3 text-white rounded-lg flex items-center justify-center gap-2 text-sm"
                            style={{ background: '#1345BA' }}
                          >
                            {isSubmitting ? (
                              <>
                                <Spinner />
                                <span>Entrando...</span>
                              </>
                            ) : (
                              "Login"
                            )}
                          </button>
                          <div className="w-full flex justify-center mt-4">
                            <span className="text-slate-500 text-sm">
                              Ainda não possui uma conta?{' '}
                              <button
                                type="button"
                                className="text-sky-600 hover:underline font-medium"
                                onClick={() => setIsRegistering(true)}
                              >
                                Cadastre-se
                              </button>
                            </span>
                          </div>
                        </Form>
                      )}
                    </Formik>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </main>
  );
}

export default LoginPage;
