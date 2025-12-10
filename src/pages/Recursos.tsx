import { useState, useMemo } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileText, Calendar, Clock, MapPin, Users, BookOpen, Music, List, ChevronRight, Download } from "lucide-react";
import sermoesData from "@/data/sermoes.json";
import ebdData from "@/data/ebd.json";
import agendaData from "@/data/agenda.json";
import escalasData from "@/data/escalas.json";
import type { Sermao, AulaEBD, Evento, Escala } from "@/types";

const sermoes = sermoesData as Sermao[];
const aulas = ebdData as AulaEBD[];
const eventos = agendaData as Evento[];
const escalas = escalasData as Escala[];

const formatDate = (dateString: string) => {
  return new Date(dateString + "T00:00:00").toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const formatShortDate = (dateString: string) => {
  return new Date(dateString + "T00:00:00").toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
  });
};

const classeColors: Record<string, string> = {
  Homens: "bg-blue-100/80 text-blue-700 border-blue-200",
  Belas: "bg-pink-100/80 text-pink-700 border-pink-200",
  Adolescentes: "bg-purple-100/80 text-purple-700 border-purple-200",
};

type TabType = "sermoes" | "ebd" | "agenda" | "escalas";

const tabs: { id: TabType; label: string; icon: React.ElementType }[] = [
  { id: "sermoes", label: "Sermões", icon: Music },
  { id: "ebd", label: "EBD", icon: BookOpen },
  { id: "agenda", label: "Agenda", icon: Calendar },
  { id: "escalas", label: "Escalas", icon: List },
];

