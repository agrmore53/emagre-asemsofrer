// Sistema de Nutrição por Faixa Etária
// Baseado em pesquisas científicas: PROT-AGE Study, ESPEN Guidelines, NIH

export type FaixaEtaria =
  | '18-29'
  | '30-39'
  | '40-49'
  | '50-59'
  | '60-69'
  | '70+'

export type FaseHormonal =
  | 'regular'           // Ciclo normal
  | 'pre_menopausa'     // 40-45 anos, início sintomas
  | 'perimenopausa'     // 45-50 anos, transição
  | 'menopausa'         // 50+ anos, pós-menopausa
  | 'andropausa_inicial' // 40-50 anos homens
  | 'andropausa'        // 50+ anos homens

export type ObjetivoSaude =
  | 'perder_peso'
  | 'manter_peso'
  | 'ganhar_massa'
  | 'longevidade'
  | 'energia'
  | 'saude_hormonal'

export interface PerfilNutricionalIdade {
  faixaEtaria: FaixaEtaria
  faseHormonal: FaseHormonal
  ajusteMetabolico: number // Percentual de ajuste no metabolismo
  proteinaMinima: number   // g/kg peso corporal
  proteinaIdeal: number    // g/kg peso corporal
  carboidratosMax: number  // % das calorias
  gordurasMin: number      // % das calorias
  fibrasMinimas: number    // gramas/dia
  aguaMinima: number       // ml/kg peso corporal
  nutrientesChave: NutrienteChave[]
  suplementosSugeridos: Suplemento[]
  alimentosPrioritarios: string[]
  alimentosEvitar: string[]
  dicasEspecificas: string[]
  exercicioRecomendado: RecomendacaoExercicio
}

export interface NutrienteChave {
  nome: string
  quantidade: string
  unidade: string
  importancia: string
  fontes: string[]
}

export interface Suplemento {
  nome: string
  dosagem: string
  motivo: string
  observacao?: string
}

export interface RecomendacaoExercicio {
  aerobico: { minutos: number; frequencia: string; exemplos: string[] }
  forca: { minutos: number; frequencia: string; exemplos: string[] }
  flexibilidade: { minutos: number; frequencia: string; exemplos: string[] }
  observacoes: string[]
}

// ========================================
// PERFIS POR FAIXA ETÁRIA
// ========================================

