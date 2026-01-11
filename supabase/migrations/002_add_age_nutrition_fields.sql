-- Migration: Adicionar campos de nutrição por idade ao perfil
-- Data: 2026-01-04
-- Descrição: Adiciona campos para personalização nutricional por faixa etária e fase hormonal

-- Adiciona campo para fase hormonal (menopausa, andropausa, etc.)
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS fase_hormonal TEXT;

-- Adiciona campo para objetivo de saúde principal
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS objetivo_saude TEXT;

-- Adiciona campo para condições de saúde (diabetes, hipertensão, etc.)
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS condicoes_saude TEXT[];

-- Adiciona campo para suplementos que o usuário já toma
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS suplementos_atuais TEXT[];

-- Comentários para documentação
COMMENT ON COLUMN profiles.fase_hormonal IS 'Fase hormonal do usuário: regular, pre_menopausa, perimenopausa, menopausa, andropausa_inicial, andropausa';
COMMENT ON COLUMN profiles.objetivo_saude IS 'Objetivo principal de saúde: perder_peso, manter_peso, ganhar_massa, longevidade, energia, saude_hormonal';
COMMENT ON COLUMN profiles.condicoes_saude IS 'Array de condições de saúde: diabetes, hipertensao, colesterol_alto, tireoide, osteoporose, artrite';
COMMENT ON COLUMN profiles.suplementos_atuais IS 'Array de suplementos que o usuário já toma';

-- Índices para melhorar performance de queries por faixa etária
CREATE INDEX IF NOT EXISTS idx_profiles_fase_hormonal ON profiles(fase_hormonal);
CREATE INDEX IF NOT EXISTS idx_profiles_objetivo_saude ON profiles(objetivo_saude);
