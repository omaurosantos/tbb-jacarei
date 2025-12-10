import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { Plus, Trash2, LogOut, Pencil, Users, Shield, User as UserIcon } from "lucide-react";
import { User, Session } from "@supabase/supabase-js";
import AdminPastores from "@/components/admin/AdminPastores";
import AdminMinisterios from "@/components/admin/AdminMinisterios";
import AdminConteudos from "@/components/admin/AdminConteudos";

interface Sermao {
  id: string;
  titulo: string;
  pregador: string;
  data: string;
  texto_base: string | null;
  link_youtube: string | null;
  link_spotify: string | null;
  resumo: string | null;
}

interface AulaEBD {
  id: string;
  titulo: string;
  professor: string;
  data: string;
  classe: "Homens" | "Belas" | "Adolescentes";
  texto_base: string | null;
  link_pdf: string | null;
  resumo: string | null;
}

interface Evento {
  id: string;
  nome: string;
  data: string;
  horario: string | null;
  local: string;
  descricao: string | null;
}

interface UserProfile {
  id: string;
  user_id: string;
  nome: string;
  email: string;
  role: "admin" | "editor" | null;
}

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState("sermoes");

  // Modal states
  const [sermaoModal, setSermaoModal] = useState(false);
  const [aulaModal, setAulaModal] = useState(false);
  const [eventoModal, setEventoModal] = useState(false);
  const [userModal, setUserModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Delete confirmation states
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    type: "sermao" | "aula" | "evento" | "user";
    id: string;
    name: string;
  }>({ open: false, type: "sermao", id: "", name: "" });

  // Data states
  const [sermoes, setSermoes] = useState<Sermao[]>([]);
  const [aulas, setAulas] = useState<AulaEBD[]>([]);
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);

  // Form states
  const [sermaoForm, setSermaoForm] = useState({
    titulo: "",
    pregador: "",
    data: "",
    texto_base: "",
    link_youtube: "",
    link_spotify: "",
    resumo: "",
  });

  const [aulaForm, setAulaForm] = useState({
    titulo: "",
    professor: "",
    data: "",
    link_pdf: "",
    resumo: "",
    texto_base: "",
    classe: "Homens" as "Homens" | "Belas" | "Adolescentes",
  });

  const [eventoForm, setEventoForm] = useState({
    nome: "",
    data: "",
    horario: "",
    descricao: "",
    local: "",
  });

  const [userForm, setUserForm] = useState({
    nome: "",
    email: "",
    password: "",
    role: "editor" as "admin" | "editor",
  });

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/areasegura/login");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      fetchData();
      checkAdminRole();
    }
  }, [user]);

  const checkAdminRole = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .maybeSingle();
    
    setIsAdmin(!!data);
  };

  const fetchData = async () => {
    const [sermoesRes, aulasRes, eventosRes] = await Promise.all([
      supabase.from("sermoes").select("*").order("data", { ascending: false }),
      supabase.from("aulas_ebd").select("*").order("data", { ascending: false }),
      supabase.from("eventos").select("*").order("data", { ascending: false }),
    ]);

    if (sermoesRes.data) setSermoes(sermoesRes.data);
    if (aulasRes.data) setAulas(aulasRes.data);
    if (eventosRes.data) setEventos(eventosRes.data);

    // Fetch users if admin
    const { data: profilesData } = await supabase
      .from("profiles")
      .select("id, user_id, nome, email");

    if (profilesData) {
      const { data: rolesData } = await supabase
        .from("user_roles")
        .select("user_id, role");

      const usersWithRoles = profilesData.map((p) => ({
        ...p,
        role: rolesData?.find((r) => r.user_id === p.user_id)?.role || null,
      }));

      setUsers(usersWithRoles);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/areasegura/login");
  };

  // Reset forms
  const resetSermaoForm = () => {
    setSermaoForm({ titulo: "", pregador: "", data: "", texto_base: "", link_youtube: "", link_spotify: "", resumo: "" });
    setEditingId(null);
  };

  const resetAulaForm = () => {
    setAulaForm({ titulo: "", professor: "", data: "", link_pdf: "", resumo: "", texto_base: "", classe: "Homens" });
    setEditingId(null);
  };

  const resetEventoForm = () => {
    setEventoForm({ nome: "", data: "", horario: "", descricao: "", local: "" });
    setEditingId(null);
  };

  const resetUserForm = () => {
    setUserForm({ nome: "", email: "", password: "", role: "editor" });
  };

  // Open modals for edit
  const openEditSermao = (sermao: Sermao) => {
    setSermaoForm({
      titulo: sermao.titulo,
      pregador: sermao.pregador,
      data: sermao.data,
      texto_base: sermao.texto_base || "",
      link_youtube: sermao.link_youtube || "",
      link_spotify: sermao.link_spotify || "",
      resumo: sermao.resumo || "",
    });
    setEditingId(sermao.id);
    setSermaoModal(true);
  };

  const openEditAula = (aula: AulaEBD) => {
    setAulaForm({
      titulo: aula.titulo,
      professor: aula.professor,
      data: aula.data,
      classe: aula.classe,
      texto_base: aula.texto_base || "",
      link_pdf: aula.link_pdf || "",
      resumo: aula.resumo || "",
    });
    setEditingId(aula.id);
    setAulaModal(true);
  };

  const openEditEvento = (evento: Evento) => {
    setEventoForm({
      nome: evento.nome,
      data: evento.data,
      horario: evento.horario || "",
      descricao: evento.descricao || "",
      local: evento.local,
    });
    setEditingId(evento.id);
    setEventoModal(true);
  };

  // Confirmation dialogs
  const confirmDelete = (type: "sermao" | "aula" | "evento" | "user", id: string, name: string) => {
    setDeleteDialog({ open: true, type, id, name });
  };

  const handleConfirmDelete = async () => {
    const { type, id } = deleteDialog;
    
    if (type === "sermao") {
      const { error } = await supabase.from("sermoes").delete().eq("id", id);
      if (error) {
        toast({ title: "Erro ao remover", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Sermão removido" });
        fetchData();
      }
    } else if (type === "aula") {
      const { error } = await supabase.from("aulas_ebd").delete().eq("id", id);
      if (error) {
        toast({ title: "Erro ao remover", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Aula removida" });
        fetchData();
      }
    } else if (type === "evento") {
      const { error } = await supabase.from("eventos").delete().eq("id", id);
      if (error) {
        toast({ title: "Erro ao remover", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Evento removido" });
        fetchData();
      }
    } else if (type === "user") {
      const { data, error } = await supabase.functions.invoke("manage-users", {
        body: { action: "delete", userId: id },
      });
      
      if (error || data?.error) {
        toast({ title: "Erro ao remover", description: data?.error || error?.message, variant: "destructive" });
      } else {
        toast({ title: "Usuário removido" });
        fetchData();
      }
    }

    setDeleteDialog({ open: false, type: "sermao", id: "", name: "" });
  };

  // Handlers
  const handleSaveSermao = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const data = {
      titulo: sermaoForm.titulo,
      pregador: sermaoForm.pregador,
      data: sermaoForm.data,
      texto_base: sermaoForm.texto_base || null,
      link_youtube: sermaoForm.link_youtube || null,
      link_spotify: sermaoForm.link_spotify || null,
      resumo: sermaoForm.resumo || null,
    };

    if (editingId) {
      const { error } = await supabase.from("sermoes").update(data).eq("id", editingId);
      if (error) {
        toast({ title: "Erro ao atualizar", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Sermão atualizado!" });
        setSermaoModal(false);
        resetSermaoForm();
        fetchData();
      }
    } else {
      const { error } = await supabase.from("sermoes").insert({ ...data, created_by: user?.id });
      if (error) {
        toast({ title: "Erro ao cadastrar", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Sermão cadastrado!" });
        setSermaoModal(false);
        resetSermaoForm();
        fetchData();
      }
    }
  };

  const handleSaveAula = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const data = {
      titulo: aulaForm.titulo,
      professor: aulaForm.professor,
      data: aulaForm.data,
      classe: aulaForm.classe,
      texto_base: aulaForm.texto_base || null,
      link_pdf: aulaForm.link_pdf || null,
      resumo: aulaForm.resumo || null,
    };

    if (editingId) {
      const { error } = await supabase.from("aulas_ebd").update(data).eq("id", editingId);
      if (error) {
        toast({ title: "Erro ao atualizar", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Aula atualizada!" });
        setAulaModal(false);
        resetAulaForm();
        fetchData();
      }
    } else {
      const { error } = await supabase.from("aulas_ebd").insert({ ...data, created_by: user?.id });
      if (error) {
        toast({ title: "Erro ao cadastrar", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Aula cadastrada!" });
        setAulaModal(false);
        resetAulaForm();
        fetchData();
      }
    }
  };

  const handleSaveEvento = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const data = {
      nome: eventoForm.nome,
      data: eventoForm.data,
      horario: eventoForm.horario || null,
      descricao: eventoForm.descricao || null,
      local: eventoForm.local,
    };

    if (editingId) {
      const { error } = await supabase.from("eventos").update(data).eq("id", editingId);
      if (error) {
        toast({ title: "Erro ao atualizar", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Evento atualizado!" });
        setEventoModal(false);
        resetEventoForm();
        fetchData();
      }
    } else {
      const { error } = await supabase.from("eventos").insert({ ...data, created_by: user?.id });
      if (error) {
        toast({ title: "Erro ao cadastrar", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Evento cadastrado!" });
        setEventoModal(false);
        resetEventoForm();
        fetchData();
      }
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();

    const { data, error } = await supabase.functions.invoke("manage-users", {
      body: {
        action: "create",
        email: userForm.email,
        password: userForm.password,
        nome: userForm.nome,
        role: userForm.role,
      },
    });

    if (error || data?.error) {
      toast({ title: "Erro ao criar usuário", description: data?.error || error?.message, variant: "destructive" });
    } else {
      toast({ title: "Usuário criado com sucesso!" });
      setUserModal(false);
      resetUserForm();
      fetchData();
    }
  };

  const handleUpdateUserRole = async (userId: string, newRole: "admin" | "editor") => {
    const { data, error } = await supabase.functions.invoke("manage-users", {
      body: { action: "update-role", userId, role: newRole },
    });

    if (error || data?.error) {
      toast({ title: "Erro ao atualizar", description: data?.error || error?.message, variant: "destructive" });
    } else {
      toast({ title: "Role atualizada!" });
      fetchData();
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString + "T00:00:00").toLocaleDateString("pt-BR");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="h-8 w-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <Layout>
      {/* Hero */}
      <section className="bg-primary text-primary-foreground py-12 md:py-16">
        <div className="container">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="text-center md:text-left">
              <h1 className="font-display text-2xl md:text-4xl font-bold">Administração</h1>
              <p className="mt-2 text-primary-foreground/80">
                Gerencie sermões, aulas e eventos da igreja
              </p>
            </div>
            <Button variant="secondary" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" /> Sair
            </Button>
          </div>
        </div>
      </section>

      {/* Admin Content */}
      <section className="py-12 md:py-16 bg-background">
        <div className="container max-w-4xl">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="flex flex-wrap h-auto gap-1 mb-8">
              <TabsTrigger value="sermoes">Sermões</TabsTrigger>
              <TabsTrigger value="ebd">Aulas EBD</TabsTrigger>
              <TabsTrigger value="agenda">Agenda</TabsTrigger>
              <TabsTrigger value="pastores">Pastores</TabsTrigger>
              <TabsTrigger value="ministerios">Ministérios</TabsTrigger>
              <TabsTrigger value="conteudos">Conteúdos</TabsTrigger>
              {isAdmin && <TabsTrigger value="usuarios">Usuários</TabsTrigger>}
            </TabsList>

            {/* Sermões */}
            <TabsContent value="sermoes">
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-display text-xl font-semibold">Sermões ({sermoes.length})</h2>
                <Button onClick={() => { resetSermaoForm(); setSermaoModal(true); }}>
                  <Plus className="h-4 w-4 mr-2" /> Novo Sermão
                </Button>
              </div>

              <div className="space-y-3">
                {sermoes.map((s) => (
                  <div key={s.id} className="bg-card border border-border rounded-lg p-4 flex justify-between items-start gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold truncate">{s.titulo}</p>
                      <p className="text-sm text-muted-foreground">
                        {s.pregador} • {formatDate(s.data)}
                      </p>
                      {s.texto_base && (
                        <p className="text-xs text-muted-foreground mt-1">{s.texto_base}</p>
                      )}
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <Button variant="ghost" size="icon" onClick={() => openEditSermao(s)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => confirmDelete("sermao", s.id, s.titulo)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))}
                {sermoes.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">Nenhum sermão cadastrado</p>
                )}
              </div>
            </TabsContent>

            {/* EBD */}
            <TabsContent value="ebd">
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-display text-xl font-semibold">Aulas EBD ({aulas.length})</h2>
                <Button onClick={() => { resetAulaForm(); setAulaModal(true); }}>
                  <Plus className="h-4 w-4 mr-2" /> Nova Aula
                </Button>
              </div>

              <div className="space-y-3">
                {aulas.map((a) => (
                  <div key={a.id} className="bg-card border border-border rounded-lg p-4 flex justify-between items-start gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold truncate">{a.titulo}</p>
                      <p className="text-sm text-muted-foreground">
                        {a.professor} • {formatDate(a.data)} • {a.classe}
                      </p>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <Button variant="ghost" size="icon" onClick={() => openEditAula(a)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => confirmDelete("aula", a.id, a.titulo)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))}
                {aulas.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">Nenhuma aula cadastrada</p>
                )}
              </div>
            </TabsContent>

            {/* Agenda */}
            <TabsContent value="agenda">
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-display text-xl font-semibold">Eventos ({eventos.length})</h2>
                <Button onClick={() => { resetEventoForm(); setEventoModal(true); }}>
                  <Plus className="h-4 w-4 mr-2" /> Novo Evento
                </Button>
              </div>

              <div className="space-y-3">
                {eventos.map((e) => (
                  <div key={e.id} className="bg-card border border-border rounded-lg p-4 flex justify-between items-start gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold truncate">{e.nome}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(e.data)} {e.horario && `• ${e.horario}`} • {e.local}
                      </p>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <Button variant="ghost" size="icon" onClick={() => openEditEvento(e)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => confirmDelete("evento", e.id, e.nome)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))}
                {eventos.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">Nenhum evento cadastrado</p>
                )}
              </div>
            </TabsContent>

            {/* Pastores */}
            <TabsContent value="pastores">
              <AdminPastores userId={user?.id} />
            </TabsContent>

            {/* Ministérios */}
            <TabsContent value="ministerios">
              <AdminMinisterios userId={user?.id} />
            </TabsContent>

            {/* Conteúdos */}
            <TabsContent value="conteudos">
              <AdminConteudos />
            </TabsContent>

            {/* Usuários */}
            {isAdmin && (
              <TabsContent value="usuarios">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="font-display text-xl font-semibold">Usuários ({users.length})</h2>
                  <Button onClick={() => { resetUserForm(); setUserModal(true); }}>
                    <Plus className="h-4 w-4 mr-2" /> Novo Usuário
                  </Button>
                </div>

                <div className="space-y-3">
                  {users.map((u) => (
                    <div key={u.id} className="bg-card border border-border rounded-lg p-4 flex justify-between items-center gap-4">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          {u.role === "admin" ? (
                            <Shield className="h-5 w-5 text-primary" />
                          ) : (
                            <UserIcon className="h-5 w-5 text-primary" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold truncate">{u.nome}</p>
                          <p className="text-sm text-muted-foreground truncate">{u.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <select
                          value={u.role || "editor"}
                          onChange={(e) => handleUpdateUserRole(u.user_id, e.target.value as "admin" | "editor")}
                          className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm"
                          disabled={u.user_id === user?.id}
                        >
                          <option value="admin">Admin</option>
                          <option value="editor">Editor</option>
                        </select>
                        {u.user_id !== user?.id && (
                          <Button variant="ghost" size="icon" onClick={() => confirmDelete("user", u.user_id, u.nome)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                  {users.length === 0 && (
                    <p className="text-center text-muted-foreground py-8">Nenhum usuário cadastrado</p>
                  )}
                </div>
              </TabsContent>
            )}
          </Tabs>
        </div>
      </section>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ ...deleteDialog, open })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir <strong>"{deleteDialog.name}"</strong>? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Modal Sermão */}
      <Dialog open={sermaoModal} onOpenChange={(open) => { setSermaoModal(open); if (!open) resetSermaoForm(); }}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? "Editar Sermão" : "Novo Sermão"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSaveSermao} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label htmlFor="sermao-titulo">Título *</Label>
                <Input
                  id="sermao-titulo"
                  value={sermaoForm.titulo}
                  onChange={(e) => setSermaoForm({ ...sermaoForm, titulo: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="sermao-pregador">Pregador *</Label>
                <Input
                  id="sermao-pregador"
                  value={sermaoForm.pregador}
                  onChange={(e) => setSermaoForm({ ...sermaoForm, pregador: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="sermao-data">Data *</Label>
                <Input
                  id="sermao-data"
                  type="date"
                  value={sermaoForm.data}
                  onChange={(e) => setSermaoForm({ ...sermaoForm, data: e.target.value })}
                  required
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="sermao-texto">Texto Base</Label>
                <Input
                  id="sermao-texto"
                  value={sermaoForm.texto_base}
                  onChange={(e) => setSermaoForm({ ...sermaoForm, texto_base: e.target.value })}
                  placeholder="Ex: João 3:16"
                />
              </div>
              <div>
                <Label htmlFor="sermao-youtube">Link YouTube</Label>
                <Input
                  id="sermao-youtube"
                  value={sermaoForm.link_youtube}
                  onChange={(e) => setSermaoForm({ ...sermaoForm, link_youtube: e.target.value })}
                  placeholder="https://youtube.com/..."
                />
              </div>
              <div>
                <Label htmlFor="sermao-spotify">Link Spotify</Label>
                <Input
                  id="sermao-spotify"
                  value={sermaoForm.link_spotify}
                  onChange={(e) => setSermaoForm({ ...sermaoForm, link_spotify: e.target.value })}
                  placeholder="https://open.spotify.com/..."
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="sermao-resumo">Resumo</Label>
                <Textarea
                  id="sermao-resumo"
                  value={sermaoForm.resumo}
                  onChange={(e) => setSermaoForm({ ...sermaoForm, resumo: e.target.value })}
                  rows={3}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setSermaoModal(false)}>
                Cancelar
              </Button>
              <Button type="submit">
                {editingId ? "Salvar" : "Adicionar"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal Aula */}
      <Dialog open={aulaModal} onOpenChange={(open) => { setAulaModal(open); if (!open) resetAulaForm(); }}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? "Editar Aula" : "Nova Aula de EBD"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSaveAula} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label htmlFor="aula-titulo">Título *</Label>
                <Input
                  id="aula-titulo"
                  value={aulaForm.titulo}
                  onChange={(e) => setAulaForm({ ...aulaForm, titulo: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="aula-professor">Professor *</Label>
                <Input
                  id="aula-professor"
                  value={aulaForm.professor}
                  onChange={(e) => setAulaForm({ ...aulaForm, professor: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="aula-data">Data *</Label>
                <Input
                  id="aula-data"
                  type="date"
                  value={aulaForm.data}
                  onChange={(e) => setAulaForm({ ...aulaForm, data: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="aula-classe">Classe *</Label>
                <select
                  id="aula-classe"
                  value={aulaForm.classe}
                  onChange={(e) => setAulaForm({ ...aulaForm, classe: e.target.value as "Homens" | "Belas" | "Adolescentes" })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  required
                >
                  <option value="Homens">Homens</option>
                  <option value="Belas">Belas</option>
                  <option value="Adolescentes">Adolescentes</option>
                </select>
              </div>
              <div>
                <Label htmlFor="aula-texto">Texto Base</Label>
                <Input
                  id="aula-texto"
                  value={aulaForm.texto_base}
                  onChange={(e) => setAulaForm({ ...aulaForm, texto_base: e.target.value })}
                  placeholder="Ex: Romanos 8:28"
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="aula-link">Link do PDF</Label>
                <Input
                  id="aula-link"
                  value={aulaForm.link_pdf}
                  onChange={(e) => setAulaForm({ ...aulaForm, link_pdf: e.target.value })}
                  placeholder="https://..."
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="aula-resumo">Resumo</Label>
                <Textarea
                  id="aula-resumo"
                  value={aulaForm.resumo}
                  onChange={(e) => setAulaForm({ ...aulaForm, resumo: e.target.value })}
                  rows={3}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setAulaModal(false)}>
                Cancelar
              </Button>
              <Button type="submit">
                {editingId ? "Salvar" : "Adicionar"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal Evento */}
      <Dialog open={eventoModal} onOpenChange={(open) => { setEventoModal(open); if (!open) resetEventoForm(); }}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? "Editar Evento" : "Novo Evento"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSaveEvento} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label htmlFor="evento-nome">Nome *</Label>
                <Input
                  id="evento-nome"
                  value={eventoForm.nome}
                  onChange={(e) => setEventoForm({ ...eventoForm, nome: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="evento-data">Data *</Label>
                <Input
                  id="evento-data"
                  type="date"
                  value={eventoForm.data}
                  onChange={(e) => setEventoForm({ ...eventoForm, data: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="evento-horario">Horário</Label>
                <Input
                  id="evento-horario"
                  type="time"
                  value={eventoForm.horario}
                  onChange={(e) => setEventoForm({ ...eventoForm, horario: e.target.value })}
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="evento-local">Local *</Label>
                <Input
                  id="evento-local"
                  value={eventoForm.local}
                  onChange={(e) => setEventoForm({ ...eventoForm, local: e.target.value })}
                  required
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="evento-descricao">Descrição</Label>
                <Textarea
                  id="evento-descricao"
                  value={eventoForm.descricao}
                  onChange={(e) => setEventoForm({ ...eventoForm, descricao: e.target.value })}
                  rows={3}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setEventoModal(false)}>
                Cancelar
              </Button>
              <Button type="submit">
                {editingId ? "Salvar" : "Adicionar"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal Novo Usuário */}
      <Dialog open={userModal} onOpenChange={(open) => { setUserModal(open); if (!open) resetUserForm(); }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Novo Usuário</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateUser} className="space-y-4">
            <div>
              <Label htmlFor="user-nome">Nome *</Label>
              <Input
                id="user-nome"
                value={userForm.nome}
                onChange={(e) => setUserForm({ ...userForm, nome: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="user-email">Email *</Label>
              <Input
                id="user-email"
                type="email"
                value={userForm.email}
                onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="user-password">Senha *</Label>
              <Input
                id="user-password"
                type="password"
                value={userForm.password}
                onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                minLength={6}
                required
              />
            </div>
            <div>
              <Label htmlFor="user-role">Permissão *</Label>
              <select
                id="user-role"
                value={userForm.role}
                onChange={(e) => setUserForm({ ...userForm, role: e.target.value as "admin" | "editor" })}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                required
              >
                <option value="editor">Editor</option>
                <option value="admin">Administrador</option>
              </select>
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setUserModal(false)}>
                Cancelar
              </Button>
              <Button type="submit">
                Criar Usuário
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Admin;
