import { useState, useEffect } from "react";
import { conteudosService } from "@/lib/api";
import { ConteudoPagina } from "shared";
import Layout from "@/components/Layout";
import PageHeader from "@/components/PageHeader";
import SectionTitle from "@/components/SectionTitle";
import { Check } from "lucide-react";

const Missao = () => {
  const [conteudo, setConteudo] = useState<ConteudoPagina | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await conteudosService.getByPagina("missao");
        setConteudo(data);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const itensSalvos = (conteudo?.conteudoExtra as { itens?: string[] })?.itens;
  const itens = itensSalvos && itensSalvos.length > 0 ? itensSalvos : [
    "Ajudamos pessoas a conhecerem a Cristo como seu Salvador.",
    "Acompanhamos pessoas por meio de discipulado, para aprenderem a amar a Cristo como Senhor, e andarem com Ele.",
    "Integramos pessoas à igreja local, que como Corpo de Cristo, é o lugar onde recebem edificação para suas vidas e oportunidades para servirem ao próximo.",
    "Nossa maneira de viver redunda em obediência aos seus mandamentos."
  ];

  return (
    <Layout>
      {/* Hero */}
      <PageHeader title={conteudo?.titulo || "Nossa Missão"} subtitle={conteudo?.subtitulo || "O propósito que nos move como comunidade de fé."} />

      {/* Conteúdo */}
      <section className="py-16 md:py-20 bg-background">
        <div className="container max-w-4xl">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="h-8 w-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
            </div>
          ) : (
            <>
              <div className="bg-card border border-border rounded-lg p-8 mb-8">
                <blockquote className="text-lg md:text-xl text-foreground italic text-center">
                  {conteudo?.conteudo || '"Glorificar a Deus, conduzindo pessoas a Cristo, integrando-as à Igreja, levando-as à maturidade cristã pelo estudo da Palavra, discipulado e prática de uma verdadeira adoração, visando o alcance da estatura de Cristo" (Rm 11.36)'}
                </blockquote>
              </div>

              <SectionTitle title="Cremos que Deus é glorificado quando:" centered={false} />
              
              <div className="space-y-4 mt-6">
                {itens.map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="bg-primary/10 rounded-full p-1 mt-1">
                      <Check className="h-4 w-4 text-primary" />
                    </div>
                    <p className="text-muted-foreground">{item}</p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Missao;
