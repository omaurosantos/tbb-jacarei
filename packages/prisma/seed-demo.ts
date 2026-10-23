import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

// Dados FICTÍCIOS para demonstrar o site. Não faz parte do seed de deploy (seed.ts).
//
//   pnpm db:seed:demo      cria/atualiza os dados de demonstração
//   pnpm db:unseed:demo    remove tudo o que este script criou
//
// Todos os registros têm id começando com "demo-"; é por isso que dá para apagá-los
// sem encostar no que foi cadastrado de verdade pelo painel.

const prisma = new PrismaClient();
const PREFIXO = 'demo-';

// Datas relativas a hoje, para a demonstração nunca parecer antiga
function diasA(offset: number): Date {
  const d = new Date();
  d.setUTCHours(0, 0, 0, 0);
  d.setUTCDate(d.getUTCDate() + offset);
  return d;
}

// Domingo mais recente (hoje, se for domingo) deslocado em semanas
function domingo(semanasAtras: number): Date {
  const d = diasA(0);
  d.setUTCDate(d.getUTCDate() - d.getUTCDay() - semanasAtras * 7);
  return d;
}

// Próxima ocorrência do dia da semana (0 = domingo), a partir de amanhã
function proximo(diaSemana: number, semanasExtras = 0): Date {
  const d = diasA(1);
  while (d.getUTCDay() !== diaSemana) d.setUTCDate(d.getUTCDate() + 1);
  d.setUTCDate(d.getUTCDate() + semanasExtras * 7);
  return d;
}

const pastores = [
  {
    id: 'demo-pastor-1',
    nome: 'Pr. Exemplo da Silva',
    funcao: 'Pastor Titular',
    bio: 'Pastor desta igreja desde a fundação. Casado, pai de três filhos, dedica-se ao ensino expositivo da Palavra e ao discipulado.\n\n(Texto de demonstração.)',
    ordem: 1,
  },
  {
    id: 'demo-pastor-2',
    nome: 'Pr. Modelo Oliveira',
    funcao: 'Pastor de Ministérios',
    bio: 'Responsável por acompanhar os ministérios da igreja e a formação de novos líderes.\n\n(Texto de demonstração.)',
    ordem: 2,
  },
  {
    id: 'demo-pastor-3',
    nome: 'Pr. Teste Santos',
    funcao: 'Pastor de Jovens',
    bio: 'Serve com adolescentes e jovens, incentivando a vida em comunidade e o estudo bíblico.\n\n(Texto de demonstração.)',
    ordem: 3,
  },
];

const ministerios = [
  {
    id: 'demo-ministerio-1',
    nome: 'Ministério de Louvor',
    descricao: 'Conduz a igreja em adoração nos cultos.',
    descricaoCompleta:
      'O Ministério de Louvor ajuda a congregação a adorar a Deus com música e Palavra. Ensaios semanais e formação musical e espiritual dos integrantes.\n\nQuem toca ou canta pode participar: procure a liderança.',
    icone: 'Music',
    ordem: 1,
    lideres: ['Maria Exemplo', 'João Modelo'],
  },
  {
    id: 'demo-ministerio-2',
    nome: 'Ministério Infantil',
    descricao: 'Ensina as crianças a conhecer Jesus.',
    descricaoCompleta:
      'Durante os cultos, as crianças têm aulas bíblicas adaptadas a cada idade, com histórias, atividades e brincadeiras em um ambiente seguro.',
    icone: 'Baby',
    ordem: 2,
    lideres: ['Ana Demonstração'],
  },
  {
    id: 'demo-ministerio-3',
    nome: 'Ministério de Jovens',
    descricao: 'Comunhão e discipulado para adolescentes e jovens.',
    descricaoCompleta:
      'Encontros aos sábados com estudo bíblico, dinâmicas e momentos de comunhão, além de acampamentos e ações de evangelismo.',
    icone: 'Users',
    ordem: 3,
    lideres: ['Lucas Teste', 'Beatriz Amostra'],
  },
  {
    id: 'demo-ministerio-4',
    nome: 'Ministério de Evangelismo',
    descricao: 'Leva o evangelho à nossa cidade.',
    descricaoCompleta:
      'Organiza visitas, distribuição de materiais e ações sociais em Jacareí, treinando os membros para compartilhar a fé.',
    icone: 'Megaphone',
    ordem: 4,
    lideres: ['Carlos Exemplo'],
  },
  {
    id: 'demo-ministerio-5',
    nome: 'Ministério de Intercessão',
    descricao: 'Sustenta a igreja em oração.',
    descricaoCompleta: 'Reúne-se para orar pelos pedidos da igreja, dos enfermos e das missões.',
    icone: 'Hand',
    ordem: 5,
    lideres: ['Helena Modelo'],
  },
];

