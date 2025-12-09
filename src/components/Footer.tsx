import { Link } from "react-router-dom";
import logoTBB from "@/assets/logo-tbb.jpg";

const Footer = () => {
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
              Uma igreja comprometida com a Palavra de Deus, onde vidas são transformadas 
              pelo evangelho de Jesus Cristo.
            </p>
          </div>

          {/* Links rápidos */}
          <div>
            <h4 className="font-display font-semibold mb-4">Links Rápidos</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/igreja" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Sobre a Igreja
                </Link>
              </li>
              <li>
                <Link to="/ministerios" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Ministérios
                </Link>
              </li>
              <li>
                <Link to="/recursos" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Sermões
                </Link>
              </li>
              <li>
                <Link to="/localizacao" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Como Chegar
                </Link>
              </li>
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h4 className="font-display font-semibold mb-4">Contato</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/80">
              <li>Rua da Igreja, 123</li>
              <li>Centro, Jacareí - SP</li>
              <li>CEP: 12300-000</li>
              <li className="pt-2">
                <a href="mailto:contato@tbbjacarei.com.br" className="hover:text-primary-foreground transition-colors">
                  contato@tbbjacarei.com.br
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
