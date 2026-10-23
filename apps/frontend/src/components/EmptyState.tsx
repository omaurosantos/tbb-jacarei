import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: { label: string; to: string };
}

const EmptyState = ({ icon, title, description, action }: EmptyStateProps) => {
  return (
    <div className="mx-auto max-w-md rounded-lg border border-dashed border-border px-6 py-10 text-center">
      {icon && <div className="mx-auto mb-4 flex justify-center text-primary/50">{icon}</div>}
      <h3 className="font-display text-lg font-semibold text-foreground">{title}</h3>
      {description && <p className="mt-2 text-base text-muted-foreground">{description}</p>}
      {action && (
        <Button asChild variant="outline" size="sm" className="mt-5">
          <Link to={action.to}>{action.label}</Link>
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
