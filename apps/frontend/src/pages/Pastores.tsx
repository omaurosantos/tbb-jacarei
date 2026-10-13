import { useState, useEffect } from "react";
import { pastoresService, conteudosService } from "@/lib/api";
import { Pastor } from "shared";
import Layout from "@/components/Layout";
import { Camera } from "lucide-react";

const Pastores = () => {
  const [pastores, setPastores] = useState<Pastor[]>([]);
  const [loading, setLoading] = useState(true);
  const [introText, setIntroText] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pastoresData, conteudoData] = await Promise.all([
          pastoresService.getAll(true),
          conteudosService.getByPagina("pastores").catch(() => null),
        ]);

        setPastores(pastoresData);
        if (conteudoData) setIntroText(conteudoData.conteudo);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="h-8 w-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
            </div>
          ) : pastores.length === 0 ? (
            <p className="text-center text-muted-foreground py-12">
              Nenhum pastor cadastrado no momento.
            </p>
          ) : (
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {pastores.map((pastor) => (
                <div key={pastor.id} className="bg-card border border-border rounded-lg overflow-hidden text-center">
                  {/* Foto */}
                  <div className="h-48 bg-primary/5 flex items-center justify-center">
                    {pastor.fotoUrl ? (
                      <img 
                        src={pastor.fotoUrl} 
                        alt={pastor.nome} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center text-primary/30">
                        <Camera className="h-12 w-12 mb-2" />
                        <span className="text-sm">Sem foto</span>
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
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Pastores;
