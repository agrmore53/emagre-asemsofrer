-- Migration: Schema inicial do Emagreça Sem Sofrer
-- Criado em: 2025-01-04

-- Habilita a extensão UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABELA: profiles
-- Extende os dados do auth.users
-- ============================================
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    nome TEXT NOT NULL,
    email TEXT NOT NULL,
    data_nascimento DATE,
    sexo TEXT CHECK (sexo IN ('masculino', 'feminino')),
    altura_cm INTEGER CHECK (altura_cm > 0 AND altura_cm < 300),
    peso_inicial DECIMAL(5,2) CHECK (peso_inicial > 0 AND peso_inicial < 500),
    peso_meta DECIMAL(5,2) CHECK (peso_meta > 0 AND peso_meta < 500),
    nivel_atividade TEXT DEFAULT 'sedentario' CHECK (nivel_atividade IN ('sedentario', 'leve', 'moderado', 'intenso')),
    restricoes_alimentares JSONB DEFAULT '[]'::jsonb,
    plano TEXT DEFAULT 'free' CHECK (plano IN ('free', 'basico', 'premium')),
    status_assinatura TEXT DEFAULT 'ativo' CHECK (status_assinatura IN ('ativo', 'cancelado', 'pendente', 'expirado')),
    mercadopago_subscription_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índice para busca por email
CREATE INDEX idx_profiles_email ON public.profiles(email);

-- ============================================
-- TABELA: tracker_registros
-- Registros de peso e medidas
-- ============================================
CREATE TABLE public.tracker_registros (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    data DATE NOT NULL,
    peso_kg DECIMAL(5,2) NOT NULL CHECK (peso_kg > 0 AND peso_kg < 500),
    cintura_cm DECIMAL(5,2) CHECK (cintura_cm > 0 AND cintura_cm < 300),
    quadril_cm DECIMAL(5,2) CHECK (quadril_cm > 0 AND quadril_cm < 300),
    braco_cm DECIMAL(5,2) CHECK (braco_cm > 0 AND braco_cm < 100),
    observacoes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),

    -- Evita registros duplicados no mesmo dia
    UNIQUE(user_id, data)
);

-- Índices
CREATE INDEX idx_tracker_user_id ON public.tracker_registros(user_id);
CREATE INDEX idx_tracker_data ON public.tracker_registros(data DESC);

-- ============================================
-- TABELA: conteudo_progresso
-- Progresso na leitura dos capítulos
-- ============================================
CREATE TABLE public.conteudo_progresso (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    capitulo_id TEXT NOT NULL,
    concluido BOOLEAN DEFAULT FALSE,
    data_conclusao TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(user_id, capitulo_id)
);

-- Índice
CREATE INDEX idx_progresso_user_id ON public.conteudo_progresso(user_id);

-- ============================================
-- TABELA: cardapios
-- Cardápios gerados para o usuário
-- ============================================
CREATE TABLE public.cardapios (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    data DATE NOT NULL,
    refeicoes JSONB NOT NULL,
    calorias_total INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(user_id, data)
);

-- Índice
CREATE INDEX idx_cardapios_user_id ON public.cardapios(user_id);
CREATE INDEX idx_cardapios_data ON public.cardapios(data DESC);

-- ============================================
-- TABELA: assinaturas
-- Controle de assinaturas e pagamentos
-- ============================================
CREATE TABLE public.assinaturas (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    mercadopago_id TEXT,
    plano TEXT NOT NULL CHECK (plano IN ('basico', 'premium')),
    valor DECIMAL(10,2) NOT NULL,
    status TEXT DEFAULT 'pendente' CHECK (status IN ('ativo', 'cancelado', 'pendente', 'expirado')),
    data_inicio TIMESTAMPTZ NOT NULL,
    data_fim TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índice
CREATE INDEX idx_assinaturas_user_id ON public.assinaturas(user_id);
CREATE INDEX idx_assinaturas_status ON public.assinaturas(status);

-- ============================================
-- FUNÇÕES E TRIGGERS
-- ============================================

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para profiles
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Função para criar perfil automaticamente após signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, nome)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'nome', split_part(NEW.email, '@', 1))
    );
    RETURN NEW;
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- Trigger para criar perfil após novo usuário
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Habilita RLS em todas as tabelas
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tracker_registros ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conteudo_progresso ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cardapios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assinaturas ENABLE ROW LEVEL SECURITY;

-- Políticas para profiles
CREATE POLICY "Usuários podem ver seu próprio perfil"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Usuários podem atualizar seu próprio perfil"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

-- Políticas para tracker_registros
CREATE POLICY "Usuários podem ver seus registros"
    ON public.tracker_registros FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem inserir seus registros"
    ON public.tracker_registros FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar seus registros"
    ON public.tracker_registros FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem deletar seus registros"
    ON public.tracker_registros FOR DELETE
    USING (auth.uid() = user_id);

-- Políticas para conteudo_progresso
CREATE POLICY "Usuários podem ver seu progresso"
    ON public.conteudo_progresso FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem inserir seu progresso"
    ON public.conteudo_progresso FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar seu progresso"
    ON public.conteudo_progresso FOR UPDATE
    USING (auth.uid() = user_id);

-- Políticas para cardapios
CREATE POLICY "Usuários podem ver seus cardápios"
    ON public.cardapios FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem inserir seus cardápios"
    ON public.cardapios FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar seus cardápios"
    ON public.cardapios FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem deletar seus cardápios"
    ON public.cardapios FOR DELETE
    USING (auth.uid() = user_id);

-- Políticas para assinaturas
CREATE POLICY "Usuários podem ver suas assinaturas"
    ON public.assinaturas FOR SELECT
    USING (auth.uid() = user_id);

-- ============================================
-- GRANTS
-- ============================================

-- Permite que usuários autenticados acessem as tabelas
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
