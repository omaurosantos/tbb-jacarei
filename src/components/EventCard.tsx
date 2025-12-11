import { Calendar, Clock, MapPin } from "lucide-react";
import type { Evento } from "@/types";

interface EventCardProps {
  evento: Evento;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString + "T00:00:00");
  return date.toLocaleDateString("pt-BR", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
};

const EventCard = ({ evento }: EventCardProps) => {
  return (
    <div className="bg-card border border-border rounded-lg p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4">
        <div className="bg-primary text-primary-foreground rounded-lg p-3 text-center min-w-[60px]">
          <span className="block text-xs uppercase">
            {new Date(evento.data + "T00:00:00").toLocaleDateString("pt-BR", { month: "short" })}
          </span>
          <span className="block text-2xl font-display font-bold">
            {new Date(evento.data + "T00:00:00").getDate()}
          </span>
        </div>
        <div className="flex-1">
          <h4 className="font-display font-semibold text-foreground">{evento.nome}</h4>
          <p className="text-sm text-muted-foreground mt-1">{evento.descricao}</p>
          <div className="flex flex-wrap gap-4 mt-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {evento.horario}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {evento.local}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
