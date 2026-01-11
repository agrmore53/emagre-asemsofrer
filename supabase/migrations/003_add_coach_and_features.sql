-- Migration: Adicionar tabelas para novas funcionalidades
-- Data: 2026-01-05
-- Inclui: AI Coach, Team Challenges, GLP-1, Ciclo Menstrual, etc.

-- ========================================
-- 1. AI COACH - Conversas
-- ========================================
CREATE TABLE IF NOT EXISTS coach_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  user_message TEXT NOT NULL,
  ai_response TEXT NOT NULL,
  message_type TEXT, -- 'greeting', 'motivation', 'nutrition', etc.
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_coach_conversations_user ON coach_conversations(user_id);
CREATE INDEX idx_coach_conversations_date ON coach_conversations(created_at);

-- ========================================
-- 2. TEAM CHALLENGES - Desafios em grupo
-- ========================================
CREATE TABLE IF NOT EXISTS challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  descricao TEXT,
  tipo TEXT NOT NULL DEFAULT 'peso', -- 'peso', 'streak', 'passos', 'agua'
  meta_valor DECIMAL, -- ex: 5 (kg para perder)
  data_inicio DATE NOT NULL,
  data_fim DATE NOT NULL,
  criador_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  codigo_convite TEXT UNIQUE, -- código para entrar no desafio
  premio_descricao TEXT,
  premio_valor DECIMAL,
  max_participantes INTEGER DEFAULT 50,
  privado BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS challenge_participantes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_id UUID REFERENCES challenges(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  peso_inicial DECIMAL,
  peso_atual DECIMAL,
  percentual_perdido DECIMAL GENERATED ALWAYS AS (
    CASE WHEN peso_inicial > 0
    THEN ((peso_inicial - COALESCE(peso_atual, peso_inicial)) / peso_inicial) * 100
    ELSE 0 END
  ) STORED,
  posicao_ranking INTEGER,
  data_entrada TIMESTAMPTZ DEFAULT NOW(),
  ativo BOOLEAN DEFAULT true,
  UNIQUE(challenge_id, user_id)
);

CREATE INDEX idx_challenge_participantes_challenge ON challenge_participantes(challenge_id);
CREATE INDEX idx_challenge_participantes_ranking ON challenge_participantes(challenge_id, percentual_perdido DESC);

-- ========================================
-- 3. LEADERBOARD - Rankings semanais
-- ========================================
CREATE TABLE IF NOT EXISTS leaderboard_semanal (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  semana_inicio DATE NOT NULL,
  semana_fim DATE NOT NULL,
  peso_inicio DECIMAL,
  peso_fim DECIMAL,
  percentual_perdido DECIMAL,
  posicao INTEGER,
  pontos_ganhos INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, semana_inicio)
);

CREATE INDEX idx_leaderboard_semana ON leaderboard_semanal(semana_inicio, percentual_perdido DESC);

