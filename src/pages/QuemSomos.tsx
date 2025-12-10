import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/Layout";

interface ConteudoPagina {
  titulo: string;
  subtitulo: string | null;
  conteudo: string;
}

const QuemSomos = () => {
  const [conteudo, setConteudo] = useState<ConteudoPagina | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase
        .from("conteudos_paginas")
        .select("titulo, subtitulo, conteudo")
        .eq("pagina", "quem-somos")
        .maybeSingle();

      if (data) setConteudo(data);
      setLoading(false);
    };

    fetchData();
  }, []);

  // Fallback content if database is empty
  const paragrafos = conteudo?.conteudo.split("\n\n").filter(p => p.trim()) || [
    "Somos uma igreja Batista que preserva a Bíblia como regra de fé e prática eclesiástica.",
    "Somos independentes na forma de conduzir nossas atividades e acreditamos que membros de um ministério local devem produzir frutos na comunidade local.",
    "Somos uma igreja que valoriza os relacionamentos, acreditando que por meio deles, Deus nos ajuda a crescer em santidade.",
    "Somos uma igreja que coloca o ensino e a pregação da Palavra de Deus acima de qualquer outra prática, crendo que a exposição bíblica é a nossa principal tarefa.",
    "Somos uma igreja envolvida com a educação. Acreditamos que pelo ensino correto das Escrituras obteremos mudanças consistentes e por esta razão, enfatizamos a educação teológica como grande parte de nosso empenho.",
    "Somos uma igreja que valoriza a adoração e o culto comunitário. Acreditamos que todo salvo deve se reunir em comunidade para adorar ao Senhor.",
  ];

  return (
    <Layout>
      {/* Hero */}
      <section className="bg-primary text-primary-foreground py-16 md:py-24">
        <div className="container text-center">
          <h1 className="font-display text-3xl md:text-5xl font-bold animate-fade-in">
            {conteudo?.titulo || "Quem Somos"}
          </h1>
          <p className="mt-4 text-lg text-primary-foreground/80 max-w-2xl mx-auto animate-fade-in-delay-1">
            {conteudo?.subtitulo || "Conheça a identidade e os valores do Templo Batista Bíblico."}
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
            <div className="prose prose-lg max-w-none text-muted-foreground space-y-6">
              {paragrafos.map((paragrafo, index) => (
                <p key={index}>{paragrafo}</p>
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default QuemSomos;
