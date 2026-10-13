import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import SectionTitle from "@/components/SectionTitle";
import LinkCard from "@/components/LinkCard";
import EventCard from "@/components/EventCard";
import { Church, Users, BookOpen, MapPin } from "lucide-react";
import { eventosService, conteudosService } from "@/lib/api";
import { Evento, ConteudoPagina } from "shared";

type HomeContent = ConteudoPagina & {
  conteudo_extra?: {
    horarios?: string;
    secao_conheca?: { titulo: string; subtitulo: string };
    secao_eventos?: { titulo: string; subtitulo: string };
  } | null;
};

const Home = () => {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [content, setContent] = useState<HomeContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const today = new Date().toISOString().split("T")[0];
        const [eventosData, contentData] = await Promise.all([
          eventosService.getAll('asc').then(evts => 
            evts.filter(e => e.data >= today).slice(0, 3)
          ),
          conteudosService.getByPagina("home").catch(() => null),
        ]);

        setEventos(eventosData);
        if (contentData) {
          setContent(contentData as HomeContent);
        }
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const heroTitle = content?.titulo || "Bem-vindo ao Templo Batista Bíblico";
  const heroSubtitle = content?.subtitulo || "Uma comunidade de fé em Jacareí, SP, comprometida com a Palavra de Deus e a transformação de vidas pelo evangelho de Jesus Cristo.";
  const ctaTitle = content?.conteudo || "Venha nos conhecer";
  const horarios = content?.conteudo_extra?.horarios || "Domingo às 10h e 18h • Quarta às 19h30";
  const secaoConheca = content?.conteudo_extra?.secao_conheca || { titulo: "Conheça nossa igreja", subtitulo: "Descubra quem somos, o que fazemos e como você pode fazer parte." };
  const secaoEventos = content?.conteudo_extra?.secao_eventos || { titulo: "Próximos eventos", subtitulo: "Fique por dentro do que está acontecendo na nossa comunidade." };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-primary text-primary-foreground py-20 md:py-32">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center animate-fade-in-up">
            <h1 className="font-display text-3xl md:text-5xl lg:text-6xl font-bold leading-tight whitespace-pre-line">
              {heroTitle}
            </h1>
            <p className="mt-6 text-lg md:text-xl text-primary-foreground/85 max-w-2xl mx-auto">
              {heroSubtitle}
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" variant="secondary" className="font-semibold">
                <Link to="/localizacao">Planeje sua visita</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
              >
                <Link to="/recursos">Assista aos sermões</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-16 md:py-20 bg-background">
        <div className="container">
          <SectionTitle
            title={secaoConheca.titulo}
            subtitle={secaoConheca.subtitulo}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <div className="animate-fade-in-delay-1">
              <LinkCard
                title="A Igreja"
                description="Nossa história, visão, missão e o que cremos."
                to="/igreja"
                icon={<Church className="h-6 w-6" />}
              />
            </div>
            <div className="animate-fade-in-delay-2">
              <LinkCard
                title="Ministérios"
                description="Conheça os ministérios e áreas de serviço."
                to="/ministerios"
                icon={<Users className="h-6 w-6" />}
              />
            </div>
            <div className="animate-fade-in-delay-2">
              <LinkCard
                title="Recursos"
                description="Sermões, estudos e agenda."
                to="/recursos"
                icon={<BookOpen className="h-6 w-6" />}
              />
            </div>
            <div className="animate-fade-in-delay-3">
              <LinkCard
                title="Localização"
                description="Endereço, horários e como chegar."
                to="/localizacao"
                icon={<MapPin className="h-6 w-6" />}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-16 md:py-20 bg-secondary">
        <div className="container">
          <SectionTitle
            title={secaoEventos.titulo}
            subtitle={secaoEventos.subtitulo}
          />
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="h-8 w-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
            </div>
          ) : eventos.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Nenhum evento próximo agendado.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {eventos.map((evento) => (
                <EventCard key={evento.id} evento={evento} />
              ))}
            </div>
          )}
          <div className="text-center mt-8">
            <Button asChild variant="outline">
              <Link to="/recursos#agenda">Ver agenda completa</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 bg-primary text-primary-foreground">
        <div className="container text-center">
          <h2 className="font-display text-2xl md:text-3xl font-semibold">{ctaTitle}</h2>
          <p className="mt-4 text-primary-foreground/80 max-w-xl mx-auto">{horarios}</p>
          <Button asChild size="lg" variant="secondary" className="mt-6 font-semibold">
            <Link to="/localizacao">Como chegar</Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default Home;
