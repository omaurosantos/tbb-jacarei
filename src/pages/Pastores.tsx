import Layout from "@/components/Layout";
import SectionTitle from "@/components/SectionTitle";
import { Camera } from "lucide-react";
import pastoresData from "@/data/pastores.json";
import type { Pastor } from "@/types";

const pastores = pastoresData as Pastor[];

const Pastores = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="bg-primary text-primary-foreground py-16 md:py-24">
        <div className="container text-center">
          <h1 className="font-display text-3xl md:text-5xl font-bold animate-fade-in">Nossos Pastores</h1>
          <p className="mt-4 text-lg text-primary-foreground/80 max-w-2xl mx-auto animate-fade-in-delay-1">
            Conheça a liderança pastoral do Templo Batista Bíblico.
          </p>
        </div>
      </section>

      {/* Intro */}
      <section className="py-12 md:py-16 bg-secondary">
        <div className="container max-w-3xl text-center">
          <p className="text-muted-foreground">
            Cremos que o modelo bíblico para o pastorado visa o trabalho em equipe (Ef 4.11; At 13.1-3; 14.23; 15.4). 
            Por isso entendemos que a autoridade pastoral essencial independe da área de atuação, dando à igreja 
            pastores e não pastores sêniores e auxiliares. Neste caso, a função não determina a vocação.
          </p>
        </div>
      </section>

      {/* Pastores */}
      <section className="py-16 md:py-20 bg-background">
        <div className="container">
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {pastores.map((pastor) => (
              <div key={pastor.id} className="bg-card border border-border rounded-lg overflow-hidden text-center">
                {/* Foto */}
                <div className="h-48 bg-primary/5 flex items-center justify-center">
                  {pastor.foto ? (
                    <img 
                      src={pastor.foto} 
                      alt={pastor.nome} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center text-primary/30">
                      <Camera className="h-12 w-12 mb-2" />
                      <span className="text-sm">Adicionar foto</span>
                    </div>
                  )}
                </div>
                
                <div className="p-6">
                  <h3 className="font-display text-xl font-semibold text-foreground">{pastor.nome}</h3>
                  <p className="text-sm text-primary font-medium mt-1">{pastor.funcao}</p>
                  {pastor.bio && (
                    <p className="mt-4 text-sm text-muted-foreground">{pastor.bio}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Pastores;
