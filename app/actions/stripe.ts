"use server";

import { headers } from "next/headers";
import Stripe from "stripe";

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
  const origin = (await headers()).get("origin") ?? "";

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
    return_url: `${origin}?session_id={CHECKOUT_SESSION_ID}&plan_id=${plan.id}`,
  });

  return session.client_secret;
}
