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
import { Plus, Trash2, Pencil, Upload, GripVertical } from "lucide-react";

interface Pastor {
  id: string;
  nome: string;
  funcao: string;
  bio: string | null;
  foto_url: string | null;
  ordem: number;
  ativo: boolean;
}

const AdminPastores = () => {
  const { toast } = useToast();
  const [pastores, setPastores] = useState<Pastor[]>([]);
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
    funcao: "",
    bio: "",
    foto_url: "",
  });

  useEffect(() => {
    fetchPastores();
  }, []);

  const fetchPastores = async () => {
    const { data } = await supabase
      .from("pastores")
      .select("*")
      .order("ordem", { ascending: true });
    if (data) setPastores(data);
  };

  const resetForm = () => {
    setForm({ nome: "", funcao: "", bio: "", foto_url: "" });
    setEditingId(null);
  };

  const openEdit = (pastor: Pastor) => {
    setForm({
      nome: pastor.nome,
      funcao: pastor.funcao,
      bio: pastor.bio || "",
      foto_url: pastor.foto_url || "",
    });
    setEditingId(pastor.id);
    setModal(true);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const fileExt = file.name.split(".").pop();
    const fileName = `pastores/${Date.now()}.${fileExt}`;

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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = {
      nome: form.nome,
      funcao: form.funcao,
      bio: form.bio || null,
      foto_url: form.foto_url || null,
    };

    if (editingId) {
      const { error } = await supabase.from("pastores").update(data).eq("id", editingId);
      if (error) {
        toast({ title: "Erro ao atualizar", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Pastor atualizado!" });
        setModal(false);
        resetForm();
        fetchPastores();
      }
    } else {
      const maxOrdem = pastores.length > 0 ? Math.max(...pastores.map((p) => p.ordem)) : 0;
      const { error } = await supabase.from("pastores").insert({
        ...data,
        ordem: maxOrdem + 1,
      });
      if (error) {
        toast({ title: "Erro ao cadastrar", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Pastor cadastrado!" });
        setModal(false);
        resetForm();
        fetchPastores();
      }
    }
  };

  const handleDelete = async () => {
    const { error } = await supabase.from("pastores").delete().eq("id", deleteDialog.id);
    if (error) {
      toast({ title: "Erro ao remover", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Pastor removido" });
      fetchPastores();
    }
    setDeleteDialog({ open: false, id: "", name: "" });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-display text-xl font-semibold">Pastores ({pastores.length})</h2>
        <Button onClick={() => { resetForm(); setModal(true); }}>
          <Plus className="h-4 w-4 mr-2" /> Novo Pastor
        </Button>
      </div>

      <div className="space-y-3">
        {pastores.map((p) => (
          <div key={p.id} className="bg-card border border-border rounded-lg p-4 flex items-center gap-4">
            <GripVertical className="h-5 w-5 text-muted-foreground cursor-move" />
            
            <div className="h-12 w-12 rounded-full bg-primary/10 overflow-hidden shrink-0">
              {p.foto_url ? (
                <img src={p.foto_url} alt={p.nome} className="h-full w-full object-cover" />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-primary text-lg font-bold">
                  {p.nome.charAt(0)}
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <p className="font-semibold truncate">{p.nome}</p>
              <p className="text-sm text-muted-foreground">{p.funcao}</p>
            </div>

            <div className="flex gap-1 shrink-0">
              <Button variant="ghost" size="icon" onClick={() => openEdit(p)}>
                <Pencil className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setDeleteDialog({ open: true, id: p.id, name: p.nome })}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          </div>
        ))}
        {pastores.length === 0 && (
          <p className="text-center text-muted-foreground py-8">Nenhum pastor cadastrado</p>
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
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? "Editar Pastor" : "Novo Pastor"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="flex justify-center">
              <div className="relative">
                <div className="h-24 w-24 rounded-full bg-primary/10 overflow-hidden">
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
              <Label htmlFor="pastor-nome">Nome *</Label>
              <Input
                id="pastor-nome"
                value={form.nome}
                onChange={(e) => setForm({ ...form, nome: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="pastor-funcao">Função *</Label>
              <Input
                id="pastor-funcao"
                value={form.funcao}
                onChange={(e) => setForm({ ...form, funcao: e.target.value })}
                placeholder="Ex: Pastor Titular"
                required
              />
            </div>
            <div>
              <Label htmlFor="pastor-bio">Biografia</Label>
              <Textarea
                id="pastor-bio"
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                rows={3}
              />
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

export default AdminPastores;
