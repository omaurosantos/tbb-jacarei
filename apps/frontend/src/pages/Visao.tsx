import { useState, useEffect } from "react";
import { conteudosService } from "@/lib/api";
import { ConteudoPagina } from "shared";
import Layout from "@/components/Layout";
import { Users, Heart, BookOpen, GraduationCap } from "lucide-react";

interface Pilar {
  titulo: string;
  referencia: string;
  descricao: string;
  icone: string;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Heart,
  Users,
  BookOpen,
  GraduationCap,
};

const defaultPilares: Pilar[] = [
  { titulo: "Apascentar", referencia: "Col 1.28", descricao: "Contribuir para o desenvolvimento pessoal e integral do grupo", icone: "Heart" },
  { titulo: "Evangelizar", referencia: "Mc 16.16", descricao: "Formação de novos discípulos", icone: "Users" },
  { titulo: "Discipular", referencia: "Mt 28.19-20", descricao: "Formação de discípulos novos", icone: "BookOpen" },
  { titulo: "Treinar", referencia: "2 Tm 2.2", descricao: "Formação de novos líderes", icone: "GraduationCap" },
];

const Visao = () => {
  const [conteudo, setConteudo] = useState<ConteudoPagina | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await conteudosService.getByPagina("visao");
        setConteudo(data);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const pilares = (conteudo?.conteudoExtra as { pilares?: Pilar[] })?.pilares || defaultPilares;
  const paragrafos = conteudo?.conteudo.split("\n\n").filter(p => p.trim()) || [
    "Cumprimos nossa missão ao percebermos o grande desafio que temos, em sermos uma igreja que investe vida em vidas; apreciando mais as pessoas do que programas e mais os relacionamentos do que eventos.",
    "Para isso, cada ministério da igreja está em desenvolvimento para cultivar 4 áreas em sua atuação:",
  ];

  return (
    <Layout>
      {/* Hero */}
      <section className="bg-primary text-primary-foreground py-16 md:py-24">
        <div className="container text-center">
          <h1 className="font-display text-3xl md:text-5xl font-bold animate-fade-in">
            {conteudo?.titulo || "Nossa Visão"}
          </h1>
          <p className="mt-4 text-lg text-primary-foreground/80 max-w-2xl mx-auto animate-fade-in-delay-1">
            {conteudo?.subtitulo || "O grande desafio que temos pela frente."}
          </p>
        </div>
      </section>

      {/* Conteúdo */}
      <section className="py-16 md:py-20 bg-background">
        <div className="container max-w-4xl">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="h-8 w-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
            </div>
          ) : (
            <>
              <div className="prose prose-lg max-w-none text-muted-foreground mb-12">
                {paragrafos.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {pilares.map((pilar, index) => {
                  const IconComponent = iconMap[pilar.icone] || Heart;
                  return (
                    <div 
                      key={index} 
                      className="bg-card border border-border rounded-lg p-6 hover:shadow-lg hover:border-primary/30 transition-all duration-300"
                    >
                      <div className="bg-primary/10 rounded-full p-3 w-fit mb-4">
                        <IconComponent className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="font-display text-xl font-semibold text-foreground">
                        {pilar.titulo}
                      </h3>
                      <p className="text-sm text-primary font-medium mt-1">{pilar.referencia}</p>
                      <p className="text-muted-foreground mt-2">{pilar.descricao}</p>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Visao;