export const PERFIS_IDADE: Record<FaixaEtaria, Omit<PerfilNutricionalIdade, 'faixaEtaria' | 'faseHormonal'>> = {
  '18-29': {
    ajusteMetabolico: 0, // Metabolismo de referência
    proteinaMinima: 0.8,
    proteinaIdeal: 1.0,
    carboidratosMax: 55,
    gordurasMin: 25,
    fibrasMinimas: 25,
    aguaMinima: 35,
    nutrientesChave: [
      { nome: 'Ferro', quantidade: '18', unidade: 'mg', importancia: 'Energia e metabolismo, especialmente mulheres', fontes: ['Carnes vermelhas', 'Feijão', 'Espinafre', 'Lentilha'] },
      { nome: 'Cálcio', quantidade: '1000', unidade: 'mg', importancia: 'Formação óssea máxima até 30 anos', fontes: ['Laticínios', 'Brócolis', 'Sardinha', 'Tofu'] },
      { nome: 'Ácido Fólico', quantidade: '400', unidade: 'mcg', importancia: 'Saúde celular e reprodutiva', fontes: ['Folhas verdes', 'Feijão', 'Laranja', 'Abacate'] },
      { nome: 'Vitamina D', quantidade: '600', unidade: 'UI', importancia: 'Absorção de cálcio e imunidade', fontes: ['Sol', 'Peixes gordos', 'Ovos', 'Cogumelos'] },
    ],
    suplementosSugeridos: [
      { nome: 'Multivitamínico', dosagem: '1x/dia', motivo: 'Dietas irregulares comuns nessa idade' },
    ],
    alimentosPrioritarios: [
      'Proteínas magras', 'Carboidratos complexos', 'Frutas variadas', 'Vegetais coloridos', 'Água'
    ],
    alimentosEvitar: [
      'Fast food em excesso', 'Refrigerantes', 'Álcool em excesso', 'Snacks ultraprocessados'
    ],
    dicasEspecificas: [
      'Não pule o café da manhã - associado a ganho de peso',
      'Cuidado com o "Freshman Fifteen" - ganho de peso na faculdade',
      'Estabeleça hábitos agora que durarão a vida toda',
      'Evite dietas restritivas - podem causar efeito rebote',
      'Priorize refeições caseiras mesmo com rotina corrida',
    ],
    exercicioRecomendado: {
      aerobico: { minutos: 150, frequencia: '3-5x/semana', exemplos: ['Corrida', 'Natação', 'Ciclismo', 'Dança'] },
      forca: { minutos: 60, frequencia: '2-3x/semana', exemplos: ['Musculação', 'CrossFit', 'Calistenia'] },
      flexibilidade: { minutos: 30, frequencia: '2x/semana', exemplos: ['Yoga', 'Alongamento', 'Pilates'] },
      observacoes: ['Metabolismo acelerado permite maior flexibilidade', 'Ideal para construir base muscular'],
    },
  },

  '30-39': {
    ajusteMetabolico: -5, // 5% mais lento
    proteinaMinima: 0.8,
    proteinaIdeal: 1.0,
    carboidratosMax: 50,
    gordurasMin: 25,
    fibrasMinimas: 28,
    aguaMinima: 35,
    nutrientesChave: [
      { nome: 'Cálcio', quantidade: '1000', unidade: 'mg', importancia: 'Prevenir perda óssea que inicia agora', fontes: ['Laticínios', 'Sardinha', 'Couve', 'Amêndoas'] },
      { nome: 'Magnésio', quantidade: '320', unidade: 'mg', importancia: 'Energia, sono e metabolismo', fontes: ['Castanhas', 'Chocolate amargo', 'Abacate', 'Banana'] },
      { nome: 'Vitamina D', quantidade: '600', unidade: 'UI', importancia: 'Absorção cálcio e humor', fontes: ['Sol', 'Salmão', 'Atum', 'Ovos'] },
      { nome: 'Ômega-3', quantidade: '1000', unidade: 'mg', importancia: 'Saúde cardiovascular e cerebral', fontes: ['Peixes gordos', 'Linhaça', 'Chia', 'Nozes'] },
    ],
    suplementosSugeridos: [
      { nome: 'Vitamina D3', dosagem: '1000-2000 UI/dia', motivo: 'Maioria tem deficiência' },
      { nome: 'Ômega-3', dosagem: '1000mg/dia', motivo: 'Proteção cardiovascular precoce' },
    ],
    alimentosPrioritarios: [
      'Peixes gordos 2x/semana', 'Vegetais de folhas verdes', 'Frutas vermelhas (antioxidantes)',
      'Oleaginosas', 'Grãos integrais'
    ],
    alimentosEvitar: [
      'Açúcar refinado em excesso', 'Carboidratos simples à noite', 'Frituras frequentes', 'Álcool regular'
    ],
    dicasEspecificas: [
      'Metabolismo começa a desacelerar - ajuste porções gradualmente',
      'Priorize proteína em cada refeição para manter massa muscular',
      'Retenção de líquidos é comum - reduza sódio',
      'Sono de qualidade é crucial para metabolismo',
      'Inicie treino de força se ainda não faz',
    ],
    exercicioRecomendado: {
      aerobico: { minutos: 150, frequencia: '3-5x/semana', exemplos: ['Corrida', 'Natação', 'Bike', 'HIIT'] },
      forca: { minutos: 90, frequencia: '3x/semana', exemplos: ['Musculação', 'Treino funcional'] },
      flexibilidade: { minutos: 30, frequencia: '2-3x/semana', exemplos: ['Yoga', 'Pilates', 'Alongamento'] },
      observacoes: ['Treino de força essencial para prevenir perda muscular', 'Recuperação pode demorar mais'],
    },
  },

  '40-49': {
    ajusteMetabolico: -10, // 10% mais lento
    proteinaMinima: 1.0,
    proteinaIdeal: 1.2,
    carboidratosMax: 45,
    gordurasMin: 28,
    fibrasMinimas: 30,
    aguaMinima: 33,
    nutrientesChave: [
      { nome: 'Proteína', quantidade: '1.0-1.2', unidade: 'g/kg', importancia: 'Combater sarcopenia (perda muscular)', fontes: ['Frango', 'Peixe', 'Ovos', 'Whey', 'Leguminosas'] },
      { nome: 'Vitamina D', quantidade: '1000', unidade: 'UI', importancia: 'Ossos, músculos e hormônios', fontes: ['Sol', 'Suplemento', 'Peixes'] },
      { nome: 'Vitamina B12', quantidade: '2.4', unidade: 'mcg', importancia: 'Energia e função nervosa', fontes: ['Carnes', 'Ovos', 'Laticínios', 'Suplemento'] },
      { nome: 'Cálcio', quantidade: '1000', unidade: 'mg', importancia: 'Densidade óssea', fontes: ['Laticínios', 'Vegetais verde-escuros'] },
    ],
    suplementosSugeridos: [
      { nome: 'Vitamina D3', dosagem: '2000 UI/dia', motivo: 'Produção reduzida pela pele' },
      { nome: 'Ômega-3', dosagem: '1000-2000mg/dia', motivo: 'Anti-inflamatório e cardiovascular' },
      { nome: 'Magnésio', dosagem: '300-400mg/dia', motivo: 'Sono, energia e músculos' },
    ],
    alimentosPrioritarios: [
      'Proteínas em todas as refeições', 'Vegetais crucíferos (brócolis, couve)',
      'Alimentos ricos em fibras', 'Gorduras saudáveis', 'Alimentos anti-inflamatórios'
    ],
    alimentosEvitar: [
      'Carboidratos refinados', 'Açúcar', 'Frituras', 'Ultraprocessados', 'Excesso de álcool'
    ],
    dicasEspecificas: [
      'Sarcopenia inicia agora - proteína e musculação são essenciais',
      'Taxa metabólica 10% menor que aos 30 - ajuste calorias',
      'Mulheres: atenção aos sintomas de pré-menopausa',
      'Homens: queda de testosterona pode afetar energia e composição corporal',
      'Priorize qualidade do sono - afeta hormônios e metabolismo',
    ],
    exercicioRecomendado: {
      aerobico: { minutos: 150, frequencia: '4-5x/semana', exemplos: ['Caminhada', 'Natação', 'Bike', 'Elíptico'] },
      forca: { minutos: 120, frequencia: '3-4x/semana', exemplos: ['Musculação', 'Treino funcional', 'Pilates com carga'] },
      flexibilidade: { minutos: 45, frequencia: '3x/semana', exemplos: ['Yoga', 'Alongamento', 'Mobilidade'] },
      observacoes: ['FUNDAMENTAL: treino de força para combater sarcopenia', 'Aquecimento mais longo necessário'],
    },
  },

  '50-59': {
    ajusteMetabolico: -15, // 15% mais lento
    proteinaMinima: 1.0,
    proteinaIdeal: 1.2,
    carboidratosMax: 40,
    gordurasMin: 30,
    fibrasMinimas: 30,
    aguaMinima: 30,
    nutrientesChave: [
      { nome: 'Proteína', quantidade: '1.0-1.2', unidade: 'g/kg', importancia: 'Preservar massa muscular', fontes: ['Carnes magras', 'Peixes', 'Ovos', 'Whey'] },
      { nome: 'Vitamina B12', quantidade: '100-400', unidade: 'mcg', importancia: '30% têm dificuldade de absorção após 50', fontes: ['Suplemento', 'Carnes', 'Ovos'] },
      { nome: 'Vitamina D', quantidade: '1000-2000', unidade: 'UI', importancia: 'Ossos, músculos, imunidade', fontes: ['Suplemento', 'Sol', 'Peixes'] },
      { nome: 'Cálcio', quantidade: '1200', unidade: 'mg', importancia: 'Prevenir osteoporose', fontes: ['Laticínios', 'Sardinha', 'Tofu', 'Couve'] },
      { nome: 'Ômega-3', quantidade: '2000', unidade: 'mg', importancia: 'Coração, cérebro, articulações', fontes: ['Peixes gordos', 'Suplemento'] },
    ],
    suplementosSugeridos: [
      { nome: 'Vitamina D3', dosagem: '2000 UI/dia', motivo: 'Produção cutânea muito reduzida' },
      { nome: 'Vitamina B12', dosagem: '100-400mcg/dia', motivo: 'Absorção diminuída' },
      { nome: 'Ômega-3', dosagem: '2000mg/dia', motivo: 'Proteção cardiovascular e cerebral' },
      { nome: 'Cálcio + D3', dosagem: '600mg 2x/dia', motivo: 'Se ingestão alimentar insuficiente', observacao: 'Consultar médico' },
    ],
    alimentosPrioritarios: [
      'Proteína de alta qualidade em cada refeição (25-30g)',
      'Peixes gordos 3x/semana', 'Vegetais ricos em cálcio',
      'Frutas vermelhas e roxas (antioxidantes)', 'Azeite extra virgem'
    ],
    alimentosEvitar: [
      'Carboidratos simples (picos de insulina)', 'Sódio em excesso',
      'Álcool (afeta absorção nutrientes)', 'Café em excesso (afeta cálcio)'
    ],
    dicasEspecificas: [
      'Absorção de B12 reduz significativamente - considere suplementar',
      'Proteína por refeição mais importante que total diário',
      'Mulheres na menopausa: foco em cálcio, D3 e fitoestrogênios',
      'Homens na andropausa: zinco, D3 e proteína são essenciais',
      'Carboidratos simples causam mais resistência à insulina nessa idade',
      'Hidratação adequada - sensação de sede diminui',
    ],
    exercicioRecomendado: {
      aerobico: { minutos: 150, frequencia: '5x/semana', exemplos: ['Caminhada', 'Natação', 'Hidroginástica', 'Bike'] },
      forca: { minutos: 120, frequencia: '3x/semana', exemplos: ['Musculação', 'Pilates', 'Treino funcional'] },
      flexibilidade: { minutos: 60, frequencia: '4x/semana', exemplos: ['Yoga', 'Alongamento', 'Tai Chi'] },
      observacoes: ['Treino de força OBRIGATÓRIO para manter independência', 'Exercícios de impacto moderado para ossos'],
    },
  },

  '60-69': {
    ajusteMetabolico: -20, // 20% mais lento
    proteinaMinima: 1.0,
    proteinaIdeal: 1.2,
    carboidratosMax: 40,
    gordurasMin: 30,
    fibrasMinimas: 30,
    aguaMinima: 30,
    nutrientesChave: [
      { nome: 'Proteína', quantidade: '1.0-1.2', unidade: 'g/kg', importancia: 'PROT-AGE recomenda mínimo 1.0g/kg', fontes: ['Carnes', 'Peixes', 'Ovos', 'Laticínios', 'Whey'] },
      { nome: 'Leucina', quantidade: '2.5-3', unidade: 'g/refeição', importancia: 'Aminoácido essencial para síntese muscular', fontes: ['Whey protein', 'Carnes', 'Ovos', 'Laticínios'] },
      { nome: 'Vitamina B12', quantidade: '100-400', unidade: 'mcg', importancia: 'Absorção muito reduzida', fontes: ['Suplemento obrigatório'] },
      { nome: 'Vitamina D', quantidade: '2000', unidade: 'UI', importancia: 'Ossos, músculos, imunidade, cognição', fontes: ['Suplemento'] },
      { nome: 'Cálcio', quantidade: '1200', unidade: 'mg', importancia: 'Absorção 30% menor que jovens', fontes: ['Laticínios', 'Vegetais', 'Suplemento'] },
    ],
    suplementosSugeridos: [
      { nome: 'Vitamina D3', dosagem: '2000 UI/dia', motivo: 'Essencial - capacidade de síntese muito reduzida' },
      { nome: 'Vitamina B12', dosagem: '100-400mcg/dia', motivo: 'Absorção comprometida pela idade' },
      { nome: 'Cálcio', dosagem: '500-600mg 2x/dia', motivo: 'Absorção reduzida em 30%' },
      { nome: 'Ômega-3', dosagem: '2000mg/dia', motivo: 'Cognição, coração, articulações' },
      { nome: 'Whey Protein', dosagem: '25-30g/dia', motivo: 'Rico em leucina para síntese muscular', observacao: 'Especialmente se apetite reduzido' },
    ],
    alimentosPrioritarios: [
      'Proteína de alta qualidade em CADA refeição (25-30g)',
      'Alimentos macios e fáceis de mastigar', 'Sopas nutritivas',
      'Laticínios (cálcio e proteína)', 'Peixes (ômega-3 e proteína)'
    ],
    alimentosEvitar: [
      'Alimentos muito duros (dificuldade mastigação)', 'Excesso de fibras insolúveis',
      'Álcool', 'Sódio em excesso', 'Açúcares'
    ],
    dicasEspecificas: [
      'CRÍTICO: 25-30g de proteína POR REFEIÇÃO para síntese muscular',
      'Idosos precisam de 70% mais proteína que jovens para mesmo efeito',
      'Reduza calorias em 10% comparado aos 50 anos',
      'Suplementação de D3 e B12 praticamente obrigatória',
      'Refeições menores e mais frequentes se apetite reduzido',
      'Hidratação: sensação de sede muito diminuída - programe horários',
    ],
    exercicioRecomendado: {
      aerobico: { minutos: 150, frequencia: '5-7x/semana', exemplos: ['Caminhada', 'Hidroginástica', 'Bike ergométrica'] },
      forca: { minutos: 90, frequencia: '2-3x/semana', exemplos: ['Musculação leve', 'Pilates', 'Elásticos', 'Peso corporal'] },
      flexibilidade: { minutos: 60, frequencia: '5x/semana', exemplos: ['Alongamento', 'Yoga suave', 'Tai Chi'] },
      observacoes: ['Equilíbrio é crucial - inclua exercícios específicos', 'Treino de força para independência funcional'],
    },
  },

  '70+': {
    ajusteMetabolico: -25, // 25% mais lento
    proteinaMinima: 1.2,
    proteinaIdeal: 1.5,
    carboidratosMax: 40,
    gordurasMin: 30,
    fibrasMinimas: 25,
    aguaMinima: 30,
    nutrientesChave: [
      { nome: 'Proteína', quantidade: '1.2-1.5', unidade: 'g/kg', importancia: 'PROT-AGE: 1.2g mínimo, 1.5g se doença', fontes: ['Proteína em pó', 'Carnes macias', 'Ovos', 'Laticínios'] },
      { nome: 'Leucina', quantidade: '3-4', unidade: 'g/refeição', importancia: 'Resistência anabólica requer mais leucina', fontes: ['Whey isolado', 'Ovos', 'Frango'] },
      { nome: 'Vitamina B12', quantidade: '500', unidade: 'mcg', importancia: 'Absorção muito comprometida', fontes: ['Suplemento sublingual'] },
      { nome: 'Vitamina D', quantidade: '2000', unidade: 'UI', importancia: 'Ossos, músculos, quedas, cognição', fontes: ['Suplemento'] },
      { nome: 'Zinco', quantidade: '11', unidade: 'mg', importancia: 'Imunidade e cicatrização', fontes: ['Carnes', 'Ostras', 'Castanhas'] },
    ],
    suplementosSugeridos: [
      { nome: 'Vitamina D3', dosagem: '2000 UI/dia', motivo: 'Obrigatório - síntese cutânea mínima' },
      { nome: 'Vitamina B12', dosagem: '500-1000mcg/dia', motivo: 'Sublingual preferível', observacao: 'Absorção oral muito reduzida' },
      { nome: 'Cálcio + D3', dosagem: '600mg 2x/dia', motivo: 'Prevenção fraturas' },
      { nome: 'Whey Protein Isolado', dosagem: '30g/dia', motivo: 'Leucina para combater resistência anabólica' },
      { nome: 'Ômega-3', dosagem: '2000mg/dia', motivo: 'Cognição e inflamação' },
      { nome: 'Creatina', dosagem: '3-5g/dia', motivo: 'Força muscular e cognição', observacao: 'Consultar médico' },
    ],
    alimentosPrioritarios: [
      'Proteína de fácil digestão em TODAS as refeições',
      'Shakes nutritivos se apetite baixo', 'Sopas cremosas enriquecidas',
      'Ovos (proteína completa e fácil)', 'Iogurte grego'
    ],
    alimentosEvitar: [
      'Alimentos que engasgam', 'Excesso de fibras (gases)',
      'Alimentos secos sem líquido', 'Café em excesso'
    ],
    dicasEspecificas: [
      'Reduza mais 10% das calorias comparado aos 60 anos',
      'NUNCA reduza proteínas - são mais importantes que nunca',
      'Resistência anabólica: precisa de 70%+ mais proteína',
      'Se perda de peso involuntária, aumente calorias e proteínas',
      'Suplementos são praticamente obrigatórios nessa fase',
      'Refeições pequenas e frequentes - capacidade gástrica reduzida',
      'Hidratação programada - não espere sentir sede',
    ],
    exercicioRecomendado: {
      aerobico: { minutos: 120, frequencia: '5-7x/semana', exemplos: ['Caminhada leve', 'Hidroginástica', 'Bike ergométrica'] },
      forca: { minutos: 60, frequencia: '2-3x/semana', exemplos: ['Exercícios sentado', 'Elásticos', 'Peso leve', 'Pilates adaptado'] },
      flexibilidade: { minutos: 60, frequencia: 'Diário', exemplos: ['Alongamento suave', 'Tai Chi', 'Yoga de cadeira'] },
      observacoes: ['Foco em EQUILÍBRIO para prevenir quedas', 'Qualquer movimento é melhor que nenhum'],
    },
  },
}

