import Layout from "@/components/Layout";
import SectionTitle from "@/components/SectionTitle";
import { User } from "lucide-react";
import pastoresData from "@/data/pastores.json";
import type { Pastor } from "@/types";

const pastores = pastoresData as Pastor[];

const Igreja = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="bg-primary text-primary-foreground py-16 md:py-24">
        <div className="container text-center">
          <h1 className="font-display text-3xl md:text-5xl font-bold animate-fade-in">A Igreja</h1>
          <p className="mt-4 text-lg text-primary-foreground/80 max-w-2xl mx-auto animate-fade-in-delay-1">
            Conheça nossa história, valores e o que nos move como comunidade de fé.
          </p>
        </div>
      </section>

      {/* Quem Somos */}
      <section className="py-16 md:py-20 bg-background">
        <div className="container max-w-4xl">
          <SectionTitle title="Quem Somos" />
          <div className="prose prose-lg max-w-none text-muted-foreground">
            <p>
              O Templo Batista Bíblico de Jacareí é uma igreja evangélica de confissão batista, 
              fundamentada nas Escrituras Sagradas como única regra de fé e prática. Fundada em 1985, 
              nossa comunidade tem crescido pela graça de Deus, servindo à cidade de Jacareí e região.
            </p>
            <p>
              Somos uma igreja comprometida com a exposição fiel da Palavra de Deus, o discipulado 
              de novos crentes, a comunhão entre os irmãos e o testemunho do evangelho em nossa cidade 
              e até os confins da terra.
            </p>
          </div>
        </div>
      </section>

      {/* Visão e Missão */}
      <section className="py-16 md:py-20 bg-secondary">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 max-w-4xl mx-auto">
            <div className="bg-card p-8 rounded-lg border border-border">
              <h3 className="font-display text-xl font-semibold text-primary mb-4">Nossa Visão</h3>
              <p className="text-muted-foreground">
                Ser uma igreja que glorifica a Deus pela proclamação do evangelho, formação de 
                discípulos maduros e transformação da comunidade ao nosso redor pelo poder do 
                Espírito Santo.
              </p>
            </div>
            <div className="bg-card p-8 rounded-lg border border-border">
              <h3 className="font-display text-xl font-semibold text-primary mb-4">Nossa Missão</h3>
              <p className="text-muted-foreground">
                Proclamar o evangelho de Jesus Cristo, fazer discípulos de todas as nações, 
                equipar os santos para a obra do ministério e demonstrar o amor de Deus 
                através do serviço à comunidade.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* O que cremos */}
      <section className="py-16 md:py-20 bg-background">
        <div className="container max-w-4xl">
          <SectionTitle title="O que Cremos" />
          <div className="space-y-6">
            {[
              {
                titulo: "As Escrituras",
                texto: "Cremos que a Bíblia é a Palavra de Deus, verbalmente inspirada, inerrante nos manuscritos originais e a autoridade final em todas as questões de fé e conduta."
              },
              {
                titulo: "Deus",
                texto: "Cremos em um só Deus, eternamente existente em três pessoas: Pai, Filho e Espírito Santo, iguais em essência, poder e glória."
              },
              {
                titulo: "Jesus Cristo",
                texto: "Cremos no Senhor Jesus Cristo, na sua divindade, nascimento virginal, vida sem pecado, morte vicária e expiatória, ressurreição corporal, ascensão ao céu e segunda vinda pessoal e visível."
              },
              {
                titulo: "A Salvação",
                texto: "Cremos que a salvação é pela graça mediante a fé, à parte de obras, e que todos os que creem em Jesus Cristo são justificados, regenerados e selados pelo Espírito Santo."
              },
              {
                titulo: "A Igreja",
                texto: "Cremos na igreja como o corpo de Cristo, composta por todos os regenerados, e na igreja local como a expressão visível dessa comunidade, ordenada para o culto, edificação e missão."
              }
            ].map((item, index) => (
              <div key={index} className="border-l-4 border-primary pl-6">
                <h4 className="font-display font-semibold text-foreground">{item.titulo}</h4>
                <p className="mt-2 text-muted-foreground">{item.texto}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pastores */}
      <section className="py-16 md:py-20 bg-secondary">
        <div className="container">
          <SectionTitle 
            title="Nossos Pastores" 
            subtitle="Conheça a liderança pastoral do Templo Batista Bíblico."
          />
          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {pastores.map((pastor) => (
              <div key={pastor.id} className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 rounded-full p-4">
                    <User className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-display font-semibold text-foreground">{pastor.nome}</h4>
                    <p className="text-sm text-primary font-medium">{pastor.funcao}</p>
                    <p className="mt-3 text-sm text-muted-foreground">{pastor.bio}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Igreja;