-- ========================================
-- 4. GLP-1 COMPANION - Tracking de medicação
-- ========================================
CREATE TABLE IF NOT EXISTS glp1_registros (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  medicamento TEXT NOT NULL, -- 'ozempic', 'wegovy', 'mounjaro', etc.
  dosagem TEXT, -- '0.25mg', '0.5mg', '1mg', etc.
  data_aplicacao TIMESTAMPTZ NOT NULL,
  local_aplicacao TEXT, -- 'abdomen', 'coxa', 'braco'
  lado TEXT, -- 'esquerdo', 'direito'
  efeitos_colaterais TEXT[],
  nivel_nausea INTEGER, -- 0-10
  nivel_apetite INTEGER, -- 0-10
  observacoes TEXT,
  foto_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_glp1_registros_user ON glp1_registros(user_id);
CREATE INDEX idx_glp1_registros_data ON glp1_registros(user_id, data_aplicacao DESC);

-- Adicionar campos GLP-1 ao perfil
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS usa_glp1 BOOLEAN DEFAULT false;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS medicamento_glp1 TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS dosagem_glp1 TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS data_inicio_glp1 DATE;

-- ========================================
-- 5. CICLO MENSTRUAL - Tracking hormonal
-- ========================================
CREATE TABLE IF NOT EXISTS ciclo_menstrual (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  data_inicio_ciclo DATE NOT NULL,
  duracao_ciclo INTEGER DEFAULT 28,
  duracao_menstruacao INTEGER DEFAULT 5,
  sintomas TEXT[],
  intensidade_fluxo TEXT, -- 'leve', 'moderado', 'intenso'
  observacoes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_ciclo_user ON ciclo_menstrual(user_id, data_inicio_ciclo DESC);

-- Adicionar fase do ciclo ao perfil
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS fase_ciclo TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS ultimo_ciclo_inicio DATE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS duracao_ciclo_media INTEGER DEFAULT 28;

-- ========================================
-- 6. CBT LESSONS - Lições comportamentais
-- ========================================
CREATE TABLE IF NOT EXISTS cbt_lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo TEXT NOT NULL,
  descricao TEXT,
  categoria TEXT NOT NULL, -- 'gatilhos', 'emocoes', 'habitos', 'mindfulness'
  conteudo JSONB NOT NULL, -- slides/cards da lição
  duracao_minutos INTEGER DEFAULT 5,
  ordem INTEGER,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS cbt_progresso (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  lesson_id UUID REFERENCES cbt_lessons(id) ON DELETE CASCADE NOT NULL,
  concluido BOOLEAN DEFAULT false,
  data_conclusao TIMESTAMPTZ,
  respostas_quiz JSONB,
  nota INTEGER, -- 0-100
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, lesson_id)
);

-- ========================================
-- 7. SLEEP TRACKING - Sono e metabolismo
-- ========================================
CREATE TABLE IF NOT EXISTS sleep_registros (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  data DATE NOT NULL,
  hora_dormir TIME,
  hora_acordar TIME,
  duracao_minutos INTEGER,
  qualidade INTEGER, -- 1-5
  acordou_noite INTEGER DEFAULT 0,
  usou_tela_antes BOOLEAN DEFAULT false,
  cafeina_tarde BOOLEAN DEFAULT false,
  exercicio_dia BOOLEAN DEFAULT false,
  nivel_energia_manha INTEGER, -- 1-10
  observacoes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, data)
);

CREATE INDEX idx_sleep_user_data ON sleep_registros(user_id, data DESC);