// ========================================
// AJUSTES HORMONAIS
// ========================================

export const AJUSTES_HORMONAIS: Record<FaseHormonal, {
  nome: string
  descricao: string
  sintomasComuns: string[]
  ajustesNutricionais: string[]
  alimentosIndicados: string[]
  alimentosEvitar: string[]
}> = {
  regular: {
    nome: 'Ciclo Regular',
    descricao: 'Fase hormonal estável sem alterações significativas',
    sintomasComuns: [],
    ajustesNutricionais: ['Seguir recomendações padrão para a idade'],
    alimentosIndicados: [],
    alimentosEvitar: [],
  },

  pre_menopausa: {
    nome: 'Pré-Menopausa',
    descricao: 'Início das alterações hormonais, geralmente entre 40-45 anos',
    sintomasComuns: ['Ciclos irregulares', 'Alterações de humor', 'Início de ondas de calor'],
    ajustesNutricionais: [
      'Aumentar consumo de fitoestrogênios gradualmente',
      'Reforçar cálcio e vitamina D',
      'Manter proteína adequada para massa muscular',
    ],
    alimentosIndicados: [
      'Soja e derivados', 'Linhaça', 'Grão-de-bico', 'Frutas vermelhas',
      'Vegetais crucíferos', 'Peixes gordos'
    ],
    alimentosEvitar: [
      'Excesso de cafeína', 'Álcool frequente', 'Açúcares refinados'
    ],
  },

  perimenopausa: {
    nome: 'Perimenopausa',
    descricao: 'Transição ativa, 2-8 anos antes da menopausa (45-50 anos)',
    sintomasComuns: [
      'Ondas de calor', 'Suores noturnos', 'Insônia', 'Alterações de humor',
      'Ganho de peso abdominal', 'Ressecamento vaginal'
    ],
    ajustesNutricionais: [
      'Fitoestrogênios em quantidade significativa',
      'Reduzir carboidratos simples (resistência à insulina)',
      'Aumentar ômega-3 para inflamação',
      'Cálcio 1200mg + D3 2000UI obrigatórios',
    ],
    alimentosIndicados: [
      'Tofu', 'Tempeh', 'Linhaça moída (2 col/dia)', 'Soja', 'Inhame',
      'Salmão', 'Sardinha', 'Nozes', 'Amêndoas'
    ],
    alimentosEvitar: [
      'Cafeína (piora ondas de calor)', 'Álcool (piora suores)',
      'Comidas picantes', 'Açúcar', 'Carboidratos refinados'
    ],
  },

  menopausa: {
    nome: 'Pós-Menopausa',
    descricao: '12 meses após última menstruação, geralmente 50+ anos',
    sintomasComuns: [
      'Metabolismo mais lento', 'Perda de massa óssea acelerada',
      'Gordura abdominal', 'Ressecamento de pele e mucosas',
      'Risco cardiovascular aumentado'
    ],
    ajustesNutricionais: [
      'Proteína mínima 1.2g/kg para massa muscular',
      'Cálcio 1200mg + D3 2000UI essenciais',
      'Ômega-3 para coração e articulações',
      'Reduzir calorias 10-15% (metabolismo mais lento)',
      'Fitoestrogênios continuam úteis',
    ],
    alimentosIndicados: [
      'Proteínas de qualidade em cada refeição', 'Laticínios',
      'Sardinha (cálcio + ômega-3)', 'Soja', 'Linhaça', 'Vegetais verde-escuros',
      'Frutas vermelhas', 'Azeite extra virgem'
    ],
    alimentosEvitar: [
      'Sódio em excesso', 'Gorduras saturadas', 'Açúcares',
      'Álcool (afeta ossos)', 'Café em excesso (cálcio)'
    ],
  },

  andropausa_inicial: {
    nome: 'Andropausa Inicial',
    descricao: 'Início da queda de testosterona, geralmente 40-50 anos',
    sintomasComuns: [
      'Diminuição de energia', 'Redução de libido', 'Dificuldade de concentração',
      'Início de perda muscular', 'Acúmulo de gordura abdominal'
    ],
    ajustesNutricionais: [
      'Zinco e magnésio são essenciais',
      'Vitamina D adequada (produção hormonal)',
      'Proteína mínima 1.2g/kg',
      'Gorduras saudáveis (produção hormonal)',
    ],
    alimentosIndicados: [
      'Ostras (zinco)', 'Sementes de abóbora', 'Carnes vermelhas magras',
      'Ovos inteiros', 'Castanhas do Pará (selênio)', 'Peixes gordos',
      'Gengibre', 'Alho'
    ],
    alimentosEvitar: [
      'Álcool em excesso', 'Soja em excesso (pode reduzir testosterona)',
      'Açúcar (aumenta gordura abdominal)', 'Ultraprocessados'
    ],
  },

  andropausa: {
    nome: 'Andropausa',
    descricao: 'Queda significativa de testosterona, 50+ anos',
    sintomasComuns: [
      'Fadiga crônica', 'Perda de massa muscular significativa',
      'Aumento de gordura visceral', 'Redução de força',
      'Alterações de humor', 'Disfunção erétil'
    ],
    ajustesNutricionais: [
      'Zinco 30-50mg/dia', 'Vitamina D3 2000UI+',
      'Magnésio 400-500mg/dia', 'Proteína 1.2-1.5g/kg',
      'Reduzir carboidratos (resistência à insulina)',
      'Treino de força é MEDICAMENTO',
    ],
    alimentosIndicados: [
      'Proteínas de alta qualidade', 'Ovos inteiros (colesterol para hormônios)',
      'Frutos do mar (zinco)', 'Carnes magras', 'Vegetais crucíferos',
      'Abacate', 'Azeite', 'Cacau puro'
    ],
    alimentosEvitar: [
      'Álcool (suprime testosterona)', 'Açúcar', 'Carboidratos refinados',
      'Excesso de soja', 'Gorduras trans', 'Ultraprocessados'
    ],
  },
}

