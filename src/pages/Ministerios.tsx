import { useState } from "react";
import Layout from "@/components/Layout";
import SectionTitle from "@/components/SectionTitle";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Sprout, Megaphone, Users, Shield, Heart, Baby, Camera } from "lucide-react";
import ministeriosData from "@/data/ministerios.json";
import type { Ministerio } from "@/types";

const ministerios = ministeriosData as Ministerio[];

const iconMap: Record<string, React.ReactNode> = {
  Sprout: <Sprout className="h-7 w-7" />,
  Megaphone: <Megaphone className="h-7 w-7" />,
  Users: <Users className="h-7 w-7" />,
  Shield: <Shield className="h-7 w-7" />,
  Heart: <Heart className="h-7 w-7" />,
  Baby: <Baby className="h-7 w-7" />,
};

const Ministerios = () => {
  const [selectedMinisterio, setSelectedMinisterio] = useState<Ministerio | null>(null);

  return (
    <Layout>
      {/* Hero */}
      <section className="bg-primary text-primary-foreground py-20 md:py-28">
        <div className="container text-center">
          <h1 className="font-display text-display-lg md:text-display-xl font-bold animate-fade-in">Ministérios</h1>
          <p className="mt-5 text-lg text-primary-foreground/75 max-w-2xl mx-auto animate-fade-in-delay-1">
            Conheça as diversas áreas de serviço onde você pode se envolver e crescer.
          </p>
        </div>
      </section>

      {/* Lista de Ministérios */}
      <section className="py-20 md:py-28 bg-background">
        <div className="container">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 stagger-children">
            {ministerios.map((ministerio) => (
              <div
                key={ministerio.id}
                className="bg-card border border-border rounded-xl overflow-hidden card-hover hover:border-primary/20 group"
              >
                {/* Foto placeholder */}
                <div className="h-44 bg-gradient-to-br from-primary/5 to-secondary flex items-center justify-center relative overflow-hidden">
                  {ministerio.foto ? (
                    <img 
                      src={ministerio.foto} 
                      alt={ministerio.nome} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="flex flex-col items-center text-muted-foreground/40">
                      <Camera className="h-10 w-10 mb-2" />
                      <span className="text-xs">Adicionar foto</span>
                    </div>
                  )}
                </div>
                
                <div className="p-6">
                  <div className="text-primary mb-4 p-2.5 bg-primary/5 rounded-lg inline-block group-hover:bg-primary/10 group-hover:scale-110 transition-all duration-300">
                    {iconMap[ministerio.icone]}
                  </div>
                  <h3 className="font-display text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                    {ministerio.nome}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    {ministerio.descricao}
                  </p>
                  
                  {/* Líderes */}
                  <div className="mt-4 pt-4 border-t border-border">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Liderança</p>
                    <p className="text-sm text-foreground leading-relaxed">
                      {ministerio.lideres.map(l => l.nome).join(" • ")}
                    </p>
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-5 w-full"
                    onClick={() => setSelectedMinisterio(ministerio)}
                  >
                    Saiba mais
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modal */}
      <Dialog open={!!selectedMinisterio} onOpenChange={() => setSelectedMinisterio(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <div className="text-primary mb-3 p-3 bg-primary/5 rounded-lg inline-block">
              {selectedMinisterio && iconMap[selectedMinisterio.icone]}
            </div>
            <DialogTitle className="font-display text-2xl">
              {selectedMinisterio?.nome}
            </DialogTitle>
            <DialogDescription className="text-base text-muted-foreground pt-4 leading-relaxed">
              {selectedMinisterio?.descricaoCompleta}
            </DialogDescription>
          </DialogHeader>
          
          {selectedMinisterio && (
            <div className="mt-4 pt-4 border-t border-border">
              <p className="text-sm font-medium text-foreground mb-3">Liderança:</p>
              <ul className="space-y-1.5">
                {selectedMinisterio.lideres.map((lider, index) => (
                  <li key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary/50" />
                    {lider.nome}
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
