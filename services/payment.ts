import { api } from "@/lib/axios";

interface MongoDBPayment {
  _id: { $oid: string };
  userId: { $oid: string };
  amount: number;
  stripePaymentIntentId: string;
  status: 'PENDING' | 'PAID' | 'EXPIRED' | 'CANCELED';
  paymentMethod: 'boleto' | 'pix';
  boletoExpirationDate?: string;
  createdAt: string;
  updatedAt: string;
}

interface Payment {
  _id: string;
  amount: number;
  userId: string;
  stripePaymentIntentId: string;
  status: 'PENDING' | 'PAID' | 'EXPIRED' | 'CANCELED';
  paymentMethod: 'boleto' | 'pix';
  boletoExpirationDate?: Date;
  boletoUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface ListPaymentsParams {
  status?: string;
  dateRange?: string;
}

export const paymentService = {
  async listPayments({ status = 'all', dateRange = 'week' }: ListPaymentsParams = {}): Promise<Payment[]> {
    const response = await api.get<MongoDBPayment[]>('/payments/boletos', {
      params: {
        status: status !== 'all' ? status : undefined,
        dateRange
      }
    });

    return response.data.map((payment) => ({
      ...payment,
      _id: payment._id.$oid,
      userId: payment.userId.$oid,
      boletoExpirationDate: payment.boletoExpirationDate ? new Date(payment.boletoExpirationDate) : undefined,
      createdAt: new Date(payment.createdAt),
      updatedAt: new Date(payment.updatedAt)
    }));
  }
}; 