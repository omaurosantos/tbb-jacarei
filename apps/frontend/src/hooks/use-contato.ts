import { useEffect, useState } from "react";
import { conteudosService } from "@/lib/api";

export type Horario = {
  dia: string;
  descricao: string;
};

export type Contato = {
  endereco: string;
  telefone: string;
  email: string;
  instagram: string;
  mapaUrl: string;
  horarios: Horario[];
};

export const CONTATO_PAGINA = "contato";

// Valores exibidos quando o banco ainda não tem o registro (ou algum campo está vazio)
export const CONTATO_PADRAO: Contato = {
  endereco: "R. Carlos de Campos, 447\nParque Itamarati, Jacareí - SP\nCEP: 12307-430",
  telefone: "(12) XXXX-XXXX",
  email: "contato@tbbjacarei.com.br",
  instagram: "tbbjacarei",
  mapaUrl:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3669.123!2d-45.9689!3d-23.2958!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94cdcb5e8d4b1e3d%3A0x1234567890abcdef!2sR.%20Carlos%20de%20Campos%2C%20447%20-%20Parque%20Itamarati%2C%20Jacare%C3%AD%20-%20SP%2C%2012307-430!5e0!3m2!1spt-BR!2sbr!4v1234567890",
  horarios: [
    { dia: "Domingo", descricao: "10h (EBD) e 18h (Culto)" },
    { dia: "Quarta-feira", descricao: "19h30 (Koinonias - Pequenos Grupos)" },
    { dia: "Sábado", descricao: "18h (Creser - quinzenal / Conexteen - semanal)" },
  ],
};

// Só aceita mapa incorporado do Google, para o painel não colocar qualquer página num iframe
export const MAPA_PREFIXO = "https://www.google.com/maps/embed";

// Aceita tanto o link quanto o código <iframe ...> que o Google Maps oferece em "Incorporar um mapa"
export function extrairMapaUrl(entrada: string): string {
  const texto = entrada.trim();
  const src = texto.match(/src\s*=\s*["']([^"']+)["']/i)?.[1] ?? texto;
  return src.replace(/&amp;/g, "&");
}

export function mesclarContato(extra: unknown): Contato {
  const e = (extra && typeof extra === "object" ? extra : {}) as Partial<Contato>;
  const texto = (valor: unknown, padrao: string) =>
    typeof valor === "string" && valor.trim() ? valor : padrao;

  const horarios = Array.isArray(e.horarios)
    ? e.horarios.filter((h) => h && typeof h.dia === "string" && typeof h.descricao === "string")
    : CONTATO_PADRAO.horarios;

  const mapaUrl = texto(e.mapaUrl, CONTATO_PADRAO.mapaUrl);

  return {
    endereco: texto(e.endereco, CONTATO_PADRAO.endereco),
    telefone: texto(e.telefone, CONTATO_PADRAO.telefone),
    email: texto(e.email, CONTATO_PADRAO.email),
    instagram: texto(e.instagram, CONTATO_PADRAO.instagram).replace(/^@/, ""),
    mapaUrl: mapaUrl.startsWith(MAPA_PREFIXO) ? mapaUrl : CONTATO_PADRAO.mapaUrl,
    horarios,
  };
}

// O rodapé aparece em todas as páginas: busca uma vez só e compartilha o resultado
let cache: Promise<Contato> | null = null;

function carregarContato(): Promise<Contato> {
  if (!cache) {
    cache = conteudosService
      .getByPagina(CONTATO_PAGINA)
      .then((c) => mesclarContato(c.conteudoExtra))
      .catch(() => {
        cache = null; // tenta de novo na próxima página
        return CONTATO_PADRAO;
      });
  }
  return cache;
}

export function useContato(): Contato {
  const [contato, setContato] = useState<Contato>(CONTATO_PADRAO);

  useEffect(() => {
    let ativo = true;
    carregarContato().then((c) => ativo && setContato(c));
    return () => {
      ativo = false;
    };
  }, []);

  return contato;
}
