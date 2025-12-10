-- Tabela para conteúdos de texto das páginas (Quem Somos, Missão, Visão, O Que Cremos)
CREATE TABLE public.conteudos_paginas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  pagina TEXT NOT NULL UNIQUE,
  titulo TEXT NOT NULL,
  subtitulo TEXT,
  conteudo TEXT NOT NULL,
  conteudo_extra JSONB,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_by UUID REFERENCES auth.users(id)
);

-- Tabela para Pastores
CREATE TABLE public.pastores (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  funcao TEXT NOT NULL,
  bio TEXT,
  foto_url TEXT,
  ordem INT NOT NULL DEFAULT 0,
  ativo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- Tabela para Ministérios
CREATE TABLE public.ministerios (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  descricao TEXT NOT NULL,
  descricao_completa TEXT,
  icone TEXT NOT NULL DEFAULT 'Users',
  foto_url TEXT,
  ordem INT NOT NULL DEFAULT 0,
  ativo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- Tabela para Líderes de Ministérios
CREATE TABLE public.ministerios_lideres (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ministerio_id UUID NOT NULL REFERENCES public.ministerios(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  ordem INT NOT NULL DEFAULT 0
);

-- Enable RLS
ALTER TABLE public.conteudos_paginas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pastores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ministerios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ministerios_lideres ENABLE ROW LEVEL SECURITY;

-- Policies para conteudos_paginas
CREATE POLICY "Anyone can view conteudos_paginas" ON public.conteudos_paginas
  FOR SELECT USING (true);

CREATE POLICY "Admins and editors can update conteudos_paginas" ON public.conteudos_paginas
  FOR UPDATE USING (is_admin_or_editor(auth.uid()));

CREATE POLICY "Admins and editors can insert conteudos_paginas" ON public.conteudos_paginas
  FOR INSERT WITH CHECK (is_admin_or_editor(auth.uid()));

-- Policies para pastores
CREATE POLICY "Anyone can view pastores" ON public.pastores
  FOR SELECT USING (true);

CREATE POLICY "Admins and editors can insert pastores" ON public.pastores
  FOR INSERT WITH CHECK (is_admin_or_editor(auth.uid()));

CREATE POLICY "Admins and editors can update pastores" ON public.pastores
  FOR UPDATE USING (is_admin_or_editor(auth.uid()));

CREATE POLICY "Admins and editors can delete pastores" ON public.pastores
  FOR DELETE USING (is_admin_or_editor(auth.uid()));

-- Policies para ministerios
CREATE POLICY "Anyone can view ministerios" ON public.ministerios
  FOR SELECT USING (true);

CREATE POLICY "Admins and editors can insert ministerios" ON public.ministerios
  FOR INSERT WITH CHECK (is_admin_or_editor(auth.uid()));

CREATE POLICY "Admins and editors can update ministerios" ON public.ministerios
  FOR UPDATE USING (is_admin_or_editor(auth.uid()));

CREATE POLICY "Admins and editors can delete ministerios" ON public.ministerios
  FOR DELETE USING (is_admin_or_editor(auth.uid()));

-- Policies para ministerios_lideres
CREATE POLICY "Anyone can view ministerios_lideres" ON public.ministerios_lideres
  FOR SELECT USING (true);

CREATE POLICY "Admins and editors can insert ministerios_lideres" ON public.ministerios_lideres
  FOR INSERT WITH CHECK (is_admin_or_editor(auth.uid()));

CREATE POLICY "Admins and editors can update ministerios_lideres" ON public.ministerios_lideres
  FOR UPDATE USING (is_admin_or_editor(auth.uid()));

CREATE POLICY "Admins and editors can delete ministerios_lideres" ON public.ministerios_lideres
  FOR DELETE USING (is_admin_or_editor(auth.uid()));

-- Triggers para updated_at
CREATE TRIGGER update_conteudos_paginas_updated_at
  BEFORE UPDATE ON public.conteudos_paginas
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_pastores_updated_at
  BEFORE UPDATE ON public.pastores
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_ministerios_updated_at
  BEFORE UPDATE ON public.ministerios
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Storage bucket para fotos
INSERT INTO storage.buckets (id, name, public) VALUES ('fotos', 'fotos', true);

-- Policies para storage
CREATE POLICY "Anyone can view fotos" ON storage.objects
  FOR SELECT USING (bucket_id = 'fotos');

CREATE POLICY "Admins and editors can upload fotos" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'fotos' AND is_admin_or_editor(auth.uid()));

CREATE POLICY "Admins and editors can update fotos" ON storage.objects
  FOR UPDATE USING (bucket_id = 'fotos' AND is_admin_or_editor(auth.uid()));

CREATE POLICY "Admins and editors can delete fotos" ON storage.objects
  FOR DELETE USING (bucket_id = 'fotos' AND is_admin_or_editor(auth.uid()));

-- Inserir conteúdos iniciais das páginas
INSERT INTO public.conteudos_paginas (pagina, titulo, subtitulo, conteudo, conteudo_extra) VALUES
('quem-somos', 'Quem Somos', 'Conheça a identidade e os valores do Templo Batista Bíblico.', 
'Somos uma igreja Batista que preserva a Bíblia como regra de fé e prática eclesiástica.

Somos independentes na forma de conduzir nossas atividades e acreditamos que membros de um ministério local devem produzir frutos na comunidade local.

Somos uma igreja que valoriza os relacionamentos, acreditando que por meio deles, Deus nos ajuda a crescer em santidade.

Somos uma igreja que coloca o ensino e a pregação da Palavra de Deus acima de qualquer outra prática, crendo que a exposição bíblica é a nossa principal tarefa.

Somos uma igreja envolvida com a educação. Acreditamos que pelo ensino correto das Escrituras obteremos mudanças consistentes e por esta razão, enfatizamos a educação teológica como grande parte de nosso empenho.

Somos uma igreja que valoriza a adoração e o culto comunitário. Acreditamos que todo salvo deve se reunir em comunidade para adorar ao Senhor.', NULL),

('missao', 'Nossa Missão', 'O propósito que nos move como comunidade de fé.',
'"Glorificar a Deus, conduzindo pessoas a Cristo, integrando-as à Igreja, levando-as à maturidade cristã pelo estudo da Palavra, discipulado e prática de uma verdadeira adoração, visando o alcance da estatura de Cristo" (Rm 11.36)',
'{"itens": ["Ajudamos pessoas a conhecerem a Cristo como seu Salvador.", "Acompanhamos pessoas por meio de discipulado, para aprenderem a amar a Cristo como Senhor, e andarem com Ele.", "Integramos pessoas à igreja local, que como Corpo de Cristo, é o lugar onde recebem edificação para suas vidas e oportunidades para servirem ao próximo.", "Nossa maneira de viver redunda em obediência aos seus mandamentos."]}'::jsonb),

('visao', 'Nossa Visão', 'O grande desafio que temos pela frente.',
'Cumprimos nossa missão ao percebermos o grande desafio que temos, em sermos uma igreja que investe vida em vidas; apreciando mais as pessoas do que programas e mais os relacionamentos do que eventos.

Para isso, cada ministério da igreja está em desenvolvimento para cultivar 4 áreas em sua atuação:',
'{"pilares": [{"titulo": "Apascentar", "referencia": "Col 1.28", "descricao": "Contribuir para o desenvolvimento pessoal e integral do grupo", "icone": "Heart"}, {"titulo": "Evangelizar", "referencia": "Mc 16.16", "descricao": "Formação de novos discípulos", "icone": "Users"}, {"titulo": "Discipular", "referencia": "Mt 28.19-20", "descricao": "Formação de discípulos novos", "icone": "BookOpen"}, {"titulo": "Treinar", "referencia": "2 Tm 2.2", "descricao": "Formação de novos líderes", "icone": "GraduationCap"}]}'::jsonb),

('o-que-cremos', 'O Que Cremos', 'As doutrinas que fundamentam nossa fé e prática.',
'',
'{"crencas": [{"titulo": "A Bíblia é suficiente para conduzir nossas vidas, igreja, família e ministérios", "texto": "Cremos que a Bíblia é a Palavra de Deus Inerrante (Mt 5.17-18; Jo 10.35), Inspirada (2 Tm 3.16-17; 2 Pe 1.20-21) e totalmente Suficiente para o homem moderno (1 Pe 1.3; Hb 4.12; Sl 119.105)."}, {"titulo": "Deus é o Criador de todas as coisas", "texto": "Cremos num Deus único (Dt 6.4-5), eterno, infinito, imutável, criador de todas as coisas, pessoal, e que se revela por meio de três pessoas essencialmente iguais: Pai, Filho e Espírito Santo (Is 48.16; Mt 28.19-20)."}, {"titulo": "Jesus Cristo é Deus que se tornou homem para redimir a humanidade de seus pecados", "texto": "Conforme Mt 16.16, Jesus é o Cristo o filho do Deus vivo. Ele é o Deus-Homem, partilhando plenamente da eterna divindade e de nossa frágil humanidade (Fp 2.7)."}, {"titulo": "O Espírito Santo é Deus e o agente da vida da igreja", "texto": "Cremos que o Espírito Santo é a terceira pessoa da Trindade. Ele não é uma força impessoal, pois tem personalidade (Rm 8.27), emoções (Ef 4.30), e vontade (1 Co 12.11)."}, {"titulo": "O homem foi criado por Deus para sua glória", "texto": "Cremos que Deus criou o homem, para a sua própria glória – Is 43.7. O corpo do homem foi criado do pó da terra; e a sua natureza imaterial, pelo sopro de Deus (Gn 1.26-27; 2.7; Ec 12.7)."}, {"titulo": "A salvação do homem é um ato da graça de Deus", "texto": "Cremos que todos os seres humanos nascem espiritualmente mortos (Ef 2.1; Rm 3.10) e por isso, necessitados de salvação, que se dá pela oferta voluntária de Jesus Cristo."}, {"titulo": "A salvação não pode ser perdida", "texto": "Entendemos que o salvo não pode perder a salvação porque suas obras não lhe dão direito, nem tiram a salvação (Ef 2.8-9)."}, {"titulo": "A volta de Jesus é iminente", "texto": "Cremos que Jesus cumprirá sua promessa de voltar a terra (At 1.11)."}, {"titulo": "A base de um ministério eficaz está no investimento pessoal de vidas", "texto": "Cremos que a missão da igreja é fazer discípulos de Cristo (Mt 28.19-20) e ajudá-los a crescer na graça e conhecimento de Cristo."}, {"titulo": "O Culto é um reflexo da adoração pessoal e diária de cada salvo", "texto": "Cremos que cada salvo por ser um adorador, deve viver todos os dias em comunhão com Deus (1 Co 10.31)."}, {"titulo": "A integridade pessoal é um instrumento nas mãos de Deus", "texto": "Cremos que cada salvo tem um compromisso pessoal com Jesus de seguir seus passos em tudo (Ef 4)."}, {"titulo": "Todo salvo é um servo apto para desenvolver seus dons", "texto": "Cremos que cada salvo tem pelo menos um dom (Ef 4.7; Rm 12.6; 1 Co 12.11) para ser usado na edificação da obra de Deus."}, {"titulo": "Uma igreja ministerialmente unida cumpre sua missão", "texto": "Cremos que o modelo de Efésios 4.1-16 demonstra que o crescimento da igreja é natural, por ser ela um organismo vivo."}, {"titulo": "O ministério pastoral funciona melhor com multiplicidade de pastores", "texto": "Cremos que o modelo bíblico para o pastorado visa o trabalho em equipe (Ef 4.11; At 13.1-3; 14.23; 15.4)."}]}'::jsonb);