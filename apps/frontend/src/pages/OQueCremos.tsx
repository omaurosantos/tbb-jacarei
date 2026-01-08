import { useState, useEffect } from "react";
import { conteudosService } from "@/lib/api";
import { ConteudoPagina } from "shared";
import Layout from "@/components/Layout";

interface Crenca {
  titulo: string;
  texto: string;
}

const defaultCrencas: Crenca[] = [
  { titulo: "A Bíblia é suficiente para conduzir nossas vidas, igreja, família e ministérios", texto: "Cremos que a Bíblia é a Palavra de Deus Inerrante (Mt 5.17-18; Jo 10.35), Inspirada (2 Tm 3.16-17; 2 Pe 1.20-21) e totalmente Suficiente para o homem moderno (1 Pe 1.3; Hb 4.12; Sl 119.105)." },
  { titulo: "Deus é o Criador de todas as coisas", texto: "Cremos num Deus único (Dt 6.4-5), eterno, infinito, imutável, criador de todas as coisas, pessoal, e que se revela por meio de três pessoas essencialmente iguais: Pai, Filho e Espírito Santo (Is 48.16; Mt 28.19-20)." },
  { titulo: "Jesus Cristo é Deus que se tornou homem para redimir a humanidade de seus pecados", texto: "Conforme Mt 16.16, Jesus é o Cristo o filho do Deus vivo. Ele é o Deus-Homem, partilhando plenamente da eterna divindade e de nossa frágil humanidade (Fp 2.7)." },
  { titulo: "O Espírito Santo é Deus e o agente da vida da igreja", texto: "Cremos que o Espírito Santo é a terceira pessoa da Trindade. Ele não é uma força impessoal, pois tem personalidade (Rm 8.27), emoções (Ef 4.30), e vontade (1 Co 12.11)." },
];

const OQueCremos = () => {
  const [conteudo, setConteudo] = useState<ConteudoPagina | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await conteudosService.getByPagina("o-que-cremos");
        setConteudo(data);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const crencas = (conteudo?.conteudoExtra as { crencas?: Crenca[] })?.crencas || defaultCrencas;

  return (
    <Layout>
      {/* Hero */}
      <section className="bg-primary text-primary-foreground py-16 md:py-24">
        <div className="container text-center">
          <h1 className="font-display text-3xl md:text-5xl font-bold animate-fade-in">
            {conteudo?.titulo || "O Que Cremos"}
          </h1>
          <p className="mt-4 text-lg text-primary-foreground/80 max-w-2xl mx-auto animate-fade-in-delay-1">
            {conteudo?.subtitulo || "As doutrinas que fundamentam nossa fé e prática."}
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
            <div className="space-y-6">
              {crencas.map((crenca, index) => (
                <div key={index} className="border-l-4 border-primary pl-6 py-2">
                  <h3 className="font-display font-semibold text-foreground text-lg">
                    {crenca.titulo}
                  </h3>
                  <p className="mt-2 text-muted-foreground">{crenca.texto}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default OQueCremos;
