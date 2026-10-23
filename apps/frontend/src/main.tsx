import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { aplicarTemaDoCache } from "./lib/tema.ts";

// Antes de montar a página, para não piscar as cores padrão
aplicarTemaDoCache();

createRoot(document.getElementById("root")!).render(<App />);
