import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import SectionTitle from "@/components/SectionTitle";
import EventCard from "@/components/EventCard";
import { ArrowRight, MapPin } from "lucide-react";
import { eventosService, conteudosService, sermoesService } from "@/lib/api";
import { useContato } from "@/hooks/use-contato";
import { Evento, ConteudoPagina, Sermao } from "shared";

type HomeContent = ConteudoPagina & {
  conteudo_extra?: {
    horarios?: string;
    secao_conheca?: { titulo: string; subtitulo: string };
    secao_eventos?: { titulo: string; subtitulo: string };
  } | null;
};

const caminhos = [
  { title: "A Igreja", description: "Nossa história, visão, missão e o que cremos.", to: "/igreja" },
  { title: "Ministérios", description: "Conheça as áreas de serviço e onde você pode participar.", to: "/ministerios" },
  { title: "Recursos", description: "Sermões, aulas da EBD e agenda de eventos.", to: "/recursos" },
  { title: "Localização", description: "Endereço, horários e como chegar.", to: "/localizacao" },
];

const DIAS_SEMANA = ["domingo", "segunda", "terca", "quarta", "quinta", "sexta", "sabado"];

const semAcento = (texto: string) => texto.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

const formatarDataSermao = (data: string) => {
  const date = new Date(data.slice(0, 10) + "T00:00:00");
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("pt-BR", { day: "numeric", month: "long", year: "numeric" });
};

