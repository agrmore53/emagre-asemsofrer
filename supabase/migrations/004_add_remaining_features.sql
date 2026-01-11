-- Migration: Adicionar tabelas restantes para features completas
-- Data: 2026-01-06
-- Inclui: Video Progress, Apostas, Wearables, Barcode Cache

-- ========================================
-- 1. VIDEO PROGRESS - Antes/Depois em Vídeo
-- ========================================
CREATE TABLE IF NOT EXISTS video_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('antes', 'durante', 'depois')),
  data DATE NOT NULL,
  peso_kg DECIMAL(5,2),
  video_url TEXT NOT NULL,
  thumbnail_url TEXT,
  descricao TEXT,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_video_progress_user ON video_progress(user_id, data);
CREATE INDEX IF NOT EXISTS idx_video_progress_public ON video_progress(is_public, created_at DESC) WHERE is_public = true;

-- ========================================
-- 2. APOSTAS - Sistema de Betting na Meta
-- ========================================
CREATE TABLE IF NOT EXISTS apostas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  tipo TEXT NOT NULL DEFAULT 'solo' CHECK (tipo IN ('solo', 'grupo', 'desafio')),
  valor_apostado DECIMAL(10,2) NOT NULL CHECK (valor_apostado >= 20),
  peso_inicial DECIMAL(5,2) NOT NULL,
  peso_meta DECIMAL(5,2) NOT NULL,
  data_inicio DATE NOT NULL DEFAULT CURRENT_DATE,
  data_limite DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'ativa' CHECK (status IN ('ativa', 'verificando', 'ganhou', 'perdeu', 'cancelada', 'reembolsada')),
  peso_final DECIMAL(5,2),
  ganho_potencial DECIMAL(10,2),
  ganho DECIMAL(10,2),
  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- Validações
  CONSTRAINT check_meta_menor CHECK (peso_meta < peso_inicial),
  CONSTRAINT check_data_limite CHECK (data_limite > data_inicio)
);

CREATE INDEX IF NOT EXISTS idx_apostas_user ON apostas(user_id);
CREATE INDEX IF NOT EXISTS idx_apostas_status ON apostas(user_id, status);
CREATE INDEX IF NOT EXISTS idx_apostas_ativas ON apostas(user_id, status) WHERE status IN ('ativa', 'verificando');

-- ========================================
-- 3. WEARABLES - Dispositivos Conectados
-- ========================================
CREATE TABLE IF NOT EXISTS wearable_devices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('apple_watch', 'mi_band', 'fitbit', 'samsung_watch', 'garmin', 'google_fit', 'outro')),
  nome TEXT NOT NULL,
  modelo TEXT,
  conectado BOOLEAN DEFAULT true,
  ultima_sincronizacao TIMESTAMPTZ,
  bateria INTEGER CHECK (bateria >= 0 AND bateria <= 100),
  access_token TEXT, -- Token OAuth para APIs externas
  refresh_token TEXT,
  token_expira_em TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_wearable_devices_user ON wearable_devices(user_id);

-- ========================================
-- 4. WEARABLE DATA - Dados dos Dispositivos
-- ========================================
CREATE TABLE IF NOT EXISTS wearable_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  device_id UUID REFERENCES wearable_devices(id) ON DELETE SET NULL,
  data DATE NOT NULL,

  -- Atividade
  passos INTEGER DEFAULT 0,
  calorias_queimadas INTEGER DEFAULT 0,
  distancia_km DECIMAL(6,2) DEFAULT 0,
  minutos_ativos INTEGER DEFAULT 0,

  -- Frequência Cardíaca
  frequencia_cardiaca_media INTEGER,
  frequencia_cardiaca_max INTEGER,
  frequencia_cardiaca_repouso INTEGER,

  -- Sono
  sono_horas DECIMAL(4,2),
  sono_qualidade INTEGER CHECK (sono_qualidade >= 0 AND sono_qualidade <= 100),

  -- Peso (se sincronizado de balança inteligente)
  peso_kg DECIMAL(5,2),

  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- Um registro por dia por usuário
  UNIQUE(user_id, data)
);

CREATE INDEX IF NOT EXISTS idx_wearable_data_user_date ON wearable_data(user_id, data DESC);
CREATE INDEX IF NOT EXISTS idx_wearable_data_device ON wearable_data(device_id);

-- ========================================
-- 5. WEARABLE METAS - Metas Diárias
-- ========================================
CREATE TABLE IF NOT EXISTS wearable_metas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL UNIQUE,
  passos_diarios INTEGER DEFAULT 10000,
  calorias_diarias INTEGER DEFAULT 500,
  minutos_ativos INTEGER DEFAULT 30,
  sono_horas DECIMAL(3,1) DEFAULT 8,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- 6. BARCODE CACHE - Cache de Produtos Escaneados
