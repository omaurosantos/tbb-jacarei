import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
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
import { Pencil, FileText } from "lucide-react";

interface ConteudoPagina {
  id: string;
  pagina: string;
  titulo: string;
  subtitulo: string | null;
  conteudo: string;
  conteudo_extra: any;
}

const paginasInfo: Record<string, { label: string; description: string }> = {
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

  const [form, setForm] = useState({
    titulo: "",
    subtitulo: "",
    conteudo: "",
  });

  useEffect(() => {
    fetchConteudos();
  }, []);

  const fetchConteudos = async () => {
    const { data } = await supabase
      .from("conteudos_paginas")
      .select("*")
      .order("pagina", { ascending: true });
    if (data) setConteudos(data);
  };

  const openEdit = (conteudo: ConteudoPagina) => {
    setEditing(conteudo);
    setForm({
      titulo: conteudo.titulo,
      subtitulo: conteudo.subtitulo || "",
      conteudo: conteudo.conteudo,
    });
    setModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;

    const { error } = await supabase
      .from("conteudos_paginas")
      .update({
        titulo: form.titulo,
        subtitulo: form.subtitulo || null,
        conteudo: form.conteudo,
      })
      .eq("id", editing.id);

    if (error) {
      toast({ title: "Erro ao atualizar", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Conteúdo atualizado!" });
      setModal(false);
      setEditing(null);
      fetchConteudos();
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
        {conteudos.map((c) => (
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
        {conteudos.length === 0 && (
          <p className="text-center text-muted-foreground py-8">Nenhum conteúdo encontrado</p>
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