const sermoes = [
  {
    id: 'demo-sermao-1',
    titulo: 'A Suficiência das Escrituras',
    pregador: 'Pr. Exemplo da Silva',
    data: domingo(0),
    textoBase: '2 Timóteo 3.14-17',
    resumo: 'A Bíblia é inspirada por Deus e suficiente para conduzir a vida do cristão, da família e da igreja.',
    linkYoutube: 'https://www.youtube.com/@exemplo',
  },
  {
    id: 'demo-sermao-2',
    titulo: 'Graça que Transforma',
    pregador: 'Pr. Modelo Oliveira',
    data: domingo(1),
    textoBase: 'Efésios 2.1-10',
    resumo: 'Fomos salvos pela graça, mediante a fé; isso muda a maneira como vivemos.',
    linkYoutube: 'https://www.youtube.com/@exemplo',
    linkSpotify: 'https://open.spotify.com/',
  },
  {
    id: 'demo-sermao-3',
    titulo: 'Investindo Vida em Vidas',
    pregador: 'Pr. Exemplo da Silva',
    data: domingo(2),
    textoBase: 'Mateus 28.18-20',
    resumo: 'Fazer discípulos é a missão da igreja e acontece por meio de relacionamentos.',
  },
  {
    id: 'demo-sermao-4',
    titulo: 'Adoração em Espírito e em Verdade',
    pregador: 'Pr. Teste Santos',
    data: domingo(3),
    textoBase: 'João 4.19-24',
    resumo: 'A adoração verdadeira vai além do culto de domingo e alcança toda a vida.',
    linkYoutube: 'https://www.youtube.com/@exemplo',
  },
  {
    id: 'demo-sermao-5',
    titulo: 'A Volta de Cristo',
    pregador: 'Pr. Modelo Oliveira',
    data: domingo(4),
    textoBase: 'Atos 1.9-11',
    resumo: 'A esperança da volta de Jesus motiva uma vida de santidade e serviço.',
  },
  {
    id: 'demo-sermao-6',
    titulo: 'O Corpo de Cristo',
    pregador: 'Pr. Exemplo da Silva',
    data: domingo(5),
    textoBase: '1 Coríntios 12.12-27',
    resumo: 'Cada membro tem um dom e uma função na edificação da igreja.',
  },
];

const aulas = [
  {
    id: 'demo-aula-1',
    titulo: 'Os Atributos de Deus',
    professor: 'Prof. Exemplo Lima',
    data: domingo(0),
    classe: 'Homens' as const,
    textoBase: 'Salmo 139',
    resumo: 'Estudo sobre a onisciência, onipresença e onipotência de Deus.',
  },
  {
    id: 'demo-aula-2',
    titulo: 'Mulheres da Bíblia: Rute',
    professor: 'Profa. Modelo Costa',
    data: domingo(0),
    classe: 'Belas' as const,
    textoBase: 'Rute 1-4',
    resumo: 'Fidelidade, redenção e a providência de Deus em meio às dificuldades.',
  },
  {
    id: 'demo-aula-3',
    titulo: 'Fé em Tempos Difíceis',
    professor: 'Pr. Teste Santos',
    data: domingo(0),
    classe: 'Adolescentes' as const,
    textoBase: 'Daniel 3',
    resumo: 'Como permanecer firme quando a pressão é grande.',
  },
  {
    id: 'demo-aula-4',
    titulo: 'A Doutrina da Salvação',
    professor: 'Prof. Exemplo Lima',
    data: domingo(1),
    classe: 'Homens' as const,
    textoBase: 'Romanos 3-5',
    resumo: 'Justificação pela fé e paz com Deus.',
  },
  {
    id: 'demo-aula-5',
    titulo: 'Mulheres da Bíblia: Ester',
    professor: 'Profa. Modelo Costa',
    data: domingo(1),
    classe: 'Belas' as const,
    textoBase: 'Ester 4',
    resumo: 'Coragem e propósito "para tal tempo como este".',
  },
  {
    id: 'demo-aula-6',
    titulo: 'Identidade em Cristo',
    professor: 'Pr. Teste Santos',
    data: domingo(1),
    classe: 'Adolescentes' as const,
    textoBase: 'Efésios 1',
    resumo: 'Quem somos à luz do que Deus diz sobre nós.',
  },
];

