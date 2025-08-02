"use client";

import {
  EmbeddedCheckout,
  EmbeddedCheckoutProvider,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

import { fetchClientSecret } from "../../../app/actions/stripe";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
);

interface CheckoutProps {
  onClose: () => void;
  onSuccess?: () => void;
  customer: {
    name: string;
    email: string;
    stripeCustomerId: string;
  };
  plan: {
    stripePriceId: string;
    id: string;
  };
}

export default function Checkout({ onClose, onSuccess, customer, plan }: CheckoutProps) {
  const fetchClientSecretNoParam = async (): Promise<string> => {
    try {
      const secret = await fetchClientSecret({ customer, plan });
      if (!secret) {
        throw new Error("Failed to get client secret");
      }
      return secret;
    } catch {
      throw new Error("Erro ao carregar o checkout. Tente novamente ou contate o suporte.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[1000] p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        <div className="bg-gradient-to-r from-primary-500 to-primary-600 p-6 text-white flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-1">Finalizar Assinatura</h2>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6 flex-1 overflow-y-auto">
          <div className="min-h-[500px]">
            <EmbeddedCheckoutProvider
              stripe={stripePromise}
              options={{
                fetchClientSecret: fetchClientSecretNoParam,
                onComplete: () => {
                  onSuccess?.();
                },
              }}
            >
              <EmbeddedCheckout />
            </EmbeddedCheckoutProvider>
          </div>
        </div>
        <div className="bg-gray-50 px-6 py-4 border-t flex-shrink-0">
          <div className="flex items-center justify-center text-sm text-gray-500">
            <svg
              className="w-4 h-4 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                clipRule="evenodd"
              />
            </svg>
            Pagamento seguro processado pelo Stripe
          </div>
        </div>
      </div>
    </div>
  );
}
