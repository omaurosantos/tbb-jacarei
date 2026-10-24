import { useState, useEffect, useCallback } from "react";
import { conteudosService } from "@/lib/api";
import { ConteudoPagina } from "shared";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Pencil, FileText, Plus, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import {
  CONTATO_PAGINA,
  CONTATO_PADRAO,
  MAPA_PREFIXO,
  extrairMapaUrl,
  mesclarContato,
  type Contato,
} from "@/hooks/use-contato";

const paginasInfo: Record<string, { label: string; description: string }> = {
  [CONTATO_PAGINA]: { label: "Contato e Localização", description: "Endereço, horários, telefone, e-mail, Instagram e mapa" },
  "quem-somos": { label: "Quem Somos", description: "Texto principal da página" },
  "missao": { label: "Missão", description: "Declaração de missão e itens" },
  "visao": { label: "Visão", description: "Texto e pilares da visão" },
  "o-que-cremos": { label: "O Que Cremos", description: "Declarações de fé" },
};

// Blocos que as páginas guardam em conteudoExtra e que o painel agora edita
type CampoExtra = { chave: string; rotulo: string; tipo: "texto" | "area" | "icone" };
type ExtraInfo = { chave: string; titulo: string; itemNome: string; ajuda: string; simples?: boolean; campos?: CampoExtra[] };
type ItemExtra = string | Record<string, string>;

const ICONES = [
  { valor: "Heart", nome: "Coração" },
  { valor: "Users", nome: "Pessoas" },
  { valor: "BookOpen", nome: "Livro aberto" },
  { valor: "GraduationCap", nome: "Capelo" },
];

const extrasInfo: Record<string, ExtraInfo> = {
  visao: {
    chave: "pilares",
    titulo: "Pilares (os blocos da página Visão)",
    itemNome: "Pilar",
    ajuda: "Cada pilar aparece como um bloco com ícone, título, referência bíblica e descrição.",
    campos: [
      { chave: "titulo", rotulo: "Título", tipo: "texto" },
      { chave: "referencia", rotulo: "Referência bíblica", tipo: "texto" },
      { chave: "descricao", rotulo: "Descrição", tipo: "area" },
      { chave: "icone", rotulo: "Ícone", tipo: "icone" },
    ],
  },
  missao: {
    chave: "itens",
    titulo: "Itens da missão",
    itemNome: "Item",
    ajuda: "Cada item aparece como uma linha da lista na página Missão.",
    simples: true,
  },
  "o-que-cremos": {
    chave: "crencas",
    titulo: "Declarações de fé",
    itemNome: "Declaração",
    ajuda: "Cada declaração aparece com o título em destaque e o texto abaixo.",
    campos: [
      { chave: "titulo", rotulo: "Título", tipo: "texto" },
      { chave: "texto", rotulo: "Texto", tipo: "area" },
    ],
  },
};

const lerItens = (extra: unknown, info: ExtraInfo): ItemExtra[] => {
  const lista = extra && typeof extra === "object" ? (extra as Record<string, unknown>)[info.chave] : undefined;
  if (!Array.isArray(lista)) return [];
  return lista.map((item) => {
    if (info.simples) return typeof item === "string" ? item : "";
    const registro = item && typeof item === "object" ? (item as Record<string, unknown>) : {};
    return Object.fromEntries((info.campos ?? []).map((c) => [c.chave, typeof registro[c.chave] === "string" ? (registro[c.chave] as string) : ""]));
  });
};

const limparItens = (itens: ItemExtra[], info: ExtraInfo): ItemExtra[] =>
  itens
    .map((item) => (typeof item === "string" ? item.trim() : Object.fromEntries(Object.entries(item).map(([k, v]) => [k, v.trim()]))))
    .filter((item) =>
      typeof item === "string" ? item !== "" : (info.campos ?? []).some((c) => c.tipo !== "icone" && item[c.chave] !== "")
    );