-- ========================================
-- 8. COMMUNITY GROUPS - Grupos temáticos
-- ========================================
CREATE TABLE IF NOT EXISTS community_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  descricao TEXT,
  tipo TEXT NOT NULL, -- 'menopausa', '50+', 'glp1', 'vegetariano', etc.
  imagem_url TEXT,
  privado BOOLEAN DEFAULT false,
  max_membros INTEGER DEFAULT 500,
  criador_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS community_membros (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID REFERENCES community_groups(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  role TEXT DEFAULT 'membro', -- 'admin', 'moderador', 'membro'
  data_entrada TIMESTAMPTZ DEFAULT NOW(),
  notificacoes BOOLEAN DEFAULT true,
  UNIQUE(group_id, user_id)
);

CREATE TABLE IF NOT EXISTS community_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID REFERENCES community_groups(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  conteudo TEXT NOT NULL,
  tipo TEXT DEFAULT 'texto', -- 'texto', 'imagem', 'video', 'conquista'
  midia_url TEXT,
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  fixado BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS community_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES community_posts(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  conteudo TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS community_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES community_posts(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);

-- Índices para comunidade
CREATE INDEX idx_community_posts_group ON community_posts(group_id, created_at DESC);
CREATE INDEX idx_community_membros_group ON community_membros(group_id);
CREATE INDEX idx_community_membros_user ON community_membros(user_id);

-- ========================================
-- 9. PHOTO MEAL LOGGING
-- ========================================
CREATE TABLE IF NOT EXISTS meal_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  foto_url TEXT NOT NULL,
  data_refeicao TIMESTAMPTZ DEFAULT NOW(),
  tipo_refeicao TEXT, -- 'cafe', 'almoco', 'jantar', 'lanche'
  descricao_ia TEXT, -- descrição gerada pela IA
  alimentos_detectados JSONB, -- lista de alimentos detectados
  calorias_estimadas INTEGER,
  proteinas_estimadas DECIMAL,
  carboidratos_estimados DECIMAL,
  gorduras_estimadas DECIMAL,
  confirmado_usuario BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_meal_photos_user ON meal_photos(user_id, data_refeicao DESC);

-- ========================================
-- 10. VIDEO PROGRESS - Antes/depois
-- ========================================
CREATE TABLE IF NOT EXISTS progress_videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  video_url TEXT NOT NULL,
  thumbnail_url TEXT,
  data DATE NOT NULL,
  peso_kg DECIMAL,
  tipo TEXT DEFAULT 'progresso', -- 'antes', 'progresso', 'depois'
  descricao TEXT,
  publico BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- 11. BETTING FEATURE - Apostas na meta
-- ========================================
CREATE TABLE IF NOT EXISTS weight_bets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  meta_peso DECIMAL NOT NULL,
  data_limite DATE NOT NULL,
  valor_apostado DECIMAL NOT NULL,
  status TEXT DEFAULT 'ativo', -- 'ativo', 'ganhou', 'perdeu', 'cancelado'
  peso_inicial DECIMAL,
  peso_final DECIMAL,
  data_conclusao TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- FUNÇÕES AUXILIARES
-- ========================================

-- Função para calcular fase do ciclo menstrual
CREATE OR REPLACE FUNCTION calcular_fase_ciclo(
  p_data_inicio DATE,
  p_duracao_ciclo INTEGER DEFAULT 28
) RETURNS TEXT AS $$
DECLARE
  dias_desde_inicio INTEGER;
  fase TEXT;
BEGIN
  dias_desde_inicio := CURRENT_DATE - p_data_inicio;
  dias_desde_inicio := dias_desde_inicio % p_duracao_ciclo;

  IF dias_desde_inicio <= 5 THEN
    fase := 'menstrual';
  ELSIF dias_desde_inicio <= 13 THEN
    fase := 'folicular';
  ELSIF dias_desde_inicio <= 16 THEN
    fase := 'ovulacao';
  ELSE
    fase := 'lutea';
  END IF;

  RETURN fase;
END;
$$ LANGUAGE plpgsql;

-- Função para atualizar ranking do leaderboard
CREATE OR REPLACE FUNCTION atualizar_ranking_challenge(p_challenge_id UUID)
RETURNS VOID AS $$
BEGIN
  WITH ranked AS (
    SELECT
      id,
      ROW_NUMBER() OVER (ORDER BY percentual_perdido DESC) as nova_posicao
    FROM challenge_participantes
    WHERE challenge_id = p_challenge_id AND ativo = true
  )
  UPDATE challenge_participantes cp
  SET posicao_ranking = r.nova_posicao
  FROM ranked r
  WHERE cp.id = r.id;
END;
$$ LANGUAGE plpgsql;

-- Inserir grupos de comunidade padrão
INSERT INTO community_groups (nome, descricao, tipo) VALUES
  ('Mulheres 40+', 'Grupo de apoio para mulheres acima de 40 anos', 'menopausa'),
  ('Usuários GLP-1', 'Comunidade para quem usa Ozempic, Wegovy, Mounjaro', 'glp1'),
  ('Iniciantes', 'Para quem está começando a jornada de emagrecimento', 'iniciantes'),
  ('Receitas Saudáveis', 'Compartilhe e descubra receitas fit', 'receitas'),
  ('Motivação Diária', 'Compartilhe suas vitórias e receba apoio', 'motivacao')
ON CONFLICT DO NOTHING;