// ========================================
// FUNÇÕES AUXILIARES
// ========================================

/**
 * Determina a faixa etária baseada na idade
 */
export function getFaixaEtaria(idade: number): FaixaEtaria {
  if (idade < 30) return '18-29'
  if (idade < 40) return '30-39'
  if (idade < 50) return '40-49'
  if (idade < 60) return '50-59'
  if (idade < 70) return '60-69'
  return '70+'
}

/**
 * Sugere fase hormonal baseada em idade e sexo
 */
export function sugerirFaseHormonal(idade: number, sexo: 'masculino' | 'feminino'): FaseHormonal {
  if (sexo === 'feminino') {
    if (idade < 40) return 'regular'
    if (idade < 45) return 'pre_menopausa'
    if (idade < 52) return 'perimenopausa'
    return 'menopausa'
  } else {
    if (idade < 40) return 'regular'
    if (idade < 50) return 'andropausa_inicial'
    return 'andropausa'
  }
}

/**
 * Calcula TMB ajustada por idade (Mifflin St. Jeor)
 */
export function calcularTMBAjustada(
  peso: number,
  altura: number,
  idade: number,
  sexo: 'masculino' | 'feminino'
): number {
  // Fórmula Mifflin St. Jeor
  let tmb: number
  if (sexo === 'masculino') {
    tmb = 10 * peso + 6.25 * altura - 5 * idade + 5
  } else {
    tmb = 10 * peso + 6.25 * altura - 5 * idade - 161
  }

  // Ajuste adicional por faixa etária
  const faixa = getFaixaEtaria(idade)
  const ajuste = PERFIS_IDADE[faixa].ajusteMetabolico / 100

  return Math.round(tmb * (1 + ajuste))
}