const ListaExtra = ({ info, itens, onChange }: { info: ExtraInfo; itens: ItemExtra[]; onChange: (itens: ItemExtra[]) => void }) => {
  const mover = (i: number, passo: number) => {
    const j = i + passo;
    if (j < 0 || j >= itens.length) return;
    const novo = [...itens];
    [novo[i], novo[j]] = [novo[j], novo[i]];
    onChange(novo);
  };
  const itemVazio = (): ItemExtra =>
    info.simples ? "" : Object.fromEntries((info.campos ?? []).map((c) => [c.chave, c.tipo === "icone" ? ICONES[0].valor : ""]));
  const mudar = (i: number, chave: string | null, valor: string) =>
    onChange(itens.map((item, j) => (j !== i ? item : chave === null ? valor : { ...(item as Record<string, string>), [chave]: valor })));

  return (
    <section aria-label={info.titulo}>
      <h3 className="font-display text-lg font-semibold">{info.titulo}</h3>
      <p className="text-sm text-muted-foreground mt-1">{info.ajuda}</p>
      <div className="mt-3 space-y-4">
        {itens.map((item, i) => (
          <div key={i} className="rounded-md bg-secondary p-4 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <span className="font-semibold">{info.itemNome} {i + 1}</span>
              <div className="flex gap-1">
                <Button type="button" variant="ghost" size="icon" aria-label={`Subir ${info.itemNome.toLowerCase()} ${i + 1}`} disabled={i === 0} onClick={() => mover(i, -1)}>
                  <ArrowUp className="h-4 w-4" />
                </Button>
                <Button type="button" variant="ghost" size="icon" aria-label={`Descer ${info.itemNome.toLowerCase()} ${i + 1}`} disabled={i === itens.length - 1} onClick={() => mover(i, 1)}>
                  <ArrowDown className="h-4 w-4" />
                </Button>
                <Button type="button" variant="ghost" size="icon" aria-label={`Remover ${info.itemNome.toLowerCase()} ${i + 1}`} onClick={() => onChange(itens.filter((_, j) => j !== i))}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {info.simples ? (
              <Textarea aria-label={`Texto do ${info.itemNome.toLowerCase()} ${i + 1}`} rows={3} value={item as string} onChange={(e) => mudar(i, null, e.target.value)} />
            ) : (
              (info.campos ?? []).map((c) => {
                const id = `extra-${i}-${c.chave}`;
                const valor = (item as Record<string, string>)[c.chave] ?? "";
                return (
                  <div key={c.chave}>
                    <Label htmlFor={id}>{c.rotulo}</Label>
                    {c.tipo === "area" ? (
                      <Textarea id={id} rows={3} value={valor} onChange={(e) => mudar(i, c.chave, e.target.value)} />
                    ) : c.tipo === "icone" ? (
                      <select
                        id={id}
                        value={valor}
                        onChange={(e) => mudar(i, c.chave, e.target.value)}
                        className="flex h-12 w-full rounded-md border border-input bg-background px-3 text-base"
                      >
                        {ICONES.map((ic) => (
                          <option key={ic.valor} value={ic.valor}>{ic.nome}</option>
                        ))}
                      </select>
                    ) : (
                      <Input id={id} value={valor} onChange={(e) => mudar(i, c.chave, e.target.value)} />
                    )}
                  </div>
                );
              })
            )}
          </div>
        ))}
        {itens.length === 0 && <p className="text-sm text-muted-foreground">Nenhum item cadastrado. O site mostra o texto padrão até você adicionar o primeiro.</p>}
        <Button type="button" variant="outline" onClick={() => onChange([...itens, itemVazio()])}>
          <Plus className="h-4 w-4 mr-1" /> Adicionar {info.itemNome.toLowerCase()}
        </Button>
      </div>
    </section>
  );
};

