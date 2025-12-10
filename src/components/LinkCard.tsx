import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

interface LinkCardProps {
  title: string;
  description: string;
  to: string;
  icon?: React.ReactNode;
}

const LinkCard = ({ title, description, to, icon }: LinkCardProps) => {
  return (
    <Link
      to={to}
      className="group block bg-card border border-border rounded-xl p-6 card-hover hover:border-primary/20"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          {icon && (
            <div className="text-primary mb-4 p-2.5 bg-primary/5 rounded-lg inline-block group-hover:bg-primary/10 group-hover:scale-110 transition-all duration-300">
              {icon}
            </div>
          )}
          <h3 className="font-display text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
            {title}
          </h3>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
            {description}
          </p>
        </div>
        <ArrowRight className="h-5 w-5 text-muted-foreground/50 group-hover:text-primary group-hover:translate-x-1 transition-all duration-300 mt-1 flex-shrink-0" />
      </div>
    </Link>
  );
};

export default LinkCard;
