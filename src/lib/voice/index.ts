// Sistema de Registro por Voz

export type VoiceCommand =
  | 'registrar_peso'
  | 'registrar_refeicao'
  | 'registrar_agua'
  | 'perguntar_coach'
  | 'ver_progresso'
  | 'desconhecido'

export interface VoiceRecognitionResult {
  transcript: string
  confidence: number
  comando: VoiceCommand
  dados_extraidos: Record<string, unknown>
}

// Padrões para detectar comandos
export const PADROES_COMANDO: { padrao: RegExp; comando: VoiceCommand; extrator: (match: RegExpMatchArray) => Record<string, unknown> }[] = [
  {
    padrao: /(?:meu peso|peso hoje|registrar peso|pesei)\s*(?:é|foi|está|tá)?\s*(\d+(?:[,\.]\d+)?)\s*(?:kg|quilos?)?/i,
    comando: 'registrar_peso',
    extrator: (match) => ({ peso: parseFloat(match[1].replace(',', '.')) })
  },
  {
    padrao: /(?:comi|almocei|jantei|tomei café|caf[eé]|lanche)\s+(.+)/i,
    comando: 'registrar_refeicao',
    extrator: (match) => ({ descricao: match[1] })
  },
  {
    padrao: /(?:bebi|tomei)\s*(\d+)\s*(?:copos?|ml|litros?|l)\s*(?:de)?\s*(?:água|agua)?/i,
    comando: 'registrar_agua',
    extrator: (match) => {
      let ml = parseInt(match[1])
      if (match[0].toLowerCase().includes('copo')) ml *= 250
      if (match[0].toLowerCase().includes('litro')) ml *= 1000
      return { ml }
    }
  },
  {
    padrao: /(?:coach|doutora|ana|ajuda|dúvida|pergunta)\s+(.+)/i,
    comando: 'perguntar_coach',
    extrator: (match) => ({ pergunta: match[1] })
  },
  {
    padrao: /(?:como estou|meu progresso|quanto perdi|resultado)/i,
    comando: 'ver_progresso',
    extrator: () => ({})
  },
]

// Processar transcrição e detectar comando
export function processarVoz(transcript: string): VoiceRecognitionResult {
  const textoLimpo = transcript.trim().toLowerCase()

  for (const { padrao, comando, extrator } of PADROES_COMANDO) {
    const match = textoLimpo.match(padrao)
    if (match) {
      return {
        transcript,
        confidence: 0.9,
        comando,
        dados_extraidos: extrator(match)
      }
    }
  }

  return {
    transcript,
    confidence: 0.5,
    comando: 'desconhecido',
    dados_extraidos: {}
  }
}

// Mensagens de resposta
export const RESPOSTAS_VOZ: Record<VoiceCommand, (dados: Record<string, unknown>) => string> = {
  registrar_peso: (dados) => `Peso de ${dados.peso}kg registrado com sucesso!`,
  registrar_refeicao: (dados) => `Refeição "${dados.descricao}" anotada!`,
  registrar_agua: (dados) => `${dados.ml}ml de água registrados!`,
  perguntar_coach: () => `Encaminhando sua pergunta para a Coach...`,
  ver_progresso: () => `Carregando seu progresso...`,
  desconhecido: () => `Não entendi. Tente: "Meu peso é 75kg" ou "Bebi 2 copos de água"`,
}

// Exemplos de comandos
export const EXEMPLOS_COMANDOS = [
  { texto: 'Meu peso hoje é 75,5 kg', comando: 'Registrar peso' },
  { texto: 'Bebi 3 copos de água', comando: 'Registrar água' },
  { texto: 'Almocei frango com salada', comando: 'Registrar refeição' },
  { texto: 'Coach, posso comer chocolate?', comando: 'Perguntar à coach' },
  { texto: 'Como está meu progresso?', comando: 'Ver progresso' },
]

// Verificar suporte a Web Speech API
export function verificarSuporteVoz(): boolean {
  if (typeof window === 'undefined') return false
  return 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SpeechRecognitionConstructor = new () => any

// Criar instância de reconhecimento de voz
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function criarReconhecimentoVoz(): any {
  if (typeof window === 'undefined') return null

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const windowAny = window as any
  const SpeechRecognition: SpeechRecognitionConstructor | undefined =
    windowAny.SpeechRecognition || windowAny.webkitSpeechRecognition

  if (!SpeechRecognition) return null

  const recognition = new SpeechRecognition()
  recognition.lang = 'pt-BR'
  recognition.continuous = false
  recognition.interimResults = true
  recognition.maxAlternatives = 1

  return recognition
}
