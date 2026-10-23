import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import SectionTitle from "@/components/SectionTitle";
import EventCard from "@/components/EventCard";
import { ArrowRight, MapPin } from "lucide-react";
import { eventosService, conteudosService, sermoesService } from "@/lib/api";
import { useContato } from "@/hooks/use-contato";
import { diaDaSemana, proximoEncontro } from "@/lib/horarios";
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
  const [agora, setAgora] = useState(() => new Date());

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

  // O boletim confere a hora a cada minuto, para "hoje" e "daqui a" não ficarem velhos
  useEffect(() => {
    const id = window.setInterval(() => setAgora(new Date()), 60_000);
    return () => window.clearInterval(id);
  }, []);

  const hoje = agora.getDay();
  const proximo = proximoEncontro(contato.horarios, agora);
  const heroTitle = content?.titulo || "Venha nos conhecer";
  const heroSubtitle = content?.subtitulo || "Templo Batista Bíblico, em Jacareí. Culto aos domingos, escola bíblica e pequenos grupos para todas as idades.";
  const ctaTitle = content?.conteudo || "Esperamos por você";
  const horarios = content?.conteudo_extra?.horarios || "Domingo às 10h e 18h • Quarta às 19h30";
  const secaoConheca = content?.conteudo_extra?.secao_conheca || { titulo: "Conheça nossa igreja", subtitulo: "Descubra quem somos, o que fazemos e como você pode fazer parte." };
  const secaoEventos = content?.conteudo_extra?.secao_eventos || { titulo: "Próximos eventos", subtitulo: "Fique por dentro do que está acontecendo na nossa comunidade." };
  const linhasEndereco = contato.endereco.split("\n").filter((linha) => linha.trim());
  const enderecoCurto = linhasEndereco.slice(0, 2).join(", ");

  return (
    <Layout>
      {/* Abertura: o boletim da semana */}
      <section className="bg-primary text-primary-foreground border-b-4 border-highlight py-12 md:py-20">
        <div className="container grid items-center gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          <div className="animate-fade-in-up">
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-semibold leading-[1.05]">
              {heroTitle}
            </h1>
            <p className="mt-6 text-xl md:text-2xl text-primary-foreground/90 max-w-xl leading-snug">
              {heroSubtitle}
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="h-14 px-8 text-lg bg-highlight text-highlight-foreground hover:bg-highlight/90 font-bold">
                <Link to="/localizacao">Como chegar</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-14 px-8 text-lg bg-transparent border-2 border-primary-foreground/60 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
              >
                <Link to="/recursos">Assistir aos sermões</Link>
              </Button>
            </div>
          </div>

          <aside aria-labelledby="boletim-titulo" className="rounded-md bg-background text-foreground">
            <div className="h-3 border-t-[6px] border-dotted border-primary/50" aria-hidden="true" />
            <div className="p-6 md:p-8">
              <h2 id="boletim-titulo" className="font-display text-3xl font-semibold">
                Boletim da semana
              </h2>

              {proximo && (
                <p className="mt-5 rounded-md bg-highlight p-4 text-highlight-foreground" aria-live="polite">
                  <span className="block text-base font-bold">Próximo encontro</span>
                  <span className="block font-display text-2xl font-semibold leading-tight">
                    {proximo.dia}, {proximo.hora}
                  </span>
                  <span className="block text-lg">{proximo.quando}</span>
                </p>
              )}

              <ul className="mt-5 space-y-3">
                {contato.horarios.map((h) => {
                  const ehHoje = diaDaSemana(h.dia) === hoje;
                  return (
                    <li
                      key={h.dia}
                      className={`rounded-md p-4 ${ehHoje ? "bg-primary text-primary-foreground" : "bg-secondary"}`}
                    >
                      <div className="flex items-baseline justify-between gap-3">
                        <span className="font-display text-xl font-semibold">{h.dia}</span>
                        {ehHoje && (
                          <span className="rounded-full bg-highlight px-3 py-0.5 text-base font-bold text-highlight-foreground">
                            Hoje
                          </span>
                        )}
                      </div>
                      <p className={`mt-1 text-lg font-display ${ehHoje ? "text-primary-foreground/90" : "text-foreground"}`}>{h.descricao}</p>
                    </li>
                  );
                })}
              </ul>

              <p className="mt-5 flex items-start gap-2 text-lg text-foreground">
                <MapPin className="mt-1 h-5 w-5 shrink-0" aria-hidden="true" />
                <span>{enderecoCurto}</span>
              </p>
            </div>
          </aside>
        </div>
      </section>

      {/* Caminhos */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container grid gap-10 lg:grid-cols-[1fr_1.3fr] lg:gap-16">
          <SectionTitle title={secaoConheca.titulo} subtitle={secaoConheca.subtitulo} centered={false} />
          <ul className="space-y-3">
            {caminhos.map((c) => (
              <li key={c.to}>
                <Link
                  to={c.to}
                  className="group flex items-center justify-between gap-4 rounded-md bg-secondary p-5 transition-colors hover:bg-muted"
                >
                  <span>
                    <span className="block font-display text-2xl font-semibold text-foreground">{c.title}</span>
                    <span className="mt-1 block text-lg text-foreground/85">{c.description}</span>
                  </span>
                  <ArrowRight className="h-6 w-6 shrink-0 text-primary transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Último sermão: só aparece quando existe */}
      {ultimoSermao && (
        <section className="py-16 md:py-24 bg-secondary">
          <div className="container max-w-3xl">
            <SectionTitle title="Último sermão" centered={false} />
            <article>
              <h3 className="font-display text-3xl md:text-4xl font-semibold text-foreground">{ultimoSermao.titulo}</h3>
              <p className="mt-2 text-lg text-foreground/85">
                {ultimoSermao.pregador}
                {formatarDataSermao(ultimoSermao.data) && ` — ${formatarDataSermao(ultimoSermao.data)}`}
              </p>
              {ultimoSermao.textoBase && (
                <p className="mt-3 text-lg font-bold text-foreground">Texto base: {ultimoSermao.textoBase}</p>
              )}
              {ultimoSermao.resumo && <p className="mt-4 text-lg text-foreground max-w-prose">{ultimoSermao.resumo}</p>}
              <div className="mt-6 flex flex-wrap gap-3">
                {ultimoSermao.linkYoutube && (
                  <Button asChild size="lg" className="h-14 px-8 text-lg">
                    <a href={ultimoSermao.linkYoutube} target="_blank" rel="noopener noreferrer">Assistir no YouTube</a>
                  </Button>
                )}
                {ultimoSermao.linkSpotify && (
                  <Button asChild size="lg" variant="outline" className="h-14 px-8 text-lg">
                    <a href={ultimoSermao.linkSpotify} target="_blank" rel="noopener noreferrer">Ouvir no Spotify</a>
                  </Button>
                )}
                <Button asChild size="lg" variant="ghost" className="h-14 px-6 text-lg">
                  <Link to="/recursos">Ver todos os sermões</Link>
                </Button>
              </div>
            </article>
          </div>
        </section>
      )}

      {/* Próximos eventos: só aparece quando há eventos */}
      {eventos.length > 0 && (
        <section className="py-16 md:py-24 bg-background">
          <div className="container">
            <SectionTitle title={secaoEventos.titulo} subtitle={secaoEventos.subtitulo} centered={false} />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {eventos.map((evento) => (
                <EventCard key={evento.id} evento={evento} />
              ))}
            </div>
            <div className="mt-8">
              <Button asChild size="lg" variant="outline" className="h-14 px-8 text-lg">
                <Link to="/recursos#agenda">Ver agenda completa</Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Convite final */}
      <section className="py-16 md:py-24 bg-primary text-primary-foreground">
        <div className="container grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <h2 className="font-display text-3xl md:text-5xl font-semibold">{ctaTitle}</h2>
            <p className="mt-3 text-xl font-display text-primary-foreground/90 max-w-xl">{horarios}</p>
            <p className="mt-1 text-lg text-primary-foreground/85">{enderecoCurto}</p>
          </div>
          <Button asChild size="lg" className="h-14 px-8 text-lg bg-highlight text-highlight-foreground hover:bg-highlight/90 font-bold">
            <Link to="/localizacao">Como chegar</Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default Home;
