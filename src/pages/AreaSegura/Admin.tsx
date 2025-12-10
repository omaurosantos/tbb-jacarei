import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, LogOut } from "lucide-react";
import { User, Session } from "@supabase/supabase-js";

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("sermoes");

  // Estados para listas
  const [sermoes, setSermoes] = useState<any[]>([]);
  const [aulas, setAulas] = useState<any[]>([]);
  const [eventos, setEventos] = useState<any[]>([]);

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

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) {
      navigate("/areasegura/login");
    }
  }, [user, loading, navigate]);

  // Fetch data
  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    const [sermoesRes, aulasRes, eventosRes] = await Promise.all([
      supabase.from("sermoes").select("*").order("data", { ascending: false }),
      supabase.from("aulas_ebd").select("*").order("data", { ascending: false }),
      supabase.from("eventos").select("*").order("data", { ascending: false }),
    ]);

    if (sermoesRes.data) setSermoes(sermoesRes.data);
    if (aulasRes.data) setAulas(aulasRes.data);
    if (eventosRes.data) setEventos(eventosRes.data);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/areasegura/login");
  };

  // Handlers
  const handleAddSermao = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { error } = await supabase.from("sermoes").insert({
      titulo: sermaoForm.titulo,
      pregador: sermaoForm.pregador,
      data: sermaoForm.data,
      texto_base: sermaoForm.texto_base,
      link_youtube: sermaoForm.link_youtube || null,
      link_spotify: sermaoForm.link_spotify || null,
      resumo: sermaoForm.resumo || null,
      created_by: user?.id,
    });

    if (error) {
      toast({ title: "Erro ao cadastrar sermão", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Sermão cadastrado com sucesso!" });
      setSermaoForm({ titulo: "", pregador: "", data: "", texto_base: "", link_youtube: "", link_spotify: "", resumo: "" });
      fetchData();
    }
  };

  const handleAddAula = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { error } = await supabase.from("aulas_ebd").insert({
      titulo: aulaForm.titulo,
      professor: aulaForm.professor,
      data: aulaForm.data,
      classe: aulaForm.classe,
      texto_base: aulaForm.texto_base || null,
      link_pdf: aulaForm.link_pdf || null,
      resumo: aulaForm.resumo || null,
      created_by: user?.id,
    });

    if (error) {
      toast({ title: "Erro ao cadastrar aula", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Aula de EBD cadastrada com sucesso!" });
      setAulaForm({ titulo: "", professor: "", data: "", link_pdf: "", resumo: "", texto_base: "", classe: "Homens" });
      fetchData();
    }
  };

  const handleAddEvento = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { error } = await supabase.from("eventos").insert({
      nome: eventoForm.nome,
      data: eventoForm.data,
      horario: eventoForm.horario || null,
      descricao: eventoForm.descricao || null,
      local: eventoForm.local,
      created_by: user?.id,
    });

    if (error) {
      toast({ title: "Erro ao cadastrar evento", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Evento cadastrado com sucesso!" });
      setEventoForm({ nome: "", data: "", horario: "", descricao: "", local: "" });
      fetchData();
    }
  };

  const handleDeleteSermao = async (id: string) => {
    const { error } = await supabase.from("sermoes").delete().eq("id", id);
    if (error) {
      toast({ title: "Erro ao remover", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Sermão removido" });
      fetchData();
    }
  };

  const handleDeleteAula = async (id: string) => {
    const { error } = await supabase.from("aulas_ebd").delete().eq("id", id);
    if (error) {
      toast({ title: "Erro ao remover", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Aula removida" });
      fetchData();
    }
  };

  const handleDeleteEvento = async (id: string) => {
    const { error } = await supabase.from("eventos").delete().eq("id", id);
    if (error) {
      toast({ title: "Erro ao remover", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Evento removido" });
      fetchData();
    }
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
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="sermoes">Sermões</TabsTrigger>
              <TabsTrigger value="ebd">Aulas EBD</TabsTrigger>
              <TabsTrigger value="agenda">Agenda</TabsTrigger>
            </TabsList>

            {/* Sermões */}
            <TabsContent value="sermoes">
              <div className="bg-card border border-border rounded-lg p-6 mb-6">
                <h3 className="font-display text-lg font-semibold mb-4">Novo Sermão</h3>
                <form onSubmit={handleAddSermao} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="sermao-titulo">Título</Label>
                      <Input
                        id="sermao-titulo"
                        value={sermaoForm.titulo}
                        onChange={(e) => setSermaoForm({ ...sermaoForm, titulo: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="sermao-pregador">Pregador</Label>
                      <Input
                        id="sermao-pregador"
                        value={sermaoForm.pregador}
                        onChange={(e) => setSermaoForm({ ...sermaoForm, pregador: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="sermao-data">Data</Label>
                      <Input
                        id="sermao-data"
                        type="date"
                        value={sermaoForm.data}
                        onChange={(e) => setSermaoForm({ ...sermaoForm, data: e.target.value })}
                        required
                      />
                    </div>
                    <div>
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
                  </div>
                  <div>
                    <Label htmlFor="sermao-resumo">Resumo</Label>
                    <Textarea
                      id="sermao-resumo"
                      value={sermaoForm.resumo}
                      onChange={(e) => setSermaoForm({ ...sermaoForm, resumo: e.target.value })}
                      placeholder="Resumo do sermão..."
                    />
                  </div>
                  <Button type="submit">
                    <Plus className="h-4 w-4 mr-2" /> Adicionar Sermão
                  </Button>
                </form>
              </div>

              {/* Lista */}
              <div className="space-y-3">
                {sermoes.map((s) => (
                  <div key={s.id} className="bg-card border border-border rounded-lg p-4 flex justify-between items-start">
                    <div>
                      <p className="font-semibold">{s.titulo}</p>
                      <p className="text-sm text-muted-foreground">{s.pregador} • {s.data}</p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteSermao(s.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}
                {sermoes.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">Nenhum sermão cadastrado</p>
                )}
              </div>
            </TabsContent>

            {/* EBD */}
            <TabsContent value="ebd">
              <div className="bg-card border border-border rounded-lg p-6 mb-6">
                <h3 className="font-display text-lg font-semibold mb-4">Nova Aula de EBD</h3>
                <form onSubmit={handleAddAula} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="aula-titulo">Título</Label>
                      <Input
                        id="aula-titulo"
                        value={aulaForm.titulo}
                        onChange={(e) => setAulaForm({ ...aulaForm, titulo: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="aula-professor">Professor</Label>
                      <Input
                        id="aula-professor"
                        value={aulaForm.professor}
                        onChange={(e) => setAulaForm({ ...aulaForm, professor: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="aula-data">Data</Label>
                      <Input
                        id="aula-data"
                        type="date"
                        value={aulaForm.data}
                        onChange={(e) => setAulaForm({ ...aulaForm, data: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="aula-classe">Classe</Label>
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
                    <div>
                      <Label htmlFor="aula-link">Link do PDF</Label>
                      <Input
                        id="aula-link"
                        value={aulaForm.link_pdf}
                        onChange={(e) => setAulaForm({ ...aulaForm, link_pdf: e.target.value })}
                        placeholder="https://..."
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="aula-resumo">Resumo</Label>
                    <Textarea
                      id="aula-resumo"
                      value={aulaForm.resumo}
                      onChange={(e) => setAulaForm({ ...aulaForm, resumo: e.target.value })}
                    />
                  </div>
                  <Button type="submit">
                    <Plus className="h-4 w-4 mr-2" /> Adicionar Aula
                  </Button>
                </form>
              </div>

              <div className="space-y-3">
                {aulas.map((a) => (
                  <div key={a.id} className="bg-card border border-border rounded-lg p-4 flex justify-between items-start">
                    <div>
                      <p className="font-semibold">{a.titulo}</p>
                      <p className="text-sm text-muted-foreground">{a.professor} • {a.data} • {a.classe}</p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteAula(a.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}
                {aulas.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">Nenhuma aula cadastrada</p>
                )}
              </div>
            </TabsContent>

            {/* Agenda */}
            <TabsContent value="agenda">
              <div className="bg-card border border-border rounded-lg p-6 mb-6">
                <h3 className="font-display text-lg font-semibold mb-4">Novo Evento</h3>
                <form onSubmit={handleAddEvento} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="evento-nome">Nome</Label>
                      <Input
                        id="evento-nome"
                        value={eventoForm.nome}
                        onChange={(e) => setEventoForm({ ...eventoForm, nome: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="evento-local">Local</Label>
                      <Input
                        id="evento-local"
                        value={eventoForm.local}
                        onChange={(e) => setEventoForm({ ...eventoForm, local: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="evento-data">Data</Label>
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
                  </div>
                  <div>
                    <Label htmlFor="evento-descricao">Descrição</Label>
                    <Textarea
                      id="evento-descricao"
                      value={eventoForm.descricao}
                      onChange={(e) => setEventoForm({ ...eventoForm, descricao: e.target.value })}
                    />
                  </div>
                  <Button type="submit">
                    <Plus className="h-4 w-4 mr-2" /> Adicionar Evento
                  </Button>
                </form>
              </div>

              <div className="space-y-3">
                {eventos.map((e) => (
                  <div key={e.id} className="bg-card border border-border rounded-lg p-4 flex justify-between items-start">
                    <div>
                      <p className="font-semibold">{e.nome}</p>
                      <p className="text-sm text-muted-foreground">{e.data} • {e.horario} • {e.local}</p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteEvento(e.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}
                {eventos.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">Nenhum evento cadastrado</p>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </Layout>
  );
};

export default Admin;
