-- Remover a política antiga que expõe emails para todos os usuários autenticados
DROP POLICY IF EXISTS "Authenticated users can read profiles" ON public.profiles;

-- Criar política restritiva: usuários só podem ver seu próprio perfil
CREATE POLICY "Users can read their own profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Política para admins verem todos os perfis
CREATE POLICY "Admins can read all profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));