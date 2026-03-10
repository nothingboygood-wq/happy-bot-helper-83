import { useEffect, useState } from "react";
import { initializePaddle, type Paddle } from "@paddle/paddle-js";

const PADDLE_CLIENT_TOKEN = "live_6b06aae42445419a91623a56dfd";

export const PADDLE_PRICES = {
  starter: {
    monthly: "pri_01kjvpen0tdqe4tg6faypq8x88",
    yearly: "pri_01kkc98m715d7nw0wtpwysgf0q",
  },
  growth: {
    monthly: "pri_01kjvpfw6ks6bhjb92hev88ssy",
    yearly: "pri_01kkc9jhsp1h5htkfq6xgdvk6m",
  },
  highEnd: {
    monthly: "pri_01kjvpjk6cx315wps5hdd818eh",
    yearly: "pri_01kkc9q0bhe3kf1gaetm0wyaa3",
  },
} as const;

export const PLAN_LIMITS = {
  free: { conversations: 50, integrations: 1 },
  starter: { conversations: 500, integrations: 1 },
  growth: { conversations: 5000, integrations: 5 },
  high_end: { conversations: -1, integrations: -1 }, // unlimited
  admin: { conversations: -1, integrations: -1 },
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
    if (!paddle) {
      console.error("Paddle not initialized yet");
      return;
    }
    paddle.Checkout.open({
      items: [{ priceId, quantity: 1 }],
      settings: {
        successUrl: `${window.location.origin}/dashboard`,
        allowLogout: false,
      },
      ...(email ? { customer: { email } } : {}),
    });
  };

  return { paddle, openCheckout };
};
