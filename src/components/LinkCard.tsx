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
      className="group block bg-card border border-border rounded-lg p-6 hover:shadow-lg hover:border-primary/30 transition-all duration-300"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          {icon && (
            <div className="text-primary mb-3">
              {icon}
            </div>
          )}
          <h3 className="font-display text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
            {title}
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            {description}
          </p>
        </div>
        <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
      </div>
    </Link>
  );
};

export default LinkCard;
