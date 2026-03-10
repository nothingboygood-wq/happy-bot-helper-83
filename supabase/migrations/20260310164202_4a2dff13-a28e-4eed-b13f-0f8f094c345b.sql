CREATE OR REPLACE FUNCTION public.is_subscription_active(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = 'admin'
  )
  OR EXISTS (
    SELECT 1 FROM public.subscriptions
    WHERE user_id = _user_id
    AND status = 'active'
    AND (
      (plan = 'free' AND trial_ends_at > now())
      OR plan NOT IN ('free', 'trial')
    )
  )
$$;

CREATE OR REPLACE FUNCTION public.get_monthly_conversation_count(_user_id uuid)
RETURNS integer
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(COUNT(*)::integer, 0)
  FROM public.conversations
  WHERE user_id = _user_id
  AND created_at >= date_trunc('month', now())
$$;