import { useState, useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { FileText, Clock, MapPin } from "lucide-react";
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

const formatDate = (dateString: string) => {
  return new Date(dateString + "T00:00:00").toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const classeColors: Record<string, string> = {
  "Homens": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  "Belas": "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300",
  "Adolescentes": "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
};

const Recursos = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("sermoes");
  const [sermoes, setSermoes] = useState<Sermao[]>([]);
  const [aulas, setAulas] = useState<AulaEBD[]>([]);
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);

  // Search and filter states for sermões
  const [sermaoSearch, setSermaoSearch] = useState("");
  const [sermaoMonth, setSermaoMonth] = useState<number | null>(null);
  const [sermaoYear, setSermaoYear] = useState<number | null>(null);

  // Search and filter states for aulas
  const [aulaSearch, setAulaSearch] = useState("");
  const [aulaMonth, setAulaMonth] = useState<number | null>(null);
  const [aulaYear, setAulaYear] = useState<number | null>(null);

  useEffect(() => {
    if (location.hash === "#agenda") {
      setActiveTab("agenda");
    }
  }, [location.hash]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      const [sermoesRes, aulasRes, eventosRes] = await Promise.all([
        supabase.from("sermoes").select("*").order("data", { ascending: false }),
        supabase.from("aulas_ebd").select("*").order("data", { ascending: false }),
        supabase.from("eventos").select("*").order("data", { ascending: true }),
      ]);

      if (sermoesRes.data) setSermoes(sermoesRes.data);
      if (aulasRes.data) setAulas(aulasRes.data);
      if (eventosRes.data) setEventos(eventosRes.data);
      
      setLoading(false);
    };

    fetchData();
  }, []);

  // Pagination hooks
  const sermoesPagination = usePagination({
    data: sermoes,
    itemsPerPage: 8,
    searchFields: ["titulo", "pregador"] as (keyof Sermao)[],
    searchQuery: sermaoSearch,
    dateField: "data" as keyof Sermao,
    filterMonth: sermaoMonth,
    filterYear: sermaoYear,
  });

  const aulasPagination = usePagination({
    data: aulas,
    itemsPerPage: 8,
    searchFields: ["titulo", "professor"] as (keyof AulaEBD)[],
    searchQuery: aulaSearch,
    dateField: "data" as keyof AulaEBD,
    filterMonth: aulaMonth,
    filterYear: aulaYear,
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

  return (
    <Layout>
      {/* Hero */}
      <section className="bg-primary text-primary-foreground py-16 md:py-24">
        <div className="container text-center">
          <h1 className="font-display text-3xl md:text-5xl font-bold animate-fade-in">Recursos</h1>
          <p className="mt-4 text-lg text-primary-foreground/80 max-w-2xl mx-auto animate-fade-in-delay-1">
            Acesse sermões, aulas e agenda de eventos.
          </p>
        </div>
      </section>

      {/* Tabs */}
      <section className="py-12 md:py-16 bg-background">
        <div className="container">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="sermoes">Sermões</TabsTrigger>
              <TabsTrigger value="ebd">Aulas de EBD</TabsTrigger>
              <TabsTrigger value="agenda">Agenda</TabsTrigger>
            </TabsList>

            {loading ? (
              <div className="flex justify-center py-12">
                <div className="h-8 w-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
              </div>
            ) : (
              <>
                {/* Sermões */}
                <TabsContent value="sermoes" className="space-y-6">
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

                  {sermoesPagination.totalItems === 0 ? (
                    <p className="text-center text-muted-foreground py-8">
                      {sermaoSearch || sermaoMonth !== null || sermaoYear !== null 
                        ? "Nenhum sermão encontrado com os filtros aplicados." 
                        : "Nenhum sermão disponível no momento."}
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {sermoesPagination.paginatedData.map((sermao) => (
                        <div key={sermao.id} className="bg-card border border-border rounded-lg p-6">
                          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                            <div className="flex-1">
                              <p className="text-sm text-primary font-medium">{formatDate(sermao.data)}</p>
                              <h3 className="font-display text-lg font-semibold text-foreground mt-1">
                                {sermao.titulo}
                              </h3>
                              <p className="text-muted-foreground mt-1">
                                {sermao.pregador} {sermao.texto_base && `• ${sermao.texto_base}`}
                              </p>
                              {sermao.resumo && (
                                <p className="text-sm text-muted-foreground mt-2">{sermao.resumo}</p>
                              )}
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {sermao.link_youtube && (
                                <a
                                  href={sermao.link_youtube}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-2 text-sm font-medium bg-red-100 text-red-700 hover:bg-red-200 px-3 py-1.5 rounded-full transition-colors"
                                >
                                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                                  </svg>
                                  YouTube
                                </a>
                              )}
                              {sermao.link_spotify && (
                                <a
                                  href={sermao.link_spotify}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-2 text-sm font-medium bg-green-100 text-green-700 hover:bg-green-200 px-3 py-1.5 rounded-full transition-colors"
                                >
                                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                                  </svg>
                                  Spotify
                                </a>
                              )}
                              {!sermao.link_youtube && !sermao.link_spotify && (
                                <span className="text-sm text-muted-foreground italic">
                                  Links em breve
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <PaginationControls
                    currentPage={sermoesPagination.currentPage}
                    totalPages={sermoesPagination.totalPages}
                    totalItems={sermoesPagination.totalItems}
                    onPageChange={sermoesPagination.goToPage}
                    hasNextPage={sermoesPagination.hasNextPage}
                    hasPrevPage={sermoesPagination.hasPrevPage}
                    itemsPerPage={8}
                  />
                </TabsContent>

                {/* EBD */}
                <TabsContent value="ebd" className="space-y-6">
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

                  {aulasPagination.totalItems === 0 ? (
                    <p className="text-center text-muted-foreground py-8">
                      {aulaSearch || aulaMonth !== null || aulaYear !== null 
                        ? "Nenhuma aula encontrada com os filtros aplicados." 
                        : "Nenhuma aula disponível no momento."}
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {aulasPagination.paginatedData.map((aula) => (
                        <div key={aula.id} className="bg-card border border-border rounded-lg p-6">
                          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <p className="text-sm text-primary font-medium">{formatDate(aula.data)}</p>
                                <Badge className={classeColors[aula.classe] || "bg-muted text-muted-foreground"}>
                                  {aula.classe}
                                </Badge>
                              </div>
                              <h3 className="font-display text-lg font-semibold text-foreground mt-1">
                                {aula.titulo}
                              </h3>
                              <p className="text-sm text-muted-foreground mt-1">Prof. {aula.professor}</p>
                              {aula.resumo && (
                                <p className="text-muted-foreground mt-2 text-sm">{aula.resumo}</p>
                              )}
                            </div>
                            {aula.link_pdf && (
                              <a
                                href={aula.link_pdf}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline whitespace-nowrap"
                              >
                                <FileText className="h-4 w-4" />
                                Download PDF
                              </a>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <PaginationControls
                    currentPage={aulasPagination.currentPage}
                    totalPages={aulasPagination.totalPages}
                    totalItems={aulasPagination.totalItems}
                    onPageChange={aulasPagination.goToPage}
                    hasNextPage={aulasPagination.hasNextPage}
                    hasPrevPage={aulasPagination.hasPrevPage}
                    itemsPerPage={8}
                  />
                </TabsContent>

                {/* Agenda */}
                <TabsContent value="agenda" className="space-y-4">
                  {eventos.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">Nenhum evento agendado no momento.</p>
                  ) : (
                    eventos.map((evento) => (
                      <div key={evento.id} className="bg-card border border-border rounded-lg p-6">
                        <div className="flex items-start gap-4">
                          <div className="bg-primary text-primary-foreground rounded-lg p-3 text-center min-w-[60px]">
                            <span className="block text-xs uppercase">
                              {new Date(evento.data + "T00:00:00").toLocaleDateString("pt-BR", { month: "short" })}
                            </span>
                            <span className="block text-2xl font-display font-bold">
                              {new Date(evento.data + "T00:00:00").getDate()}
                            </span>
                          </div>
                          <div className="flex-1">
                            <h3 className="font-display text-lg font-semibold text-foreground">
                              {evento.nome}
                            </h3>
                            {evento.descricao && (
                              <p className="text-muted-foreground mt-1">{evento.descricao}</p>
                            )}
                            <div className="flex flex-wrap gap-4 mt-3 text-sm text-muted-foreground">
                              {evento.horario && (
                                <span className="flex items-center gap-1">
                                  <Clock className="h-4 w-4" />
                                  {evento.horario}
                                </span>
                              )}
                              <span className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                {evento.local}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </TabsContent>
              </>
            )}
          </Tabs>
        </div>
      </section>
    </Layout>
  );
};

export default Recursos;
