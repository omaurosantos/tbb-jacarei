import { useState, useEffect, useMemo, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { sermoesService, aulasEbdService, eventosService, usersService, pastoresService, ministeriosService } from "@/lib/api";
import logoTBB from "@/assets/logo-tbb.jpg";
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
  BookOpen, GraduationCap, Calendar, FileText, Church, Menu, LayoutDashboard, ExternalLink, Palette
} from "lucide-react";
import { Sermao, AulaEbd, Evento, User, AppRole, EbdClasse } from "shared";
import AdminPastores from "@/components/admin/AdminPastores";
import AdminMinisterios from "@/components/admin/AdminMinisterios";
import AdminConteudos from "@/components/admin/AdminConteudos";
import AdminTema from "@/components/admin/AdminTema";
import { cn } from "@/lib/utils";
import { usePagination } from "@/hooks/use-pagination";
import { SearchFilter } from "@/components/SearchFilter";
import { PaginationControls } from "@/components/PaginationControls";

type SermaoForm = Omit<Sermao, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>;
type AulaEbdForm = Omit<AulaEbd, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>;
type EventoForm = Omit<Evento, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>;

type Section = "resumo" | "aparencia" | "sermoes" | "aulas" | "eventos" | "pastores" | "ministerios" | "conteudos" | "usuarios";

