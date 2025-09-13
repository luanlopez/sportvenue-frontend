"use client";

import { FaCheck, FaVolleyballBall } from "react-icons/fa";
import {
  HiOutlineChartBar,
  HiOutlineClock,
  HiOutlineCash,
} from "react-icons/hi";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { plansService } from "@/services/plans";
import { LoadingScreen } from "@/components/ui/LoadingScreen";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { showToast } from "@/components/ui/Toast";
import { useState } from "react";
import Checkout from "@/components/payment/Checkout/checkout";

const benefits = [
  {
    icon: FaVolleyballBall,
    title: "Alcance mais clientes",
    description:
      "Exponha sua quadra para milhares de esportistas na sua região",
  },
  {
    icon: HiOutlineChartBar,
    title: "Gestão simplificada",
    description: "Gerencie reservas e horários em um só lugar",
  },
  {
    icon: HiOutlineClock,
    title: "Economia de tempo",
    description:
      "Automatize o processo de reservas e evite conflitos de horários",
  },
  {
    icon: HiOutlineCash,
    title: "Aumente seu faturamento",
    description: "Otimize a ocupação da sua quadra com mais visibilidade",
  },
];

const processSteps = [
  {
    number: "01",
    title: "Cadastre sua quadra",
    description:
      "Crie sua conta e adicione informações da sua quadra, fotos e horários disponíveis",
  },
  {
    number: "02",
    title: "Personalize seu perfil",
    description:
      "Configure preços, regras de reserva e políticas de cancelamento",
  },
  {
    number: "03",
    title: "Receba reservas",
    description: "Clientes podem ver sua quadra e fazer reservas online 24/7",
  },
  {
    number: "04",
    title: "Gerencie tudo online",
    description: "Acompanhe reservas, pagamentos e avaliações em um só lugar",
  },
];

interface Plan {
  _id: string;
  name: string;
  price: number;
  description: string;
  courtLimit: number;
  features?: string[];
  stripePriceId: string;
}

