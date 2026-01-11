// Conteúdo Educativo por Fase da Vida
// Artigos e guias personalizados para cada faixa etária

import type { FaixaEtaria, FaseHormonal } from './faixas-etarias'

export interface ArtigoEducativo {
  id: string
  titulo: string
  subtitulo: string
  categoria: 'nutricao' | 'exercicio' | 'hormonal' | 'mental' | 'receitas'
  faixasEtarias: FaixaEtaria[]
  fasesHormonais?: FaseHormonal[]
  sexo?: 'masculino' | 'feminino' | 'ambos'
  tempoLeitura: number // minutos
  conteudo: SecaoConteudo[]
  acaoRecomendada?: string
}

export interface SecaoConteudo {
  tipo: 'texto' | 'lista' | 'destaque' | 'tabela' | 'citacao'
  titulo?: string
  conteudo: string | string[] | TabelaConteudo
}

export interface TabelaConteudo {
  cabecalho: string[]
  linhas: string[][]
}

// ========================================
// ARTIGOS EDUCATIVOS
// ========================================

export const ARTIGOS_EDUCATIVOS: ArtigoEducativo[] = [
  // ========== JOVENS ADULTOS (18-29) ==========
  {
    id: 'jovens-metabolismo-acelerado',
    titulo: 'Seu Metabolismo aos 20: Como Aproveitar ao Máximo',
    subtitulo: 'Estabeleça hábitos agora que vão durar a vida toda',
    categoria: 'nutricao',
    faixasEtarias: ['18-29'],
    sexo: 'ambos',
    tempoLeitura: 5,
    conteudo: [
      {
        tipo: 'texto',
        conteudo: 'Você está na fase de ouro do seu metabolismo. Entre os 18 e 29 anos, seu corpo queima calorias de forma mais eficiente do que em qualquer outra fase da vida. Mas cuidado: os hábitos que você estabelecer agora vão moldar sua saúde para sempre.',
      },
      {
        tipo: 'destaque',
        titulo: 'Alerta: O Efeito "Freshman Fifteen"',
        conteudo: 'Estudos mostram que jovens adultos ganham em média 5-7kg nos primeiros anos de independência. Fast food, álcool e pular refeições são os principais culpados.',
      },
      {
        tipo: 'lista',
        titulo: 'O Que Fazer Agora',
        conteudo: [
          'Nunca pule o café da manhã - associado a ganho de peso a longo prazo',
          'Aprenda 5-10 receitas saudáveis e rápidas',
          'Limite fast food a 1-2x por semana no máximo',
          'Beba água antes de qualquer bebida açucarada ou alcoólica',
          'Estabeleça rotina de exercícios - seu corpo agradecerá aos 40',
        ],
      },
      {
        tipo: 'tabela',
        titulo: 'Comparativo: Agora vs. Depois',
        conteudo: {
          cabecalho: ['Hábito', 'Impacto aos 20', 'Impacto aos 40'],
          linhas: [
            ['Fast food 3x/semana', 'Ganho de 2-3kg/ano', 'Ganho de 5-7kg/ano + colesterol alto'],
            ['Treino 3x/semana', 'Músculos definidos', 'Preservação de massa muscular'],
            ['Pular café da manhã', 'Fome excessiva à noite', 'Metabolismo desregulado'],
          ],
        },
      },
    ],
    acaoRecomendada: 'Comece hoje: escolha 2 dias da semana para preparar suas próprias refeições',
  },

  {
    id: 'jovens-construindo-musculos',
    titulo: 'Construa Músculos Agora, Agradeça Depois',
    subtitulo: 'Por que treino de força aos 20 é investimento para a vida',
    categoria: 'exercicio',
    faixasEtarias: ['18-29'],
    sexo: 'ambos',
    tempoLeitura: 4,
    conteudo: [
      {
        tipo: 'texto',
        conteudo: 'Sua capacidade de construir massa muscular está no auge. A partir dos 30 anos, você perde de 3-8% de massa muscular por década. Quanto mais músculos você construir agora, maior será sua "reserva" para o futuro.',
      },
      {
        tipo: 'destaque',
        conteudo: 'Músculos são seu motor metabólico. Cada kg de músculo queima 50-100 calorias extras por dia, mesmo em repouso.',
      },
      {
        tipo: 'lista',
        titulo: 'Estratégia de Treino para os 20',
        conteudo: [
          'Musculação 3x por semana (mínimo)',
          'Foco em exercícios compostos: agachamento, levantamento terra, supino',
          'Progressão de carga semanal',
          'Proteína adequada: 1.0g por kg de peso',
          'Descanso: músculos crescem durante o sono',
        ],
      },
    ],
  },

  // ========== 30-39 ANOS ==========
  {
    id: '30s-metabolismo-desacelerando',
    titulo: 'Seu Metabolismo aos 30: O Que Muda e Como Adaptar',
    subtitulo: 'Entenda por que emagrecer ficou mais difícil',
    categoria: 'nutricao',
    faixasEtarias: ['30-39'],
    sexo: 'ambos',
    tempoLeitura: 6,
    conteudo: [
      {
        tipo: 'texto',
        conteudo: 'Se você notou que aquele jeans não fecha mais como antes, não é sua imaginação. A partir dos 25 anos, seu metabolismo basal reduz cerca de 2% por década. Aos 35, você já queima aproximadamente 5% menos calorias que aos 25.',
      },
      {
        tipo: 'tabela',
        titulo: 'Mudanças Metabólicas aos 30',
        conteudo: {
          cabecalho: ['Aspecto', 'Aos 20', 'Aos 30'],
          linhas: [
            ['Metabolismo basal', 'Referência', '-5%'],
            ['Massa muscular', 'Pico máximo', 'Início de perda (-3%/década)'],
            ['Recuperação pós-exercício', '24-48h', '48-72h'],
            ['Retenção de líquidos', 'Rara', 'Mais comum'],
          ],
        },
      },
      {
        tipo: 'lista',
        titulo: 'Adaptações Necessárias',
        conteudo: [
          'Reduza porções em 5-10% comparado aos 20',
          'Priorize proteína em CADA refeição',
          'Treino de força: agora é OBRIGATÓRIO para manter massa muscular',
          'Reduza sódio para evitar retenção de líquidos',
          'Sono de qualidade: afeta diretamente o metabolismo',
        ],
      },
      {
        tipo: 'destaque',
        titulo: 'A Boa Notícia',
        conteudo: 'Com ajustes simples, você pode manter o mesmo corpo dos seus 20. A diferença é que agora precisa ser mais intencional.',
      },
    ],
    acaoRecomendada: 'Calcule suas novas calorias usando nosso calculador ajustado por idade',
  },

  // ========== 40-49 ANOS ==========
  {
    id: '40s-sarcopenia-prevencao',
    titulo: 'Sarcopenia: A Perda Muscular que Começa aos 40',
    subtitulo: 'Como preservar seus músculos e sua independência futura',
    categoria: 'exercicio',
    faixasEtarias: ['40-49', '50-59'],
    sexo: 'ambos',
    tempoLeitura: 7,
    conteudo: [
      {
        tipo: 'texto',
        conteudo: 'Sarcopenia é a perda progressiva de massa muscular que começa de forma silenciosa aos 40 e acelera após os 50. Afeta 30% das pessoas acima de 60 anos e mais de 50% acima de 80. A boa notícia? É altamente prevenível.',
      },
      {
        tipo: 'destaque',
        titulo: 'Estatística Alarmante',
        conteudo: 'Sem intervenção, você perde 8% de massa muscular por década após os 40, e 15% por década após os 70.',
      },
      {
        tipo: 'lista',
        titulo: 'Sinais de Sarcopenia Inicial',
        conteudo: [
          'Dificuldade para abrir potes ou carregar compras',
          'Cansaço ao subir escadas',
          'Braços e pernas parecem mais finos',
          'Força diminuída no dia a dia',
          'Equilíbrio pior que antes',
        ],
      },
      {
        tipo: 'texto',
        titulo: 'A Solução: Proteína + Treino de Força',
        conteudo: 'Estudos da ESPEN (Sociedade Europeia de Nutrição) mostram que a combinação de proteína adequada (1.0-1.2g/kg) com treino de força 2-3x por semana pode reverter a sarcopenia em qualquer idade.',
      },
      {
        tipo: 'tabela',
        titulo: 'Proteína por Refeição para Síntese Muscular',
        conteudo: {
          cabecalho: ['Idade', 'Proteína por Refeição', 'Exemplo Prático'],
          linhas: [
            ['20-40 anos', '20-25g', '100g de frango ou 3 ovos'],
            ['40-60 anos', '25-30g', '120g de frango ou 4 ovos'],
            ['60+ anos', '30-40g', '150g de frango ou shake proteico'],
          ],
        },
      },
      {
        tipo: 'lista',
        titulo: 'Plano de Ação Anti-Sarcopenia',
        conteudo: [
          'Treino de força 3x/semana (musculação, funcional ou pilates com carga)',
          'Proteína de qualidade em TODAS as refeições',
          'Leucina: aminoácido chave - encontrado em whey protein, ovos e carnes',
          'Vitamina D: essencial para função muscular',
          'Sono de qualidade: músculos se recuperam durante o sono',
        ],
      },
    ],
    acaoRecomendada: 'Adicione 1 fonte de proteína em cada refeição a partir de hoje',
  },

  // ========== MENOPAUSA ==========
  {
    id: 'menopausa-guia-completo',
    titulo: 'Guia Nutricional Completo para a Menopausa',
    subtitulo: 'Alimentação estratégica para esta nova fase',
    categoria: 'hormonal',
    faixasEtarias: ['40-49', '50-59', '60-69'],
    fasesHormonais: ['pre_menopausa', 'perimenopausa', 'menopausa'],
    sexo: 'feminino',
    tempoLeitura: 10,
    conteudo: [
      {
        tipo: 'texto',
        conteudo: 'A menopausa é uma transição natural que afeta profundamente o metabolismo. A queda de estrogênio e progesterona impacta como seu corpo armazena gordura, absorve nutrientes e regula a temperatura. Com as estratégias certas, você pode minimizar os sintomas e manter sua saúde.',
      },
      {
        tipo: 'tabela',
        titulo: 'Fases da Menopausa',
        conteudo: {
          cabecalho: ['Fase', 'Idade Típica', 'O Que Acontece'],
          linhas: [
            ['Pré-menopausa', '40-45 anos', 'Início das alterações, ciclos podem variar'],
            ['Perimenopausa', '45-52 anos', 'Transição ativa, sintomas mais intensos'],
            ['Pós-menopausa', '52+ anos', '12 meses após última menstruação'],
          ],
        },
      },
      {
        tipo: 'lista',
        titulo: 'Sintomas que a Alimentação Pode Ajudar',
        conteudo: [
          'Ondas de calor e suores noturnos',
          'Ganho de peso abdominal',
          'Alterações de humor',
          'Ressecamento de pele e mucosas',
          'Perda óssea (osteoporose)',
          'Risco cardiovascular aumentado',
        ],
      },
      {
        tipo: 'destaque',
        titulo: 'Fitoestrogênios: Seus Aliados Naturais',
        conteudo: 'Fitoestrogênios são compostos vegetais similares ao estrogênio. Podem ajudar a reduzir ondas de calor em até 50%. Fontes: soja, linhaça, grão-de-bico, tofu.',
      },
      {
        tipo: 'lista',
        titulo: 'Alimentos Indicados na Menopausa',
        conteudo: [
          'SOJA e derivados (tofu, leite de soja, tempeh) - fitoestrogênios',
          'LINHAÇA moída (2 colheres/dia) - lignanas',
          'SARDINHA e peixes gordos - cálcio + ômega-3',
          'VEGETAIS verde-escuros - cálcio vegetal',
          'INHAME - precursor de progesterona natural',
          'FRUTAS VERMELHAS - antioxidantes',
          'OLEAGINOSAS - gorduras saudáveis',
        ],
      },
      {
        tipo: 'lista',
        titulo: 'Alimentos a EVITAR',
        conteudo: [
          'CAFEÍNA - intensifica ondas de calor',
          'ÁLCOOL - piora suores noturnos e afeta ossos',
          'COMIDAS PICANTES - gatilho para ondas de calor',
          'AÇÚCAR - piora alterações de humor',
          'SÓDIO EM EXCESSO - retenção e pressão',
        ],
      },
      {
        tipo: 'tabela',
        titulo: 'Suplementação Recomendada',
        conteudo: {
          cabecalho: ['Suplemento', 'Dosagem', 'Por Quê'],
          linhas: [
            ['Cálcio', '600mg 2x/dia', 'Prevenir osteoporose'],
            ['Vitamina D3', '2000 UI/dia', 'Absorção de cálcio'],
            ['Ômega-3', '2000mg/dia', 'Coração e inflamação'],
            ['Magnésio', '300-400mg', 'Sono e humor'],
          ],
        },
      },
    ],
    acaoRecomendada: 'Adicione 2 colheres de linhaça moída ao seu café da manhã',
  },

  // ========== ANDROPAUSA ==========
  {
    id: 'andropausa-guia-homens',
    titulo: 'Testosterona Baixa: Guia Nutricional para Homens 40+',
    subtitulo: 'Maximize sua produção hormonal naturalmente',
    categoria: 'hormonal',
    faixasEtarias: ['40-49', '50-59', '60-69'],
    fasesHormonais: ['andropausa_inicial', 'andropausa'],
    sexo: 'masculino',
    tempoLeitura: 8,
    conteudo: [
      {
        tipo: 'texto',
        conteudo: 'A partir dos 40 anos, a produção de testosterona diminui cerca de 1% ao ano. Aos 50, muitos homens sentem os efeitos: menos energia, perda de massa muscular, acúmulo de gordura abdominal e redução da libido. A alimentação certa pode ajudar a otimizar seus níveis naturalmente.',
      },
      {
        tipo: 'lista',
        titulo: 'Sinais de Testosterona Baixa',
        conteudo: [
          'Fadiga persistente',
          'Perda de massa muscular',
          'Aumento de gordura, especialmente abdominal',
          'Diminuição da libido',
          'Dificuldade de concentração',
          'Alterações de humor',
          'Sono de má qualidade',
        ],
      },
      {
        tipo: 'destaque',
        titulo: 'Trio Essencial: Zinco, Vitamina D e Magnésio',
        conteudo: 'Estes três nutrientes são fundamentais para a produção de testosterona. Deficiência em qualquer um deles pode reduzir significativamente seus níveis hormonais.',
      },
      {
        tipo: 'lista',
        titulo: 'Alimentos que Suportam a Testosterona',
        conteudo: [
          'OSTRAS - campeãs em zinco',
          'OVOS INTEIROS - colesterol é precursor de testosterona',
          'CARNES VERMELHAS MAGRAS - zinco e proteína',
          'SEMENTES DE ABÓBORA - zinco e magnésio',
          'PEIXES GORDOS - vitamina D e ômega-3',
          'CASTANHA DO PARÁ - selênio',
          'ALHO e GENGIBRE - suportam produção hormonal',
          'ABACATE - gorduras saudáveis',
        ],
      },
      {
        tipo: 'lista',
        titulo: 'O Que REDUZ Testosterona',
        conteudo: [
          'ÁLCOOL EM EXCESSO - suprime produção diretamente',
          'AÇÚCAR - aumenta gordura abdominal que converte testosterona em estrogênio',
          'GORDURAS TRANS - inflamação hormonal',
          'SOJA EM EXCESSO - fitoestrogênios em homens podem ser negativos',
          'SONO RUIM - grande parte da produção ocorre à noite',
          'ESTRESSE CRÔNICO - cortisol antagoniza testosterona',
        ],
      },
      {
        tipo: 'texto',
        titulo: 'Exercício: O Melhor Potencializador Natural',
        conteudo: 'Treino de força é o mais potente estimulador natural de testosterona. Estudos mostram aumentos de 15-20% após sessões intensas de musculação. Cardio excessivo (maratonas, por exemplo) pode ter efeito contrário.',
      },
      {
        tipo: 'tabela',
        titulo: 'Suplementação para Homens 40+',
        conteudo: {
          cabecalho: ['Suplemento', 'Dosagem', 'Benefício'],
          linhas: [
            ['Zinco', '30-50mg/dia', 'Produção de testosterona'],
            ['Vitamina D3', '2000-4000 UI', 'Hormônios e músculos'],
            ['Magnésio', '400-500mg', 'Sono e produção hormonal'],
            ['Ômega-3', '2000mg', 'Anti-inflamatório'],
            ['Ashwagandha', '300-600mg', 'Reduz cortisol (consultar médico)'],
          ],
        },
      },
    ],
    acaoRecomendada: 'Inclua ovos no café da manhã e treino de força 3x por semana',
  },

  // ========== 60+ ANOS ==========
  {
    id: '60plus-proteina-essencial',
    titulo: 'Proteína Após os 60: Por Que Você Precisa de MAIS',
    subtitulo: 'A ciência da resistência anabólica e como vencê-la',
    categoria: 'nutricao',
    faixasEtarias: ['60-69', '70+'],
    sexo: 'ambos',
    tempoLeitura: 7,
    conteudo: [
      {
        tipo: 'texto',
        conteudo: 'Contraintuitivamente, pessoas acima de 60 anos precisam de MAIS proteína que jovens, não menos. Isso porque o corpo desenvolve "resistência anabólica" - uma resposta muscular menos eficiente à proteína consumida.',
      },
      {
        tipo: 'destaque',
        titulo: 'Estudo PROT-AGE (Grupo de Especialistas Internacionais)',
        conteudo: 'Idosos precisam de 70% MAIS proteína por refeição para obter o mesmo estímulo de síntese muscular que jovens. Recomendação: 1.0-1.2g/kg/dia para saudáveis, 1.2-1.5g/kg/dia se há doença.',
      },
      {
        tipo: 'tabela',
        titulo: 'Comparativo de Necessidades Proteicas',
        conteudo: {
          cabecalho: ['Idade', 'Proteína Total/Dia', 'Por Refeição', 'Para Pessoa de 70kg'],
          linhas: [
            ['20-40 anos', '0.8g/kg', '20-25g', '56g total / 18g/refeição'],
            ['40-60 anos', '1.0g/kg', '25-30g', '70g total / 23g/refeição'],
            ['60+ anos', '1.0-1.2g/kg', '30-40g', '84g total / 28g/refeição'],
            ['70+ com doença', '1.2-1.5g/kg', '35-40g', '105g total / 35g/refeição'],
          ],
        },
      },
      {
        tipo: 'lista',
        titulo: 'Estratégias para Aumentar Proteína',
        conteudo: [
          'Proteína em TODAS as refeições, não só no almoço',
          'Café da manhã proteico: ovos, queijo, iogurte grego',
          'Lanches com proteína: castanhas, queijo, ovo cozido',
          'Shakes de whey protein se apetite estiver baixo',
          'Carnes macias: frango desfiado, peixe, carne moída',
          'Ovos: proteína completa e fácil de preparar',
        ],
      },
      {
        tipo: 'texto',
        titulo: 'O Papel da Leucina',
        conteudo: 'Leucina é o aminoácido que "liga" a síntese muscular. Idosos precisam de 2.5-3g de leucina por refeição (jovens precisam de 1.5-2g). Whey protein é a fonte mais concentrada.',
      },
    ],
    acaoRecomendada: 'Adicione 30g de whey protein ao seu café da manhã ou lanche',
  },

  {
    id: '60plus-suplementacao-essencial',
    titulo: 'Suplementação Após os 60: O Que é Realmente Necessário',
    subtitulo: 'Baseado em evidências científicas, não marketing',
    categoria: 'nutricao',
    faixasEtarias: ['60-69', '70+'],
    sexo: 'ambos',
    tempoLeitura: 6,
    conteudo: [
      {
        tipo: 'texto',
        conteudo: 'Com a idade, a absorção de nutrientes diminui significativamente. Além disso, a exposição solar reduzida, menor apetite e alterações no trato digestivo fazem com que alguns suplementos se tornem praticamente obrigatórios.',
      },
      {
        tipo: 'tabela',
        titulo: 'Suplementos Essenciais 60+',
        conteudo: {
          cabecalho: ['Suplemento', 'Por Quê', 'Dosagem', 'Observação'],
          linhas: [
            ['Vitamina D3', 'Síntese cutânea reduzida em 75%', '2000 UI/dia', 'Praticamente obrigatório'],
            ['Vitamina B12', '30% têm absorção comprometida', '100-500mcg/dia', 'Sublingual é melhor absorvido'],
            ['Cálcio', 'Absorção 30% menor', '600mg 2x/dia', 'Junto com D3 para absorção'],
            ['Ômega-3', 'Cognição, coração, articulações', '2000mg/dia', 'DHA é mais importante para cérebro'],
            ['Whey Protein', 'Leucina para músculos', '25-30g/dia', 'Se ingestão proteica for baixa'],
          ],
        },
      },
      {
        tipo: 'destaque',
        conteudo: 'ATENÇÃO: Sempre consulte seu médico antes de iniciar suplementação. Alguns suplementos podem interagir com medicamentos.',
      },
      {
        tipo: 'lista',
        titulo: 'Suplementos a Considerar (com orientação médica)',
        conteudo: [
          'Creatina: 3-5g/dia - benefícios para força e cognição',
          'Magnésio: 300-400mg - sono e função muscular',
          'Probióticos: saúde intestinal e imunidade',
          'Colágeno: 10g/dia - pele e articulações',
        ],
      },
    ],
    acaoRecomendada: 'Converse com seu médico sobre D3 e B12 na próxima consulta',
  },
]

