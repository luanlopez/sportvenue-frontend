"use client";

import { useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { userService } from "@/services/users";
import { subscriptionService } from "@/services/subscription";
import { showToast } from "@/components/ui/Toast";
import { Brand } from "@/components/ui/Brand";

import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import Image from "next/image";
import { 
  FaCreditCard, 
  FaUsers, 
  FaArrowLeft,
  FaPhone,
  FaEnvelope,
  FaUserTag,
  FaHome,
  FaEye,
  FaCalendarAlt
} from "react-icons/fa";
import { Button } from "@/components/ui/Button";

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase();
};

type ActiveSection = 'overview' | 'membership' | 'profiles';

export default function Profile() {
  const router = useRouter();
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState<ActiveSection>('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    phone: user?.phone || "",
  });

  const { data: subscriptionInfo } = useQuery({
    queryKey: ["subscriptionInfo"],
    queryFn: subscriptionService.getSubscriptionInfo,
    staleTime: 1000 * 60 * 5,
  });

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await userService.updateUser(formData);
      setIsEditing(false);
      showToast.success("Sucesso", "Perfil atualizado com sucesso!");
      window.location.reload();
    } catch {
      showToast.error("Erro", "Não foi possível atualizar o perfil");
    } finally {
      setIsLoading(false);
    }
  }, [formData]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }, []);

  const navigationItems = useMemo(() => [
    { id: 'overview', label: 'Visão Geral', icon: FaHome },
    { id: 'membership', label: 'Assinatura', icon: FaCreditCard },
    { id: 'profiles', label: 'Perfil', icon: FaUsers },
  ], []);

  const memberSinceText = useMemo(() => 
    format(new Date(), 'MMMM yyyy', { locale: ptBR }), 
    []
  );

  const nextPaymentText = useMemo(() => 
    subscriptionInfo ? format(new Date(subscriptionInfo.billing.currentPeriodEnd), 'dd MMMM yyyy', { locale: ptBR }) : "Não disponível",
    [subscriptionInfo]
  );

  if (!user) return null;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row h-screen">
          <div className="w-full lg:w-64 bg-white flex-shrink-0 border-b lg:border-b-0">
            <div className="p-4 lg:p-6">
              <Button onClick={() => router.push('/')} className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6 lg:mb-8">
                <FaArrowLeft className="w-4 h-4" />
                <span className="text-sm font-medium">Voltar ao SportVenue</span>
              </Button>
              
              <nav className="space-y-1">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Button
                      key={item.id}
                      onClick={() => setActiveSection(item.id as ActiveSection)}
                      className={`w-full flex items-center space-x-3 px-3 lg:px-4 py-2 lg:py-3 rounded-lg text-left transition-colors text-sm lg:text-base ${
                        activeSection === item.id
                          ? 'bg-gray-100 text-gray-900'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <Icon className="w-4 h-4 lg:w-5 lg:h-5" />
                      <span className="font-medium">{item.label}</span>
                    </Button>
                  );
                })}
              </nav>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            <div className="p-4 lg:p-8">
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Conta</h1>
              <p className="text-gray-600 mb-6 lg:mb-8">Detalhes da Assinatura</p>

              {activeSection === 'overview' && (
                <div className="space-y-4 lg:space-y-6">
                  <div className="bg-white border border-gray-200 rounded-lg p-4 lg:p-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className="inline-flex items-center px-2 lg:px-3 py-1 rounded-full text-xs lg:text-sm font-medium bg-primary-50 text-secondary-50">
                        Membro desde {memberSinceText}
                      </span>
                    </div>
                    
                    <h3 className="text-lg lg:text-xl font-bold text-gray-900 mb-2">
                      {subscriptionInfo ? subscriptionInfo.plan.name : "Plano Padrão"}
                    </h3>
                    
                    <p className="text-sm lg:text-base text-gray-600 mb-4">
                      Próximo pagamento: {nextPaymentText}
                    </p>
                    
                    <div className="flex items-center space-x-2 mb-6">
                      <Brand brand={subscriptionInfo?.paymentMethod?.brand} />
                      <div>
                        <p className="text-xs lg:text-sm font-bold text-gray-500">
                          •••• •••• •••• •••• {subscriptionInfo?.paymentMethod?.last4 || '****'}
                        </p>
                      </div>
                    </div>
                    
                    <Button 
                      onClick={() => setActiveSection('membership')}
                      className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 font-medium text-white rounded-lg hover:bg-blue-700 transition-colors text-sm lg:text-base"
                    >
                      Gerenciar assinatura
                      <FaArrowLeft className="w-3 h-3 lg:w-4 lg:h-4 rotate-180" />
                    </Button>
                  </div>
                </div>
              )}

              {activeSection === 'membership' && (
                <div className="space-y-4 lg:space-y-6">
                  <div className="bg-white border border-gray-200 rounded-lg p-4 lg:p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 gap-2">
                      <h3 className="text-xl lg:text-2xl font-bold text-gray-900">Detalhes da Assinatura</h3>
                      <span className="inline-flex items-center px-2 lg:px-3 py-1 rounded-full text-xs lg:text-sm font-medium bg-primary-50 text-secondary-50 self-start lg:self-auto">
                        Membro desde {memberSinceText}
                      </span>
                    </div>
                    
                    <div className="space-y-4 mb-6">
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between py-3 border-b border-gray-200 gap-2">
                        <div className="flex items-center space-x-3">
                          <FaCreditCard className="w-4 h-4 lg:w-5 lg:h-5 text-gray-600" />
                          <span className="font-medium text-gray-900 text-sm lg:text-base">Plano Atual</span>
                        </div>
                        <div className="text-left lg:text-right">
                          <p className="font-semibold text-gray-900 text-sm lg:text-base">
                            {subscriptionInfo ? subscriptionInfo.plan.name : "Plano Padrão"}
                          </p>
                          <p className="text-xs lg:text-sm text-gray-600">
                            {subscriptionInfo ? `R$ ${subscriptionInfo.billing.amount.toFixed(2)}/mês` : "Valor não disponível"}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between py-3 border-b border-gray-200 gap-2">
                        <div className="flex items-center space-x-3">
                          <FaCalendarAlt className="w-4 h-4 lg:w-5 lg:h-5 text-gray-600" />
                          <span className="font-medium text-gray-900 text-sm lg:text-base">Próxima Cobrança</span>
                        </div>
                        <p className="font-semibold text-gray-900 text-sm lg:text-base">
                          {nextPaymentText}
                        </p>
                      </div>
                      
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between py-3 border-b border-gray-200 gap-2">
                        <div className="flex items-center space-x-3">
                          <FaUsers className="w-4 h-4 lg:w-5 lg:h-5 text-gray-600" />
                          <span className="font-medium text-gray-900 text-sm lg:text-base">Limite de Quadras</span>
                        </div>
                        <p className="font-semibold text-gray-900 text-sm lg:text-base">
                          {subscriptionInfo ? `Até ${subscriptionInfo.plan.courtLimit} quadras` : "Não disponível"}
                        </p>
                      </div>
                    </div>
                    
                    <div className="border-t border-gray-200 pt-6">
                      <h4 className="text-base lg:text-lg font-semibold text-gray-900 mb-4">Método de Pagamento</h4>
                      <div className="flex items-center space-x-4 p-3 lg:p-4 bg-white border border-gray-200 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Brand brand={subscriptionInfo?.paymentMethod?.brand} />
                          <div>
                            <p className="text-xs lg:text-sm font-bold text-gray-500">
                              •••• •••• •••• •••• {subscriptionInfo?.paymentMethod?.last4 || '****'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6 flex flex-col sm:flex-row gap-3">
                      <Button 
                        onClick={() => router.push('/payments')}
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 font-medium text-white rounded-lg hover:bg-blue-700 transition-colors text-sm lg:text-base"
                      >
                        <FaEye className="w-4 h-4" />
                        Ver Histórico de Pagamentos
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'profiles' && (
                <div className="space-y-4 lg:space-y-6">
                  <div className="bg-white border border-gray-200 rounded-lg p-4 lg:p-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
                      <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center text-blue-700 text-xl font-semibold border border-blue-200 flex-shrink-0">
                        {user?.picture ? (
                          <Image
                            src={user.picture}
                            alt="Profile Picture"
                            width={64}
                            height={64}
                            className="rounded-full"
                          />
                        ) : (
                          getInitials(user.name)
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg lg:text-xl font-semibold text-gray-900">{user.name}</h3>
                        <p className="text-sm lg:text-base text-gray-600">{user.email}</p>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mt-1">
                          {user.userType === "HOUSE_OWNER" ? "Proprietário" : "Usuário"}
                        </span>
                      </div>
                    </div>

                    {isEditing ? (
                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Nome</label>
                            <input
                              type="text"
                              name="firstName"
                              value={formData.firstName}
                              onChange={handleChange}
                              placeholder="Digite seu nome"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm lg:text-base"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Sobrenome</label>
                            <input
                              type="text"
                              name="lastName"
                              value={formData.lastName}
                              onChange={handleChange}
                              placeholder="Digite seu sobrenome"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm lg:text-base"
                            />
                          </div>
                          <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Telefone</label>
                            <input
                              type="text"
                              name="phone"
                              value={formData.phone}
                              onChange={handleChange}
                              placeholder="Digite seu telefone"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm lg:text-base"
                            />
                          </div>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row justify-end gap-3">
                          <Button 
                            type="button"
                            onClick={() => setIsEditing(false)}
                            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 font-medium text-sm lg:text-base"
                          >
                            Cancelar
                          </Button>
                          <Button
                            type="submit"
                            disabled={isLoading}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm lg:text-base"
                          >
                            {isLoading ? "Salvando..." : "Salvar Alterações"}
                          </Button>
                        </div>
                      </form>
                    ) : (
                      <div className="space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border border-gray-200 rounded-lg gap-2">
                          <div className="flex items-center space-x-3">
                            <FaEnvelope className="w-4 h-4 lg:w-5 lg:h-5 text-gray-400" />
                            <div>
                              <p className="font-medium text-gray-900 text-sm lg:text-base">Email</p>
                              <p className="text-xs lg:text-sm text-gray-600">{user.email}</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border border-gray-200 rounded-lg gap-2">
                          <div className="flex items-center space-x-3">
                            <FaPhone className="w-4 h-4 lg:w-5 lg:h-5 text-gray-400" />
                            <div>
                              <p className="font-medium text-gray-900 text-sm lg:text-base">Telefone</p>
                              <p className="text-xs lg:text-sm text-gray-600">{user.phone || "Não informado"}</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border border-gray-200 rounded-lg gap-2">
                          <div className="flex items-center space-x-3">
                            <FaUserTag className="w-4 h-4 lg:w-5 lg:h-5 text-gray-400" />
                            <div>
                              <p className="font-medium text-gray-900 text-sm lg:text-base">Tipo de Usuário</p>
                              <p className="text-xs lg:text-sm text-gray-600">{user.userType === "HOUSE_OWNER" ? "Proprietário" : "Usuário"}</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex justify-end pt-4">
                          <Button
                            onClick={() => setIsEditing(true)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 text-sm lg:text-base"
                          >
                            Editar Perfil
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