-- ========================================
CREATE TABLE IF NOT EXISTS barcode_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  codigo_barras TEXT NOT NULL UNIQUE,
  nome TEXT NOT NULL,
  marca TEXT,
  porcao TEXT,
  calorias INTEGER,
  proteinas DECIMAL(6,2),
  carboidratos DECIMAL(6,2),
  gorduras DECIMAL(6,2),
  fibras DECIMAL(6,2),
  sodio INTEGER,
  categoria TEXT,
  imagem_url TEXT,
  fonte TEXT DEFAULT 'openfoodfacts', -- 'openfoodfacts', 'manual', 'api'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_barcode_codigo ON barcode_cache(codigo_barras);

-- ========================================
-- 7. DIÁRIO DE ALIMENTOS ESCANEADOS
-- ========================================
CREATE TABLE IF NOT EXISTS diario_alimentos_scan (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  barcode_id UUID REFERENCES barcode_cache(id) ON DELETE SET NULL,
  codigo_barras TEXT NOT NULL,
  data DATE NOT NULL DEFAULT CURRENT_DATE,
  tipo_refeicao TEXT CHECK (tipo_refeicao IN ('cafe', 'almoco', 'jantar', 'lanche')),
  quantidade DECIMAL(5,2) DEFAULT 1, -- multiplicador da porção
  calorias_total INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_diario_scan_user ON diario_alimentos_scan(user_id, data DESC);

-- ========================================
-- 8. VOICE COMMANDS LOG - Log de Comandos de Voz
-- ========================================
CREATE TABLE IF NOT EXISTS voice_commands_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  transcript TEXT NOT NULL,
  comando_detectado TEXT,
  dados_extraidos JSONB,
  confianca DECIMAL(3,2),
  sucesso BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_voice_commands_user ON voice_commands_log(user_id, created_at DESC);

-- ========================================
-- FUNÇÕES E TRIGGERS
-- ========================================

-- Trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Aplicar trigger em tabelas com updated_at
DROP TRIGGER IF EXISTS update_wearable_metas_updated_at ON wearable_metas;
CREATE TRIGGER update_wearable_metas_updated_at
  BEFORE UPDATE ON wearable_metas
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_barcode_cache_updated_at ON barcode_cache;
CREATE TRIGGER update_barcode_cache_updated_at
  BEFORE UPDATE ON barcode_cache
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- FUNÇÃO: Calcular Score de Atividade Diária
-- ========================================
CREATE OR REPLACE FUNCTION calcular_score_atividade(
  p_user_id UUID,
  p_data DATE DEFAULT CURRENT_DATE
) RETURNS INTEGER AS $$
DECLARE
  v_dados wearable_data%ROWTYPE;
  v_metas wearable_metas%ROWTYPE;
  v_score INTEGER := 0;
  v_count INTEGER := 0;
BEGIN
  -- Buscar dados do dia
  SELECT * INTO v_dados
  FROM wearable_data
  WHERE user_id = p_user_id AND data = p_data;

  IF NOT FOUND THEN
    RETURN 0;
  END IF;

  -- Buscar metas do usuário
  SELECT * INTO v_metas
  FROM wearable_metas
  WHERE user_id = p_user_id;

  -- Usar metas padrão se não existir
  IF NOT FOUND THEN
    v_metas.passos_diarios := 10000;
    v_metas.calorias_diarias := 500;
    v_metas.minutos_ativos := 30;
    v_metas.sono_horas := 8;
  END IF;

  -- Calcular percentual de cada meta
  IF v_metas.passos_diarios > 0 THEN
    v_score := v_score + LEAST(100, (v_dados.passos::DECIMAL / v_metas.passos_diarios) * 100);
    v_count := v_count + 1;
  END IF;

  IF v_metas.calorias_diarias > 0 THEN
    v_score := v_score + LEAST(100, (v_dados.calorias_queimadas::DECIMAL / v_metas.calorias_diarias) * 100);
    v_count := v_count + 1;
  END IF;

  IF v_metas.minutos_ativos > 0 THEN
    v_score := v_score + LEAST(100, (v_dados.minutos_ativos::DECIMAL / v_metas.minutos_ativos) * 100);
    v_count := v_count + 1;
  END IF;

  IF v_metas.sono_horas > 0 AND v_dados.sono_horas IS NOT NULL THEN
    v_score := v_score + LEAST(100, (v_dados.sono_horas / v_metas.sono_horas) * 100);
    v_count := v_count + 1;
  END IF;

  -- Retornar média
  IF v_count > 0 THEN
    RETURN ROUND(v_score / v_count);
  ELSE
    RETURN 0;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- ========================================
-- FUNÇÃO: Verificar e Atualizar Status de Aposta
-- ========================================
CREATE OR REPLACE FUNCTION verificar_apostas_vencidas()
RETURNS VOID AS $$
BEGIN
  -- Marcar apostas que passaram da data limite como 'verificando'
  UPDATE apostas
  SET status = 'verificando'
  WHERE status = 'ativa'
    AND data_limite < CURRENT_DATE;
END;
$$ LANGUAGE plpgsql;

-- ========================================
-- VIEWS ÚTEIS
-- ========================================

-- View: Resumo semanal de atividades
CREATE OR REPLACE VIEW vw_resumo_semanal_wearable AS
SELECT
  user_id,
  DATE_TRUNC('week', data)::DATE as semana,
  SUM(passos) as total_passos,
  SUM(calorias_queimadas) as total_calorias,
  SUM(minutos_ativos) as total_minutos_ativos,
  AVG(sono_horas) as media_sono,
  COUNT(*) as dias_registrados,
  ROUND(AVG(passos)) as media_passos_diarios
FROM wearable_data
GROUP BY user_id, DATE_TRUNC('week', data);

-- View: Apostas ativas com progresso
CREATE OR REPLACE VIEW vw_apostas_progresso AS
SELECT
  a.*,
  ROUND(((a.peso_inicial - COALESCE(tr.peso_kg, a.peso_inicial)) / (a.peso_inicial - a.peso_meta)) * 100, 1) as percentual_progresso,
  a.data_limite - CURRENT_DATE as dias_restantes,
  COALESCE(tr.peso_kg, a.peso_inicial) as peso_atual
FROM apostas a
LEFT JOIN LATERAL (
  SELECT peso_kg
  FROM tracker_registros
  WHERE user_id = a.user_id AND peso_kg IS NOT NULL
  ORDER BY data DESC
  LIMIT 1
) tr ON true
WHERE a.status IN ('ativa', 'verificando');

-- ========================================
-- RLS (Row Level Security) - Se não existir
-- ========================================

-- Video Progress
ALTER TABLE video_progress ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own videos" ON video_progress;
CREATE POLICY "Users can view own videos" ON video_progress
  FOR SELECT USING (auth.uid() = user_id OR is_public = true);

DROP POLICY IF EXISTS "Users can insert own videos" ON video_progress;
CREATE POLICY "Users can insert own videos" ON video_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own videos" ON video_progress;
CREATE POLICY "Users can update own videos" ON video_progress
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own videos" ON video_progress;
CREATE POLICY "Users can delete own videos" ON video_progress
  FOR DELETE USING (auth.uid() = user_id);

-- Apostas
ALTER TABLE apostas ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own bets" ON apostas;
CREATE POLICY "Users can view own bets" ON apostas
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own bets" ON apostas;
CREATE POLICY "Users can insert own bets" ON apostas
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own bets" ON apostas;
CREATE POLICY "Users can update own bets" ON apostas
  FOR UPDATE USING (auth.uid() = user_id);

-- Wearable Devices
ALTER TABLE wearable_devices ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage own devices" ON wearable_devices;
CREATE POLICY "Users can manage own devices" ON wearable_devices
  FOR ALL USING (auth.uid() = user_id);

-- Wearable Data
ALTER TABLE wearable_data ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage own wearable data" ON wearable_data;
CREATE POLICY "Users can manage own wearable data" ON wearable_data
  FOR ALL USING (auth.uid() = user_id);

-- Wearable Metas
ALTER TABLE wearable_metas ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage own metas" ON wearable_metas;
CREATE POLICY "Users can manage own metas" ON wearable_metas
  FOR ALL USING (auth.uid() = user_id);

-- Barcode Cache (público para leitura)
ALTER TABLE barcode_cache ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read barcode cache" ON barcode_cache;
CREATE POLICY "Anyone can read barcode cache" ON barcode_cache
  FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Authenticated users can insert barcode cache" ON barcode_cache;
CREATE POLICY "Authenticated users can insert barcode cache" ON barcode_cache
  FOR INSERT TO authenticated WITH CHECK (true);

-- Diário de Alimentos Scan
ALTER TABLE diario_alimentos_scan ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage own scanned foods" ON diario_alimentos_scan;
CREATE POLICY "Users can manage own scanned foods" ON diario_alimentos_scan
  FOR ALL USING (auth.uid() = user_id);

-- Voice Commands Log
ALTER TABLE voice_commands_log ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own voice logs" ON voice_commands_log;
CREATE POLICY "Users can view own voice logs" ON voice_commands_log
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own voice logs" ON voice_commands_log;
CREATE POLICY "Users can insert own voice logs" ON voice_commands_log
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ========================================
-- COMENTÁRIOS NAS TABELAS
-- ========================================
COMMENT ON TABLE video_progress IS 'Vídeos de progresso antes/depois dos usuários';
COMMENT ON TABLE apostas IS 'Sistema de apostas na meta de peso';
COMMENT ON TABLE wearable_devices IS 'Dispositivos wearables conectados (Apple Watch, Mi Band, etc)';
COMMENT ON TABLE wearable_data IS 'Dados diários sincronizados dos wearables';
COMMENT ON TABLE wearable_metas IS 'Metas diárias de atividade dos usuários';
COMMENT ON TABLE barcode_cache IS 'Cache de produtos escaneados por código de barras';
COMMENT ON TABLE diario_alimentos_scan IS 'Registro de alimentos escaneados no diário';
COMMENT ON TABLE voice_commands_log IS 'Log de comandos de voz processados';
