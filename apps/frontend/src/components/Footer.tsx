import { Link } from "react-router-dom";
import { Instagram } from "lucide-react";
import logoTBB from "@/assets/logo-tbb.jpg";
import { useContato } from "@/hooks/use-contato";

const Footer = () => {
  const contato = useContato();
  const instagramLinks = [{ handle: `@${contato.instagram}`, url: `https://instagram.com/${contato.instagram}` }];

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo e descrição */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <img src={logoTBB} alt="TBB" className="h-12 w-12 rounded-full" />
              <div>
                <span className="font-display text-xl font-semibold">Templo Batista Bíblico</span>
                <p className="text-sm text-primary-foreground/70">Jacareí, SP</p>
              </div>
            </div>
            <p className="text-sm text-primary-foreground/80 max-w-md">
              Uma igreja comprometida com a Palavra de Deus, onde vidas são transformadas pelo evangelho de Jesus
              Cristo.
            </p>

            {/* Redes Sociais */}
            <div className="mt-6">
              <h4 className="font-display font-semibold mb-3 text-sm">Siga-nos no Instagram</h4>
              <div className="flex flex-wrap gap-2">
                {instagramLinks.map((link) => (
                  <a
                    key={link.handle}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs bg-primary-foreground/10 hover:bg-primary-foreground/20 px-3 py-2.5 rounded-full transition-colors"
                  >
                    <Instagram className="h-3.5 w-3.5" />
                    {link.handle}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Links rápidos */}
          <div>
            <h4 className="font-display font-semibold mb-4">Links Rápidos</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/igreja"
                  className="inline-block py-1.5 text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  Sobre a Igreja
                </Link>
              </li>
              <li>
                <Link
                  to="/ministerios"
                  className="inline-block py-1.5 text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  Ministérios
                </Link>
              </li>
              <li>
                <Link
                  to="/recursos"
                  className="inline-block py-1.5 text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  Sermões
                </Link>
              </li>
              <li>
                <Link
                  to="/localizacao"
                  className="inline-block py-1.5 text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  Como Chegar
                </Link>
              </li>
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h4 className="font-display font-semibold mb-4">Contato</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/80">
              {contato.endereco
                .split("\n")
                .filter((linha) => linha.trim())
                .map((linha, i) => (
                  <li key={i}>{linha}</li>
                ))}
              <li className="pt-2">
                <a href={`mailto:${contato.email}`} className="inline-block py-1.5 hover:text-primary-foreground transition-colors">
                  {contato.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center text-sm text-primary-foreground/60">
          <p>© {new Date().getFullYear()} Templo Batista Bíblico - Jacareí, SP. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
