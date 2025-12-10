import { Link } from "react-router-dom";
import { useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import logoTBB from "@/assets/logo-tbb.jpg";

const igrejaSubLinks = [
  { to: "/igreja/quem-somos", label: "Quem Somos" },
  { to: "/igreja/missao", label: "Missão" },
  { to: "/igreja/visao", label: "Visão" },
  { to: "/igreja/o-que-cremos", label: "O Que Cremos" },
  { to: "/igreja/pastores", label: "Pastores" },
];

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [igrejaOpen, setIgrejaOpen] = useState(false);

  return (
    <header className="bg-primary text-primary-foreground sticky top-0 z-50">
      <div className="container">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link to="/" className="flex items-center gap-3">
            <img src={logoTBB} alt="Templo Batista Bíblico" className="h-10 w-10 md:h-12 md:w-12 rounded-full" />
            <div className="hidden sm:block">
              <span className="font-display text-lg md:text-xl font-semibold">Templo Batista Bíblico</span>
              <p className="text-xs text-primary-foreground/70">Jacareí, SP</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-sm font-medium hover:text-primary-foreground/80 transition-colors">
              Início
            </Link>
            
            {/* A Igreja Dropdown */}
            <div className="relative group">
              <button 
                className="text-sm font-medium hover:text-primary-foreground/80 transition-colors flex items-center gap-1"
                onClick={() => setIgrejaOpen(!igrejaOpen)}
              >
                A Igreja
                <ChevronDown className="h-4 w-4" />
              </button>
              
              <div className="absolute top-full left-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="py-2">
                  {igrejaSubLinks.map((link) => (
                    <Link
                      key={link.to}
                      to={link.to}
                      className="block px-4 py-2 text-sm text-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
            
            <Link to="/ministerios" className="text-sm font-medium hover:text-primary-foreground/80 transition-colors">
              Ministérios
            </Link>
            <Link to="/recursos" className="text-sm font-medium hover:text-primary-foreground/80 transition-colors">
              Recursos
            </Link>
            <Link to="/localizacao" className="text-sm font-medium hover:text-primary-foreground/80 transition-colors">
              Localização
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <nav className="md:hidden pb-4 animate-fade-in">
            <div className="flex flex-col gap-1">
              <Link
                to="/"
                className="py-2 px-4 text-sm font-medium hover:bg-primary-foreground/10 rounded transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Início
              </Link>
              
              {/* A Igreja Mobile */}
              <div>
                <button
                  onClick={() => setIgrejaOpen(!igrejaOpen)}
                  className="w-full py-2 px-4 text-sm font-medium hover:bg-primary-foreground/10 rounded transition-colors flex items-center justify-between"
                >
                  A Igreja
                  <ChevronDown className={`h-4 w-4 transition-transform ${igrejaOpen ? "rotate-180" : ""}`} />
                </button>
                
                {igrejaOpen && (
                  <div className="pl-4 mt-1 space-y-1">
                    {igrejaSubLinks.map((link) => (
                      <Link
                        key={link.to}
                        to={link.to}
                        className="block py-2 px-4 text-sm text-primary-foreground/80 hover:bg-primary-foreground/10 rounded transition-colors"
                        onClick={() => setIsOpen(false)}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
              
              <Link
                to="/ministerios"
                className="py-2 px-4 text-sm font-medium hover:bg-primary-foreground/10 rounded transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Ministérios
              </Link>
              <Link
                to="/recursos"
                className="py-2 px-4 text-sm font-medium hover:bg-primary-foreground/10 rounded transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Recursos
              </Link>
              <Link
                to="/localizacao"
                className="py-2 px-4 text-sm font-medium hover:bg-primary-foreground/10 rounded transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Localização
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
