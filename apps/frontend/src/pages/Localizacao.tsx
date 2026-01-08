import Layout from "@/components/Layout";
import SectionTitle from "@/components/SectionTitle";
import { MapPin, Clock, Phone, Mail, Users } from "lucide-react";

const Localizacao = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="bg-primary text-primary-foreground py-16 md:py-24">
        <div className="container text-center">
          <h1 className="font-display text-3xl md:text-5xl font-bold animate-fade-in">Localização</h1>
          <p className="mt-4 text-lg text-primary-foreground/80 max-w-2xl mx-auto animate-fade-in-delay-1">
            Encontre-nos e venha fazer parte da nossa comunidade.
          </p>
        </div>
      </section>

      {/* Info */}
      <section className="py-16 md:py-20 bg-background">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Informações */}
            <div>
              <SectionTitle title="Como nos encontrar" centered={false} />

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 rounded-lg p-3">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Endereço</h4>
                    <p className="text-muted-foreground mt-1">
                      R. Carlos de Campos, 447
                      <br />
                      Parque Itamarati, Jacareí - SP
                      <br />
                      CEP: 12307-430
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 rounded-lg p-3">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Horários</h4>
                    <ul className="text-muted-foreground mt-1 space-y-1">
                      <li>
                        <strong>Domingo:</strong> 10h (EBD) e 18h (Culto)
                      </li>
                      <li>
                        <strong>Quarta-feira:</strong> 19h30 (Koinonias - Pequenos Grupos)
                      </li>
                      <li>
                        <strong>Sábado:</strong> 18h (Creser - quinzenal / Conexteen - semanal)
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 rounded-lg p-3">
                    <Phone className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Telefone</h4>
                    <p className="text-muted-foreground mt-1">(12) XXXX-XXXX</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 rounded-lg p-3">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">E-mail</h4>
                    <p className="text-muted-foreground mt-1">
                      <a href="mailto:contato@tbbjacarei.com.br" className="hover:text-primary transition-colors">
                        contato@tbbjacarei.com.br
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Mapa */}
            <div>
              <div className="bg-muted rounded-lg overflow-hidden h-[400px] lg:h-full min-h-[300px]">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3669.123!2d-45.9689!3d-23.2958!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94cdcb5e8d4b1e3d%3A0x1234567890abcdef!2sR.%20Carlos%20de%20Campos%2C%20447%20-%20Parque%20Itamarati%2C%20Jacare%C3%AD%20-%20SP%2C%2012307-430!5e0!3m2!1spt-BR!2sbr!4v1234567890"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Localização do Templo Batista Bíblico"
                  className="grayscale hover:grayscale-0 transition-all duration-300"
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2 text-center">
                * Atualize o link do mapa com a localização exata da igreja
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Koinonias */}
      <section className="py-12 md:py-16 bg-secondary">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center justify-center bg-primary/10 rounded-full p-4 mb-4">
              <Users className="h-8 w-8 text-primary" />
            </div>
            <h2 className="font-display text-2xl md:text-3xl font-semibold text-foreground">
              Koinonias - Pequenos Grupos
            </h2>
            <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
              Nossas Koinonias são pequenos grupos que se reúnem semanalmente às <strong>quartas-feiras</strong> nas
              casas para comunhão, estudo bíblico e oração. É uma excelente oportunidade para crescer na fé e
              desenvolver relacionamentos genuínos.
            </p>
            <div className="mt-6 p-4 bg-card rounded-lg border border-border inline-block">
              <p className="text-sm text-muted-foreground">Quer saber mais ou encontrar um grupo perto de você?</p>
              <p className="text-lg font-semibold text-primary mt-1">Entre em contato: (12) XXXX-XXXX</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 md:py-16 bg-background">
        <div className="container text-center">
          <h2 className="font-display text-2xl font-semibold text-foreground">Primeira visita?</h2>
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
            Será um prazer recebê-lo! Chegue alguns minutos antes para ser recebido por nossa equipe de recepção.
          </p>
        </div>
      </section>
    </Layout>
  );
};

export default Localizacao;
