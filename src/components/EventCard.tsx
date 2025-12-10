import { Clock, MapPin } from "lucide-react";
import type { Evento } from "@/types";

interface EventCardProps {
  evento: Evento;
}

const EventCard = ({ evento }: EventCardProps) => {
  const date = new Date(evento.data + "T00:00:00");
  
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden card-hover hover:border-primary/20 group">
      <div className="flex">
        {/* Date Badge */}
        <div className="bg-primary text-primary-foreground p-4 flex flex-col items-center justify-center min-w-[80px] group-hover:bg-primary/95 transition-colors">
          <span className="text-xs uppercase tracking-wide opacity-80">
            {date.toLocaleDateString("pt-BR", { month: "short" })}
          </span>
          <span className="text-3xl font-display font-bold mt-0.5">
            {date.getDate()}
          </span>
        </div>
        
        {/* Content */}
        <div className="p-5 flex-1">
          <h3 className="font-display text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
            {evento.titulo}
          </h3>
          <p className="mt-1.5 text-sm text-muted-foreground line-clamp-2">
            {evento.descricao}
          </p>
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              {evento.horario}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5" />
              {evento.local}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
