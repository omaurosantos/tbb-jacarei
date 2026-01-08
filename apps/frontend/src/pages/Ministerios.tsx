import { useState, useEffect } from "react";
import { ministeriosService } from "@/lib/api";
import { Ministerio } from "shared";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Sprout, Megaphone, Users, Shield, Heart, Baby, Music, BookOpen, Mic, Hand, Camera } from "lucide-react";

const iconMap: Record<string, React.ReactNode> = {
  Sprout: <Sprout className="h-8 w-8" />,
  Megaphone: <Megaphone className="h-8 w-8" />,
  Users: <Users className="h-8 w-8" />,
  Shield: <Shield className="h-8 w-8" />,
  Heart: <Heart className="h-8 w-8" />,
  Baby: <Baby className="h-8 w-8" />,
  Music: <Music className="h-8 w-8" />,
  BookOpen: <BookOpen className="h-8 w-8" />,
  Mic: <Mic className="h-8 w-8" />,
  Hand: <Hand className="h-8 w-8" />,
};

const Ministerios = () => {
  const [ministerios, setMinisterios] = useState<Ministerio[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMinisterio, setSelectedMinisterio] = useState<Ministerio | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const ministeriosData = await ministeriosService.getAll(true);
        setMinisterios(ministeriosData);
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
          <h1 className="font-display text-3xl md:text-5xl font-bold animate-fade-in">Ministérios</h1>
          <p className="mt-4 text-lg text-primary-foreground/80 max-w-2xl mx-auto animate-fade-in-delay-1">
            Conheça as diversas áreas de serviço onde você pode se envolver e crescer.
          </p>
        </div>
      </section>

      {/* Lista de Ministérios */}
      <section className="py-16 md:py-20 bg-background">
        <div className="container">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="h-8 w-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
            </div>
          ) : ministerios.length === 0 ? (
            <p className="text-center text-muted-foreground py-12">
              Nenhum ministério cadastrado no momento.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {ministerios.map((ministerio, index) => (
                <div
                  key={ministerio.id}
                  className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg hover:border-primary/30 transition-all duration-300"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Foto placeholder */}
                  <div className="h-40 bg-primary/5 flex items-center justify-center">
                    {ministerio.fotoUrl ? (
                      <img 
                        src={ministerio.fotoUrl} 
                        alt={ministerio.nome} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center text-primary/30">
                        <Camera className="h-10 w-10 mb-1" />
                        <span className="text-xs">Sem foto</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-6">
                    <div className="text-primary mb-3">
                      {iconMap[ministerio.icone] || <Users className="h-8 w-8" />}
                    </div>
                    <h3 className="font-display text-xl font-semibold text-foreground">
                      {ministerio.nome}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {ministerio.descricao}
                    </p>
                    
                    {/* Líderes */}
                    {ministerio.lideres && ministerio.lideres.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-border">
                        <p className="text-xs text-muted-foreground mb-1">Liderança:</p>
                        <p className="text-sm text-foreground">
                          {ministerio.lideres.map(l => l.nome).join(", ")}
                        </p>
                      </div>
                    )}
                    
                    {ministerio.descricaoCompleta && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-4"
                        onClick={() => setSelectedMinisterio(ministerio)}
                      >
                        Saiba mais
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Modal */}
      <Dialog open={!!selectedMinisterio} onOpenChange={() => setSelectedMinisterio(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <div className="text-primary mb-2">
              {selectedMinisterio && (iconMap[selectedMinisterio.icone] || <Users className="h-8 w-8" />)}
            </div>
            <DialogTitle className="font-display text-2xl">
              {selectedMinisterio?.nome}
            </DialogTitle>
            <DialogDescription className="text-base text-muted-foreground pt-4">
              {selectedMinisterio?.descricaoCompleta}
            </DialogDescription>
          </DialogHeader>
          
          {selectedMinisterio?.lideres && selectedMinisterio.lideres.length > 0 && (
            <div className="mt-4 pt-4 border-t border-border">
              <p className="text-sm font-medium text-foreground mb-2">Liderança:</p>
              <ul className="space-y-1">
                {selectedMinisterio.lideres.map((lider, index) => (
                  <li key={index} className="text-sm text-muted-foreground">
                    • {lider.nome}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Ministerios;
