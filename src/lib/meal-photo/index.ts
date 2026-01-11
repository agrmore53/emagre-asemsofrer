// Sistema de Análise de Fotos de Refeições com IA

export interface MealAnalysis {
  alimentos_detectados: AlimentoDetectado[]
  calorias_estimadas: number
  macros_estimados: {
    proteinas: number
    carboidratos: number
    gorduras: number
    fibras: number
  }
  qualidade: 'excelente' | 'boa' | 'regular' | 'ruim'
  sugestoes: string[]
  confianca: number // 0-100
}

export interface AlimentoDetectado {
  nome: string
  porcao_estimada: string
  calorias: number
  categoria: 'proteina' | 'carboidrato' | 'vegetal' | 'fruta' | 'gordura' | 'processado' | 'bebida'
  confianca: number
}

export interface MealPhoto {
  id: string
  user_id: string
  url: string
  tipo_refeicao: 'cafe' | 'almoco' | 'jantar' | 'lanche'
  data: string
  analise?: MealAnalysis
  notas?: string
  aprovado_usuario: boolean
  created_at: string
}

// Prompt para análise de imagem com GPT-4 Vision ou Claude
export const MEAL_ANALYSIS_PROMPT = `Você é um nutricionista especializado em análise de refeições através de fotos.

Analise esta foto de refeição e retorne um JSON com o seguinte formato:
{
  "alimentos_detectados": [
    {
      "nome": "nome do alimento",
      "porcao_estimada": "ex: 100g, 1 unidade, 1 xícara",
      "calorias": número,
      "categoria": "proteina" | "carboidrato" | "vegetal" | "fruta" | "gordura" | "processado" | "bebida",
      "confianca": 0-100
    }
  ],
  "calorias_estimadas": número total,
  "macros_estimados": {
    "proteinas": gramas,
    "carboidratos": gramas,
    "gorduras": gramas,
    "fibras": gramas
  },
  "qualidade": "excelente" | "boa" | "regular" | "ruim",
  "sugestoes": ["sugestão 1", "sugestão 2"],
  "confianca": 0-100
}

Critérios de qualidade:
- Excelente: Boa quantidade de proteína, vegetais, carboidratos complexos
- Boa: Balanceada, mas poderia melhorar em algum aspecto
- Regular: Falta diversidade ou excesso de processados
- Ruim: Altamente processada, sem nutrientes importantes

Seja específico nas porções e use valores realistas para alimentos brasileiros.
Retorne APENAS o JSON, sem texto adicional.`

// Tipos de refeição
export const TIPOS_REFEICAO = [
  { id: 'cafe', nome: 'Café da manhã', emoji: '☕', horario_tipico: '06:00-10:00' },
  { id: 'almoco', nome: 'Almoço', emoji: '🍽️', horario_tipico: '11:00-14:00' },
  { id: 'jantar', nome: 'Jantar', emoji: '🌙', horario_tipico: '18:00-21:00' },
  { id: 'lanche', nome: 'Lanche', emoji: '🍎', horario_tipico: 'Qualquer' },
]

// Categorias de alimentos com cores
export const CATEGORIAS_ALIMENTOS = {
  proteina: { nome: 'Proteína', cor: 'bg-red-100 text-red-800', emoji: '🥩' },
  carboidrato: { nome: 'Carboidrato', cor: 'bg-amber-100 text-amber-800', emoji: '🍚' },
  vegetal: { nome: 'Vegetal', cor: 'bg-green-100 text-green-800', emoji: '🥗' },
  fruta: { nome: 'Fruta', cor: 'bg-purple-100 text-purple-800', emoji: '🍎' },
  gordura: { nome: 'Gordura', cor: 'bg-yellow-100 text-yellow-800', emoji: '🥑' },
  processado: { nome: 'Processado', cor: 'bg-gray-100 text-gray-800', emoji: '🍔' },
  bebida: { nome: 'Bebida', cor: 'bg-blue-100 text-blue-800', emoji: '🥤' },
}

// Qualidade com cores
export const QUALIDADE_CONFIG = {
  excelente: { emoji: '🌟', cor: 'text-green-600', bg: 'bg-green-100' },
  boa: { emoji: '👍', cor: 'text-blue-600', bg: 'bg-blue-100' },
  regular: { emoji: '😐', cor: 'text-yellow-600', bg: 'bg-yellow-100' },
  ruim: { emoji: '⚠️', cor: 'text-red-600', bg: 'bg-red-100' },
}

// Converter imagem para base64
export async function imageToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

// Determinar tipo de refeição pelo horário
export function detectarTipoRefeicao(): 'cafe' | 'almoco' | 'jantar' | 'lanche' {
  const hora = new Date().getHours()
  if (hora >= 6 && hora < 10) return 'cafe'
  if (hora >= 11 && hora < 14) return 'almoco'
  if (hora >= 18 && hora < 21) return 'jantar'
  return 'lanche'
}

// Fallback de análise (quando não há API configurada)
export function gerarAnaliseSimulada(): MealAnalysis {
  return {
    alimentos_detectados: [
      {
        nome: 'Alimento detectado',
        porcao_estimada: 'Porção média',
        calorias: 200,
        categoria: 'proteina',
        confianca: 50,
      },
    ],
    calorias_estimadas: 400,
    macros_estimados: {
      proteinas: 20,
      carboidratos: 40,
      gorduras: 15,
      fibras: 5,
    },
    qualidade: 'boa',
    sugestoes: [
      'Configure a API de visão para análises detalhadas',
      'Adicione a variável OPENAI_API_KEY ou ANTHROPIC_API_KEY',
    ],
    confianca: 50,
  }
}
