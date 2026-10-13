import { useState, useEffect } from "react";
import { pastoresService, uploadService } from "@/lib/api";
import { Pastor } from "shared";
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
    fotoUrl: "",
  });

  useEffect(() => {
    fetchPastores();
  }, []);

  const fetchPastores = async () => {
    try {
      const data = await pastoresService.getAll();
      setPastores(data);
    } catch (error) {
      toast({
        title: "Erro ao carregar pastores",
        description: error instanceof Error ? error.message : "Ocorreu um erro",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setForm({ nome: "", funcao: "", bio: "", fotoUrl: "" });
    setEditingId(null);
  };

  const openEdit = (pastor: Pastor) => {
    setForm({
      nome: pastor.nome,
      funcao: pastor.funcao,
      bio: pastor.bio || "",
      fotoUrl: pastor.fotoUrl || "",
    });
    setEditingId(pastor.id);
    setModal(true);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const response = await uploadService.uploadFile(file);
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      setForm({ ...form, fotoUrl: `${apiUrl}${response.url}` });
      toast({ title: "Foto enviada!" });
    } catch (error) {
      toast({
        title: "Erro ao fazer upload",
        description: error instanceof Error ? error.message : "Ocorreu um erro",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const data = {
        nome: form.nome,
        funcao: form.funcao,
        bio: form.bio || null,
        fotoUrl: form.fotoUrl || null,
      };

      if (editingId) {
        await pastoresService.update(editingId, data);
        toast({ title: "Pastor atualizado!" });
      } else {
        const maxOrdem = pastores.length > 0 ? Math.max(...pastores.map((p) => p.ordem)) : 0;
        await pastoresService.create({
          ...data,
          ordem: maxOrdem + 1,
          ativo: true,
        });
        toast({ title: "Pastor cadastrado!" });
      }
      setModal(false);
      resetForm();
      fetchPastores();
    } catch (error) {
      toast({
        title: editingId ? "Erro ao atualizar" : "Erro ao cadastrar",
        description: error instanceof Error ? error.message : "Ocorreu um erro",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    try {
      await pastoresService.delete(deleteDialog.id);
      toast({ title: "Pastor removido" });
      fetchPastores();
    } catch (error) {
      toast({
        title: "Erro ao remover",
        description: error instanceof Error ? error.message : "Ocorreu um erro",
        variant: "destructive",
      });
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
              {p.fotoUrl ? (
                <img src={p.fotoUrl} alt={p.nome} className="h-full w-full object-cover" />
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
                  {form.fotoUrl ? (
                    <img src={form.fotoUrl} alt="Preview" className="h-full w-full object-cover" />
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
