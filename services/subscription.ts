import { api } from "@/lib/axios";

interface Plan {
  _id: string;
  name: string;
  description: string;
  price: number;
  courtLimit: number;
  type: 'BASIC' | 'PREMIUM' | 'ENTERPRISE';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  features?: string[];
}

const DEFAULT_FEATURES = {
  BASIC: [
    "Página personalizada da quadra",
    "Sistema de reservas online",
    "Gestão de horários disponíveis",
    "Suporte via email",
    "Tem direito a 3 quadras"
  ],
  PREMIUM: [
    "Página personalizada da quadra",
    "Sistema de reservas online",
    "Gestão de horários disponíveis",
    "Suporte via email",
    "Contato direto com clientes",
    "Tem direito a 10 quadras"
  ],
  ENTERPRISE: [
    "Página personalizada da quadra",
    "Sistema de reservas online",
    "Gestão de horários disponíveis",
    "Suporte prioritário 24/7",
    "Contato direto com clientes",
    "Relatórios avançados",
    "Quadras ilimitadas"
  ],
};

export const subscriptionService = {
  async getPlans(): Promise<Plan[]> {
    const response = await api.get<Plan[]>('/subscriptions/plans');
    
    return response.data.map(plan => ({
      ...plan,
      features: DEFAULT_FEATURES[plan.type]
    }));
  },

  async subscribeToPlan(subscriptionPlanId: string): Promise<void> {
    await api.patch('/users/subscription', { subscriptionPlanId });
  }
}; 