const Home = () => {
  const contato = useContato();
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [ultimoSermao, setUltimoSermao] = useState<Sermao | null>(null);
  const [content, setContent] = useState<HomeContent | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const today = new Date().toISOString().split("T")[0];
        const [eventosData, contentData, sermoesData] = await Promise.all([
          eventosService.getAll("asc").then((evts) => evts.filter((e) => e.data >= today).slice(0, 3)),
          conteudosService.getByPagina("home").catch(() => null),
          sermoesService.getAll("desc").catch(() => [] as Sermao[]),
        ]);

        setEventos(eventosData);
        setUltimoSermao(sermoesData[0] ?? null);
        if (contentData) {
          setContent(contentData as HomeContent);
        }
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      }
    };

    fetchData();
  }, []);

  const hoje = DIAS_SEMANA[new Date().getDay()];
  const heroTitle = content?.titulo || "Bem-vindo ao Templo Batista Bíblico";
  const heroSubtitle = content?.subtitulo || "Uma comunidade de fé em Jacareí, SP, comprometida com a Palavra de Deus e a transformação de vidas pelo evangelho de Jesus Cristo.";
  const ctaTitle = content?.conteudo || "Venha nos conhecer";
  const horarios = content?.conteudo_extra?.horarios || "Domingo às 10h e 18h • Quarta às 19h30";
  const secaoConheca = content?.conteudo_extra?.secao_conheca || { titulo: "Conheça nossa igreja", subtitulo: "Descubra quem somos, o que fazemos e como você pode fazer parte." };
  const secaoEventos = content?.conteudo_extra?.secao_eventos || { titulo: "Próximos eventos", subtitulo: "Fique por dentro do que está acontecendo na nossa comunidade." };
  const linhasEndereco = contato.endereco.split("\n").filter((linha) => linha.trim());

  return (
    <Layout>
      {/* Hero */}
      <section className="bg-primary text-primary-foreground border-b-4 border-highlight py-14 md:py-24">
        <div className="container grid items-center gap-10 lg:grid-cols-[1.25fr_1fr] lg:gap-16">
          <div className="animate-fade-in-up">
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold leading-[1.1] whitespace-pre-line">
              {heroTitle}
            </h1>
            <p className="mt-6 text-lg md:text-xl text-primary-foreground/85 max-w-xl">
              {heroSubtitle}
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="bg-highlight text-highlight-foreground hover:bg-highlight/90 font-semibold">
                <Link to="/localizacao">Planeje sua visita</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="bg-transparent border-primary-foreground/40 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
              >
                <Link to="/recursos">Assista aos sermões</Link>
              </Button>
            </div>
          </div>

          {/* Horários da semana, com o dia de hoje destacado */}
          <aside
            aria-labelledby="horarios-titulo"
            className="rounded-lg bg-primary-foreground/[0.07] border border-primary-foreground/15 p-6 md:p-8"
          >
            <h2 id="horarios-titulo" className="font-display text-xl font-semibold">
              Quando nos encontrar
            </h2>
            <ul className="mt-5 divide-y divide-primary-foreground/15">
              {contato.horarios.map((h) => {
                const ehHoje = semAcento(h.dia).includes(hoje);
                return (
                  <li key={h.dia} className="py-3 first:pt-0">
                    <div className="flex items-baseline justify-between gap-3">
                      <span className="font-semibold">{h.dia}</span>
                      {ehHoje && (
                        <span className="rounded-full bg-highlight px-2.5 py-0.5 text-xs font-semibold text-highlight-foreground">
                          Hoje
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 text-base text-primary-foreground/85">{h.descricao}</p>
                  </li>
                );
              })}
            </ul>
            <p className="mt-5 flex items-start gap-2 border-t border-primary-foreground/15 pt-5 text-base text-primary-foreground/85">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              <span>{linhasEndereco.slice(0, 2).join(", ")}</span>
            </p>
          </aside>
        </div>
      </section>

      {/* Caminhos */}
      <section className="py-16 md:py-20 bg-background">
        <div className="container grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
          <SectionTitle title={secaoConheca.titulo} subtitle={secaoConheca.subtitulo} centered={false} />
          <ul className="divide-y divide-border border-y border-border">
            {caminhos.map((c) => (
              <li key={c.to}>
                <Link
                  to={c.to}
                  className="group flex items-center justify-between gap-4 py-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <span>
                    <span className="block font-display text-xl font-semibold text-foreground group-hover:text-primary">
                      {c.title}
                    </span>
                    <span className="mt-1 block text-muted-foreground">{c.description}</span>
                  </span>
                  <ArrowRight className="h-5 w-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Último sermão: só aparece quando existe */}
      {ultimoSermao && (
        <section className="py-16 md:py-20 bg-secondary">
          <div className="container max-w-3xl">
            <SectionTitle title="Último sermão" centered={false} />
            <article>
              <h3 className="font-display text-2xl md:text-3xl font-semibold text-foreground">{ultimoSermao.titulo}</h3>
              <p className="mt-2 text-muted-foreground">
                {ultimoSermao.pregador}
                {formatarDataSermao(ultimoSermao.data) && ` — ${formatarDataSermao(ultimoSermao.data)}`}
              </p>
              {ultimoSermao.textoBase && (
                <p className="mt-3 text-sm font-medium text-foreground">Texto base: {ultimoSermao.textoBase}</p>
              )}
              {ultimoSermao.resumo && <p className="mt-4 text-foreground/85 max-w-prose">{ultimoSermao.resumo}</p>}
              <div className="mt-6 flex flex-wrap gap-3">
                {ultimoSermao.linkYoutube && (
                  <Button asChild>
                    <a href={ultimoSermao.linkYoutube} target="_blank" rel="noopener noreferrer">Assistir no YouTube</a>
                  </Button>
                )}
                {ultimoSermao.linkSpotify && (
                  <Button asChild variant="outline">
                    <a href={ultimoSermao.linkSpotify} target="_blank" rel="noopener noreferrer">Ouvir no Spotify</a>
                  </Button>
                )}
                <Button asChild variant="ghost">
                  <Link to="/recursos">Ver todos os sermões</Link>
                </Button>
              </div>
            </article>
          </div>
        </section>
      )}

      {/* Próximos eventos: só aparece quando há eventos */}
      {eventos.length > 0 && (
        <section className="py-16 md:py-20 bg-background">
          <div className="container">
            <SectionTitle title={secaoEventos.titulo} subtitle={secaoEventos.subtitulo} centered={false} />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {eventos.map((evento) => (
                <EventCard key={evento.id} evento={evento} />
              ))}
            </div>
            <div className="mt-8">
              <Button asChild variant="outline">
                <Link to="/recursos#agenda">Ver agenda completa</Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Convite final */}
      <section className="py-16 md:py-20 bg-primary text-primary-foreground">
        <div className="container grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <h2 className="font-display text-2xl md:text-3xl font-semibold">{ctaTitle}</h2>
            <p className="mt-3 text-primary-foreground/80 max-w-xl">{horarios}</p>
            <p className="mt-1 text-primary-foreground/80 text-base">{linhasEndereco.slice(0, 2).join(", ")}</p>
          </div>
          <Button asChild size="lg" className="bg-highlight text-highlight-foreground hover:bg-highlight/90 font-semibold">
            <Link to="/localizacao">Como chegar</Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default Home;
