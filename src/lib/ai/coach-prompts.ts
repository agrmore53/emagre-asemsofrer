// Prompts e configurações do AI Coach
// Sistema de coaching personalizado com IA

export const COACH_PERSONA = `Você é a Dra. Ana, uma coach de emagrecimento virtual especializada em:
- Nutrição funcional e comportamental
- Psicologia do emagrecimento (CBT)
- Menopausa e andropausa
- Emagrecimento sustentável sem sofrimento

Sua personalidade:
- Empática e acolhedora, mas direta
- Usa linguagem simples e brasileira
- Celebra pequenas vitórias
- Nunca julga ou critica
- Foca em progresso, não perfeição
- Conhece a cultura alimentar brasileira

Regras:
1. Respostas curtas (máx 3 parágrafos)
2. Sempre termine com uma pergunta ou sugestão prática
3. Use emojis com moderação (máx 2 por mensagem)
4. Personalize baseado no perfil do usuário
5. Nunca dê conselhos médicos específicos
6. Incentive consulta com profissionais quando apropriado`

export type CoachContext = {
  userName: string
  idade?: number
  sexo?: 'masculino' | 'feminino'
  pesoAtual?: number
  pesoMeta?: number
  faixaEtaria?: string
  faseHormonal?: string
  objetivoSaude?: string
  restricoesAlimentares?: string[]
  diasStreak?: number
  ultimoPeso?: number
  variacaoPeso?: number
  usaGLP1?: boolean
  medicamentoGLP1?: string
  faseCicloMenstrual?: string
}

export type MessageType =
  | 'greeting'
  | 'motivation'
  | 'nutrition_question'
  | 'emotional_eating'
  | 'plateau'
  | 'celebration'
  | 'slip_up'
  | 'glp1_support'
  | 'menopause_support'
  | 'exercise_advice'
  | 'general'

export function buildSystemPrompt(context: CoachContext): string {
  let contextInfo = `
CONTEXTO DO USUÁRIO:
- Nome: ${context.userName || 'Usuário'}
- Idade: ${context.idade ? `${context.idade} anos` : 'Não informada'}
- Sexo: ${context.sexo || 'Não informado'}
`

  if (context.pesoAtual && context.pesoMeta) {
    const falta = context.pesoAtual - context.pesoMeta
    contextInfo += `- Peso atual: ${context.pesoAtual}kg
- Meta: ${context.pesoMeta}kg
- Falta perder: ${falta.toFixed(1)}kg
`
  }

  if (context.faixaEtaria) {
    contextInfo += `- Faixa etária: ${context.faixaEtaria}\n`
  }

  if (context.faseHormonal && context.faseHormonal !== 'regular') {
    contextInfo += `- Fase hormonal: ${context.faseHormonal.replace('_', ' ')}\n`
  }

  if (context.diasStreak && context.diasStreak > 0) {
    contextInfo += `- Streak atual: ${context.diasStreak} dias consecutivos\n`
  }

  if (context.variacaoPeso) {
    const direcao = context.variacaoPeso < 0 ? 'perdeu' : 'ganhou'
    contextInfo += `- Última semana: ${direcao} ${Math.abs(context.variacaoPeso).toFixed(1)}kg\n`
  }

  if (context.usaGLP1) {
    contextInfo += `- Usa medicação GLP-1: ${context.medicamentoGLP1 || 'Sim'}\n`
  }

  if (context.faseCicloMenstrual) {
    contextInfo += `- Fase do ciclo menstrual: ${context.faseCicloMenstrual}\n`
  }

  if (context.restricoesAlimentares && context.restricoesAlimentares.length > 0) {
    contextInfo += `- Restrições alimentares: ${context.restricoesAlimentares.join(', ')}\n`
  }

  return `${COACH_PERSONA}\n\n${contextInfo}`
}