const AdminConteudos = () => {
  const { toast } = useToast();
  const [conteudos, setConteudos] = useState<ConteudoPagina[]>([]);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<ConteudoPagina | null>(null);
  const [carregado, setCarregado] = useState(false);

  const [form, setForm] = useState({
    titulo: "",
    subtitulo: "",
    conteudo: "",
  });
  const [contato, setContato] = useState<Contato>(CONTATO_PADRAO);
  const [itensExtra, setItensExtra] = useState<ItemExtra[]>([]);

  const editandoContato = editing?.pagina === CONTATO_PAGINA;
  const extraInfo = editing ? extrasInfo[editing.pagina] : undefined;

  const fetchConteudos = useCallback(async () => {
    try {
      const data = await conteudosService.getAll();
      setConteudos(data);
      setCarregado(true);
    } catch (error) {
      toast({
        title: "Erro ao carregar conteúdos",
        description: error instanceof Error ? error.message : "Ocorreu um erro",
        variant: "destructive",
      });
    }
  }, [toast]);

  useEffect(() => {
    fetchConteudos();
  }, [fetchConteudos]);

  const openEdit = (conteudo: ConteudoPagina) => {
    setEditing(conteudo);
    setForm({
      titulo: conteudo.titulo,
      subtitulo: conteudo.subtitulo || "",
      conteudo: conteudo.conteudo,
    });
    setContato(mesclarContato(conteudo.conteudoExtra));
    const info = extrasInfo[conteudo.pagina];
    setItensExtra(info ? lerItens(conteudo.conteudoExtra, info) : []);
    setModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;

    if (editandoContato) {
      const mapaUrl = extrairMapaUrl(contato.mapaUrl);
      if (!mapaUrl.startsWith(MAPA_PREFIXO)) {
        toast({
          title: "Mapa inválido",
          description: "Cole o código de \"Incorporar um mapa\" do Google Maps (começa com <iframe ...>).",
          variant: "destructive",
        });
        return;
      }
    }

    try {
      await conteudosService.update(editing.pagina, {
        titulo: form.titulo,
        subtitulo: form.subtitulo || null,
        conteudo: form.conteudo,
        ...(extraInfo && {
          // Mantém as outras chaves que a página já tinha em conteudoExtra
          conteudoExtra: {
            ...(editing.conteudoExtra && typeof editing.conteudoExtra === "object" ? (editing.conteudoExtra as Record<string, unknown>) : {}),
            [extraInfo.chave]: limparItens(itensExtra, extraInfo),
          },
        }),
        ...(editandoContato && {
          conteudoExtra: {
            ...contato,
            instagram: contato.instagram.replace(/^@/, "").trim(),
            mapaUrl: extrairMapaUrl(contato.mapaUrl),
            horarios: contato.horarios.filter((h) => h.dia.trim() && h.descricao.trim()),
          },
        }),
      });
      toast({ title: "Conteúdo atualizado!" });
      setModal(false);
      setEditing(null);
      fetchConteudos();
    } catch (error) {
      toast({
        title: "Erro ao atualizar",
        description: error instanceof Error ? error.message : "Ocorreu um erro",
        variant: "destructive",
      });
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="font-display text-xl font-semibold">Conteúdos das Páginas</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Edite os textos das páginas institucionais
        </p>
      </div>

      <div className="space-y-3">
        {conteudos.filter((c) => c.pagina !== "tema").map((c) => (
          <div key={c.id} className="bg-card border border-border rounded-lg p-4 flex items-center gap-4">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <FileText className="h-5 w-5 text-primary" />
            </div>

            <div className="flex-1 min-w-0">
              <p className="font-semibold">{paginasInfo[c.pagina]?.label || c.pagina}</p>
              <p className="text-sm text-muted-foreground">{paginasInfo[c.pagina]?.description}</p>
            </div>

            <Button variant="ghost" size="icon" onClick={() => openEdit(c)}>
              <Pencil className="h-4 w-4" />
            </Button>
          </div>
        ))}
        {carregado && conteudos.length === 0 && (
          <p className="text-center text-muted-foreground py-8">
            Nenhum texto cadastrado ainda. Rode o seed (<code>pnpm db:seed</code>, ou reinicie o serviço prisma-migrate no Docker) para criar os textos padrão.
          </p>
        )}
      </div>

      {/* Modal */}
      <Dialog open={modal} onOpenChange={(open) => { setModal(open); if (!open) setEditing(null); }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Editar {editing && paginasInfo[editing.pagina]?.label}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4">
            {editandoContato ? (
              <>
                <div>
                  <Label htmlFor="contato-endereco">Endereço</Label>
                  <Textarea
                    id="contato-endereco"
                    value={contato.endereco}
                    onChange={(e) => setContato({ ...contato, endereco: e.target.value })}
                    rows={3}
                  />
                  <p className="text-xs text-muted-foreground mt-1">Uma linha para cada parte (rua, bairro, CEP)</p>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="contato-telefone">Telefone</Label>
                    <Input
                      id="contato-telefone"
                      value={contato.telefone}
                      onChange={(e) => setContato({ ...contato, telefone: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="contato-email">E-mail</Label>
                    <Input
                      id="contato-email"
                      type="email"
                      value={contato.email}
                      onChange={(e) => setContato({ ...contato, email: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="contato-instagram">Instagram (usuário)</Label>
                  <Input
                    id="contato-instagram"
                    value={contato.instagram}
                    onChange={(e) => setContato({ ...contato, instagram: e.target.value })}
                    placeholder="tbbjacarei"
                  />
                </div>
                <div>
                  <Label>Horários</Label>
                  <div className="space-y-2 mt-1">
                    {contato.horarios.map((h, i) => (
                      <div key={i} className="flex gap-2">
                        <Input
                          aria-label="Dia"
                          className="w-36 shrink-0"
                          placeholder="Domingo"
                          value={h.dia}
                          onChange={(e) =>
                            setContato({
                              ...contato,
                              horarios: contato.horarios.map((x, j) => (j === i ? { ...x, dia: e.target.value } : x)),
                            })
                          }
                        />
                        <Input
                          aria-label="Descrição do horário"
                          placeholder="10h (EBD) e 18h (Culto)"
                          value={h.descricao}
                          onChange={(e) =>
                            setContato({
                              ...contato,
                              horarios: contato.horarios.map((x, j) =>
                                j === i ? { ...x, descricao: e.target.value } : x
                              ),
                            })
                          }
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          aria-label="Remover horário"
                          onClick={() =>
                            setContato({ ...contato, horarios: contato.horarios.filter((_, j) => j !== i) })
                          }
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setContato({ ...contato, horarios: [...contato.horarios, { dia: "", descricao: "" }] })
                      }
                    >
                      <Plus className="h-4 w-4 mr-1" /> Adicionar horário
                    </Button>
                  </div>
                </div>
                <div>
                  <Label htmlFor="contato-mapa">Mapa (Google Maps)</Label>
                  <Textarea
                    id="contato-mapa"
                    value={contato.mapaUrl}
                    onChange={(e) => setContato({ ...contato, mapaUrl: e.target.value })}
                    rows={3}
                    className="font-mono text-xs"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    No Google Maps: Compartilhar → Incorporar um mapa → Copiar HTML, e cole aqui.
                  </p>
                </div>
              </>
            ) : (
              <>
                <div>
                  <Label htmlFor="conteudo-titulo">Título</Label>
                  <Input
                    id="conteudo-titulo"
                    value={form.titulo}
                    onChange={(e) => setForm({ ...form, titulo: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="conteudo-subtitulo">Subtítulo</Label>
                  <Input
                    id="conteudo-subtitulo"
                    value={form.subtitulo}
                    onChange={(e) => setForm({ ...form, subtitulo: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="conteudo-texto">Conteúdo</Label>
                  <Textarea
                    id="conteudo-texto"
                    value={form.conteudo}
                    onChange={(e) => setForm({ ...form, conteudo: e.target.value })}
                    rows={12}
                    className="font-mono text-sm"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Use linhas em branco para separar parágrafos
                  </p>
                </div>
                {extraInfo && <ListaExtra info={extraInfo} itens={itensExtra} onChange={setItensExtra} />}
              </>
            )}

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setModal(false)}>
                Cancelar
              </Button>
              <Button type="submit">Salvar</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminConteudos;
