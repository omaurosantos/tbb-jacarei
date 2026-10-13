import { Component, ReactNode } from "react";

const RELOAD_FLAG = "chunk-reload-tentado";

// Depois de um deploy, uma aba antiga pode pedir um chunk que não existe mais.
// Recarrega a página uma vez para buscar o index.html novo; se falhar de novo, mostra um aviso.
function isChunkLoadError(error: Error) {
  return /Failed to fetch dynamically imported module|Importing a module script failed|ChunkLoadError/i.test(
    `${error.name} ${error.message}`
  );
}

interface State {
  error: Error | null;
}

class ChunkErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error) {
    if (!isChunkLoadError(error)) return;
    try {
      // Só recarrega se não houve outra tentativa nos últimos 10s (evita loop)
      const ultimaTentativa = Number(sessionStorage.getItem(RELOAD_FLAG) || 0);
      if (Date.now() - ultimaTentativa > 10_000) {
        sessionStorage.setItem(RELOAD_FLAG, String(Date.now()));
        window.location.reload();
      }
    } catch {
      // sessionStorage indisponível: cai no aviso abaixo
    }
  }

  render() {
    if (!this.state.error) return this.props.children;

    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-background p-6 text-center">
        <p className="text-muted-foreground">Não foi possível carregar esta página.</p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
        >
          Recarregar
        </button>
      </div>
    );
  }
}

export default ChunkErrorBoundary;
