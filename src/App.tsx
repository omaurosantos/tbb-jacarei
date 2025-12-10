import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Igreja from "./pages/Igreja";
import QuemSomos from "./pages/QuemSomos";
import Missao from "./pages/Missao";
import Visao from "./pages/Visao";
import OQueCremos from "./pages/OQueCremos";
import Pastores from "./pages/Pastores";
import Ministerios from "./pages/Ministerios";
import Recursos from "./pages/Recursos";
import Localizacao from "./pages/Localizacao";
import Login from "./pages/AreaSegura/Login";
import Admin from "./pages/AreaSegura/Admin";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
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
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
