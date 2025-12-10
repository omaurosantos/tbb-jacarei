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
      <section className="bg-primary text-primary-foreground py-20 md:py-32">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center animate-fade-in-up">
            <h1 className="font-display text-3xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Bem-vindo ao
              <br />
              Templo Batista Bíblico
            </h1>
            <p className="mt-6 text-lg md:text-xl text-primary-foreground/85 max-w-2xl mx-auto">
              Uma comunidade de fé em Jacareí, SP, comprometida com a Palavra de Deus e a transformação de vidas pelo
              evangelho de Jesus Cristo.
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
            title="Conheça nossa igreja"
            subtitle="Descubra quem somos, o que fazemos e como você pode fazer parte."
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
            title="Próximos eventos"
            subtitle="Fique por dentro do que está acontecendo na nossa comunidade."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {eventos.map((evento) => (
              <EventCard key={evento.id} evento={evento} />
            ))}
          </div>
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
          <h2 className="font-display text-2xl md:text-3xl font-semibold">Venha nos conhecer</h2>
          <p className="mt-4 text-primary-foreground/80 max-w-xl mx-auto">Domingo às 10h e 18h • Quarta às 19h30</p>
          <Button asChild size="lg" variant="secondary" className="mt-6 font-semibold">
            <Link to="/localizacao">Como chegar</Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default Home;
