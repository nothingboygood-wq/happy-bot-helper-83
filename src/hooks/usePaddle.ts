import { useEffect, useState } from "react";
import { initializePaddle, type Paddle } from "@paddle/paddle-js";

const PADDLE_CLIENT_TOKEN = "test_0616e551ccedd9d67365a463cf2";

export const PADDLE_PRICES = {
  starter: "pro_01kjewf5490n8aydfm3fb72nk0",
  growth: "pro_01kjewhc3mp3vd473nwpqp25c7",
  enterprise: "pro_01kjewrsx25dzxhdmnakdxj8gr",
} as const;

export const usePaddle = () => {
  const [paddle, setPaddle] = useState<Paddle | null>(null);

  useEffect(() => {
    initializePaddle({
      environment: "sandbox",
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
