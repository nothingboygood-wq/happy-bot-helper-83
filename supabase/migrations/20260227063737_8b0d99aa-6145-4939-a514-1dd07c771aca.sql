
-- Add paddle fields to subscriptions
ALTER TABLE public.subscriptions
ADD COLUMN IF NOT EXISTS paddle_subscription_id text,
ADD COLUMN IF NOT EXISTS paddle_customer_id text;
