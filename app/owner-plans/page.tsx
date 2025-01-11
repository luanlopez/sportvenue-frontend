"use client";

import { AnimatedBackground } from "@/components/background/AnimatedBackground";
import { FaCheck, FaVolleyballBall } from "react-icons/fa";
import { HiOutlineChartBar, HiOutlineClock, HiOutlineCash } from "react-icons/hi";
import Link from "next/link";
import Image from "next/image";

const benefits = [
  {
    icon: FaVolleyballBall,
    title: "Alcance mais clientes",
    description: "Exponha sua quadra para milhares de esportistas na sua região"
  },
  {
    icon: HiOutlineChartBar,
    title: "Gestão simplificada",
    description: "Gerencie reservas e horários em um só lugar"
  },
  {
    icon: HiOutlineClock,
    title: "Economia de tempo",
    description: "Automatize o processo de reservas e evite conflitos de horários"
  },
  {
    icon: HiOutlineCash,
    title: "Aumente seu faturamento",
    description: "Otimize a ocupação da sua quadra com mais visibilidade"
  }
];

const features = [
  "Página personalizada da sua quadra",
  "Sistema de reservas online",
  "Gestão de horários disponíveis",
  "Suporte via email",
  "Sem taxas por reserva",
  "Contato direto com clientes",
  "Exposição premium nos resultados"
];

const processSteps = [
  {
    number: "01",
    title: "Cadastre sua quadra",
    description: "Crie sua conta e adicione informações da sua quadra, fotos e horários disponíveis"
  },
  {
    number: "02",
    title: "Personalize seu perfil",
    description: "Configure preços, regras de reserva e políticas de cancelamento"
  },
  {
    number: "03",
    title: "Receba reservas",
    description: "Clientes podem ver sua quadra e fazer reservas online 24/7"
  },
  {
    number: "04",
    title: "Gerencie tudo online",
    description: "Acompanhe reservas, pagamentos e avaliações em um só lugar"
  }
];

export default function OwnerPlans() {
  return (
    <div className="min-h-screen relative">
      <AnimatedBackground />
      
      <div className="relative z-10 pt-6 px-4">
        <div className="max-w-7xl mx-auto">
          <Link
            href="/"
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white
              hover:bg-white/10 rounded-lg transition-colors duration-200"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Voltar para início
          </Link>
        </div>
      </div>
      
      <div className="relative pt-24 pb-16 text-center z-10">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
          Transforme sua quadra em um negócio<br />mais lucrativo
        </h1>
        <p className="text-xl text-white/80 max-w-2xl mx-auto mb-8">
          Junte-se a centenas de proprietários que já estão revolucionando
          a forma de gerenciar seus espaços esportivos
        </p>
        <Link
          href="/register?type=HOUSE_OWNER"
          className="inline-flex items-center px-8 py-3 text-lg font-medium text-primary-500
            bg-white rounded-lg hover:bg-white/90 transition-all duration-300
            shadow-lg hover:shadow-xl"
        >
          Começar agora
        </Link>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-6
                border border-white/20 text-white"
            >
              <benefit.icon className="w-8 h-8 mb-4" />
              <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
              <p className="text-white/80">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white mb-4">
            Sua quadra em destaque
          </h2>
          <p className="text-xl text-white/80">
            Veja como sua quadra será apresentada aos clientes
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">

          <div className="bg-white rounded-2xl shadow-xl overflow-hidden transform hover:scale-105 transition-transform duration-300">
            <div className="relative h-64">
              <Image
                src="https://www.topsporteng.com.br/imagens-y/informacoes/quadra-areia-01.jpg"
                alt="Exemplo de quadra"
                fill
                className="object-cover"
              />
              <div className="absolute top-4 right-4 bg-primary-500 text-white px-3 py-1 rounded-full text-sm">
                Destaque
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Quadra Exemplo
              </h3>
              <p className="text-gray-600 mb-4">
                São Paulo, SP
              </p>
              <div className="flex items-center gap-4 mb-4">
                <span className="flex items-center text-sm text-gray-500">
                  <FaVolleyballBall className="w-4 h-4 mr-1" />
                  Vôlei
                </span>
                <span className="flex items-center text-sm text-gray-500">
                  <HiOutlineClock className="w-4 h-4 mr-1" />
                  24/7
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-primary-500 font-bold">R$ 80/hora</span>
                <button className="px-4 py-2 bg-primary-500 text-white rounded-lg">
                  Ver detalhes
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  Suas Reservas
                </h3>
                <p className="text-sm text-gray-500">
                  Gerencie todas as reservas em um só lugar
                </p>
              </div>
              
              <div className="p-4">
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                          <FaVolleyballBall className="w-5 h-5 text-primary-500" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">João Silva</h4>
                          <p className="text-sm text-gray-500">Vôlei - Quadra 01</p>
                        </div>
                      </div>
                      <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm">
                        Pendente
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <HiOutlineClock className="w-4 h-4" />
                        <span>Segunda, 15:00 - 16:00</span>
                      </div>
                      <span className="font-medium text-gray-900">R$ 80,00</span>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                          <FaVolleyballBall className="w-5 h-5 text-primary-500" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">Maria Santos</h4>
                          <p className="text-sm text-gray-500">Vôlei - Quadra 01</p>
                        </div>
                      </div>
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                        Confirmada
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <HiOutlineClock className="w-4 h-4" />
                        <span>Segunda, 16:00 - 17:00</span>
                      </div>
                      <span className="font-medium text-gray-900">R$ 80,00</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 p-4 border-t border-gray-100">
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>Total de reservas hoje</span>
                    <span className="font-medium text-gray-900">2 reservas</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-white mb-6">
                Perfil otimizado para mais reservas
              </h3>
              <ul className="space-y-4">
                {[
                  "Fotos em alta qualidade",
                  "Calendário de disponibilidade",
                  "Preços e horários personalizados",
                  "Página personalizada",
                  "Gestão de reservas",
                  "Visibilidade na plataforma"
                ].map((feature, index) => (
                  <li key={index} className="flex items-center text-white">
                    <FaCheck className="w-5 h-5 text-primary-500 mr-3" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white mb-4">
            Como funciona
          </h2>
          <p className="text-xl text-white/80">
            Comece a receber reservas em 4 passos simples
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {processSteps.map((step, index) => (
            <div
              key={index}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-6
                border border-white/20 text-white
                relative overflow-hidden"
            >
              <span className="absolute -top-6 -left-6 text-8xl font-bold text-white/10">
                {step.number}
              </span>
              <div className="relative">
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-white/80">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-16">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-8 text-center border-b">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Plano Premium
            </h2>
            <div className="flex justify-center items-baseline mb-4">
              <span className="text-5xl font-extrabold text-gray-900">R$99</span>
              <span className="text-gray-500 ml-1">/mês</span>
            </div>
            <p className="text-gray-600">
              Tudo que você precisa para gerenciar sua quadra
            </p>
          </div>
          
          <div className="p-8">
            <ul className="space-y-4">
              {features.map((feature, index) => (
                <li key={index} className="flex items-center text-gray-600">
                  <FaCheck className="w-5 h-5 text-primary-500 mr-3" />
                  {feature}
                </li>
              ))}
            </ul>

            <Link
              href="/register?type=HOUSE_OWNER"
              className="mt-8 w-full inline-flex justify-center items-center px-6 py-3
                text-white bg-primary-500 rounded-lg
                hover:bg-primary-600 transition-colors duration-300
                font-medium text-lg"
            >
              Começar teste grátis
            </Link>
            
            <p className="text-sm text-gray-500 text-center mt-4">
              7 dias grátis, cancele quando quiser
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 