const Recursos = () => {
  const [activeTab, setActiveTab] = useState<TabType>("sermoes");
  const [yearFilter, setYearFilter] = useState<string>("all");

  // Get unique years from sermoes for the filter
  const availableYears = useMemo(() => {
    const years = [...new Set(sermoes.map((s) => new Date(s.data).getFullYear()))];
    return years.sort((a, b) => b - a);
  }, []);

  // Filtered and sorted sermoes
  const filteredSermoes = useMemo(() => {
    let filtered = [...sermoes];
    if (yearFilter !== "all") {
      filtered = filtered.filter(
        (s) => new Date(s.data).getFullYear().toString() === yearFilter
      );
    }
    return filtered.sort(
      (a, b) => new Date(b.data).getTime() - new Date(a.data).getTime()
    );
  }, [yearFilter]);

  // Sorted EBD
  const sortedAulas = useMemo(() => {
    return [...aulas].sort(
      (a, b) => new Date(b.data).getTime() - new Date(a.data).getTime()
    );
  }, []);

  // Sorted agenda (future events, ascending)
  const sortedEventos = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return [...eventos]
      .filter((e) => new Date(e.data + "T00:00:00") >= today)
      .sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime());
  }, []);

  // Group escalas by ministry, then by date
  const groupedEscalas = useMemo(() => {
    const groups: Record<string, Record<string, Escala[]>> = {};
    
    const sorted = [...escalas].sort(
      (a, b) => new Date(a.data).getTime() - new Date(b.data).getTime()
    );

    sorted.forEach((escala) => {
      if (!groups[escala.ministerio]) {
        groups[escala.ministerio] = {};
      }
      if (!groups[escala.ministerio][escala.data]) {
        groups[escala.ministerio][escala.data] = [];
      }
      groups[escala.ministerio][escala.data].push(escala);
    });

    return groups;
  }, []);

  return (
    <Layout>
      {/* Hero */}
      <section className="bg-primary text-primary-foreground py-20 md:py-28">
        <div className="container text-center">
          <h1 className="font-display text-display-lg md:text-display-xl font-bold animate-fade-in">
            Recursos
          </h1>
          <p className="mt-5 text-lg text-primary-foreground/75 max-w-2xl mx-auto animate-fade-in-delay-1">
            Acesse sermões, aulas, agenda de eventos e escalas de serviço.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container max-w-5xl">
          {/* Segmented Control */}
          <div className="flex justify-center mb-12">
            <div className="inline-flex bg-secondary p-1.5 rounded-xl gap-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                      ${
                        activeTab === tab.id
                          ? "bg-card text-foreground shadow-sm"
                          : "text-muted-foreground hover:text-foreground hover:bg-card/50"
                      }
                    `}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sermões */}
          {activeTab === "sermoes" && (
            <div className="space-y-6 animate-fade-in">
              {/* Filter */}
              <div className="flex justify-end">
                <Select value={yearFilter} onValueChange={setYearFilter}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Filtrar por ano" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os anos</SelectItem>
                    {availableYears.map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* List */}
              <div className="space-y-4">
                {filteredSermoes.length === 0 ? (
                  <p className="text-center text-muted-foreground py-12">
                    Nenhum sermão encontrado para este ano.
                  </p>
                ) : (
                  filteredSermoes.map((sermao) => (
                    <div
                      key={sermao.id}
                      className="bg-card border border-border rounded-xl p-5 md:p-6 card-hover hover:border-primary/20 group"
                    >
                      <div className="flex flex-col md:flex-row md:items-center gap-4">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-primary font-medium">
                            {formatDate(sermao.data)}
                          </p>
                          <h3 className="font-display text-lg font-semibold text-foreground mt-1 truncate">
                            {sermao.titulo}
                          </h3>
                          <p className="text-muted-foreground mt-1 text-sm">
                            {sermao.pregador} • <span className="italic">{sermao.textoBase}</span>
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="self-start md:self-center group-hover:border-primary group-hover:text-primary shrink-0"
                        >
                          Ver detalhes
                          <ChevronRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-0.5" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* EBD */}
          {activeTab === "ebd" && (
            <div className="space-y-4 animate-fade-in">
              {sortedAulas.map((aula) => (
                <div
                  key={aula.id}
                  className="bg-card border border-border rounded-xl p-5 md:p-6 card-hover hover:border-primary/20"
                >
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm text-primary font-medium">
                        {formatDate(aula.data)}
                      </p>
                      <Badge
                        variant="outline"
                        className={`${classeColors[aula.classe] || "bg-muted text-muted-foreground"} text-xs font-medium`}
                      >
                        {aula.classe}
                      </Badge>
                    </div>
                    <div>
                      <h3 className="font-display text-lg font-semibold text-foreground">
                        {aula.titulo}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Prof. {aula.professor}
                      </p>
                      <p className="text-muted-foreground mt-3 text-sm leading-relaxed line-clamp-3">
                        {aula.resumo}
                      </p>
                    </div>
                    {aula.linkPdf && (
                      <a
                        href={aula.linkPdf}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors self-start"
                      >
                        <Download className="h-4 w-4" />
                        Download PDF
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Agenda */}
          {activeTab === "agenda" && (
            <div className="space-y-4 animate-fade-in">
              {sortedEventos.length === 0 ? (
                <p className="text-center text-muted-foreground py-12">
                  Nenhum evento futuro agendado.
                </p>
              ) : (
                sortedEventos.map((evento) => (
                  <div
                    key={evento.id}
                    className="bg-card border border-border rounded-xl overflow-hidden card-hover hover:border-primary/20"
                  >
                    <div className="flex">
                      <div className="bg-primary text-primary-foreground p-4 md:p-5 flex flex-col items-center justify-center min-w-[80px] md:min-w-[100px]">
                        <span className="text-xs uppercase tracking-wide opacity-80">
                          {new Date(evento.data + "T00:00:00").toLocaleDateString(
                            "pt-BR",
                            { month: "short" }
                          )}
                        </span>
                        <span className="text-3xl md:text-4xl font-display font-bold mt-0.5">
                          {new Date(evento.data + "T00:00:00").getDate()}
                        </span>
                      </div>
                      <div className="p-5 flex-1">
                        <h3 className="font-display text-lg font-semibold text-foreground">
                          {evento.titulo}
                        </h3>
                        <p className="text-muted-foreground mt-1.5 text-sm leading-relaxed">
                          {evento.descricao}
                        </p>
                        <div className="flex flex-wrap gap-4 mt-3 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1.5">
                            <Clock className="h-4 w-4" />
                            {evento.horario}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <MapPin className="h-4 w-4" />
                            {evento.local}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Escalas */}
          {activeTab === "escalas" && (
            <div className="space-y-8 animate-fade-in">
              {Object.keys(groupedEscalas).length === 0 ? (
                <p className="text-center text-muted-foreground py-12">
                  Nenhuma escala cadastrada.
                </p>
              ) : (
                Object.entries(groupedEscalas).map(([ministerio, dateGroups]) => (
                  <div key={ministerio}>
                    <h3 className="font-display text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-primary" />
                      {ministerio}
                    </h3>
                    <div className="space-y-3 pl-4 border-l-2 border-border">
                      {Object.entries(dateGroups).map(([data, escalasList]) => (
                        <div
                          key={data}
                          className="bg-card border border-border rounded-xl p-4 md:p-5 card-hover hover:border-primary/20"
                        >
                          <div className="flex items-start gap-4">
                            <div className="bg-secondary text-foreground px-3 py-2 rounded-lg text-center min-w-[60px]">
                              <span className="text-xs uppercase tracking-wide text-muted-foreground block">
                                {new Date(data + "T00:00:00").toLocaleDateString(
                                  "pt-BR",
                                  { month: "short" }
                                )}
                              </span>
                              <span className="text-xl font-display font-bold">
                                {new Date(data + "T00:00:00").getDate()}
                              </span>
                            </div>
                            <div className="flex-1">
                              {escalasList.map((escala) => (
                                <div
                                  key={escala.id}
                                  className="flex items-center gap-2 text-sm text-muted-foreground"
                                >
                                  <Users className="h-4 w-4 flex-shrink-0 text-primary" />
                                  <span>{escala.participantes.join(", ")}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Recursos;