const menuItems: { id: Section; label: string; icon: React.ReactNode; adminOnly?: boolean }[] = [
  { id: "resumo", label: "Resumo", icon: <LayoutDashboard className="h-5 w-5" /> },
  { id: "sermoes", label: "Sermões", icon: <BookOpen className="h-5 w-5" /> },
  { id: "aulas", label: "Aulas EBD", icon: <GraduationCap className="h-5 w-5" /> },
  { id: "eventos", label: "Eventos", icon: <Calendar className="h-5 w-5" /> },
  { id: "pastores", label: "Pastores", icon: <UserIcon className="h-5 w-5" /> },
  { id: "ministerios", label: "Ministérios", icon: <Church className="h-5 w-5" /> },
  { id: "conteudos", label: "Conteúdos", icon: <FileText className="h-5 w-5" /> },
  { id: "aparencia", label: "Cores do site", icon: <Palette className="h-5 w-5" />, adminOnly: true },
  { id: "usuarios", label: "Usuários", icon: <Users className="h-5 w-5" />, adminOnly: true },
];

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isAdmin, loading: authLoading, logout } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [activeSection, setActiveSection] = useState<Section>("resumo");
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
  const [aulas, setAulas] = useState<AulaEbd[]>([]);
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
  const [users, setUsers] = useState<User[]>([]);
  const [totalPastores, setTotalPastores] = useState<number | null>(null);
  const [totalMinisterios, setTotalMinisterios] = useState<number | null>(null);

  // Form states
  const [sermaoForm, setSermaoForm] = useState({
    titulo: "",
    pregador: "",
    data: "",
    textoBase: "",
    linkYoutube: "",
    linkSpotify: "",
    resumo: "",
  });

  const [aulaForm, setAulaForm] = useState({
    titulo: "",
    professor: "",
    data: "",
    linkPdf: "",
    resumo: "",
    textoBase: "",
    classe: EbdClasse.HOMENS,
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
    role: AppRole.EDITOR,
  });

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/areasegura/login");
    }
  }, [user, authLoading, navigate]);

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
    searchFields: ["titulo", "professor"] as (keyof AulaEbd)[],
    searchQuery: aulaSearch,
    dateField: "data" as keyof AulaEbd,
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

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [sermoesData, aulasData, eventosData] = await Promise.all([
        sermoesService.getAll('desc'),
        aulasEbdService.getAll('desc'),
        eventosService.getAll('desc'),
      ]);

      setSermoes(sermoesData);
      setAulas(aulasData);
      setEventos(eventosData);

      // Só para o resumo: se falhar, o painel segue funcionando
      pastoresService.getAll().then((l) => setTotalPastores(l.length)).catch(() => setTotalPastores(null));
      ministeriosService.getAll().then((l) => setTotalMinisterios(l.length)).catch(() => setTotalMinisterios(null));

      // Fetch users if admin
      if (isAdmin) {
        const usersData = await usersService.getAll();
        setUsers(usersData);
      }
    } catch (error) {
      toast({
        title: "Erro ao carregar dados",
        description: error instanceof Error ? error.message : "Ocorreu um erro",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [isAdmin, toast]);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user, fetchData]);

  const handleLogout = async () => {
    await logout();
    navigate("/areasegura/login");
  };

  // Reset forms
  const resetSermaoForm = () => {
    setSermaoForm({ titulo: "", pregador: "", data: "", textoBase: "", linkYoutube: "", linkSpotify: "", resumo: "" });
    setEditingId(null);
  };

  const resetAulaForm = () => {
    setAulaForm({ titulo: "", professor: "", data: "", linkPdf: "", resumo: "", textoBase: "", classe: EbdClasse.HOMENS });
    setEditingId(null);
  };

  const resetEventoForm = () => {
    setEventoForm({ nome: "", data: "", horario: "", descricao: "", local: "" });
    setEditingId(null);
  };

  const resetUserForm = () => {
    setUserForm({ nome: "", email: "", password: "", role: AppRole.EDITOR });
  };

  // Open modals for edit
  const openEditSermao = (sermao: Sermao) => {
    setSermaoForm({
      titulo: sermao.titulo,
      pregador: sermao.pregador,
      data: sermao.data,
      textoBase: sermao.textoBase || "",
      linkYoutube: sermao.linkYoutube || "",
      linkSpotify: sermao.linkSpotify || "",
      resumo: sermao.resumo || "",
    });
    setEditingId(sermao.id);
    setSermaoModal(true);
  };

  const openEditAula = (aula: AulaEbd) => {
    setAulaForm({
      titulo: aula.titulo,
      professor: aula.professor,
      data: aula.data,
      classe: aula.classe,
      textoBase: aula.textoBase || "",
      linkPdf: aula.linkPdf || "",
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
    
    try {
      if (type === "sermao") {
        await sermoesService.delete(id);
        toast({ title: "Sermão removido" });
      } else if (type === "aula") {
        await aulasEbdService.delete(id);
        toast({ title: "Aula removida" });
      } else if (type === "evento") {
        await eventosService.delete(id);
        toast({ title: "Evento removido" });
      } else if (type === "user") {
        await usersService.delete(id);
        toast({ title: "Usuário removido" });
      }
      fetchData();
    } catch (error) {
      toast({
        title: "Erro ao remover",
        description: error instanceof Error ? error.message : "Ocorreu um erro",
        variant: "destructive",
      });
    }

    setDeleteDialog({ open: false, type: "sermao", id: "", name: "" });
  };

  // Handlers
  const handleSaveSermao = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const data = {
        titulo: sermaoForm.titulo,
        pregador: sermaoForm.pregador,
        data: sermaoForm.data,
        textoBase: sermaoForm.textoBase || null,
        linkYoutube: sermaoForm.linkYoutube || null,
        linkSpotify: sermaoForm.linkSpotify || null,
        resumo: sermaoForm.resumo || null,
      };

      if (editingId) {
        await sermoesService.update(editingId, data);
        toast({ title: "Sermão atualizado!" });
      } else {
        await sermoesService.create(data);
        toast({ title: "Sermão cadastrado!" });
      }
      setSermaoModal(false);
      resetSermaoForm();
      fetchData();
    } catch (error) {
      toast({
        title: editingId ? "Erro ao atualizar" : "Erro ao cadastrar",
        description: error instanceof Error ? error.message : "Ocorreu um erro",
        variant: "destructive",
      });
    }
  };

  const handleSaveAula = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const data = {
        titulo: aulaForm.titulo,
        professor: aulaForm.professor,
        data: aulaForm.data,
        classe: aulaForm.classe,
        textoBase: aulaForm.textoBase || null,
        linkPdf: aulaForm.linkPdf || null,
        resumo: aulaForm.resumo || null,
      };

      if (editingId) {
        await aulasEbdService.update(editingId, data);
        toast({ title: "Aula atualizada!" });
      } else {
        await aulasEbdService.create(data);
        toast({ title: "Aula cadastrada!" });
      }
      setAulaModal(false);
      resetAulaForm();
      fetchData();
    } catch (error) {
      toast({
        title: editingId ? "Erro ao atualizar" : "Erro ao cadastrar",
        description: error instanceof Error ? error.message : "Ocorreu um erro",
        variant: "destructive",
      });
    }
  };

  const handleSaveEvento = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const data = {
        nome: eventoForm.nome,
        data: eventoForm.data,
        horario: eventoForm.horario || null,
        descricao: eventoForm.descricao || null,
        local: eventoForm.local,
      };

      if (editingId) {
        await eventosService.update(editingId, data);
        toast({ title: "Evento atualizado!" });
      } else {
        await eventosService.create(data);
        toast({ title: "Evento cadastrado!" });
      }
      setEventoModal(false);
      resetEventoForm();
      fetchData();
    } catch (error) {
      toast({
        title: editingId ? "Erro ao atualizar" : "Erro ao cadastrar",
        description: error instanceof Error ? error.message : "Ocorreu um erro",
        variant: "destructive",
      });
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await usersService.create({
        email: userForm.email,
        password: userForm.password,
        nome: userForm.nome,
        role: userForm.role,
      });
      toast({ title: "Usuário criado com sucesso!" });
      setUserModal(false);
      resetUserForm();
      fetchData();
    } catch (error) {
      toast({
        title: "Erro ao criar usuário",
        description: error instanceof Error ? error.message : "Ocorreu um erro",
        variant: "destructive",
      });
    }
  };

  const handleUpdateUserRole = async (userId: string, newRole: AppRole) => {
    try {
      await usersService.updateRole(userId, newRole);
      toast({ title: "Role atualizada!" });
      fetchData();
    } catch (error) {
      toast({
        title: "Erro ao atualizar",
        description: error instanceof Error ? error.message : "Ocorreu um erro",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString + "T00:00:00").toLocaleDateString("pt-BR");
  };

  if (authLoading || loading) {
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

  const hojeISO = new Date().toISOString().split("T")[0];
  const proximosEventos = eventos.filter((e) => e.data >= hojeISO).sort((a, b) => a.data.localeCompare(b.data));
  const formatarData = (d: string) => {
    const date = new Date(d.slice(0, 10) + "T00:00:00");
    return Number.isNaN(date.getTime()) ? "" : date.toLocaleDateString("pt-BR", { day: "numeric", month: "short", year: "numeric" });
  };

  const irPara = (secao: Section, abrir?: () => void) => {
    setActiveSection(secao);
    abrir?.();
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Barra do painel */}
      <header className="sticky top-0 z-50 h-14 bg-primary text-primary-foreground border-b-2 border-highlight">
        <div className="flex h-full items-center gap-3 px-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden -ml-1 p-2 rounded-md hover:bg-primary-foreground/10"
            aria-label={sidebarOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={sidebarOpen}
            aria-controls="admin-sidebar"
          >
            <Menu className="h-5 w-5" />
          </button>
          <img src={logoTBB} alt="" className="h-8 w-8 rounded-full" />
          <span className="font-display font-semibold">Administração</span>
          <div className="ml-auto flex items-center gap-1 sm:gap-3">
            <span className="hidden md:inline text-sm text-primary-foreground/75">{user?.email}</span>
            <Button asChild variant="ghost" size="sm" className="text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground">
              <Link to="/" aria-label="Ver site">
                <ExternalLink className="h-4 w-4 sm:mr-2" aria-hidden="true" />
                <span className="hidden sm:inline">Ver site</span>
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
              onClick={handleLogout}
              aria-label="Sair"
            >
              <LogOut className="h-4 w-4 sm:mr-2" aria-hidden="true" />
              <span className="hidden sm:inline">Sair</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar overlay for mobile */}
        {sidebarOpen && (
          <div
            className="lg:hidden fixed inset-0 top-14 bg-black/50 z-40"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* Sidebar */}
        <aside
          id="admin-sidebar"
          className={cn(
            "fixed lg:sticky top-14 left-0 z-40 h-[calc(100vh-3.5rem)] w-64 shrink-0 bg-card border-r border-border transition-transform motion-reduce:transition-none lg:translate-x-0",
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <nav aria-label="Seções do painel" className="h-full p-4 space-y-1 overflow-y-auto">
            {visibleMenuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveSection(item.id);
                  setSidebarOpen(false);
                }}
                aria-current={activeSection === item.id ? "page" : undefined}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  activeSection === item.id
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                {item.icon}
                {item.label}
                {item.adminOnly && <Shield className="h-3 w-3 ml-auto opacity-60" aria-hidden="true" />}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0 p-4 md:p-6 lg:p-8 bg-background">
          {/* Resumo */}
          {activeSection === "resumo" && (
            <div className="space-y-8">
              <div>
                <h1 className="text-2xl font-display font-bold text-foreground">
                  Olá{user?.nome ? `, ${user.nome.split(" ")[0]}` : ""}
                </h1>
                <p className="text-muted-foreground">O que está publicado no site hoje.</p>
              </div>

              <dl className="grid grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4">
                {[
                  { rotulo: "Sermões", valor: sermoes.length, secao: "sermoes" as Section },
                  { rotulo: "Aulas da EBD", valor: aulas.length, secao: "aulas" as Section },
                  { rotulo: "Eventos futuros", valor: proximosEventos.length, secao: "eventos" as Section },
                  { rotulo: "Pastores", valor: totalPastores, secao: "pastores" as Section },
                  { rotulo: "Ministérios", valor: totalMinisterios, secao: "ministerios" as Section },
                ].map((c) => (
                  <button
                    key={c.rotulo}
                    onClick={() => setActiveSection(c.secao)}
                    className="text-left rounded-lg border border-border bg-card p-4 hover:border-primary/40 transition-colors"
                  >
                    <dd className="font-display text-3xl font-semibold text-foreground">{c.valor ?? "–"}</dd>
                    <dt className="mt-1 text-sm text-muted-foreground">{c.rotulo}</dt>
                  </button>
                ))}
              </dl>

              <div className="grid gap-8 lg:grid-cols-2">
                <section aria-labelledby="resumo-publicar">
                  <h2 id="resumo-publicar" className="font-display text-lg font-semibold text-foreground">Publicar agora</h2>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Button onClick={() => irPara("sermoes", () => { resetSermaoForm(); setSermaoModal(true); })}>
                      <Plus className="h-4 w-4 mr-2" /> Novo sermão
                    </Button>
                    <Button variant="outline" onClick={() => irPara("aulas", () => { resetAulaForm(); setAulaModal(true); })}>
                      <Plus className="h-4 w-4 mr-2" /> Nova aula
                    </Button>
                    <Button variant="outline" onClick={() => irPara("eventos", () => { resetEventoForm(); setEventoModal(true); })}>
                      <Plus className="h-4 w-4 mr-2" /> Novo evento
                    </Button>
                  </div>

                  <h2 className="mt-8 font-display text-lg font-semibold text-foreground">Último sermão</h2>
                  {sermoes[0] ? (
                    <p className="mt-2 text-sm text-muted-foreground">
                      <span className="font-medium text-foreground">{sermoes[0].titulo}</span>
                      {" — "}{sermoes[0].pregador}, {formatarData(sermoes[0].data)}
                    </p>
                  ) : (
                    <p className="mt-2 text-sm text-muted-foreground">Nenhum sermão publicado ainda. A home só mostra o bloco de sermão depois do primeiro.</p>
                  )}
                </section>

                <section aria-labelledby="resumo-eventos">
                  <h2 id="resumo-eventos" className="font-display text-lg font-semibold text-foreground">Próximos eventos</h2>
                  {proximosEventos.length === 0 ? (
                    <p className="mt-2 text-sm text-muted-foreground">Nenhum evento futuro. Sem eventos, a home mostra só os horários da semana.</p>
                  ) : (
                    <ul className="mt-3 divide-y divide-border rounded-lg border border-border bg-card">
                      {proximosEventos.slice(0, 4).map((e) => (
                        <li key={e.id} className="flex items-baseline justify-between gap-4 px-4 py-3 text-sm">
                          <span className="font-medium text-foreground">{e.nome}</span>
                          <span className="shrink-0 text-muted-foreground">{formatarData(e.data)}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              </div>
            </div>
          )}

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

          {/* Cores do site */}
          {activeSection === "aparencia" && isAdmin && <AdminTema />}

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
                              value={u.role || AppRole.EDITOR}
                              onValueChange={(val) => handleUpdateUserRole(u.id, val as AppRole)}
                            >
                              <SelectTrigger className="w-28">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value={AppRole.ADMIN}>
                                  <span className="flex items-center gap-2">
                                    <Shield className="h-3 w-3" /> Admin
                                  </span>
                                </SelectItem>
                                <SelectItem value={AppRole.EDITOR}>Editor</SelectItem>
                              </SelectContent>
                            </Select>
                          </td>
                          <td className="p-4 text-right">
                            {u.id !== user?.id && (
                              <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => confirmDelete("user", u.id, u.nome)}>
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
              <Input id="texto_base" value={sermaoForm.textoBase} onChange={(e) => setSermaoForm({ ...sermaoForm, textoBase: e.target.value })} placeholder="Ex: João 3:16" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="link_youtube">Link YouTube</Label>
              <Input id="link_youtube" value={sermaoForm.linkYoutube} onChange={(e) => setSermaoForm({ ...sermaoForm, linkYoutube: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="link_spotify">Link Spotify</Label>
              <Input id="link_spotify" value={sermaoForm.linkSpotify} onChange={(e) => setSermaoForm({ ...sermaoForm, linkSpotify: e.target.value })} />
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
                <Select value={aulaForm.classe} onValueChange={(val) => setAulaForm({ ...aulaForm, classe: val as EbdClasse })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={EbdClasse.HOMENS}>Homens</SelectItem>
                    <SelectItem value={EbdClasse.BELAS}>Belas</SelectItem>
                    <SelectItem value={EbdClasse.ADOLESCENTES}>Adolescentes</SelectItem>
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
              <Input id="aula_texto_base" value={aulaForm.textoBase} onChange={(e) => setAulaForm({ ...aulaForm, textoBase: e.target.value })} placeholder="Ex: Mateus 5:1-12" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="link_pdf">Link PDF</Label>
              <Input id="link_pdf" value={aulaForm.linkPdf} onChange={(e) => setAulaForm({ ...aulaForm, linkPdf: e.target.value })} />
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
              <Select value={userForm.role} onValueChange={(val) => setUserForm({ ...userForm, role: val as AppRole })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={AppRole.ADMIN}>
                    <span className="flex items-center gap-2">
                      <Shield className="h-3 w-3" /> Admin
                    </span>
                  </SelectItem>
                  <SelectItem value={AppRole.EDITOR}>Editor</SelectItem>
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
    </div>
  );
};

export default Admin;
