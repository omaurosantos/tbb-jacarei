import { useEffect, useMemo, useState } from "react";
import { conteudosService } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  TEMA_PADRAO,
  TEMA_PAGINA,
  TEMAS_PRONTOS,
  avisosDoTema,
  ehHex,
  normalizarTema,
  salvarTema,
  variaveisDoTema,
  type Tema,
} from "@/lib/tema";

const campos: { chave: keyof Tema; rotulo: string; ajuda: string }[] = [
  { chave: "principal", rotulo: "Cor principal", ajuda: "Cabeçalho, botões e links. A logo usa #485043." },
  { chave: "fundo", rotulo: "Cor do fundo", ajuda: "O papel das páginas. Use um tom claro." },
  { chave: "destaque", rotulo: "Cor de destaque", ajuda: "Faixas, selos e o bloco do próximo encontro." },
];

const iguais = (a: Tema, b: Tema) =>
  a.principal.toLowerCase() === b.principal.toLowerCase() &&
  a.fundo.toLowerCase() === b.fundo.toLowerCase() &&
  a.destaque.toLowerCase() === b.destaque.toLowerCase();

const AdminTema = () => {
  const { toast } = useToast();
  const [salvo, setSalvo] = useState<Tema>(TEMA_PADRAO);
  const [tema, setTema] = useState<Tema>(TEMA_PADRAO);
  const [textos, setTextos] = useState<Record<keyof Tema, string>>({ ...TEMA_PADRAO });
  const [carregado, setCarregado] = useState(false);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    conteudosService
      .getByPagina(TEMA_PAGINA)
      .then((c) => normalizarTema(c.conteudoExtra))
      .catch(() => TEMA_PADRAO)
      .then((t) => {
        setSalvo(t);
        definir(t);
        setCarregado(true);
      });
  }, []);

  const definir = (t: Tema) => {
    setTema(t);
    setTextos({ ...t });
  };

  const mudar = (chave: keyof Tema, valor: string) => {
    setTextos((atual) => ({ ...atual, [chave]: valor }));
    if (ehHex(valor)) setTema((atual) => ({ ...atual, [chave]: valor }));
  };

  const avisos = useMemo(() => avisosDoTema(tema), [tema]);
  const comErro = avisos.some((a) => a.gravidade === "erro");
  const hexInvalido = campos.some((c) => !ehHex(textos[c.chave]));
  const alterado = !iguais(tema, salvo);
  const previa = useMemo(() => variaveisDoTema(tema) as React.CSSProperties, [tema]);

  const guardar = async (novo: Tema) => {
    setSalvando(true);
    try {
      await salvarTema(novo);
      setSalvo(novo);
      definir(novo);
      toast({ title: "Cores salvas", description: "O site já está com as novas cores." });
    } catch (error) {
      toast({
        title: "Não foi possível salvar as cores",
        description: error instanceof Error ? error.message : "Tente de novo em instantes.",
        variant: "destructive",
      });
    } finally {
      setSalvando(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">Cores do site</h1>
        <p className="text-muted-foreground">Escolha três cores. O texto, as bordas e os tons de apoio saem delas.</p>
      </div>

      <section aria-labelledby="temas-prontos">
        <h2 id="temas-prontos" className="font-display text-lg font-semibold text-foreground">Combinações prontas</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {TEMAS_PRONTOS.map((p) => (
            <Button key={p.nome} type="button" variant="outline" onClick={() => definir(p.tema)}>
              <span className="flex" aria-hidden="true">
                {[p.tema.principal, p.tema.fundo, p.tema.destaque].map((c) => (
                  <span key={c} className="-ml-1 first:ml-0 h-5 w-5 rounded-full border border-border" style={{ background: c }} />
                ))}
              </span>
              {p.nome}
            </Button>
          ))}
        </div>
      </section>

      <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr]">
        <section aria-labelledby="cores-titulo" className="space-y-5">
          <h2 id="cores-titulo" className="font-display text-lg font-semibold text-foreground">Suas cores</h2>
          {campos.map((c) => {
            const invalido = !ehHex(textos[c.chave]);
            return (
              <div key={c.chave}>
                <Label htmlFor={`cor-${c.chave}`}>{c.rotulo}</Label>
                <div className="mt-1 flex items-center gap-3">
                  <input
                    type="color"
                    aria-label={`${c.rotulo}: seletor de cor`}
                    value={tema[c.chave]}
                    onChange={(e) => mudar(c.chave, e.target.value.toUpperCase())}
                    className="h-12 w-14 cursor-pointer rounded-md border border-input bg-card p-1"
                  />
                  <Input
                    id={`cor-${c.chave}`}
                    value={textos[c.chave]}
                    onChange={(e) => mudar(c.chave, e.target.value.trim())}
                    maxLength={7}
                    spellCheck={false}
                    aria-invalid={invalido}
                    className="max-w-[9rem] font-mono uppercase"
                  />
                </div>
                <p className={`mt-1 text-sm ${invalido ? "text-destructive" : "text-muted-foreground"}`}>
                  {invalido ? "Use o formato #RRGGBB, por exemplo #485043." : c.ajuda}
                </p>
              </div>
            );
          })}

          {avisos.length > 0 && (
            <ul className="space-y-2" aria-live="polite">
              {avisos.map((a) => (
                <li
                  key={a.texto}
                  className={`rounded-md p-3 text-base ${a.gravidade === "erro" ? "bg-destructive/10 text-destructive" : "bg-secondary text-foreground"}`}
                >
                  {a.texto}
                </li>
              ))}
            </ul>
          )}

          <div className="flex flex-wrap gap-3 pt-2">
            <Button type="button" disabled={!carregado || salvando || !alterado || comErro || hexInvalido} onClick={() => guardar(tema)}>
              {salvando ? "Salvando…" : "Salvar cores"}
            </Button>
            <Button type="button" variant="outline" disabled={salvando || iguais(tema, TEMA_PADRAO)} onClick={() => definir(TEMA_PADRAO)}>
              Voltar às cores da logo
            </Button>
          </div>
        </section>

        <section aria-labelledby="previa-titulo">
          <h2 id="previa-titulo" className="font-display text-lg font-semibold text-foreground">Prévia</h2>
          <div className="mt-3 overflow-hidden rounded-lg border border-border bg-background text-foreground" style={previa}>
            <div className="bg-primary px-5 py-3 font-display font-semibold text-primary-foreground">Templo Batista Bíblico</div>
            <div className="bg-primary px-5 pb-6 pt-2 text-primary-foreground">
              <p className="font-display text-3xl font-semibold leading-tight">Venha nos conhecer</p>
              <p className="mt-2 text-lg text-primary-foreground/90">Culto aos domingos, escola bíblica e pequenos grupos.</p>
              <span className="mt-4 inline-block rounded-md bg-highlight px-5 py-3 font-bold text-highlight-foreground">Como chegar</span>
            </div>
            <div className="space-y-3 p-5">
              <div className="rounded-md bg-highlight p-4 text-highlight-foreground">
                <span className="block font-bold">Próximo encontro</span>
                <span className="block font-display text-xl font-semibold">Domingo, 18h</span>
              </div>
              <div className="rounded-md bg-secondary p-4">
                <span className="block font-display text-lg font-semibold">Quarta-feira</span>
                <span className="block text-muted-foreground">19h30, pequenos grupos</span>
              </div>
              <p className="text-lg">
                Texto comum e <span className="font-semibold text-primary underline">um link na cor principal</span>.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdminTema;
