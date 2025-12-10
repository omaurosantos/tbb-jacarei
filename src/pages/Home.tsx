import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import SectionTitle from "@/components/SectionTitle";
import LinkCard from "@/components/LinkCard";
import EventCard from "@/components/EventCard";
import { Church, Users, BookOpen, MapPin } from "lucide-react";
import agendaData from "@/data/agenda.json";
import type { Evento } from "@/types";

const Home = () => {
  const eventos = (agendaData as Evento[])
    .sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime())
    .slice(0, 3);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-primary text-primary-foreground py-24 md:py-36 lg:py-44">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="font-display text-display-lg md:text-display-xl font-bold animate-fade-in">
              Bem-vindo ao
              <br />
              Templo Batista Bíblico
            </h1>
            <p className="mt-6 md:mt-8 text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto leading-relaxed animate-fade-in-delay-1">
              Uma comunidade de fé em Jacareí, SP, comprometida com a Palavra de Deus e a transformação de vidas pelo
              evangelho de Jesus Cristo.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-delay-2">
              <Button asChild size="lg" variant="secondary">
                <Link to="/localizacao">Planeje sua visita</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 hover:border-primary-foreground/50"
              >
                <Link to="/recursos">Assista aos sermões</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-20 md:py-28 bg-background">
        <div className="container">
          <SectionTitle
            title="Conheça nossa igreja"
            subtitle="Descubra quem somos, o que fazemos e como você pode fazer parte."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6 stagger-children">
            <LinkCard
              title="A Igreja"
              description="Nossa história, visão, missão e o que cremos."
              to="/igreja"
              icon={<Church className="h-6 w-6" />}
            />
            <LinkCard
              title="Ministérios"
              description="Conheça os ministérios e áreas de serviço."
              to="/ministerios"
              icon={<Users className="h-6 w-6" />}
            />
            <LinkCard
              title="Recursos"
              description="Sermões, estudos e agenda."
              to="/recursos"
              icon={<BookOpen className="h-6 w-6" />}
            />
            <LinkCard
              title="Localização"
              description="Endereço, horários e como chegar."
              to="/localizacao"
              icon={<MapPin className="h-6 w-6" />}
            />
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-20 md:py-28 bg-secondary/50">
        <div className="container">
          <SectionTitle
            title="Próximos eventos"
            subtitle="Fique por dentro do que está acontecendo na nossa comunidade."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 stagger-children">
            {eventos.map((evento) => (
              <EventCard key={evento.id} evento={evento} />
            ))}
          </div>
          <div className="text-center mt-10">
            <Button asChild variant="outline" size="lg">
              <Link to="/recursos">Ver agenda completa</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-28 bg-primary text-primary-foreground">
        <div className="container text-center">
          <h2 className="font-display text-display-sm md:text-display-md font-semibold">Venha nos conhecer</h2>
          <p className="mt-4 text-primary-foreground/70 text-lg max-w-xl mx-auto">
            Domingo às 10h (EBD) e 18h (Culto) • Quarta às 19h30 (Koinonia)
          </p>
          <Button asChild size="lg" variant="secondary" className="mt-8">
            <Link to="/localizacao">Como chegar</Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default Home;
