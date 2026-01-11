// Sistema de Acompanhamento de Medicamentos GLP-1

export type MedicamentoGLP1 = 'ozempic' | 'wegovy' | 'mounjaro' | 'saxenda' | 'rybelsus' | 'outro'

export interface DoseInfo {
  medicamento: MedicamentoGLP1
  dose_atual: string
  proxima_dose?: string
  frequencia: 'semanal' | 'diaria'
  dia_aplicacao?: number // 0-6 (domingo-sábado) para semanal
  hora_aplicacao?: string
}

export interface RegistroGLP1 {
  id: string
  user_id: string
  data: string
  medicamento: MedicamentoGLP1
  dose: string
  local_aplicacao: string
  efeitos_colaterais: string[]
  nivel_nausea: number // 0-10
  nivel_apetite: number // 0-10
  notas?: string
}

export interface EfeitoColateral {
  nome: string
  emoji: string
  severidade: 'leve' | 'moderado' | 'severo'
  dica: string
}

// Informações dos medicamentos
export const MEDICAMENTOS_INFO: Record<MedicamentoGLP1, {
  nome: string
  principio_ativo: string
  fabricante: string
  frequencia: 'semanal' | 'diaria'
  doses_disponiveis: string[]
  emoji: string
}> = {
  ozempic: {
    nome: 'Ozempic',
    principio_ativo: 'Semaglutida',
    fabricante: 'Novo Nordisk',
    frequencia: 'semanal',
    doses_disponiveis: ['0.25mg', '0.5mg', '1mg', '2mg'],
    emoji: '💉',
  },
  wegovy: {
    nome: 'Wegovy',
    principio_ativo: 'Semaglutida',
    fabricante: 'Novo Nordisk',
    frequencia: 'semanal',
    doses_disponiveis: ['0.25mg', '0.5mg', '1mg', '1.7mg', '2.4mg'],
    emoji: '💉',
  },
  mounjaro: {
    nome: 'Mounjaro',
    principio_ativo: 'Tirzepatida',
    fabricante: 'Eli Lilly',
    frequencia: 'semanal',
    doses_disponiveis: ['2.5mg', '5mg', '7.5mg', '10mg', '12.5mg', '15mg'],
    emoji: '💉',
  },
  saxenda: {
    nome: 'Saxenda',
    principio_ativo: 'Liraglutida',
    fabricante: 'Novo Nordisk',
    frequencia: 'diaria',
    doses_disponiveis: ['0.6mg', '1.2mg', '1.8mg', '2.4mg', '3.0mg'],
    emoji: '💉',
  },
  rybelsus: {
    nome: 'Rybelsus',
    principio_ativo: 'Semaglutida (oral)',
    fabricante: 'Novo Nordisk',
    frequencia: 'diaria',
    doses_disponiveis: ['3mg', '7mg', '14mg'],
    emoji: '💊',
  },
  outro: {
    nome: 'Outro',
    principio_ativo: 'Vários',
    fabricante: 'Vários',
    frequencia: 'semanal',
    doses_disponiveis: ['Personalizado'],
    emoji: '💊',
  },
}

// Efeitos colaterais comuns
export const EFEITOS_COLATERAIS: EfeitoColateral[] = [
  {
    nome: 'Náusea',
    emoji: '🤢',
    severidade: 'moderado',
    dica: 'Coma porções menores e mais frequentes. Evite alimentos gordurosos.',
  },
  {
    nome: 'Constipação',
    emoji: '🚽',
    severidade: 'leve',
    dica: 'Aumente a ingestão de água e fibras. Considere psyllium.',
  },
  {
    nome: 'Diarreia',
    emoji: '💨',
    severidade: 'moderado',
    dica: 'Mantenha-se hidratado. Evite alimentos que piorem o sintoma.',
  },
  {
    nome: 'Dor abdominal',
    emoji: '😣',
    severidade: 'moderado',
    dica: 'Coma devagar. Porções menores ajudam.',
  },
  {
    nome: 'Fadiga',
    emoji: '😴',
    severidade: 'leve',
    dica: 'Comum nas primeiras semanas. Garanta sono adequado.',
  },
  {
    nome: 'Dor de cabeça',
    emoji: '🤕',
    severidade: 'leve',
    dica: 'Hidrate-se bem. Geralmente passa com o tempo.',
  },
  {
    nome: 'Tontura',
    emoji: '💫',
    severidade: 'leve',
    dica: 'Levante-se devagar. Mantenha-se hidratado.',
  },
  {
    nome: 'Refluxo',
    emoji: '🔥',
    severidade: 'moderado',
    dica: 'Evite deitar após comer. Refeições menores ajudam.',
  },
  {
    nome: 'Vômito',
    emoji: '🤮',
    severidade: 'severo',
    dica: 'Se persistir, consulte seu médico sobre ajuste de dose.',
  },
  {
    nome: 'Perda de apetite',
    emoji: '🍽️',
    severidade: 'leve',
    dica: 'É esperado! Foque em alimentos nutritivos mesmo sem fome.',
  },
]