export const QUICK_RESPONSES: Record<MessageType, string[]> = {
  greeting: [
    'Oi! Como você está se sentindo hoje?',
    'Olá! Que bom te ver por aqui. Como posso te ajudar?',
    'Oi! Pronta pra mais um dia de conquistas?',
  ],
  motivation: [
    'Lembre-se: cada escolha saudável conta. Você está construindo um novo você, um dia de cada vez.',
    'Você já provou que consegue! Olha quantos dias você manteve o foco.',
    'Progresso não é linear. Dias difíceis fazem parte. O importante é não desistir.',
  ],
  celebration: [
    'Isso merece comemoração! Você está arrasando!',
    'Que orgulho! Continue assim, você está no caminho certo.',
    'Parabéns pela conquista! Cada passo conta.',
  ],
  slip_up: [
    'Tudo bem, acontece com todo mundo. O importante é o que você faz agora. Que tal um copo de água e seguir em frente?',
    'Um deslize não apaga todo seu progresso. Respire fundo e volte ao foco na próxima refeição.',
    'Não se culpe. Amanhã é um novo dia. O que você aprendeu com isso?',
  ],
  plateau: [
    'Platôs são normais e temporários. Seu corpo está se ajustando. Vamos revisar algumas estratégias?',
    'Às vezes o peso estaciona, mas as medidas mudam. Você tem acompanhado cintura e quadril?',
    'Platô pode ser sinal de que seu corpo precisa de algo diferente. Vamos conversar sobre isso?',
  ],
  emotional_eating: [
    'Parece que a fome não é física. O que você está sentindo agora?',
    'Antes de comer, vamos respirar juntas. 3 respirações profundas. O que está acontecendo?',
    'Comida emocional é comum. Vamos identificar o gatilho juntas?',
  ],
  nutrition_question: [
    'Ótima pergunta! Vamos ver isso juntas.',
    'Cada corpo é diferente, mas posso te dar algumas direções.',
  ],
  glp1_support: [
    'Como você está se sentindo com a medicação? Algum efeito colateral?',
    'Lembre-se de priorizar proteína nas refeições. Está conseguindo?',
    'A hidratação é super importante com GLP-1. Quantos copos de água hoje?',
  ],
  menopause_support: [
    'Nessa fase, o corpo muda e precisamos adaptar a estratégia. Como estão os sintomas?',
    'Menopausa traz desafios, mas também é uma fase de autoconhecimento. Como posso ajudar?',
  ],
  exercise_advice: [
    'Movimento é remédio! Mesmo uma caminhada de 10 minutos já ajuda.',
    'O melhor exercício é aquele que você consegue manter. O que você gosta de fazer?',
  ],
  general: [
    'Estou aqui pra te ajudar. Me conta mais.',
    'Vamos conversar sobre isso. O que você gostaria de saber?',
  ],
}

export const TOPIC_STARTERS = [
  {
    id: 'hunger',
    label: 'Estou com fome',
    icon: '🍽️',
    prompt: 'Estou sentindo fome agora',
  },
  {
    id: 'motivation',
    label: 'Preciso de motivação',
    icon: '💪',
    prompt: 'Estou precisando de motivação hoje',
  },
  {
    id: 'plateau',
    label: 'Peso parou',
    icon: '📊',
    prompt: 'Meu peso está estagnado há dias',
  },
  {
    id: 'emotional',
    label: 'Comer emocional',
    icon: '😔',
    prompt: 'Estou querendo comer por ansiedade/tristeza',
  },
  {
    id: 'celebration',
    label: 'Quero comemorar!',
    icon: '🎉',
    prompt: 'Tive uma vitória que quero compartilhar!',
  },
  {
    id: 'recipe',
    label: 'Ideia de refeição',
    icon: '🥗',
    prompt: 'Preciso de uma ideia de refeição saudável',
  },
  {
    id: 'glp1',
    label: 'Dúvida GLP-1',
    icon: '💊',
    prompt: 'Tenho uma dúvida sobre minha medicação GLP-1',
  },
  {
    id: 'exercise',
    label: 'Exercício',
    icon: '🏃',
    prompt: 'Quero dicas de exercício',
  },
]

// Análise de sentimento simples para categorizar mensagens
export function detectMessageType(message: string): MessageType {
  const lowerMessage = message.toLowerCase()

  // Saudações
  if (/^(oi|olá|ola|hey|bom dia|boa tarde|boa noite|e aí|eai)/.test(lowerMessage)) {
    return 'greeting'
  }

  // GLP-1
  if (/ozempic|wegovy|mounjaro|zepbound|semaglutida|glp-?1|injeção|caneta/.test(lowerMessage)) {
    return 'glp1_support'
  }

  // Emocional
  if (/ansiedad|estress|triste|deprimid|nervos|compuls|descontrol|vontade de comer/.test(lowerMessage)) {
    return 'emotional_eating'
  }

  // Platô
  if (/estagnado|parado|não emagrec|não perco|travado|platô|plato/.test(lowerMessage)) {
    return 'plateau'
  }

  // Celebração
  if (/consegui|perdi.*kg|emagreci|vitória|meta|objetivo.*atingi|comemorar/.test(lowerMessage)) {
    return 'celebration'
  }

  // Deslize
  if (/comi demais|exagerei|sai da dieta|fui mal|comi besteira|deslize/.test(lowerMessage)) {
    return 'slip_up'
  }

  // Motivação
  if (/motivação|desanima|desistir|difícil|não consigo|cansad/.test(lowerMessage)) {
    return 'motivation'
  }

  // Menopausa
  if (/menopausa|climatério|calor|fogacho|hormônio|tpm/.test(lowerMessage)) {
    return 'menopause_support'
  }

  // Exercício
  if (/exercício|treino|academia|caminhada|correr|musculação/.test(lowerMessage)) {
    return 'exercise_advice'
  }

  // Nutrição
  if (/caloria|proteína|carboidrato|gordura|comer|refeição|alimento|dieta/.test(lowerMessage)) {
    return 'nutrition_question'
  }

  return 'general'
}
