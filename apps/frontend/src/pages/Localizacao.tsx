import Layout from "@/components/Layout";
import PageHeader from "@/components/PageHeader";
import SectionTitle from "@/components/SectionTitle";
import { MapPin, Clock, Phone, Mail, Users } from "lucide-react";
import { useContato } from "@/hooks/use-contato";

const Localizacao = () => {
  const contato = useContato();
  const linhasEndereco = contato.endereco.split("\n").filter((linha) => linha.trim());

  return (
    <Layout>
      {/* Hero */}
      <PageHeader title="Localização" subtitle="Encontre-nos e venha fazer parte da nossa comunidade." />

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
                      {linhasEndereco.map((linha, i) => (
                        <span key={i}>
                          {i > 0 && <br />}
                          {linha}
                        </span>
                      ))}
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
                      {contato.horarios.map((h, i) => (
                        <li key={i}>
                          <strong>{h.dia}:</strong> {h.descricao}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 rounded-lg p-3">
                    <Phone className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Telefone</h4>
                    <p className="text-muted-foreground mt-1">{contato.telefone}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 rounded-lg p-3">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">E-mail</h4>
                    <p className="text-muted-foreground mt-1">
                      <a href={`mailto:${contato.email}`} className="hover:text-primary transition-colors">
                        {contato.email}
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
                  src={contato.mapaUrl}
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
              <p className="text-base text-muted-foreground">Quer saber mais ou encontrar um grupo perto de você?</p>
              <p className="text-lg font-semibold text-primary mt-1">Entre em contato: {contato.telefone}</p>
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
