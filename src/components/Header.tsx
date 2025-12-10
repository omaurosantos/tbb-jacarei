import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
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
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
    setIgrejaOpen(false);
  }, [location.pathname]);

  // Handle scroll for shadow effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinkClass = "text-sm font-medium text-primary-foreground/90 hover:text-primary-foreground transition-colors";
  const activeNavLinkClass = "text-sm font-medium text-primary-foreground";

  const isActive = (path: string) => location.pathname === path;
  const isIgrejaActive = location.pathname.startsWith("/igreja");

  return (
    <header 
      className={`bg-primary text-primary-foreground sticky top-0 z-50 transition-shadow duration-300 ${
        scrolled ? "shadow-header" : ""
      }`}
    >
      <div className="container">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <img 
              src={logoTBB} 
              alt="Templo Batista Bíblico" 
              className="h-10 w-10 md:h-11 md:w-11 rounded-full ring-2 ring-primary-foreground/20 group-hover:ring-primary-foreground/40 transition-all" 
            />
            <div className="hidden sm:block">
              <span className="font-display text-lg font-semibold tracking-tight">Templo Batista Bíblico</span>
              <p className="text-xs text-primary-foreground/60">Jacareí, SP</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            <Link 
              to="/" 
              className={`px-4 py-2 rounded-lg hover:bg-primary-foreground/10 transition-colors ${isActive("/") ? activeNavLinkClass : navLinkClass}`}
            >
              Início
            </Link>
            
            {/* A Igreja Dropdown */}
            <div className="relative group">
              <button 
                className={`px-4 py-2 rounded-lg hover:bg-primary-foreground/10 transition-colors flex items-center gap-1.5 ${isIgrejaActive ? activeNavLinkClass : navLinkClass}`}
              >
                A Igreja
                <ChevronDown className="h-3.5 w-3.5 opacity-70 group-hover:opacity-100 transition-opacity" />
              </button>
              
              <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="w-52 bg-card border border-border rounded-xl shadow-soft-lg py-2 overflow-hidden">
                  {igrejaSubLinks.map((link) => (
                    <Link
                      key={link.to}
                      to={link.to}
                      className={`block px-4 py-2.5 text-sm transition-colors ${
                        isActive(link.to) 
                          ? "bg-primary/5 text-primary font-medium" 
                          : "text-foreground hover:bg-secondary hover:text-primary"
                      }`}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
            
            <Link 
              to="/ministerios" 
              className={`px-4 py-2 rounded-lg hover:bg-primary-foreground/10 transition-colors ${isActive("/ministerios") ? activeNavLinkClass : navLinkClass}`}
            >
              Ministérios
            </Link>
            <Link 
              to="/recursos" 
              className={`px-4 py-2 rounded-lg hover:bg-primary-foreground/10 transition-colors ${isActive("/recursos") ? activeNavLinkClass : navLinkClass}`}
            >
              Recursos
            </Link>
            <Link 
              to="/localizacao" 
              className={`px-4 py-2 rounded-lg hover:bg-primary-foreground/10 transition-colors ${isActive("/localizacao") ? activeNavLinkClass : navLinkClass}`}
            >
              Localização
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 -mr-2 rounded-lg hover:bg-primary-foreground/10 transition-colors"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <nav className="md:hidden pb-6 pt-2 animate-fade-in border-t border-primary-foreground/10">
            <div className="flex flex-col gap-1">
              <Link
                to="/"
                className={`py-3 px-4 rounded-lg transition-colors ${
                  isActive("/") ? "bg-primary-foreground/10 font-medium" : "hover:bg-primary-foreground/5"
                }`}
              >
                Início
              </Link>
              
              {/* A Igreja Mobile */}
              <div>
                <button
                  onClick={() => setIgrejaOpen(!igrejaOpen)}
                  className={`w-full py-3 px-4 rounded-lg transition-colors flex items-center justify-between ${
                    isIgrejaActive ? "bg-primary-foreground/10 font-medium" : "hover:bg-primary-foreground/5"
                  }`}
                >
                  A Igreja
                  <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${igrejaOpen ? "rotate-180" : ""}`} />
                </button>
                
                {igrejaOpen && (
                  <div className="ml-4 mt-1 space-y-0.5 border-l-2 border-primary-foreground/20 pl-4 animate-fade-in">
                    {igrejaSubLinks.map((link) => (
                      <Link
                        key={link.to}
                        to={link.to}
                        className={`block py-2.5 px-3 rounded-lg text-sm transition-colors ${
                          isActive(link.to) 
                            ? "bg-primary-foreground/10 font-medium" 
                            : "text-primary-foreground/80 hover:bg-primary-foreground/5 hover:text-primary-foreground"
                        }`}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
              
              <Link
                to="/ministerios"
                className={`py-3 px-4 rounded-lg transition-colors ${
                  isActive("/ministerios") ? "bg-primary-foreground/10 font-medium" : "hover:bg-primary-foreground/5"
                }`}
              >
                Ministérios
              </Link>
              <Link
                to="/recursos"
                className={`py-3 px-4 rounded-lg transition-colors ${
                  isActive("/recursos") ? "bg-primary-foreground/10 font-medium" : "hover:bg-primary-foreground/5"
                }`}
              >
                Recursos
              </Link>
              <Link
                to="/localizacao"
                className={`py-3 px-4 rounded-lg transition-colors ${
                  isActive("/localizacao") ? "bg-primary-foreground/10 font-medium" : "hover:bg-primary-foreground/5"
                }`}
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
