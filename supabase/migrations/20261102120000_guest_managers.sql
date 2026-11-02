-- "Guest manager" role: a signed-in user who may add / edit / remove guests in Admin,
-- but cannot change any other wedding setting (those stay owner-only via their own RLS).
--
-- Add a guest manager (run in the SQL editor, using their id from auth.users):
--   insert into public.guest_managers (user_id) values ('<auth user id>');
-- Remove:
--   delete from public.guest_managers where user_id = '<auth user id>';

BEGIN;

CREATE TABLE IF NOT EXISTS public.guest_managers (
  user_id text PRIMARY KEY
);

ALTER TABLE public.guest_managers ENABLE ROW LEVEL SECURITY;

-- A user may only see their own row (the Admin page uses this to pick the guest-only view).
-- Nobody can write to the table through the API; it is managed from the SQL editor.
DROP POLICY IF EXISTS "Guest managers read own row" ON public.guest_managers;
CREATE POLICY "Guest managers read own row" ON public.guest_managers
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid()::text);

GRANT SELECT ON public.guest_managers TO authenticated;

DROP POLICY IF EXISTS "Guest managers manage guest invitations" ON public.guest_invitations;
CREATE POLICY "Guest managers manage guest invitations" ON public.guest_invitations
  FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM public.guest_managers gm WHERE gm.user_id = auth.uid()::text))
  WITH CHECK (EXISTS (SELECT 1 FROM public.guest_managers gm WHERE gm.user_id = auth.uid()::text));

COMMIT;
