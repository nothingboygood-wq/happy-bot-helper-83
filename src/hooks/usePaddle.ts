import { useEffect, useState } from "react";
import { initializePaddle, type Paddle } from "@paddle/paddle-js";

const PADDLE_CLIENT_TOKEN = "live_187e903e1f9473c48b206328a0c";

export const PADDLE_PRICES = {
  starter: "pri_01kjeyspgn3smejp2dyb55nwy6",
  growth: "pri_01kjeytvp30tfrx579svf206w8",
  highEnd: "pri_01kjeyx4bm5ktjb81a131dbycw",
} as const;

export const usePaddle = () => {
  const [paddle, setPaddle] = useState<Paddle | null>(null);

  useEffect(() => {
    initializePaddle({
      environment: "production",
      token: PADDLE_CLIENT_TOKEN,
    }).then((instance) => {
      if (instance) setPaddle(instance);
    });
  }, []);

  const openCheckout = (priceId: string, email?: string) => {
    paddle?.Checkout.open({
      items: [{ priceId, quantity: 1 }],
      ...(email ? { customer: { email } } : {}),
    });
  };

  return { paddle, openCheckout };
};