const eventos = [
  {
    id: 'demo-evento-1',
    nome: 'Culto de Domingo',
    data: proximo(0),
    horario: '18h',
    local: 'Templo Batista Bíblico',
    descricao: 'Culto de adoração e exposição da Palavra. Venha com a família.',
  },
  {
    id: 'demo-evento-2',
    nome: 'Koinonias - Pequenos Grupos',
    data: proximo(3),
    horario: '19h30',
    local: 'Nas casas',
    descricao: 'Comunhão, estudo bíblico e oração durante a semana. Procure um grupo perto de você.',
  },
  {
    id: 'demo-evento-3',
    nome: 'Conexteen',
    data: proximo(6),
    horario: '18h',
    local: 'Templo Batista Bíblico',
    descricao: 'Encontro semanal dos adolescentes.',
  },
  {
    id: 'demo-evento-4',
    nome: 'Encontro de Casais',
    data: diasA(21),
    horario: '19h',
    local: 'Salão da igreja',
    descricao: 'Noite de comunhão e ensino bíblico para casais. Inscrições com a liderança.',
  },
  {
    id: 'demo-evento-5',
    nome: 'Batismo',
    data: diasA(35),
    horario: '17h',
    local: 'Templo Batista Bíblico',
    descricao: 'Celebração de batismo. Quem deseja ser batizado deve procurar um pastor.',
  },
];

async function aplicar() {
  for (const p of pastores) {
    await prisma.pastor.upsert({ where: { id: p.id }, update: p, create: p });
  }

  for (const { lideres, ...m } of ministerios) {
    await prisma.ministerio.upsert({ where: { id: m.id }, update: m, create: m });
    // Líderes: recria a lista para refletir sempre o que está acima
    await prisma.ministerioLider.deleteMany({ where: { ministerioId: m.id } });
    await prisma.ministerioLider.createMany({
      data: lideres.map((nome, i) => ({ id: `${m.id}-lider-${i + 1}`, ministerioId: m.id, nome, ordem: i + 1 })),
    });
  }

  for (const s of sermoes) {
    await prisma.sermao.upsert({ where: { id: s.id }, update: s, create: s });
  }
  for (const a of aulas) {
    await prisma.aulaEbd.upsert({ where: { id: a.id }, update: a, create: a });
  }
  for (const e of eventos) {
    await prisma.evento.upsert({ where: { id: e.id }, update: e, create: e });
  }

  console.log(
    `Dados de demonstração aplicados: ${pastores.length} pastores, ${ministerios.length} ministérios, ` +
      `${sermoes.length} sermões, ${aulas.length} aulas, ${eventos.length} eventos.`
  );
}

async function remover() {
  const filtro = { id: { startsWith: PREFIXO } };
  // Líderes saem junto com o ministério (onDelete: Cascade)
  const resultados = await Promise.all([
    prisma.pastor.deleteMany({ where: filtro }),
    prisma.ministerio.deleteMany({ where: filtro }),
    prisma.sermao.deleteMany({ where: filtro }),
    prisma.aulaEbd.deleteMany({ where: filtro }),
    prisma.evento.deleteMany({ where: filtro }),
  ]);
  const total = resultados.reduce((soma, r) => soma + r.count, 0);
  console.log(`Dados de demonstração removidos (${total} registros).`);
}

const remove = process.argv.includes('--remove');

(remove ? remover() : aplicar())
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
