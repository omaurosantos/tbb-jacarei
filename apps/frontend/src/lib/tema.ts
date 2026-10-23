import { conteudosService } from "@/lib/api";

// O admin escolhe três cores; o resto (texto, bordas, tons de apoio) sai delas.
export type Tema = {
  principal: string; // cabeçalho, botões e links
  fundo: string; // papel das páginas
  destaque: string; // faixas, selos e botões sobre a cor principal
};

export const TEMA_PAGINA = "tema";
const CACHE = "tbb-tema";

export const TEMA_PADRAO: Tema = { principal: "#485043", fundo: "#F7F6F8", destaque: "#D5DCCD" };

export const TEMAS_PRONTOS: { nome: string; tema: Tema }[] = [
  { nome: "Oliva da logo", tema: TEMA_PADRAO },
  { nome: "Azul-noite", tema: { principal: "#1B2F4E", fundo: "#F6F8FB", destaque: "#C9D6E8" } },
  { nome: "Vinho", tema: { principal: "#5B1E2B", fundo: "#F7F4F4", destaque: "#E6CFD3" } },
  { nome: "Pinheiro", tema: { principal: "#1F372F", fundo: "#F3F6F4", destaque: "#CFE0D6" } },
];

const HEX = /^#[0-9a-f]{6}$/i;
export const ehHex = (v: unknown): v is string => typeof v === "string" && HEX.test(v);

export function normalizarTema(extra: unknown): Tema {
  const e = (extra && typeof extra === "object" ? extra : {}) as Partial<Tema>;
  return {
    principal: ehHex(e.principal) ? e.principal : TEMA_PADRAO.principal,
    fundo: ehHex(e.fundo) ? e.fundo : TEMA_PADRAO.fundo,
    destaque: ehHex(e.destaque) ? e.destaque : TEMA_PADRAO.destaque,
  };
}

// ---------- cor ----------

type RGB = [number, number, number];

const paraRgb = (hex: string): RGB => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16)) as RGB;
const paraHex = ([r, g, b]: RGB) =>
  "#" + [r, g, b].map((v) => Math.round(Math.min(255, Math.max(0, v))).toString(16).padStart(2, "0")).join("");

function paraHsl(hex: string): [number, number, number] {
  const [r, g, b] = paraRgb(hex).map((v) => v / 255);
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return [0, 0, l];
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  const h = max === r ? (g - b) / d + (g < b ? 6 : 0) : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return [h * 60, s, l];
}

function deHsl(h: number, s: number, l: number): string {
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return paraHex([f(0) * 255, f(8) * 255, f(4) * 255]);
}

