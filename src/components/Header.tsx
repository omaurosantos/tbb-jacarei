import { Link } from "react-router-dom";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import logoTBB from "@/assets/logo-tbb.jpg";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { to: "/", label: "Início" },
    { to: "/igreja", label: "A Igreja" },
    { to: "/ministerios", label: "Ministérios" },
    { to: "/recursos", label: "Recursos" },
    { to: "/localizacao", label: "Localização" },
  ];

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
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-sm font-medium hover:text-primary-foreground/80 transition-colors"
              >
                {link.label}
              </Link>
            ))}
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
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="py-2 px-4 text-sm font-medium hover:bg-primary-foreground/10 rounded transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
