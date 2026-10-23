import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";
import { sincronizarTema } from "@/lib/tema";
import { AuthProvider } from "@/contexts/AuthContext";
import ChunkErrorBoundary from "@/components/ChunkErrorBoundary";
import Home from "./pages/Home";

// Demais páginas carregadas sob demanda; o painel (Login/Admin) fica fora do bundle do visitante
const Igreja = lazy(() => import("./pages/Igreja"));
const QuemSomos = lazy(() => import("./pages/QuemSomos"));
const Missao = lazy(() => import("./pages/Missao"));
const Visao = lazy(() => import("./pages/Visao"));
const OQueCremos = lazy(() => import("./pages/OQueCremos"));
const Pastores = lazy(() => import("./pages/Pastores"));
const Ministerios = lazy(() => import("./pages/Ministerios"));
const Recursos = lazy(() => import("./pages/Recursos"));
const Localizacao = lazy(() => import("./pages/Localizacao"));
const Login = lazy(() => import("./pages/AreaSegura/Login"));
const Admin = lazy(() => import("./pages/AreaSegura/Admin"));
const NotFound = lazy(() => import("./pages/NotFound"));

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="h-8 w-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
  </div>
);

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    sincronizarTema();
  }, []);

  return (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ChunkErrorBoundary>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/igreja" element={<Igreja />} />
                <Route path="/igreja/quem-somos" element={<QuemSomos />} />
                <Route path="/igreja/missao" element={<Missao />} />
                <Route path="/igreja/visao" element={<Visao />} />
                <Route path="/igreja/o-que-cremos" element={<OQueCremos />} />
                <Route path="/igreja/pastores" element={<Pastores />} />
                <Route path="/ministerios" element={<Ministerios />} />
                <Route path="/recursos" element={<Recursos />} />
                <Route path="/localizacao" element={<Localizacao />} />
                <Route path="/areasegura/login" element={<Login />} />
                <Route path="/areasegura/admin" element={<Admin />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </ChunkErrorBoundary>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
  );
};

export default App;