// "H S% L%", o formato que o Tailwind do projeto espera nas variáveis
const comoVariavel = (hex: string) => {
  const [h, s, l] = paraHsl(hex);
  return `${Math.round(h)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
};

const mistura = (a: string, b: string, t: number) => {
  const ra = paraRgb(a);
  const rb = paraRgb(b);
  return paraHex(ra.map((v, i) => v + (rb[i] - v) * t) as RGB);
};

function luminancia(hex: string) {
  const [r, g, b] = paraRgb(hex).map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contraste(a: string, b: string) {
  const x = luminancia(a);
  const y = luminancia(b);
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
}

// Primeira opção que passa; se nenhuma passar, a de maior contraste
function textoSobre(cor: string, opcoes: string[]) {
  return opcoes.find((o) => contraste(o, cor) >= 4.5) ?? (contraste("#FFFFFF", cor) >= contraste("#000000", cor) ? "#FFFFFF" : "#000000");
}

// ---------- tema -> variáveis ----------

export function variaveisDoTema(tema: Tema): Record<string, string> {
  const [h, s] = paraHsl(tema.principal);
  const tinta = deHsl(h, Math.min(s, 0.2), 0.12);
  const sobrePrincipal = textoSobre(tema.principal, [tema.fundo, "#FFFFFF", "#000000"]);
  const sobreDestaque = textoSobre(tema.destaque, [tinta, "#FFFFFF", "#000000"]);
  const textoSecundario = mistura(tinta, tema.fundo, 0.12);
  const secundario = contraste(textoSecundario, tema.fundo) >= 7 ? textoSecundario : tinta;
  const apoio = mistura(tema.fundo, tema.principal, 0.1);
  const borda = mistura(tema.fundo, tema.principal, 0.2);
  const lateralClara = mistura(tema.principal, sobrePrincipal, 0.12);

  const v: Record<string, string> = {
    background: tema.fundo,
    foreground: tinta,
    "card-foreground": tinta,
    "popover-foreground": tinta,
    primary: tema.principal,
    "primary-foreground": sobrePrincipal,
    secondary: apoio,
    "secondary-foreground": tema.principal,
    muted: mistura(tema.fundo, tema.principal, 0.14),
    "muted-foreground": secundario,
    accent: tema.principal,
    "accent-foreground": sobrePrincipal,
    highlight: tema.destaque,
    "highlight-foreground": sobreDestaque,
    border: borda,
    input: borda,
    ring: tema.principal,
    "sidebar-background": tema.principal,
    "sidebar-foreground": sobrePrincipal,
    "sidebar-primary": sobrePrincipal,
    "sidebar-primary-foreground": tema.principal,
    "sidebar-accent": lateralClara,
    "sidebar-accent-foreground": sobrePrincipal,
    "sidebar-border": lateralClara,
    "sidebar-ring": sobrePrincipal,
  };
  return Object.fromEntries(Object.entries(v).map(([k, cor]) => [`--${k}`, comoVariavel(cor)]));
}

export type Aviso = { gravidade: "erro" | "aviso"; texto: string };

export function avisosDoTema(tema: Tema): Aviso[] {
  const avisos: Aviso[] = [];
  const [h, s] = paraHsl(tema.principal);
  const tinta = deHsl(h, Math.min(s, 0.2), 0.12);
  if (contraste(tinta, tema.fundo) < 7) {
    avisos.push({ gravidade: "erro", texto: "O fundo é escuro demais: o texto não fica legível. Escolha um fundo claro." });
  }
  if (contraste(tema.principal, tema.fundo) < 4.5) {
    avisos.push({ gravidade: "erro", texto: "A cor principal e o fundo são parecidas demais: links e botões somem." });
  }
  if (contraste(tema.destaque, tema.principal) < 1.5 && contraste(tema.destaque, tema.fundo) < 1.2) {
    avisos.push({ gravidade: "aviso", texto: "O destaque quase não se distingue das outras cores." });
  }
  return avisos;
}

// ---------- aplicar no site ----------

export function aplicarTema(tema: Tema) {
  const raiz = document.documentElement;
  for (const [nome, valor] of Object.entries(variaveisDoTema(tema))) raiz.style.setProperty(nome, valor);
}

function limparTema() {
  const raiz = document.documentElement;
  for (const nome of Object.keys(variaveisDoTema(TEMA_PADRAO))) raiz.style.removeProperty(nome);
}

function lerCache(): Tema | null {
  try {
    const bruto = localStorage.getItem(CACHE);
    return bruto ? normalizarTema(JSON.parse(bruto)) : null;
  } catch {
    return null;
  }
}

function gravarCache(tema: Tema | null) {
  try {
    if (tema) localStorage.setItem(CACHE, JSON.stringify(tema));
    else localStorage.removeItem(CACHE);
  } catch {
    // sem armazenamento: o tema só chega depois da API, sem problema
  }
}

// Antes de montar a página: usa o último tema conhecido para não piscar a cor padrão
export function aplicarTemaDoCache() {
  const cache = lerCache();
  if (cache) aplicarTema(cache);
}

// Depois de montar: confere com o que está salvo no painel
export async function sincronizarTema() {
  try {
    const salvo = await conteudosService.getByPagina(TEMA_PAGINA);
    const tema = normalizarTema(salvo.conteudoExtra);
    if (avisosDoTema(tema).some((a) => a.gravidade === "erro")) return;
    aplicarTema(tema);
    gravarCache(tema);
  } catch {
    // sem tema salvo (404) ou API fora do ar: fica o padrão do código
    if (!lerCache()) limparTema();
  }
}

export async function salvarTema(tema: Tema) {
  await conteudosService.update(TEMA_PAGINA, {
    titulo: "Cores do site",
    subtitulo: null,
    conteudo: "",
    conteudoExtra: tema,
  });
  aplicarTema(tema);
  gravarCache(tema);
}
