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
import { Pencil, FileText, Plus, Trash2 } from "lucide-react";
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

  const editandoContato = editing?.pagina === CONTATO_PAGINA;

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
