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
      console.log("🔍 === COMPLETE ENVIRONMENT VARIABLES ===");
  console.log("🔑 STRIPE_SECRET_KEY:", process.env.STRIPE_SECRET_KEY);
  console.log("🔑 NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY:", process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
  console.log("🌍 NODE_ENV:", process.env.NODE_ENV);
  console.log("🌐 NEXT_PUBLIC_API_URL:", process.env.NEXT_PUBLIC_API_URL);
  console.log("🔍 All process.env keys:", Object.keys(process.env));
  console.log("🔍 === END COMPLETE ENVIRONMENT VARIABLES ===");
  
      const secret = await fetchClientSecret({ customer, plan });
      if (!secret) {
        throw new Error("Failed to get client secret");
      }
      return secret;
    } catch (error) {
      console.error("Error fetching client secret:", error);
      throw new Error("Erro ao carregar o checkout. Tente novamente ou contate o suporte.");
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[1000] p-4"
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header minimalista */}
        <div className="bg-white border-b border-slate-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Finalizar Assinatura</h2>
              <p className="text-slate-500 text-sm mt-1">Complete seu pagamento de forma segura</p>
            </div>
            
            <button
              onClick={onClose}
              className="w-8 h-8 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg flex items-center justify-center transition-colors"
              aria-label="Fechar modal"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Conteúdo principal */}
        <div className="flex-1 overflow-hidden">
          <div className="h-full p-6">
            <div className="h-full min-h-[500px] bg-slate-50 rounded-lg">
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
        </div>
        
        {/* Footer minimalista */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-xs text-slate-500">
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                <span>Pagamento seguro</span>
              </div>
              <div className="w-px h-3 bg-slate-300"></div>
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Stripe</span>
              </div>
            </div>
            
            <button
              onClick={onClose}
              className="text-slate-500 hover:text-slate-700 text-sm font-medium transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
