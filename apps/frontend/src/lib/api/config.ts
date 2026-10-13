// Origem do backend, sem "/api" (as rotas em API_ROUTES já começam com /api)
export const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3000').replace(/\/+$/, '');

// Arquivos enviados são salvos no banco como caminho relativo (/uploads/...);
// aqui viram URL absoluta do backend. URLs completas passam sem alteração.
export function resolveAssetUrl(url?: string | null): string | undefined {
  if (!url) return undefined;
  if (/^https?:\/\//i.test(url)) return url;
  return `${API_BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
}
