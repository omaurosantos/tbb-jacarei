export interface Sermao {
  id: string;
  titulo: string;
  pregador: string;
  data: string;
  textoBase: string;
  linkVideo: string;
}

export interface AulaEBD {
  id: string;
  titulo: string;
  professor: string;
  data: string;
  linkPdf: string;
  resumo: string;
}

export interface Evento {
  id: string;
  titulo: string;
  data: string;
  horario: string;
  descricao: string;
  local: string;
}

export interface Escala {
  id: string;
  ministerio: string;
  data: string;
  participantes: string[];
}

export interface Pastor {
  id: string;
  nome: string;
  funcao: string;
  foto: string;
  bio: string;
}

export interface Ministerio {
  id: string;
  nome: string;
  descricao: string;
  descricaoCompleta: string;
  icone: string;
}