// Locais de aplicação
export const LOCAIS_APLICACAO = [
  { id: 'abdomen', nome: 'Abdômen', emoji: '🫁' },
  { id: 'coxa', nome: 'Coxa', emoji: '🦵' },
  { id: 'braco', nome: 'Parte superior do braço', emoji: '💪' },
]

// Dicas nutricionais para usuários de GLP-1
export const DICAS_NUTRICAO_GLP1 = [
  {
    titulo: 'Proteína Primeiro',
    descricao: 'Comece as refeições pela proteína para garantir ingestão adequada',
    emoji: '🥩',
  },
  {
    titulo: 'Hidratação',
    descricao: 'Beba 2-3L de água/dia. Constipação é comum.',
    emoji: '💧',
  },
  {
    titulo: 'Porções Menores',
    descricao: 'Seu estômago esvazia mais devagar. Respeite a saciedade.',
    emoji: '🍽️',
  },
  {
    titulo: 'Evite Frituras',
    descricao: 'Gorduras podem piorar náuseas. Prefira grelhados e assados.',
    emoji: '🍳',
  },
  {
    titulo: 'Coma Devagar',
    descricao: 'Mastigue bem e faça pausas. Isso reduz desconforto.',
    emoji: '⏰',
  },
  {
    titulo: 'Suplementação',
    descricao: 'Considere vitaminas B12 e D com orientação médica.',
    emoji: '💊',
  },
]

// Calcular próxima dose
export function calcularProximaDose(config: DoseInfo): Date {
  const hoje = new Date()

  if (config.frequencia === 'diaria') {
    // Próxima dose é amanhã no horário configurado
    const proxima = new Date(hoje)
    if (config.hora_aplicacao) {
      const [hora, min] = config.hora_aplicacao.split(':').map(Number)
      proxima.setHours(hora, min, 0, 0)
      if (proxima <= hoje) {
        proxima.setDate(proxima.getDate() + 1)
      }
    } else {
      proxima.setDate(proxima.getDate() + 1)
    }
    return proxima
  }

  // Semanal - encontrar próximo dia configurado
  const diaAtual = hoje.getDay()
  const diaAplicacao = config.dia_aplicacao ?? 0
  let diasAte = diaAplicacao - diaAtual
  if (diasAte <= 0) diasAte += 7

  const proxima = new Date(hoje)
  proxima.setDate(hoje.getDate() + diasAte)

  if (config.hora_aplicacao) {
    const [hora, min] = config.hora_aplicacao.split(':').map(Number)
    proxima.setHours(hora, min, 0, 0)
  }

  return proxima
}

// Analisar tendência de efeitos colaterais
export function analisarTendenciaEfeitos(
  registros: RegistroGLP1[]
): { efeito: string; frequencia: number; tendencia: 'aumentando' | 'diminuindo' | 'estavel' }[] {
  if (registros.length < 2) return []

  const contagemEfeitos = new Map<string, number[]>()

  registros.forEach((reg, index) => {
    reg.efeitos_colaterais.forEach((efeito) => {
      if (!contagemEfeitos.has(efeito)) {
        contagemEfeitos.set(efeito, new Array(registros.length).fill(0))
      }
      contagemEfeitos.get(efeito)![index] = 1
    })
  })

  return Array.from(contagemEfeitos.entries()).map(([efeito, ocorrencias]) => {
    const frequencia = ocorrencias.reduce((a, b) => a + b, 0) / registros.length
    const metade = Math.floor(ocorrencias.length / 2)
    const primeiraMet = ocorrencias.slice(0, metade).reduce((a, b) => a + b, 0) / metade
    const segundaMet = ocorrencias.slice(metade).reduce((a, b) => a + b, 0) / (ocorrencias.length - metade)

    let tendencia: 'aumentando' | 'diminuindo' | 'estavel' = 'estavel'
    if (segundaMet > primeiraMet + 0.2) tendencia = 'aumentando'
    else if (segundaMet < primeiraMet - 0.2) tendencia = 'diminuindo'

    return { efeito, frequencia, tendencia }
  })
}

// Dias da semana para seleção
export const DIAS_SEMANA = [
  { value: 0, label: 'Domingo' },
  { value: 1, label: 'Segunda' },
  { value: 2, label: 'Terça' },
  { value: 3, label: 'Quarta' },
  { value: 4, label: 'Quinta' },
  { value: 5, label: 'Sexta' },
  { value: 6, label: 'Sábado' },
]