// ========================================
// FUNÇÕES AUXILIARES
// ========================================

/**
 * Busca artigos por faixa etária
 */
export function getArtigosPorIdade(faixaEtaria: FaixaEtaria): ArtigoEducativo[] {
  return ARTIGOS_EDUCATIVOS.filter(artigo =>
    artigo.faixasEtarias.includes(faixaEtaria)
  )
}

/**
 * Busca artigos por fase hormonal
 */
export function getArtigosPorFaseHormonal(fase: FaseHormonal): ArtigoEducativo[] {
  return ARTIGOS_EDUCATIVOS.filter(artigo =>
    artigo.fasesHormonais?.includes(fase)
  )
}

/**
 * Busca artigos personalizados para um perfil
 */
export function getArtigosPersonalizados(
  faixaEtaria: FaixaEtaria,
  sexo: 'masculino' | 'feminino',
  faseHormonal?: FaseHormonal
): ArtigoEducativo[] {
  return ARTIGOS_EDUCATIVOS.filter(artigo => {
    // Verifica faixa etária
    if (!artigo.faixasEtarias.includes(faixaEtaria)) return false

    // Verifica sexo
    if (artigo.sexo && artigo.sexo !== 'ambos' && artigo.sexo !== sexo) return false

    // Verifica fase hormonal se especificada
    if (faseHormonal && artigo.fasesHormonais) {
      if (!artigo.fasesHormonais.includes(faseHormonal)) return false
    }

    return true
  })
}

/**
 * Busca artigo por ID
 */
export function getArtigoPorId(id: string): ArtigoEducativo | undefined {
  return ARTIGOS_EDUCATIVOS.find(artigo => artigo.id === id)
}

/**
 * Busca artigos por categoria
 */
export function getArtigosPorCategoria(
  categoria: ArtigoEducativo['categoria']
): ArtigoEducativo[] {
  return ARTIGOS_EDUCATIVOS.filter(artigo => artigo.categoria === categoria)
}
