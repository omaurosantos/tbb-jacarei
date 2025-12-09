import Layout from "@/components/Layout";
import SectionTitle from "@/components/SectionTitle";
import { Check } from "lucide-react";

const Missao = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="bg-primary text-primary-foreground py-16 md:py-24">
        <div className="container text-center">
          <h1 className="font-display text-3xl md:text-5xl font-bold animate-fade-in">Nossa Missão</h1>
          <p className="mt-4 text-lg text-primary-foreground/80 max-w-2xl mx-auto animate-fade-in-delay-1">
            O propósito que nos move como comunidade de fé.
          </p>
        </div>
      </section>

      {/* Conteúdo */}
      <section className="py-16 md:py-20 bg-background">
        <div className="container max-w-4xl">
          <div className="bg-card border border-border rounded-lg p-8 mb-8">
            <blockquote className="text-lg md:text-xl text-foreground italic text-center">
              "Glorificar a Deus, conduzindo pessoas a Cristo, integrando-as à Igreja, levando-as 
              à maturidade cristã pelo estudo da Palavra, discipulado e prática de uma verdadeira 
              adoração, visando o alcance da estatura de Cristo"
            </blockquote>
            <p className="text-center text-primary font-medium mt-4">(Rm 11.36)</p>
          </div>

          <SectionTitle title="Cremos que Deus é glorificado quando:" centered={false} />
          
          <div className="space-y-4 mt-6">
            {[
              "Ajudamos pessoas a conhecerem a Cristo como seu Salvador.",
              "Acompanhamos pessoas por meio de discipulado, para aprenderem a amar a Cristo como Senhor, e andarem com Ele.",
              "Integramos pessoas à igreja local, que como Corpo de Cristo, é o lugar onde recebem edificação para suas vidas e oportunidades para servirem ao próximo.",
              "Nossa maneira de viver redunda em obediência aos seus mandamentos."
            ].map((item, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="bg-primary/10 rounded-full p-1 mt-1">
                  <Check className="h-4 w-4 text-primary" />
                </div>
                <p className="text-muted-foreground">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Missao;
