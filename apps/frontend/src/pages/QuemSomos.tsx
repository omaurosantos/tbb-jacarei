import { useState, useEffect } from "react";
import { conteudosService } from "@/lib/api";
import { ConteudoPagina } from "shared";
import Layout from "@/components/Layout";
import PageHeader from "@/components/PageHeader";

const QuemSomos = () => {
  const [conteudo, setConteudo] = useState<ConteudoPagina | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await conteudosService.getByPagina("quem-somos");
        setConteudo(data);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setLoading(false);
      }
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
      <PageHeader title={conteudo?.titulo || "Quem Somos"} subtitle={conteudo?.subtitulo || "Conheça a identidade e os valores do Templo Batista Bíblico."} />

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
