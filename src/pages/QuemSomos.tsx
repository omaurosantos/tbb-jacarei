import Layout from "@/components/Layout";
import SectionTitle from "@/components/SectionTitle";

const QuemSomos = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="bg-primary text-primary-foreground py-16 md:py-24">
        <div className="container text-center">
          <h1 className="font-display text-3xl md:text-5xl font-bold animate-fade-in">Quem Somos</h1>
          <p className="mt-4 text-lg text-primary-foreground/80 max-w-2xl mx-auto animate-fade-in-delay-1">
            Conheça a identidade e os valores do Templo Batista Bíblico.
          </p>
        </div>
      </section>

      {/* Conteúdo */}
      <section className="py-16 md:py-20 bg-background">
        <div className="container max-w-4xl">
          <div className="prose prose-lg max-w-none text-muted-foreground space-y-6">
            <p>
              Somos uma igreja Batista que preserva a Bíblia como regra de fé e prática eclesiástica.
            </p>
            
            <p>
              Somos independentes na forma de conduzir nossas atividades e acreditamos que membros 
              de um ministério local devem produzir frutos na comunidade local.
            </p>
            
            <p>
              Somos uma igreja que valoriza os relacionamentos, acreditando que por meio deles, 
              Deus nos ajuda a crescer em santidade.
            </p>
            
            <p>
              Somos uma igreja que coloca o ensino e a pregação da Palavra de Deus acima de qualquer 
              outra prática, crendo que a exposição bíblica é a nossa principal tarefa.
            </p>
            
            <p>
              Somos uma igreja envolvida com a educação. Acreditamos que pelo ensino correto das 
              Escrituras obteremos mudanças consistentes e por esta razão, enfatizamos a educação 
              teológica como grande parte de nosso empenho.
            </p>
            
            <p>
              Somos uma igreja que valoriza a adoração e o culto comunitário. Acreditamos que todo 
              salvo deve se reunir em comunidade para adorar ao Senhor.
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default QuemSomos;