export default function OwnerPlans() {
  const { data: plans, isLoading } = useQuery({
    queryKey: ["plans"],
    queryFn: plansService.getPlans,
    staleTime: 1000 * 60 * 5,
  });

  const router = useRouter();
  const { user } = useAuth();

  const [showCheckout, setShowCheckout] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);

  const handleSelectPlan = async (plan: Plan) => {
    try {
      if (!user) {
        router.push(`/login`);
        return;
      }

      setSelectedPlan(plan);
      setShowCheckout(true);
    } catch {
      showToast.error(
        "Erro",
        "Não foi possível selecionar o plano. Tente novamente."
      );
    }
  };

  const handleCheckoutCancel = () => {
    setShowCheckout(false);
    setSelectedPlan(null);
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price / 100);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 via-slate-50/50 to-white">
          <Image
            src="https://images.unsplash.com/photo-1553778263-73a83bab9b0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
            alt="Quadra de vôlei de praia"
            fill
            className="object-cover opacity-20"
          />
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold text-slate-900 mb-6 leading-tight">
            Transforme sua quadra em um
            <span className="text-blue-600"> negócio lucrativo</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-600 mb-8 max-w-2xl mx-auto">
            Junte-se a centenas de proprietários que já estão revolucionando a
            forma de gerenciar seus espaços esportivos
          </p>
          <button
            onClick={() =>
              document
                .getElementById("plans")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 transform hover:scale-105"
          >
            Começar agora
          </button>
        </div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-slate-400 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-slate-400 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </div>

      <div className="py-20 px-4 bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Por que escolher o SportMap?
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              A plataforma mais completa para proprietários de quadras
              esportivas
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="bg-white/80 backdrop-blur-sm rounded-xl p-8 border border-slate-200 hover:border-blue-300 transition-all duration-300 hover:transform hover:scale-105 shadow-lg"
              >
                <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mb-6">
                  <benefit.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-4">
                  {benefit.title}
                </h3>
                <p className="text-slate-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="py-20 px-4 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Sua quadra em destaque
            </h2>
            <p className="text-xl text-slate-600">
              Veja como sua quadra será apresentada aos clientes
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden transform hover:scale-105 transition-transform duration-300 border border-slate-200">
              <div className="relative h-80">
                <Image
                  src="https://images.unsplash.com/photo-1554068865-24cecd4e34b8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                  alt="Exemplo de quadra"
                  fill
                  className="object-cover"
                />
                <div className="absolute top-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                  Destaque
                </div>
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-bold text-slate-900 mb-3">
                  Quadra Exemplo
                </h3>
                <p className="text-slate-600 mb-6">São Paulo, SP</p>
                <div className="flex items-center gap-6 mb-6">
                  <span className="flex items-center text-sm text-slate-500">
                    <FaVolleyballBall className="w-5 h-5 mr-2" />
                    Vôlei
                  </span>
                  <span className="flex items-center text-sm text-slate-500">
                    <HiOutlineClock className="w-5 h-5 mr-2" />
                    24/7
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-blue-600 font-bold text-xl">
                    R$ 80/hora
                  </span>
                  <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Ver detalhes
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
                <div className="p-6 border-b border-slate-200">
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">
                    Suas Reservas
                  </h3>
                  <p className="text-slate-600">
                    Gerencie todas as reservas em um só lugar
                  </p>
                </div>

                <div className="p-6">
                  <div className="space-y-4">
                    <div className="bg-slate-50 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                            <FaVolleyballBall className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-slate-900">
                              João Silva
                            </h4>
                            <p className="text-slate-600">Vôlei - Quadra 01</p>
                          </div>
                        </div>
                        <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                          Pendente
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-slate-500">
                          <HiOutlineClock className="w-4 h-4" />
                          <span>Segunda, 15:00 - 16:00</span>
                        </div>
                        <span className="font-semibold text-slate-900">
                          R$ 80,00
                        </span>
                      </div>
                    </div>

                    <div className="bg-slate-50 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                            <FaVolleyballBall className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-slate-900">
                              Maria Santos
                            </h4>
                            <p className="text-slate-600">Vôlei - Quadra 01</p>
                          </div>
                        </div>
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                          Confirmada
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-slate-500">
                          <HiOutlineClock className="w-4 h-4" />
                          <span>Segunda, 16:00 - 17:00</span>
                        </div>
                        <span className="font-semibold text-slate-900">
                          R$ 80,00
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 p-4 border-t border-slate-200">
                    <div className="flex items-center justify-between text-sm text-slate-500">
                      <span>Total de reservas hoje</span>
                      <span className="font-semibold text-slate-900">
                        2 reservas
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-slate-900 mb-6">
                  Perfil otimizado para mais reservas
                </h3>
                <ul className="space-y-4">
                  {[
                    "Fotos em alta qualidade",
                    "Calendário de disponibilidade",
                    "Preços e horários personalizados",
                    "Página personalizada",
                    "Gestão de reservas",
                    "Visibilidade na plataforma",
                  ].map((feature, index) => (
                    <li
                      key={index}
                      className="flex items-center text-slate-700"
                    >
                      <FaCheck className="w-5 h-5 text-blue-600 mr-4" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Como funciona
            </h2>
            <p className="text-xl text-slate-600">
              Comece a receber reservas em 4 passos simples
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((step, index) => (
              <div
                key={index}
                className="relative bg-white rounded-2xl p-8 border border-slate-200 hover:border-blue-300 transition-all duration-300 shadow-lg"
              >
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-lg font-bold">
                  {step.number}
                </div>
                <div className="mt-6">
                  <h3 className="text-xl font-semibold text-slate-900 mb-4">
                    {step.title}
                  </h3>
                  <p className="text-slate-600">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div
        id="plans"
        className="py-20 px-4 bg-gradient-to-b from-slate-50 to-white"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Escolha o plano ideal para você
            </h2>
            <p className="text-xl text-slate-600">
              Comece a receber reservas hoje mesmo
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {plans?.map((plan) => (
              <div
                key={plan._id}
                className="bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden hover:border-blue-300 transition-all duration-300 transform hover:scale-105"
              >
                <div className="p-8 text-center border-b border-slate-200">
                  <h2 className="text-2xl font-bold text-slate-900 mb-6">
                    {plan.name}
                  </h2>
                  <div className="flex justify-center items-baseline mb-6">
                    <span className="text-5xl font-extrabold text-slate-900">
                      {formatPrice(plan.price)}
                    </span>
                    <span className="text-slate-500 ml-2">/mês</span>
                  </div>
                  <p className="text-slate-600">{plan.description}</p>
                </div>

                <div className="p-8">
                  <ul className="space-y-4 mb-8">
                    <li className="flex items-center text-slate-700">
                      <FaCheck className="w-5 h-5 text-blue-600 mr-4" />
                      {plan.courtLimit === 0
                        ? "Quadras ilimitadas"
                        : `Até ${plan.courtLimit} quadras`}
                    </li>

                    {plan.features?.map((feature, index) => (
                      <li
                        key={index}
                        className="flex items-center text-slate-700"
                      >
                        <FaCheck className="w-5 h-5 text-blue-600 mr-4" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => handleSelectPlan(plan)}
                    className="w-full px-8 py-4 text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-all duration-300 font-semibold text-lg transform hover:scale-105"
                  >
                    Começar agora
                  </button>

                  <p className="text-sm text-slate-500 text-center mt-6">
                    7 dias grátis, cancele quando quiser
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showCheckout && selectedPlan && user && (
        <Checkout
          onClose={handleCheckoutCancel}
          customer={{
            name: user.name || "",
            email: user.email || "",
            stripeCustomerId: user.stripeCustomerId || "",
          }}
          plan={{
            stripePriceId: selectedPlan.stripePriceId,
            id: selectedPlan._id,
          }}
        />
      )}
    </div>
  );
}
