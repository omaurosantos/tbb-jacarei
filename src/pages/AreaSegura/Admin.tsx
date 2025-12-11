import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/Layout";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { 
  Plus, Trash2, LogOut, Pencil, Users, Shield, User as UserIcon, 
  BookOpen, GraduationCap, Calendar, FileText, Church, Menu
} from "lucide-react";
import { User, Session } from "@supabase/supabase-js";
import AdminPastores from "@/components/admin/AdminPastores";
import AdminMinisterios from "@/components/admin/AdminMinisterios";
import AdminConteudos from "@/components/admin/AdminConteudos";
import { cn } from "@/lib/utils";
import { usePagination } from "@/hooks/use-pagination";
import { SearchFilter } from "@/components/SearchFilter";
import { PaginationControls } from "@/components/PaginationControls";

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

type Section = "sermoes" | "aulas" | "eventos" | "pastores" | "ministerios" | "conteudos" | "usuarios";

const menuItems: { id: Section; label: string; icon: React.ReactNode; adminOnly?: boolean }[] = [
  { id: "sermoes", label: "Sermões", icon: <BookOpen className="h-5 w-5" /> },
  { id: "aulas", label: "Aulas EBD", icon: <GraduationCap className="h-5 w-5" /> },
  { id: "eventos", label: "Eventos", icon: <Calendar className="h-5 w-5" /> },
  { id: "pastores", label: "Pastores", icon: <UserIcon className="h-5 w-5" /> },
  { id: "ministerios", label: "Ministérios", icon: <Church className="h-5 w-5" /> },
  { id: "conteudos", label: "Conteúdos", icon: <FileText className="h-5 w-5" /> },
  { id: "usuarios", label: "Usuários", icon: <Users className="h-5 w-5" />, adminOnly: true },
];

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeSection, setActiveSection] = useState<Section>("sermoes");
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

  // Search and filter states
  const [sermaoSearch, setSermaoSearch] = useState("");
  const [sermaoMonth, setSermaoMonth] = useState<number | null>(null);
  const [sermaoYear, setSermaoYear] = useState<number | null>(null);

  const [aulaSearch, setAulaSearch] = useState("");
  const [aulaMonth, setAulaMonth] = useState<number | null>(null);
  const [aulaYear, setAulaYear] = useState<number | null>(null);

  const [eventoSearch, setEventoSearch] = useState("");
  const [eventoMonth, setEventoMonth] = useState<number | null>(null);
  const [eventoYear, setEventoYear] = useState<number | null>(null);
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

  // Pagination hooks
  const sermoesPagination = usePagination({
    data: sermoes,
    itemsPerPage: 10,
    searchFields: ["titulo", "pregador"] as (keyof Sermao)[],
    searchQuery: sermaoSearch,
    dateField: "data" as keyof Sermao,
    filterMonth: sermaoMonth,
    filterYear: sermaoYear,
  });

  const aulasPagination = usePagination({
    data: aulas,
    itemsPerPage: 10,
    searchFields: ["titulo", "professor"] as (keyof AulaEBD)[],
    searchQuery: aulaSearch,
    dateField: "data" as keyof AulaEBD,
    filterMonth: aulaMonth,
    filterYear: aulaYear,
  });

  const eventosPagination = usePagination({
    data: eventos,
    itemsPerPage: 10,
    searchFields: ["nome", "local"] as (keyof Evento)[],
    searchQuery: eventoSearch,
    dateField: "data" as keyof Evento,
    filterMonth: eventoMonth,
    filterYear: eventoYear,
  });

  // Get available years from data
  const sermaoYears = useMemo(() => {
    const years = [...new Set(sermoes.map(s => new Date(s.data + "T00:00:00").getFullYear()))];
    return years.sort((a, b) => b - a);
  }, [sermoes]);

  const aulaYears = useMemo(() => {
    const years = [...new Set(aulas.map(a => new Date(a.data + "T00:00:00").getFullYear()))];
    return years.sort((a, b) => b - a);
  }, [aulas]);

  const eventoYears = useMemo(() => {
    const years = [...new Set(eventos.map(e => new Date(e.data + "T00:00:00").getFullYear()))];
    return years.sort((a, b) => b - a);
  }, [eventos]);

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

  const visibleMenuItems = menuItems.filter(item => !item.adminOnly || isAdmin);

  return (
    <Layout>
      <div className="flex min-h-[calc(100vh-4rem)]">
        {/* Mobile menu button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden fixed bottom-4 right-4 z-50 bg-primary text-primary-foreground p-3 rounded-full shadow-lg"
        >
          <Menu className="h-6 w-6" />
        </button>

        {/* Sidebar overlay for mobile */}
        {sidebarOpen && (
          <div 
            className="lg:hidden fixed inset-0 bg-black/50 z-40"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside className={cn(
          "fixed lg:sticky top-0 left-0 z-40 h-screen lg:h-auto w-64 bg-card border-r border-border transition-transform lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}>
          <div className="flex flex-col h-full">
            {/* Sidebar Header */}
            <div className="p-4 border-b border-border">
              <h2 className="font-display text-lg font-semibold text-foreground">Administração</h2>
              <p className="text-sm text-muted-foreground mt-1">Gerencie o conteúdo</p>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
              {visibleMenuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveSection(item.id);
                    setSidebarOpen(false);
                  }}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                    activeSection === item.id
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  {item.icon}
                  {item.label}
                  {item.adminOnly && (
                    <Shield className="h-3 w-3 ml-auto opacity-60" />
                  )}
                </button>
              ))}
            </nav>

            {/* Sidebar Footer */}
            <div className="p-4 border-t border-border">
              <Button 
                variant="outline" 
                className="w-full justify-start gap-2" 
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
                Sair
              </Button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 bg-background">
          {/* Sermões */}
          {activeSection === "sermoes" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-display font-bold text-foreground">Sermões</h1>
                  <p className="text-muted-foreground">Gerencie os sermões da igreja</p>
                </div>
                <Button onClick={() => { resetSermaoForm(); setSermaoModal(true); }}>
                  <Plus className="h-4 w-4 mr-2" /> Novo Sermão
                </Button>
              </div>

              <SearchFilter
                searchQuery={sermaoSearch}
                onSearchChange={setSermaoSearch}
                searchPlaceholder="Buscar por título ou pregador..."
                filterMonth={sermaoMonth}
                filterYear={sermaoYear}
                onMonthChange={setSermaoMonth}
                onYearChange={setSermaoYear}
                availableYears={sermaoYears}
              />

              <div className="bg-card rounded-lg border border-border overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="text-left p-4 font-medium text-muted-foreground">Título</th>
                        <th className="text-left p-4 font-medium text-muted-foreground">Pregador</th>
                        <th className="text-left p-4 font-medium text-muted-foreground">Data</th>
                        <th className="text-right p-4 font-medium text-muted-foreground">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {sermoesPagination.paginatedData.map((s) => (
                        <tr key={s.id} className="hover:bg-muted/30">
                          <td className="p-4 text-foreground">{s.titulo}</td>
                          <td className="p-4 text-muted-foreground">{s.pregador}</td>
                          <td className="p-4 text-muted-foreground">{formatDate(s.data)}</td>
                          <td className="p-4 text-right">
                            <div className="flex justify-end gap-2">
                              <Button size="sm" variant="ghost" onClick={() => openEditSermao(s)}>
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => confirmDelete("sermao", s.id, s.titulo)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {sermoesPagination.totalItems === 0 && (
                  <div className="p-8 text-center text-muted-foreground">
                    {sermaoSearch || sermaoMonth !== null || sermaoYear !== null 
                      ? "Nenhum sermão encontrado com os filtros aplicados." 
                      : "Nenhum sermão cadastrado."}
                  </div>
                )}
                <PaginationControls
                  currentPage={sermoesPagination.currentPage}
                  totalPages={sermoesPagination.totalPages}
                  totalItems={sermoesPagination.totalItems}
                  onPageChange={sermoesPagination.goToPage}
                  hasNextPage={sermoesPagination.hasNextPage}
                  hasPrevPage={sermoesPagination.hasPrevPage}
                />
              </div>
            </div>
          )}

          {/* Aulas EBD */}
          {activeSection === "aulas" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-display font-bold text-foreground">Aulas EBD</h1>
                  <p className="text-muted-foreground">Gerencie as aulas da Escola Bíblica</p>
                </div>
                <Button onClick={() => { resetAulaForm(); setAulaModal(true); }}>
                  <Plus className="h-4 w-4 mr-2" /> Nova Aula
                </Button>
              </div>

              <SearchFilter
                searchQuery={aulaSearch}
                onSearchChange={setAulaSearch}
                searchPlaceholder="Buscar por título ou professor..."
                filterMonth={aulaMonth}
                filterYear={aulaYear}
                onMonthChange={setAulaMonth}
                onYearChange={setAulaYear}
                availableYears={aulaYears}
              />

              <div className="bg-card rounded-lg border border-border overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="text-left p-4 font-medium text-muted-foreground">Título</th>
                        <th className="text-left p-4 font-medium text-muted-foreground">Professor</th>
                        <th className="text-left p-4 font-medium text-muted-foreground">Classe</th>
                        <th className="text-left p-4 font-medium text-muted-foreground">Data</th>
                        <th className="text-right p-4 font-medium text-muted-foreground">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {aulasPagination.paginatedData.map((a) => (
                        <tr key={a.id} className="hover:bg-muted/30">
                          <td className="p-4 text-foreground">{a.titulo}</td>
                          <td className="p-4 text-muted-foreground">{a.professor}</td>
                          <td className="p-4">
                            <span className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary">
                              {a.classe}
                            </span>
                          </td>
                          <td className="p-4 text-muted-foreground">{formatDate(a.data)}</td>
                          <td className="p-4 text-right">
                            <div className="flex justify-end gap-2">
                              <Button size="sm" variant="ghost" onClick={() => openEditAula(a)}>
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => confirmDelete("aula", a.id, a.titulo)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {aulasPagination.totalItems === 0 && (
                  <div className="p-8 text-center text-muted-foreground">
                    {aulaSearch || aulaMonth !== null || aulaYear !== null 
                      ? "Nenhuma aula encontrada com os filtros aplicados." 
                      : "Nenhuma aula cadastrada."}
                  </div>
                )}
                <PaginationControls
                  currentPage={aulasPagination.currentPage}
                  totalPages={aulasPagination.totalPages}
                  totalItems={aulasPagination.totalItems}
                  onPageChange={aulasPagination.goToPage}
                  hasNextPage={aulasPagination.hasNextPage}
                  hasPrevPage={aulasPagination.hasPrevPage}
                />
              </div>
            </div>
          )}

          {/* Eventos */}
          {activeSection === "eventos" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-display font-bold text-foreground">Eventos</h1>
                  <p className="text-muted-foreground">Gerencie os eventos e agenda</p>
                </div>
                <Button onClick={() => { resetEventoForm(); setEventoModal(true); }}>
                  <Plus className="h-4 w-4 mr-2" /> Novo Evento
                </Button>
              </div>

              <SearchFilter
                searchQuery={eventoSearch}
                onSearchChange={setEventoSearch}
                searchPlaceholder="Buscar por nome ou local..."
                filterMonth={eventoMonth}
                filterYear={eventoYear}
                onMonthChange={setEventoMonth}
                onYearChange={setEventoYear}
                availableYears={eventoYears}
              />

              <div className="bg-card rounded-lg border border-border overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="text-left p-4 font-medium text-muted-foreground">Nome</th>
                        <th className="text-left p-4 font-medium text-muted-foreground">Data</th>
                        <th className="text-left p-4 font-medium text-muted-foreground">Horário</th>
                        <th className="text-left p-4 font-medium text-muted-foreground">Local</th>
                        <th className="text-right p-4 font-medium text-muted-foreground">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {eventosPagination.paginatedData.map((ev) => (
                        <tr key={ev.id} className="hover:bg-muted/30">
                          <td className="p-4 text-foreground">{ev.nome}</td>
                          <td className="p-4 text-muted-foreground">{formatDate(ev.data)}</td>
                          <td className="p-4 text-muted-foreground">{ev.horario || "-"}</td>
                          <td className="p-4 text-muted-foreground">{ev.local}</td>
                          <td className="p-4 text-right">
                            <div className="flex justify-end gap-2">
                              <Button size="sm" variant="ghost" onClick={() => openEditEvento(ev)}>
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => confirmDelete("evento", ev.id, ev.nome)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {eventosPagination.totalItems === 0 && (
                  <div className="p-8 text-center text-muted-foreground">
                    {eventoSearch || eventoMonth !== null || eventoYear !== null 
                      ? "Nenhum evento encontrado com os filtros aplicados." 
                      : "Nenhum evento cadastrado."}
                  </div>
                )}
                <PaginationControls
                  currentPage={eventosPagination.currentPage}
                  totalPages={eventosPagination.totalPages}
                  totalItems={eventosPagination.totalItems}
                  onPageChange={eventosPagination.goToPage}
                  hasNextPage={eventosPagination.hasNextPage}
                  hasPrevPage={eventosPagination.hasPrevPage}
                />
              </div>
            </div>
          )}

          {/* Pastores */}
          {activeSection === "pastores" && <AdminPastores />}

          {/* Ministérios */}
          {activeSection === "ministerios" && <AdminMinisterios />}

          {/* Conteúdos */}
          {activeSection === "conteudos" && <AdminConteudos />}

          {/* Usuários */}
          {activeSection === "usuarios" && isAdmin && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-display font-bold text-foreground">Usuários</h1>
                  <p className="text-muted-foreground">Gerencie os usuários do sistema</p>
                </div>
                <Button onClick={() => { resetUserForm(); setUserModal(true); }}>
                  <Plus className="h-4 w-4 mr-2" /> Novo Usuário
                </Button>
              </div>

              <div className="bg-card rounded-lg border border-border overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="text-left p-4 font-medium text-muted-foreground">Nome</th>
                        <th className="text-left p-4 font-medium text-muted-foreground">Email</th>
                        <th className="text-left p-4 font-medium text-muted-foreground">Role</th>
                        <th className="text-right p-4 font-medium text-muted-foreground">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {users.map((u) => (
                        <tr key={u.id} className="hover:bg-muted/30">
                          <td className="p-4 text-foreground">{u.nome}</td>
                          <td className="p-4 text-muted-foreground">{u.email}</td>
                          <td className="p-4">
                            <Select
                              value={u.role || "editor"}
                              onValueChange={(val) => handleUpdateUserRole(u.user_id, val as "admin" | "editor")}
                            >
                              <SelectTrigger className="w-28">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="admin">
                                  <span className="flex items-center gap-2">
                                    <Shield className="h-3 w-3" /> Admin
                                  </span>
                                </SelectItem>
                                <SelectItem value="editor">Editor</SelectItem>
                              </SelectContent>
                            </Select>
                          </td>
                          <td className="p-4 text-right">
                            {u.user_id !== user?.id && (
                              <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => confirmDelete("user", u.user_id, u.nome)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {users.length === 0 && (
                  <div className="p-8 text-center text-muted-foreground">
                    Nenhum usuário cadastrado.
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Sermão Modal */}
      <Dialog open={sermaoModal} onOpenChange={(open) => { setSermaoModal(open); if (!open) resetSermaoForm(); }}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? "Editar Sermão" : "Novo Sermão"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSaveSermao} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="titulo">Título *</Label>
              <Input id="titulo" value={sermaoForm.titulo} onChange={(e) => setSermaoForm({ ...sermaoForm, titulo: e.target.value })} required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pregador">Pregador *</Label>
                <Input id="pregador" value={sermaoForm.pregador} onChange={(e) => setSermaoForm({ ...sermaoForm, pregador: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="data">Data *</Label>
                <Input id="data" type="date" value={sermaoForm.data} onChange={(e) => setSermaoForm({ ...sermaoForm, data: e.target.value })} required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="texto_base">Texto Base</Label>
              <Input id="texto_base" value={sermaoForm.texto_base} onChange={(e) => setSermaoForm({ ...sermaoForm, texto_base: e.target.value })} placeholder="Ex: João 3:16" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="link_youtube">Link YouTube</Label>
              <Input id="link_youtube" value={sermaoForm.link_youtube} onChange={(e) => setSermaoForm({ ...sermaoForm, link_youtube: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="link_spotify">Link Spotify</Label>
              <Input id="link_spotify" value={sermaoForm.link_spotify} onChange={(e) => setSermaoForm({ ...sermaoForm, link_spotify: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="resumo">Resumo</Label>
              <Textarea id="resumo" value={sermaoForm.resumo} onChange={(e) => setSermaoForm({ ...sermaoForm, resumo: e.target.value })} rows={3} />
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setSermaoModal(false)}>Cancelar</Button>
              <Button type="submit">{editingId ? "Salvar" : "Cadastrar"}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Aula Modal */}
      <Dialog open={aulaModal} onOpenChange={(open) => { setAulaModal(open); if (!open) resetAulaForm(); }}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? "Editar Aula" : "Nova Aula"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSaveAula} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="aula_titulo">Título *</Label>
              <Input id="aula_titulo" value={aulaForm.titulo} onChange={(e) => setAulaForm({ ...aulaForm, titulo: e.target.value })} required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="professor">Professor *</Label>
                <Input id="professor" value={aulaForm.professor} onChange={(e) => setAulaForm({ ...aulaForm, professor: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="classe">Classe *</Label>
                <Select value={aulaForm.classe} onValueChange={(val) => setAulaForm({ ...aulaForm, classe: val as "Homens" | "Belas" | "Adolescentes" })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Homens">Homens</SelectItem>
                    <SelectItem value="Belas">Belas</SelectItem>
                    <SelectItem value="Adolescentes">Adolescentes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="aula_data">Data *</Label>
              <Input id="aula_data" type="date" value={aulaForm.data} onChange={(e) => setAulaForm({ ...aulaForm, data: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="aula_texto_base">Texto Base</Label>
              <Input id="aula_texto_base" value={aulaForm.texto_base} onChange={(e) => setAulaForm({ ...aulaForm, texto_base: e.target.value })} placeholder="Ex: Mateus 5:1-12" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="link_pdf">Link PDF</Label>
              <Input id="link_pdf" value={aulaForm.link_pdf} onChange={(e) => setAulaForm({ ...aulaForm, link_pdf: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="aula_resumo">Resumo</Label>
              <Textarea id="aula_resumo" value={aulaForm.resumo} onChange={(e) => setAulaForm({ ...aulaForm, resumo: e.target.value })} rows={3} />
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setAulaModal(false)}>Cancelar</Button>
              <Button type="submit">{editingId ? "Salvar" : "Cadastrar"}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Evento Modal */}
      <Dialog open={eventoModal} onOpenChange={(open) => { setEventoModal(open); if (!open) resetEventoForm(); }}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? "Editar Evento" : "Novo Evento"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSaveEvento} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="evento_nome">Nome *</Label>
              <Input id="evento_nome" value={eventoForm.nome} onChange={(e) => setEventoForm({ ...eventoForm, nome: e.target.value })} required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="evento_data">Data *</Label>
                <Input id="evento_data" type="date" value={eventoForm.data} onChange={(e) => setEventoForm({ ...eventoForm, data: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="horario">Horário</Label>
                <Input id="horario" type="time" value={eventoForm.horario} onChange={(e) => setEventoForm({ ...eventoForm, horario: e.target.value })} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="local">Local *</Label>
              <Input id="local" value={eventoForm.local} onChange={(e) => setEventoForm({ ...eventoForm, local: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="evento_descricao">Descrição</Label>
              <Textarea id="evento_descricao" value={eventoForm.descricao} onChange={(e) => setEventoForm({ ...eventoForm, descricao: e.target.value })} rows={3} />
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setEventoModal(false)}>Cancelar</Button>
              <Button type="submit">{editingId ? "Salvar" : "Cadastrar"}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* User Modal */}
      <Dialog open={userModal} onOpenChange={(open) => { setUserModal(open); if (!open) resetUserForm(); }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Novo Usuário</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateUser} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="user_nome">Nome *</Label>
              <Input id="user_nome" value={userForm.nome} onChange={(e) => setUserForm({ ...userForm, nome: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="user_email">Email *</Label>
              <Input id="user_email" type="email" value={userForm.email} onChange={(e) => setUserForm({ ...userForm, email: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="user_password">Senha *</Label>
              <Input id="user_password" type="password" value={userForm.password} onChange={(e) => setUserForm({ ...userForm, password: e.target.value })} required minLength={6} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="user_role">Role *</Label>
              <Select value={userForm.role} onValueChange={(val) => setUserForm({ ...userForm, role: val as "admin" | "editor" })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">
                    <span className="flex items-center gap-2">
                      <Shield className="h-3 w-3" /> Admin
                    </span>
                  </SelectItem>
                  <SelectItem value="editor">Editor</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setUserModal(false)}>Cancelar</Button>
              <Button type="submit">Criar Usuário</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ ...deleteDialog, open })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir "{deleteDialog.name}"? Esta ação não pode ser desfeita.
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
    </Layout>
  );
};

export default Admin;
