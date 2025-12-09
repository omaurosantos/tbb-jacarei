import { useState } from "react";
import Layout from "@/components/Layout";
import SectionTitle from "@/components/SectionTitle";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Sprout, Megaphone, Users, Shield, Heart, Baby } from "lucide-react";
import ministeriosData from "@/data/ministerios.json";
import type { Ministerio } from "@/types";

const ministerios = ministeriosData as Ministerio[];

const iconMap: Record<string, React.ReactNode> = {
  Sprout: <Sprout className="h-8 w-8" />,
  Megaphone: <Megaphone className="h-8 w-8" />,
  Users: <Users className="h-8 w-8" />,
  Shield: <Shield className="h-8 w-8" />,
  Heart: <Heart className="h-8 w-8" />,
  Baby: <Baby className="h-8 w-8" />,
};

const Ministerios = () => {
  const [selectedMinisterio, setSelectedMinisterio] = useState<Ministerio | null>(null);

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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {ministerios.map((ministerio, index) => (
              <div
                key={ministerio.id}
                className="bg-card border border-border rounded-lg p-6 hover:shadow-lg hover:border-primary/30 transition-all duration-300"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="text-primary mb-4">
                  {iconMap[ministerio.icone]}
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground">
                  {ministerio.nome}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {ministerio.descricao}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4"
                  onClick={() => setSelectedMinisterio(ministerio)}
                >
                  Saiba mais
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modal */}
      <Dialog open={!!selectedMinisterio} onOpenChange={() => setSelectedMinisterio(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <div className="text-primary mb-2">
              {selectedMinisterio && iconMap[selectedMinisterio.icone]}
            </div>
            <DialogTitle className="font-display text-2xl">
              {selectedMinisterio?.nome}
            </DialogTitle>
            <DialogDescription className="text-base text-muted-foreground pt-4">
              {selectedMinisterio?.descricaoCompleta}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Ministerios;