/**
 * Calcula necessidade proteica por idade
 */
export function calcularProteinaIdade(
  peso: number,
  idade: number,
  objetivo: ObjetivoSaude = 'perder_peso',
  nivelAtividade: 'sedentario' | 'leve' | 'moderado' | 'intenso' = 'leve'
): { minima: number; ideal: number; maxima: number } {
  const faixa = getFaixaEtaria(idade)
  const perfil = PERFIS_IDADE[faixa]

  let multiplicadorBase = perfil.proteinaIdeal

  // Ajustes por objetivo
  if (objetivo === 'ganhar_massa') multiplicadorBase += 0.3
  if (objetivo === 'perder_peso') multiplicadorBase += 0.1 // Preservar massa magra

  // Ajustes por atividade
  if (nivelAtividade === 'intenso') multiplicadorBase += 0.2
  if (nivelAtividade === 'moderado') multiplicadorBase += 0.1

  return {
    minima: Math.round(peso * perfil.proteinaMinima),
    ideal: Math.round(peso * multiplicadorBase),
    maxima: Math.round(peso * (multiplicadorBase + 0.3)),
  }
}

/**
 * Gera perfil nutricional completo para um usuário
 */
export function gerarPerfilNutricionalCompleto(
  idade: number,
  sexo: 'masculino' | 'feminino',
  peso: number,
  altura: number,
  nivelAtividade: 'sedentario' | 'leve' | 'moderado' | 'intenso',
  objetivo: ObjetivoSaude,
  faseHormonalManual?: FaseHormonal
): PerfilNutricionalIdade & {
  tmb: number
  caloriasDiarias: number
  proteinas: { minima: number; ideal: number; maxima: number }
  macros: { carboidratos: number; gorduras: number; proteinas: number }
} {
  const faixaEtaria = getFaixaEtaria(idade)
  const faseHormonal = faseHormonalManual || sugerirFaseHormonal(idade, sexo)
  const perfilIdade = PERFIS_IDADE[faixaEtaria]

  // Calcular TMB
  const tmb = calcularTMBAjustada(peso, altura, idade, sexo)

  // Fator de atividade
  const fatoresAtividade = {
    sedentario: 1.2,
    leve: 1.375,
    moderado: 1.55,
    intenso: 1.725,
  }

  let caloriasDiarias = Math.round(tmb * fatoresAtividade[nivelAtividade])

  // Ajuste por objetivo
  if (objetivo === 'perder_peso') caloriasDiarias -= 300
  if (objetivo === 'ganhar_massa') caloriasDiarias += 300

  // Calcular proteínas
  const proteinas = calcularProteinaIdade(peso, idade, objetivo, nivelAtividade)

  // Calcular macros
  const caloriasProteina = proteinas.ideal * 4
  const percentualProteina = Math.round((caloriasProteina / caloriasDiarias) * 100)

  const macros = {
    proteinas: percentualProteina,
    gorduras: perfilIdade.gordurasMin,
    carboidratos: 100 - percentualProteina - perfilIdade.gordurasMin,
  }

  return {
    faixaEtaria,
    faseHormonal,
    ...perfilIdade,
    tmb,
    caloriasDiarias,
    proteinas,
    macros,
  }
}
