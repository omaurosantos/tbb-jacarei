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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Pencil, Upload, X } from "lucide-react";

interface Ministerio {
  id: string;
  nome: string;
  descricao: string;
  descricao_completa: string | null;
  icone: string;
  foto_url: string | null;
  ordem: number;
  ativo: boolean;
  lideres?: { id: string; nome: string; ordem: number }[];
}

interface AdminMinisteriosProps {
  userId: string | undefined;
}

const icones = [
  "Sprout", "Megaphone", "Users", "Shield", "Heart", "Baby", "Music", "BookOpen", "Mic", "Hand"
];

const AdminMinisterios = ({ userId }: AdminMinisteriosProps) => {
  const { toast } = useToast();
  const [ministerios, setMinisterios] = useState<Ministerio[]>([]);
  const [modal, setModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; id: string; name: string }>({
    open: false,
    id: "",
    name: "",
  });

  const [form, setForm] = useState({
    nome: "",
    descricao: "",
    descricao_completa: "",
    icone: "Users",
    foto_url: "",
    lideres: [] as string[],
  });

  const [novoLider, setNovoLider] = useState("");

  useEffect(() => {
    fetchMinisterios();
  }, []);

  const fetchMinisterios = async () => {
    const { data: ministeriosData } = await supabase
      .from("ministerios")
      .select("*")
      .order("ordem", { ascending: true });

    if (ministeriosData) {
      // Fetch leaders for each ministry
      const ministeriosWithLideres = await Promise.all(
        ministeriosData.map(async (m) => {
          const { data: lideresData } = await supabase
            .from("ministerios_lideres")
            .select("*")
            .eq("ministerio_id", m.id)
            .order("ordem", { ascending: true });
          return { ...m, lideres: lideresData || [] };
        })
      );
      setMinisterios(ministeriosWithLideres);
    }
  };

  const resetForm = () => {
    setForm({ nome: "", descricao: "", descricao_completa: "", icone: "Users", foto_url: "", lideres: [] });
    setNovoLider("");
    setEditingId(null);
  };

  const openEdit = (ministerio: Ministerio) => {
    setForm({
      nome: ministerio.nome,
      descricao: ministerio.descricao,
      descricao_completa: ministerio.descricao_completa || "",
      icone: ministerio.icone,
      foto_url: ministerio.foto_url || "",
      lideres: ministerio.lideres?.map((l) => l.nome) || [],
    });
    setEditingId(ministerio.id);
    setModal(true);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const fileExt = file.name.split(".").pop();
    const fileName = `ministerios/${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("fotos")
      .upload(fileName, file);

    if (uploadError) {
      toast({ title: "Erro ao fazer upload", description: uploadError.message, variant: "destructive" });
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage.from("fotos").getPublicUrl(fileName);
    setForm({ ...form, foto_url: urlData.publicUrl });
    setUploading(false);
    toast({ title: "Foto enviada!" });
  };

  const addLider = () => {
    if (novoLider.trim() && !form.lideres.includes(novoLider.trim())) {
      setForm({ ...form, lideres: [...form.lideres, novoLider.trim()] });
      setNovoLider("");
    }
  };

  const removeLider = (nome: string) => {
    setForm({ ...form, lideres: form.lideres.filter((l) => l !== nome) });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = {
      nome: form.nome,
      descricao: form.descricao,
      descricao_completa: form.descricao_completa || null,
      icone: form.icone,
      foto_url: form.foto_url || null,
    };

    if (editingId) {
      const { error } = await supabase.from("ministerios").update(data).eq("id", editingId);
      if (error) {
        toast({ title: "Erro ao atualizar", description: error.message, variant: "destructive" });
        return;
      }

      // Update leaders
      await supabase.from("ministerios_lideres").delete().eq("ministerio_id", editingId);
      if (form.lideres.length > 0) {
        await supabase.from("ministerios_lideres").insert(
          form.lideres.map((nome, index) => ({
            ministerio_id: editingId,
            nome,
            ordem: index,
          }))
        );
      }

      toast({ title: "Ministério atualizado!" });
      setModal(false);
      resetForm();
      fetchMinisterios();
    } else {
      const maxOrdem = ministerios.length > 0 ? Math.max(...ministerios.map((m) => m.ordem)) : 0;
      const { data: newMinisterio, error } = await supabase
        .from("ministerios")
        .insert({ ...data, ordem: maxOrdem + 1, created_by: userId })
        .select()
        .single();

      if (error || !newMinisterio) {
        toast({ title: "Erro ao cadastrar", description: error?.message, variant: "destructive" });
        return;
      }

      // Add leaders
      if (form.lideres.length > 0) {
        await supabase.from("ministerios_lideres").insert(
          form.lideres.map((nome, index) => ({
            ministerio_id: newMinisterio.id,
            nome,
            ordem: index,
          }))
        );
      }

      toast({ title: "Ministério cadastrado!" });
      setModal(false);
      resetForm();
      fetchMinisterios();
    }
  };

  const handleDelete = async () => {
    const { error } = await supabase.from("ministerios").delete().eq("id", deleteDialog.id);
    if (error) {
      toast({ title: "Erro ao remover", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Ministério removido" });
      fetchMinisterios();
    }
    setDeleteDialog({ open: false, id: "", name: "" });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-display text-xl font-semibold">Ministérios ({ministerios.length})</h2>
        <Button onClick={() => { resetForm(); setModal(true); }}>
          <Plus className="h-4 w-4 mr-2" /> Novo Ministério
        </Button>
      </div>

      <div className="space-y-3">
        {ministerios.map((m) => (
          <div key={m.id} className="bg-card border border-border rounded-lg p-4 flex items-center gap-4">
            <div className="h-12 w-12 rounded-lg bg-primary/10 overflow-hidden shrink-0">
              {m.foto_url ? (
                <img src={m.foto_url} alt={m.nome} className="h-full w-full object-cover" />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-primary font-bold">
                  {m.nome.charAt(0)}
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <p className="font-semibold truncate">{m.nome}</p>
              <p className="text-sm text-muted-foreground truncate">{m.descricao}</p>
              {m.lideres && m.lideres.length > 0 && (
                <p className="text-xs text-primary mt-1">
                  Líderes: {m.lideres.map((l) => l.nome).join(", ")}
                </p>
              )}
            </div>

            <div className="flex gap-1 shrink-0">
              <Button variant="ghost" size="icon" onClick={() => openEdit(m)}>
                <Pencil className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setDeleteDialog({ open: true, id: m.id, name: m.nome })}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          </div>
        ))}
        {ministerios.length === 0 && (
          <p className="text-center text-muted-foreground py-8">Nenhum ministério cadastrado</p>
        )}
      </div>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ ...deleteDialog, open })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir <strong>"{deleteDialog.name}"</strong>?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Modal */}
      <Dialog open={modal} onOpenChange={(open) => { setModal(open); if (!open) resetForm(); }}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? "Editar Ministério" : "Novo Ministério"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="flex justify-center">
              <div className="relative">
                <div className="h-24 w-24 rounded-lg bg-primary/10 overflow-hidden">
                  {form.foto_url ? (
                    <img src={form.foto_url} alt="Preview" className="h-full w-full object-cover" />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-primary">
                      <Upload className="h-8 w-8" />
                    </div>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  disabled={uploading}
                />
              </div>
            </div>
            <p className="text-center text-sm text-muted-foreground">
              {uploading ? "Enviando..." : "Clique para adicionar foto"}
            </p>

            <div>
              <Label htmlFor="min-nome">Nome *</Label>
              <Input
                id="min-nome"
                value={form.nome}
                onChange={(e) => setForm({ ...form, nome: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="min-icone">Ícone</Label>
              <select
                id="min-icone"
                value={form.icone}
                onChange={(e) => setForm({ ...form, icone: e.target.value })}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                {icones.map((icone) => (
                  <option key={icone} value={icone}>{icone}</option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="min-descricao">Descrição curta *</Label>
              <Input
                id="min-descricao"
                value={form.descricao}
                onChange={(e) => setForm({ ...form, descricao: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="min-descricao-completa">Descrição completa</Label>
              <Textarea
                id="min-descricao-completa"
                value={form.descricao_completa}
                onChange={(e) => setForm({ ...form, descricao_completa: e.target.value })}
                rows={3}
              />
            </div>

            <div>
              <Label>Líderes</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  value={novoLider}
                  onChange={(e) => setNovoLider(e.target.value)}
                  placeholder="Nome do líder"
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addLider(); } }}
                />
                <Button type="button" variant="outline" onClick={addLider}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {form.lideres.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {form.lideres.map((lider) => (
                    <span
                      key={lider}
                      className="inline-flex items-center gap-1 bg-primary/10 text-primary px-2 py-1 rounded text-sm"
                    >
                      {lider}
                      <button type="button" onClick={() => removeLider(lider)}>
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setModal(false)}>
                Cancelar
              </Button>
              <Button type="submit">
                {editingId ? "Salvar" : "Adicionar"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminMinisterios;
