"use server";

import { headers } from "next/headers";
import Stripe from "stripe";

// Log das variáveis de ambiente na inicialização
console.log("🔍 === STRIPE ENVIRONMENT VARIABLES ===");
console.log("🔑 STRIPE_SECRET_KEY exists:", !!process.env.STRIPE_SECRET_KEY);
console.log("🔑 STRIPE_SECRET_KEY length:", process.env.STRIPE_SECRET_KEY?.length || 0);
console.log("🔑 STRIPE_SECRET_KEY starts with 'sk_':", process.env.STRIPE_SECRET_KEY);
console.log("🔑 STRIPE_SECRET_KEY starts with 'sk_test_':", process.env.STRIPE_SECRET_KEY);
console.log("🔑 STRIPE_SECRET_KEY first 10 chars:", process.env.STRIPE_SECRET_KEY?.substring(0, 10) || 'NOT_SET');
console.log("🔑 STRIPE_SECRET_KEY:", process.env.STRIPE_SECRET_KEY);
console.log("🔑 STRIPE_SECRET_KEY:", process.env.STRIPE_SECRET_KEY);
console.log("🔑 STRIPE_SECRET_KEY:", process.env.STRIPE_SECRET_KEY);
console.log("🌍 NODE_ENV:", process.env.NODE_ENV);
console.log("🔍 === END STRIPE ENVIRONMENT VARIABLES ===");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-05-28.basil",
});

interface Customer {
  name: string;
  email: string;
  stripeCustomerId: string;
}

interface Plan {
  stripePriceId: string;
  id: string;
}

interface FetchClientSecretProps {
  customer: Customer;
  plan: Plan;
}

export async function fetchClientSecret({
  plan,
  customer,
}: FetchClientSecretProps): Promise<string | null> {
  console.log("🚀 === FETCHCLIENTSECRET EXECUTION ===");
  console.log("📋 Plan received:", JSON.stringify(plan, null, 2));
  console.log("👤 Customer received:", JSON.stringify(customer, null, 2));
  
  // Verificar se as variáveis críticas existem
  if (!process.env.STRIPE_SECRET_KEY) {
    console.error("❌ STRIPE_SECRET_KEY não está definida!");
    return null;
  }
  
  if (!plan.stripePriceId) {
    console.error("❌ stripePriceId não fornecido:", plan.stripePriceId);
    return null;
  }
  
  if (!customer.email) {
    console.error("❌ customer.email não fornecido:", customer.email);
    return null;
  }

  try {
    const origin = (await headers()).get("origin") ?? "";
    console.log("🌐 Origin detected:", origin);
    console.log("🔗 Return URL will be:", `${origin}/owner-plans?session_id={CHECKOUT_SESSION_ID}&plan_id=${plan.id}`);

    console.log("🏗️ Creating Stripe session...");
    const session = await stripe.checkout.sessions.create({
      ui_mode: "embedded",
      line_items: [
        {
          price: plan.stripePriceId,
          quantity: 1,
        },
      ],
      customer_email: customer.email,
      payment_method_types: ["card", "boleto"],
      mode: "subscription",
      subscription_data: {
        trial_period_days: 7,
      },
      return_url: `${origin}/owner-plans?session_id={CHECKOUT_SESSION_ID}&plan_id=${plan.id}`,
    });

    console.log("✅ Stripe session created successfully!");
    console.log("🆔 Session ID:", session.id);
    console.log("🔐 Client secret exists:", !!session.client_secret);
    console.log("🔐 Client secret length:", session.client_secret?.length || 0);
    console.log("🚀 === END FETCHCLIENTSECRET EXECUTION ===");

    return session.client_secret;
  } catch (error) {
    console.error("❌ === STRIPE ERROR ===");
    console.error("Error type:", error?.constructor?.name);
    console.error("Error message:", error instanceof Error ? error.message : 'Unknown error');
    console.error("Full error:", error);
    console.error("❌ === END STRIPE ERROR ===");
    return null;
  }
}
