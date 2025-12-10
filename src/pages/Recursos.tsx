import { useState } from "react";
import Layout from "@/components/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { FileText, Calendar, Clock, MapPin, Users } from "lucide-react";
import sermoesData from "@/data/sermoes.json";
import ebdData from "@/data/ebd.json";
import agendaData from "@/data/agenda.json";
import escalasData from "@/data/escalas.json";
import type { Sermao, AulaEBD, Evento, Escala } from "@/types";

const sermoes = (sermoesData as Sermao[]).sort((a, b) => 
  new Date(b.data).getTime() - new Date(a.data).getTime()
);

const aulas = (ebdData as AulaEBD[]).sort((a, b) => 
  new Date(b.data).getTime() - new Date(a.data).getTime()
);

const eventos = (agendaData as Evento[]).sort((a, b) => 
  new Date(a.data).getTime() - new Date(b.data).getTime()
);

const escalas = (escalasData as Escala[]).sort((a, b) => 
  new Date(a.data).getTime() - new Date(b.data).getTime()
);

const formatDate = (dateString: string) => {
  return new Date(dateString + "T00:00:00").toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const classeColors: Record<string, string> = {
  "Homens": "bg-blue-50 text-blue-700 border-blue-200",
  "Belas": "bg-pink-50 text-pink-700 border-pink-200",
  "Adolescentes": "bg-purple-50 text-purple-700 border-purple-200",
};

const Recursos = () => {
  const [activeTab, setActiveTab] = useState("sermoes");

  return (
    <Layout>
      {/* Hero */}
      <section className="bg-primary text-primary-foreground py-20 md:py-28">
        <div className="container text-center">
          <h1 className="font-display text-display-lg md:text-display-xl font-bold animate-fade-in">Recursos</h1>
          <p className="mt-5 text-lg text-primary-foreground/75 max-w-2xl mx-auto animate-fade-in-delay-1">
            Acesse sermões, aulas, agenda de eventos e escalas de serviço.
          </p>
        </div>
      </section>

      {/* Tabs */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container max-w-4xl">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-10 h-auto p-1.5 bg-secondary rounded-xl">
              <TabsTrigger value="sermoes" className="rounded-lg py-2.5 text-sm font-medium data-[state=active]:bg-card data-[state=active]:shadow-sm">
                Sermões
              </TabsTrigger>
              <TabsTrigger value="ebd" className="rounded-lg py-2.5 text-sm font-medium data-[state=active]:bg-card data-[state=active]:shadow-sm">
                Aulas de EBD
              </TabsTrigger>
              <TabsTrigger value="agenda" className="rounded-lg py-2.5 text-sm font-medium data-[state=active]:bg-card data-[state=active]:shadow-sm">
                Agenda
              </TabsTrigger>
              <TabsTrigger value="escalas" className="rounded-lg py-2.5 text-sm font-medium data-[state=active]:bg-card data-[state=active]:shadow-sm">
                Escalas
              </TabsTrigger>
            </TabsList>

            {/* Sermões */}
            <TabsContent value="sermoes" className="space-y-4 stagger-children">
              {sermoes.map((sermao) => (
                <div key={sermao.id} className="bg-card border border-border rounded-xl p-6 card-hover hover:border-primary/20">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="flex-1">
                      <p className="text-sm text-primary font-medium">{formatDate(sermao.data)}</p>
                      <h3 className="font-display text-lg font-semibold text-foreground mt-1.5">
                        {sermao.titulo}
                      </h3>
                      <p className="text-muted-foreground mt-1.5">
                        {sermao.pregador} • {sermao.textoBase}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {sermao.linkYoutube && (
                        <a
                          href={sermao.linkYoutube}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-sm font-medium bg-red-50 text-red-700 hover:bg-red-100 px-3.5 py-2 rounded-lg transition-colors"
                        >
                          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                          </svg>
                          YouTube
                        </a>
                      )}
                      {sermao.linkSpotify && (
                        <a
                          href={sermao.linkSpotify}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-sm font-medium bg-green-50 text-green-700 hover:bg-green-100 px-3.5 py-2 rounded-lg transition-colors"
                        >
                          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                          </svg>
                          Spotify
                        </a>
                      )}
                      {!sermao.linkYoutube && !sermao.linkSpotify && (
                        <span className="text-sm text-muted-foreground italic">
                          Links em breve
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </TabsContent>

            {/* EBD */}
            <TabsContent value="ebd" className="space-y-4 stagger-children">
              {aulas.map((aula) => (
                <div key={aula.id} className="bg-card border border-border rounded-xl p-6 card-hover hover:border-primary/20">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <p className="text-sm text-primary font-medium">{formatDate(aula.data)}</p>
                        <Badge variant="outline" className={`${classeColors[aula.classe] || "bg-muted text-muted-foreground"} text-xs font-medium`}>
                          {aula.classe}
                        </Badge>
                      </div>
                      <h3 className="font-display text-lg font-semibold text-foreground">
                        {aula.titulo}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">Prof. {aula.professor}</p>
                      <p className="text-muted-foreground mt-3 text-sm leading-relaxed">{aula.resumo}</p>
                    </div>
                    {aula.linkPdf && (
                      <a
                        href={aula.linkPdf}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors whitespace-nowrap"
                      >
                        <FileText className="h-4 w-4" />
                        Download PDF
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </TabsContent>

            {/* Agenda */}
            <TabsContent value="agenda" className="space-y-4 stagger-children">
              {eventos.map((evento) => (
                <div key={evento.id} className="bg-card border border-border rounded-xl overflow-hidden card-hover hover:border-primary/20">
                  <div className="flex">
                    <div className="bg-primary text-primary-foreground p-4 flex flex-col items-center justify-center min-w-[80px]">
                      <span className="text-xs uppercase tracking-wide opacity-75">
                        {new Date(evento.data + "T00:00:00").toLocaleDateString("pt-BR", { month: "short" })}
                      </span>
                      <span className="text-3xl font-display font-bold mt-0.5">
                        {new Date(evento.data + "T00:00:00").getDate()}
                      </span>
                    </div>
                    <div className="p-5 flex-1">
                      <h3 className="font-display text-lg font-semibold text-foreground">
                        {evento.titulo}
                      </h3>
                      <p className="text-muted-foreground mt-1.5 text-sm leading-relaxed">{evento.descricao}</p>
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
              ))}
            </TabsContent>

            {/* Escalas */}
            <TabsContent value="escalas" className="space-y-4 stagger-children">
              {escalas.map((escala) => (
                <div key={escala.id} className="bg-card border border-border rounded-xl overflow-hidden card-hover hover:border-primary/20">
                  <div className="flex">
                    <div className="bg-secondary text-secondary-foreground p-4 flex flex-col items-center justify-center min-w-[80px]">
                      <span className="text-xs uppercase tracking-wide opacity-75">
                        {new Date(escala.data + "T00:00:00").toLocaleDateString("pt-BR", { month: "short" })}
                      </span>
                      <span className="text-3xl font-display font-bold mt-0.5">
                        {new Date(escala.data + "T00:00:00").getDate()}
                      </span>
                    </div>
                    <div className="p-5 flex-1">
                      <h3 className="font-display text-lg font-semibold text-foreground">
                        {escala.ministerio}
                      </h3>
                      <div className="flex items-center gap-2 mt-2.5 text-sm text-muted-foreground">
                        <Users className="h-4 w-4 flex-shrink-0" />
                        <span>{escala.participantes.join(", ")}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </Layout>
  );
};

export default Recursos;
