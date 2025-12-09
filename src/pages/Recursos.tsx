import { useState } from "react";
import Layout from "@/components/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExternalLink, FileText, Calendar, Clock, MapPin, Users } from "lucide-react";
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

const Recursos = () => {
  const [activeTab, setActiveTab] = useState("sermoes");

  return (
    <Layout>
      {/* Hero */}
      <section className="bg-primary text-primary-foreground py-16 md:py-24">
        <div className="container text-center">
          <h1 className="font-display text-3xl md:text-5xl font-bold animate-fade-in">Recursos</h1>
          <p className="mt-4 text-lg text-primary-foreground/80 max-w-2xl mx-auto animate-fade-in-delay-1">
            Acesse sermões, aulas, agenda de eventos e escalas de serviço.
          </p>
        </div>
      </section>

      {/* Tabs */}
      <section className="py-12 md:py-16 bg-background">
        <div className="container">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-8">
              <TabsTrigger value="sermoes">Sermões</TabsTrigger>
              <TabsTrigger value="ebd">Aulas de EBD</TabsTrigger>
              <TabsTrigger value="agenda">Agenda</TabsTrigger>
              <TabsTrigger value="escalas">Escalas</TabsTrigger>
            </TabsList>

            {/* Sermões */}
            <TabsContent value="sermoes" className="space-y-4">
              {sermoes.map((sermao) => (
                <div key={sermao.id} className="bg-card border border-border rounded-lg p-6">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div>
                      <p className="text-sm text-primary font-medium">{formatDate(sermao.data)}</p>
                      <h3 className="font-display text-lg font-semibold text-foreground mt-1">
                        {sermao.titulo}
                      </h3>
                      <p className="text-muted-foreground mt-1">
                        {sermao.pregador} • {sermao.textoBase}
                      </p>
                    </div>
                    <a
                      href={sermao.linkVideo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Assistir
                    </a>
                  </div>
                </div>
              ))}
            </TabsContent>

            {/* EBD */}
            <TabsContent value="ebd" className="space-y-4">
              {aulas.map((aula) => (
                <div key={aula.id} className="bg-card border border-border rounded-lg p-6">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="flex-1">
                      <p className="text-sm text-primary font-medium">{formatDate(aula.data)}</p>
                      <h3 className="font-display text-lg font-semibold text-foreground mt-1">
                        {aula.titulo}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">Prof. {aula.professor}</p>
                      <p className="text-muted-foreground mt-2 text-sm">{aula.resumo}</p>
                    </div>
                    <a
                      href={aula.linkPdf}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline whitespace-nowrap"
                    >
                      <FileText className="h-4 w-4" />
                      Download PDF
                    </a>
                  </div>
                </div>
              ))}
            </TabsContent>

            {/* Agenda */}
            <TabsContent value="agenda" className="space-y-4">
              {eventos.map((evento) => (
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
                        {evento.titulo}
                      </h3>
                      <p className="text-muted-foreground mt-1">{evento.descricao}</p>
                      <div className="flex flex-wrap gap-4 mt-3 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {evento.horario}
                        </span>
                        <span className="flex items-center gap-1">
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
            <TabsContent value="escalas" className="space-y-4">
              {escalas.map((escala) => (
                <div key={escala.id} className="bg-card border border-border rounded-lg p-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-secondary text-secondary-foreground rounded-lg p-3 text-center min-w-[60px]">
                      <span className="block text-xs uppercase">
                        {new Date(escala.data + "T00:00:00").toLocaleDateString("pt-BR", { month: "short" })}
                      </span>
                      <span className="block text-2xl font-display font-bold">
                        {new Date(escala.data + "T00:00:00").getDate()}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-display text-lg font-semibold text-foreground">
                        {escala.ministerio}
                      </h3>
                      <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                        <Users className="h-4 w-4" />
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
