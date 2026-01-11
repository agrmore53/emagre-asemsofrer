-- Migration: Sistema de Gamificação
-- Criado em: 2025-01-04

-- ============================================
-- TABELA: conquistas
-- Lista de todas as conquistas possíveis
-- ============================================
CREATE TABLE public.conquistas (
    id TEXT PRIMARY KEY,
    titulo TEXT NOT NULL,
    descricao TEXT NOT NULL,
    icone TEXT NOT NULL,
    categoria TEXT NOT NULL CHECK (categoria IN ('streak', 'peso', 'conteudo', 'engajamento', 'especial')),
    pontos INTEGER DEFAULT 10,
    requisito JSONB NOT NULL, -- Ex: {"tipo": "streak", "valor": 7}
    ordem INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABELA: usuario_conquistas
-- Conquistas desbloqueadas por cada usuário
-- ============================================
CREATE TABLE public.usuario_conquistas (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    conquista_id TEXT REFERENCES public.conquistas(id) ON DELETE CASCADE NOT NULL,
    desbloqueada_em TIMESTAMPTZ DEFAULT NOW(),
    notificado BOOLEAN DEFAULT FALSE,

    UNIQUE(user_id, conquista_id)
);

-- Índices
CREATE INDEX idx_usuario_conquistas_user ON public.usuario_conquistas(user_id);
CREATE INDEX idx_usuario_conquistas_conquista ON public.usuario_conquistas(conquista_id);

-- ============================================
-- TABELA: usuario_streaks
-- Controle de sequências de dias
-- ============================================
CREATE TABLE public.usuario_streaks (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE NOT NULL,
    streak_atual INTEGER DEFAULT 0,
    maior_streak INTEGER DEFAULT 0,
    ultima_atividade DATE,
    total_dias_ativos INTEGER DEFAULT 0,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índice
CREATE INDEX idx_streaks_user ON public.usuario_streaks(user_id);

-- ============================================
-- TABELA: usuario_pontos
-- Pontuação total do usuário
-- ============================================
CREATE TABLE public.usuario_pontos (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE NOT NULL,
    pontos_totais INTEGER DEFAULT 0,
    nivel INTEGER DEFAULT 1,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índice
CREATE INDEX idx_pontos_user ON public.usuario_pontos(user_id);

-- ============================================
-- RLS (Row Level Security)
-- ============================================
ALTER TABLE public.conquistas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usuario_conquistas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usuario_streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usuario_pontos ENABLE ROW LEVEL SECURITY;

-- Conquistas - todos podem ver
CREATE POLICY "Todos podem ver conquistas"
    ON public.conquistas FOR SELECT
    TO authenticated
    USING (true);

-- Usuario conquistas - apenas próprias
CREATE POLICY "Usuários podem ver suas conquistas"
    ON public.usuario_conquistas FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Sistema pode inserir conquistas"
    ON public.usuario_conquistas FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Usuario streaks - apenas próprios
CREATE POLICY "Usuários podem ver seus streaks"
    ON public.usuario_streaks FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem inserir seus streaks"
    ON public.usuario_streaks FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar seus streaks"
    ON public.usuario_streaks FOR UPDATE
    USING (auth.uid() = user_id);

-- Usuario pontos - apenas próprios
CREATE POLICY "Usuários podem ver seus pontos"
    ON public.usuario_pontos FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem inserir seus pontos"
    ON public.usuario_pontos FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar seus pontos"
    ON public.usuario_pontos FOR UPDATE
    USING (auth.uid() = user_id);

-- ============================================
-- DADOS INICIAIS: Conquistas
-- ============================================
INSERT INTO public.conquistas (id, titulo, descricao, icone, categoria, pontos, requisito, ordem) VALUES
-- Streaks
('primeiro-registro', 'Primeiro Passo', 'Registrou seu peso pela primeira vez', '👣', 'streak', 10, '{"tipo": "registros", "valor": 1}', 1),
('streak-3', 'Iniciante Dedicado', 'Manteve uma sequência de 3 dias', '🌱', 'streak', 20, '{"tipo": "streak", "valor": 3}', 2),
('streak-7', 'Semana Perfeita', 'Manteve uma sequência de 7 dias', '🔥', 'streak', 50, '{"tipo": "streak", "valor": 7}', 3),
('streak-14', 'Duas Semanas Fortes', 'Manteve uma sequência de 14 dias', '💪', 'streak', 100, '{"tipo": "streak", "valor": 14}', 4),
('streak-30', 'Mês de Ouro', 'Manteve uma sequência de 30 dias', '🏆', 'streak', 200, '{"tipo": "streak", "valor": 30}', 5),
('streak-60', 'Guerreiro', 'Manteve uma sequência de 60 dias', '⚔️', 'streak', 400, '{"tipo": "streak", "valor": 60}', 6),
('streak-100', 'Lendário', 'Manteve uma sequência de 100 dias', '👑', 'streak', 1000, '{"tipo": "streak", "valor": 100}', 7),

-- Peso
('primeiro-kg', 'Primeira Vitória', 'Perdeu o primeiro quilograma', '🎯', 'peso', 50, '{"tipo": "peso_perdido", "valor": 1}', 10),
('perdeu-5kg', 'Em Transformação', 'Perdeu 5 quilogramas', '⭐', 'peso', 150, '{"tipo": "peso_perdido", "valor": 5}', 11),
('perdeu-10kg', 'Nova Pessoa', 'Perdeu 10 quilogramas', '🌟', 'peso', 300, '{"tipo": "peso_perdido", "valor": 10}', 12),
('perdeu-20kg', 'Transformação Total', 'Perdeu 20 quilogramas', '💎', 'peso', 500, '{"tipo": "peso_perdido", "valor": 20}', 13),
('meta-alcancada', 'Objetivo Conquistado', 'Alcançou o peso meta!', '🏅', 'peso', 1000, '{"tipo": "meta_alcancada", "valor": true}', 14),

-- Conteúdo
('primeiro-capitulo', 'Leitor Iniciante', 'Completou o primeiro capítulo', '📖', 'conteudo', 20, '{"tipo": "capitulos", "valor": 1}', 20),
('metade-conteudo', 'Dedicado ao Conhecimento', 'Completou metade do conteúdo', '📚', 'conteudo', 100, '{"tipo": "capitulos", "valor": 4}', 21),
('todo-conteudo', 'Mestre do Método', 'Completou todo o conteúdo', '🎓', 'conteudo', 300, '{"tipo": "capitulos", "valor": 8}', 22),

-- Engajamento
('perfil-completo', 'Perfil Completo', 'Preencheu todas as informações do perfil', '✅', 'engajamento', 30, '{"tipo": "perfil_completo", "valor": true}', 30),
('primeiro-cardapio', 'Chef em Formação', 'Gerou seu primeiro cardápio', '🍽️', 'engajamento', 40, '{"tipo": "cardapios", "valor": 1}', 31),
('10-cardapios', 'Planejador', 'Gerou 10 cardápios', '📋', 'engajamento', 100, '{"tipo": "cardapios", "valor": 10}', 32),

-- Especiais
('madrugador', 'Madrugador', 'Registrou peso antes das 7h', '🌅', 'especial', 25, '{"tipo": "horario", "valor": "antes_7h"}', 40),
('consistente', 'Consistente', 'Registrou peso toda semana por um mês', '📊', 'especial', 150, '{"tipo": "semanas_consecutivas", "valor": 4}', 41),
('assinante', 'Apoiador', 'Assinou um plano premium', '💜', 'especial', 100, '{"tipo": "assinatura", "valor": true}', 42);

-- ============================================
-- FUNÇÃO: Atualizar streak após registro
-- ============================================
CREATE OR REPLACE FUNCTION public.atualizar_streak()
RETURNS TRIGGER AS $$
DECLARE
    ultimo_registro DATE;
    streak_atual_val INTEGER;
    maior_streak_val INTEGER;
BEGIN
    -- Busca ou cria registro de streak
    INSERT INTO public.usuario_streaks (user_id, streak_atual, maior_streak, ultima_atividade, total_dias_ativos)
    VALUES (NEW.user_id, 0, 0, NULL, 0)
    ON CONFLICT (user_id) DO NOTHING;

    -- Busca dados atuais
    SELECT ultima_atividade, streak_atual, maior_streak
    INTO ultimo_registro, streak_atual_val, maior_streak_val
    FROM public.usuario_streaks
    WHERE user_id = NEW.user_id;

    -- Calcula novo streak
    IF ultimo_registro IS NULL THEN
        -- Primeiro registro
        streak_atual_val := 1;
    ELSIF NEW.data = ultimo_registro THEN
        -- Mesmo dia, não muda nada
        RETURN NEW;
    ELSIF NEW.data = ultimo_registro + INTERVAL '1 day' THEN
        -- Dia consecutivo
        streak_atual_val := streak_atual_val + 1;
    ELSIF NEW.data > ultimo_registro + INTERVAL '1 day' THEN
        -- Quebrou o streak
        streak_atual_val := 1;
    END IF;

    -- Atualiza maior streak se necessário
    IF streak_atual_val > maior_streak_val THEN
        maior_streak_val := streak_atual_val;
    END IF;

    -- Atualiza tabela
    UPDATE public.usuario_streaks
    SET
        streak_atual = streak_atual_val,
        maior_streak = maior_streak_val,
        ultima_atividade = NEW.data,
        total_dias_ativos = total_dias_ativos + 1,
        updated_at = NOW()
    WHERE user_id = NEW.user_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para atualizar streak
CREATE TRIGGER trigger_atualizar_streak
    AFTER INSERT ON public.tracker_registros
    FOR EACH ROW
    EXECUTE FUNCTION public.atualizar_streak();

-- ============================================
-- FUNÇÃO: Criar registros iniciais para novo usuário
-- ============================================
CREATE OR REPLACE FUNCTION public.criar_gamificacao_usuario()
RETURNS TRIGGER AS $$
BEGIN
    -- Cria registro de streaks
    INSERT INTO public.usuario_streaks (user_id)
    VALUES (NEW.id)
    ON CONFLICT DO NOTHING;

    -- Cria registro de pontos
    INSERT INTO public.usuario_pontos (user_id)
    VALUES (NEW.id)
    ON CONFLICT DO NOTHING;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para criar gamificação após perfil
CREATE TRIGGER trigger_criar_gamificacao
    AFTER INSERT ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.criar_gamificacao_usuario();
