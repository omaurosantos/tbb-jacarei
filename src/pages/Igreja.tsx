import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { Users, Target, Eye, BookOpen, UserCheck } from "lucide-react";

const sections = [
  {
    to: "/igreja/quem-somos",
    icon: Users,
    titulo: "Quem Somos",
    descricao: "Conheça a identidade e os valores do Templo Batista Bíblico."
  },
  {
    to: "/igreja/missao",
    icon: Target,
    titulo: "Nossa Missão",
    descricao: "O propósito que nos move como comunidade de fé."
  },
  {
    to: "/igreja/visao",
    icon: Eye,
    titulo: "Nossa Visão",
    descricao: "O grande desafio que temos pela frente."
  },
  {
    to: "/igreja/o-que-cremos",
    icon: BookOpen,
    titulo: "O Que Cremos",
    descricao: "As doutrinas que fundamentam nossa fé e prática."
  },
  {
    to: "/igreja/pastores",
    icon: UserCheck,
    titulo: "Pastores",
    descricao: "Conheça a liderança pastoral da igreja."
  },
];

const Igreja = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="bg-primary text-primary-foreground py-16 md:py-24">
        <div className="container text-center">
          <h1 className="font-display text-3xl md:text-5xl font-bold animate-fade-in">A Igreja</h1>
          <p className="mt-4 text-lg text-primary-foreground/80 max-w-2xl mx-auto animate-fade-in-delay-1">
            Conheça nossa história, valores e o que nos move como comunidade de fé.
          </p>
        </div>
      </section>

      {/* Cards de navegação */}
      <section className="py-16 md:py-20 bg-background">
        <div className="container">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {sections.map((section, index) => (
              <Link
                key={section.to}
                to={section.to}
                className="bg-card border border-border rounded-lg p-6 hover:shadow-lg hover:border-primary/30 transition-all duration-300 group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="bg-primary/10 rounded-full p-3 w-fit mb-4 group-hover:bg-primary/20 transition-colors">
                  <section.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                  {section.titulo}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {section.descricao}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Igreja;
