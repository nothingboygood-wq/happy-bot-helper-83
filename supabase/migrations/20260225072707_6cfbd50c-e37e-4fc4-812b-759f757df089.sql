
-- Role enum and user_roles table
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "Users can read own roles"
ON public.user_roles FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Widget settings table
CREATE TABLE public.widget_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  bot_name text NOT NULL DEFAULT 'BotDesk AI',
  greeting_message text NOT NULL DEFAULT 'Hi! 👋 How can I help you today?',
  system_prompt text NOT NULL DEFAULT 'You are a friendly and helpful customer support chatbot. You help visitors with their questions about the business. Keep responses concise, professional, and helpful.',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id)
);

ALTER TABLE public.widget_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own widget settings"
ON public.widget_settings FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users insert own widget settings"
ON public.widget_settings FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users update own widget settings"
ON public.widget_settings FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

CREATE TRIGGER update_widget_settings_updated_at
BEFORE UPDATE ON public.widget_settings
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Subscriptions table
CREATE TABLE public.subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  status text NOT NULL DEFAULT 'inactive',
  plan text NOT NULL DEFAULT 'trial',
  trial_ends_at timestamptz,
  card_last_four text,
  card_brand text,
  activated_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id)
);

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own subscription"
ON public.subscriptions FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users insert own subscription"
ON public.subscriptions FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users update own subscription"
ON public.subscriptions FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

CREATE TRIGGER update_subscriptions_updated_at
BEFORE UPDATE ON public.subscriptions
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Function to check if user has active subscription (used by edge functions)
CREATE OR REPLACE FUNCTION public.is_subscription_active(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = 'admin'
  )
  OR EXISTS (
    SELECT 1 FROM public.subscriptions
    WHERE user_id = _user_id
    AND status = 'active'
    AND (plan != 'trial' OR trial_ends_at > now())
  )
$$;
