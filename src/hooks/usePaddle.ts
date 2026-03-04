import { useEffect, useState } from "react";
import { initializePaddle, type Paddle } from "@paddle/paddle-js";

const PADDLE_CLIENT_TOKEN = "live_6b06aae42445419a91623a56dfd";

export const PADDLE_PRICES = {
  starter: "pri_01kjvpen0tdqe4tg6faypq8x88",
  growth: "pri_01kjvpfw6ks6bhjb92hev88ssy",
  highEnd: "pri_01kjvpjk6cx315wps5hdd818eh",
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
