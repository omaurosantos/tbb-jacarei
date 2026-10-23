import type { Horario } from "@/hooks/use-contato";

const DIAS = ["domingo", "segunda", "terca", "quarta", "quinta", "sexta", "sabado"];

const semAcento = (texto: string) => texto.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

// 0 = domingo ... 6 = sábado; null quando o texto do painel não traz um dia da semana
export function diaDaSemana(dia: string): number | null {
  const n = semAcento(dia);
  const i = DIAS.findIndex((d) => n.includes(d));
  return i < 0 ? null : i;
}

// Lê "10h (EBD) e 18h30 (Culto)" como 10:00 e 18:30
export function horasDe(descricao: string): { h: number; m: number }[] {
  return [...descricao.matchAll(/(\d{1,2})h(\d{2})?/g)]
    .map((x) => ({ h: Number(x[1]), m: x[2] ? Number(x[2]) : 0 }))
    .filter((t) => t.h < 24 && t.m < 60);
}

export type ProximoEncontro = {
  dia: string;
  hora: string;
  quando: string;
};

const inicioDoDia = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();

export function proximoEncontro(horarios: Horario[], agora: Date = new Date()): ProximoEncontro | null {
  let melhor: { data: Date; dia: string; h: number; m: number } | null = null;

  for (const horario of horarios) {
    const dia = diaDaSemana(horario.dia);
    if (dia === null) continue;
    for (const t of horasDe(horario.descricao)) {
      const data = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate() + ((dia - agora.getDay() + 7) % 7), t.h, t.m);
      if (data.getTime() <= agora.getTime()) data.setDate(data.getDate() + 7);
      if (!melhor || data < melhor.data) melhor = { data, dia: horario.dia, h: t.h, m: t.m };
    }
  }

  if (!melhor) return null;

  const dias = Math.round((inicioDoDia(melhor.data) - inicioDoDia(agora)) / 86_400_000);
  const minutos = Math.round((melhor.data.getTime() - agora.getTime()) / 60_000);
  let quando: string;
  if (dias === 0) {
    quando = minutos < 60 ? `daqui a ${minutos} minutos` : `hoje, daqui a ${Math.round(minutos / 60)} h`;
  } else if (dias === 1) {
    quando = "amanhã";
  } else {
    quando = `em ${dias} dias`;
  }

  return {
    dia: melhor.dia,
    hora: `${melhor.h}h${melhor.m ? String(melhor.m).padStart(2, "0") : ""}`,
    quando,
  };
}
