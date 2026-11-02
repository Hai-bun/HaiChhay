-- Each guest remembers which user added it, so a guest manager only works with their own guests.
-- Existing guests have created_by = NULL: only the wedding owner can see/edit them in Admin.

BEGIN;

ALTER TABLE public.guest_invitations ADD COLUMN IF NOT EXISTS created_by text;

DROP POLICY IF EXISTS "Guest managers manage guest invitations" ON public.guest_invitations;
CREATE POLICY "Guest managers manage guest invitations" ON public.guest_invitations
  FOR ALL
  TO authenticated
  USING (
    created_by = auth.uid()::text
    AND EXISTS (SELECT 1 FROM public.guest_managers gm WHERE gm.user_id = auth.uid()::text)
  )
  WITH CHECK (
    created_by = auth.uid()::text
    AND EXISTS (SELECT 1 FROM public.guest_managers gm WHERE gm.user_id = auth.uid()::text)
  );

COMMIT;
