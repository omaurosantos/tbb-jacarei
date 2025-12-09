import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import SectionTitle from "@/components/SectionTitle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2 } from "lucide-react";
import type { Sermao, AulaEBD, Evento } from "@/types";

const Admin = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("sermoes");

  // Estados para listas locais
  const [sermoes, setSermoes] = useState<Sermao[]>([]);
  const [aulas, setAulas] = useState<AulaEBD[]>([]);
  const [eventos, setEventos] = useState<Evento[]>([]);

  // Carregar dados do localStorage
  useEffect(() => {
    const storedSermoes = localStorage.getItem("admin_sermoes");
    const storedAulas = localStorage.getItem("admin_aulas");
    const storedEventos = localStorage.getItem("admin_eventos");

    if (storedSermoes) setSermoes(JSON.parse(storedSermoes));
    if (storedAulas) setAulas(JSON.parse(storedAulas));
    if (storedEventos) setEventos(JSON.parse(storedEventos));
  }, []);

  // Form states
  const [sermaoForm, setSermaoForm] = useState({
    titulo: "",
    pregador: "",
    data: "",
    textoBase: "",
    linkVideo: "",
  });

  const [aulaForm, setAulaForm] = useState({
    titulo: "",
    professor: "",
    data: "",
    linkPdf: "",
    resumo: "",
  });

  const [eventoForm, setEventoForm] = useState({
    titulo: "",
    data: "",
    horario: "",
    descricao: "",
    local: "",
  });

  // Handlers
  const handleAddSermao = (e: React.FormEvent) => {
    e.preventDefault();
    const newSermao: Sermao = {
      id: Date.now().toString(),
      ...sermaoForm,
    };
    const updated = [newSermao, ...sermoes];
    setSermoes(updated);
    localStorage.setItem("admin_sermoes", JSON.stringify(updated));
    setSermaoForm({ titulo: "", pregador: "", data: "", textoBase: "", linkVideo: "" });
    toast({ title: "Sermão cadastrado com sucesso!" });
  };

  const handleAddAula = (e: React.FormEvent) => {
    e.preventDefault();
    const newAula: AulaEBD = {
      id: Date.now().toString(),
      ...aulaForm,
    };
    const updated = [newAula, ...aulas];
    setAulas(updated);
    localStorage.setItem("admin_aulas", JSON.stringify(updated));
    setAulaForm({ titulo: "", professor: "", data: "", linkPdf: "", resumo: "" });
    toast({ title: "Aula de EBD cadastrada com sucesso!" });
  };

  const handleAddEvento = (e: React.FormEvent) => {
    e.preventDefault();
    const newEvento: Evento = {
      id: Date.now().toString(),
      ...eventoForm,
    };
    const updated = [newEvento, ...eventos];
    setEventos(updated);
    localStorage.setItem("admin_eventos", JSON.stringify(updated));
    setEventoForm({ titulo: "", data: "", horario: "", descricao: "", local: "" });
    toast({ title: "Evento cadastrado com sucesso!" });
  };

  const handleDeleteSermao = (id: string) => {
    const updated = sermoes.filter((s) => s.id !== id);
    setSermoes(updated);
    localStorage.setItem("admin_sermoes", JSON.stringify(updated));
    toast({ title: "Sermão removido" });
  };

  const handleDeleteAula = (id: string) => {
    const updated = aulas.filter((a) => a.id !== id);
    setAulas(updated);
    localStorage.setItem("admin_aulas", JSON.stringify(updated));
    toast({ title: "Aula removida" });
  };

  const handleDeleteEvento = (id: string) => {
    const updated = eventos.filter((e) => e.id !== id);
    setEventos(updated);
    localStorage.setItem("admin_eventos", JSON.stringify(updated));
    toast({ title: "Evento removido" });
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="bg-primary text-primary-foreground py-12 md:py-16">
        <div className="container text-center">
          <h1 className="font-display text-2xl md:text-4xl font-bold">Administração</h1>
          <p className="mt-2 text-primary-foreground/80">
            Protótipo • Os dados são salvos apenas no navegador
          </p>
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
                        value={sermaoForm.textoBase}
                        onChange={(e) => setSermaoForm({ ...sermaoForm, textoBase: e.target.value })}
                        placeholder="Ex: João 3:16"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="sermao-link">Link do Vídeo</Label>
                    <Input
                      id="sermao-link"
                      value={sermaoForm.linkVideo}
                      onChange={(e) => setSermaoForm({ ...sermaoForm, linkVideo: e.target.value })}
                      placeholder="https://youtube.com/..."
                      required
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
                      <Label htmlFor="aula-link">Link do PDF</Label>
                      <Input
                        id="aula-link"
                        value={aulaForm.linkPdf}
                        onChange={(e) => setAulaForm({ ...aulaForm, linkPdf: e.target.value })}
                        placeholder="/materiais/aula.pdf"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="aula-resumo">Resumo</Label>
                    <Textarea
                      id="aula-resumo"
                      value={aulaForm.resumo}
                      onChange={(e) => setAulaForm({ ...aulaForm, resumo: e.target.value })}
                      required
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
                      <p className="text-sm text-muted-foreground">{a.professor} • {a.data}</p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteAula(a.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* Agenda */}
            <TabsContent value="agenda">
              <div className="bg-card border border-border rounded-lg p-6 mb-6">
                <h3 className="font-display text-lg font-semibold mb-4">Novo Evento</h3>
                <form onSubmit={handleAddEvento} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="evento-titulo">Título</Label>
                      <Input
                        id="evento-titulo"
                        value={eventoForm.titulo}
                        onChange={(e) => setEventoForm({ ...eventoForm, titulo: e.target.value })}
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
                        value={eventoForm.horario}
                        onChange={(e) => setEventoForm({ ...eventoForm, horario: e.target.value })}
                        placeholder="19:00"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="evento-descricao">Descrição</Label>
                    <Textarea
                      id="evento-descricao"
                      value={eventoForm.descricao}
                      onChange={(e) => setEventoForm({ ...eventoForm, descricao: e.target.value })}
                      required
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
                      <p className="font-semibold">{e.titulo}</p>
                      <p className="text-sm text-muted-foreground">{e.data} • {e.horario} • {e.local}</p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteEvento(e.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </Layout>
  );
};

export default Admin;
