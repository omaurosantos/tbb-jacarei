import Layout from "@/components/Layout";
import SectionTitle from "@/components/SectionTitle";
import { MapPin, Clock, Phone, Mail } from "lucide-react";

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
                      Rua da Igreja, 123<br />
                      Centro, Jacareí - SP<br />
                      CEP: 12300-000
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 rounded-lg p-3">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Horários dos Cultos</h4>
                    <ul className="text-muted-foreground mt-1 space-y-1">
                      <li><strong>Domingo:</strong> 9h (EBD) e 18h30 (Culto)</li>
                      <li><strong>Quarta-feira:</strong> 19h30 (Reunião de Oração)</li>
                      <li><strong>Sábado:</strong> 19h (Jovens - quinzenal)</li>
                    </ul>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 rounded-lg p-3">
                    <Phone className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Telefone</h4>
                    <p className="text-muted-foreground mt-1">
                      (12) 3456-7890
                    </p>
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
                {/* Placeholder para o Google Maps */}
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3669.5!2d-45.9!3d-23.3!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjPCsDE4JzAwLjAiUyA0NcKwNTQnMDAuMCJX!5e0!3m2!1spt-BR!2sbr!4v1234567890"
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

      {/* CTA */}
      <section className="py-12 md:py-16 bg-secondary">
        <div className="container text-center">
          <h2 className="font-display text-2xl font-semibold text-foreground">
            Primeira visita?
          </h2>
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
            Será um prazer recebê-lo! Chegue alguns minutos antes para ser recebido por nossa 
            equipe de recepção. Temos classes de escola bíblica para todas as idades.
          </p>
        </div>
      </section>
    </Layout>
  );
};

export default Localizacao;
