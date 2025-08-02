import { api } from "@/lib/axios";

interface CreateSubscriptionDto {
  userId: string;
  planId: string;
  sessionId: string;
}

interface Subscription {
  _id: string;
  userId: string;
  planId: string;
  stripeCustomerId: string;
  stripeSubscriptionId: string;
  status: "active" | "canceled" | "past_due" | "unpaid";
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserDto {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface PlanDto {
  _id: string;
  name: string;
  price: number;
  type: "BASIC" | "PREMIUM" | "ENTERPRISE";
}

export interface InvoiceDetailsDto {
  id: string;
  number: string;
  status: string;
  amount: number;
  currency: string;
  created: number;
  dueDate?: number;
  paidAt?: number;
  description?: string;
  subscription?: string;
  customer?: string;
  hostedInvoiceUrl?: string;
  invoicePdf?: string;
}

export interface SubscriptionDto {
  id: string;
  stripeSubscriptionId: string;
  status: "active" | "canceled" | "past_due" | "unpaid" | "trialing";
  user: UserDto;
  plan: PlanDto;
}

export interface InvoiceDto {
  id: string;
  number: string;
  amount: number;
  currency: string;
  status: string;
  created: string;
  dueDate?: string;
  paid: boolean;
  paymentMethod: "card" | "boleto";
}

export interface BillingHistoryDto {
  subscription: SubscriptionDto;
  invoices: InvoiceDto[];
}

export interface BillingHistoryResponseDto {
  data: BillingHistoryDto;
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
}

export interface BillingHistoryFilters {
  status?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export interface SubscriptionInfoDto {
  id: string;
  stripeSubscriptionId: string;
  status: "active" | "canceled" | "past_due" | "unpaid" | "trialing";
  plan: {
    id: string;
    name: string;
    description: string;
    price: number;
    currency: string;
    courtLimit: number;
    features: string[];
  };
  courtUsage: {
    totalCreated: number;
    limit: number;
    available: number;
  };
  billing: {
    currentPeriodStart: string;
    currentPeriodEnd: string;
    cancelAtPeriodEnd: boolean;
    amount: number;
    currency: string;
  };
  createdAt: string;
  updatedAt: string;
  paymentMethod: {
    id: string;
    brand: string;
    last4: string;
  };
}

export const subscriptionService = {
  async createSubscription(data: CreateSubscriptionDto): Promise<Subscription> {
    const response = await api.post("/subscriptions", data);
    return response.data;
  },

  async getSubscription(userId: string): Promise<Subscription | null> {
    const response = await api.get(`/subscriptions/user/${userId}`);
    return response.data;
  },

  async getSubscriptionInfo(): Promise<SubscriptionInfoDto> {
    const response = await api.get("/subscriptions/info");
    return response.data;
  },

  async cancelSubscription(): Promise<void> {
    const response = await api.post("/subscriptions/cancel", { confirm: true });
    return response.data;
  },

  async getBillingHistory(
    filters?: BillingHistoryFilters
  ): Promise<BillingHistoryResponseDto> {
    const response = await api.get(`/subscriptions/billing-history`, {
      params: filters,
    });
    return response.data;
  },

  async getInvoiceDetails(invoiceId: string): Promise<InvoiceDetailsDto> {
    const response = await api.get(`/subscriptions/invoice/${invoiceId}`);
    return response.data;
  },
};
