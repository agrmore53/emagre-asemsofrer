// Sistema de Lições Diárias de Terapia Cognitivo-Comportamental (CBT)

export interface CBTLesson {
  id: string
  titulo: string
  subtitulo: string
  duracao_minutos: number
  categoria: CategoriaCBT
  nivel: 'iniciante' | 'intermediario' | 'avancado'
  conteudo: CBTContent[]
  exercicio?: CBTExercise
  reflexao?: string
}

export interface CBTContent {
  tipo: 'texto' | 'exemplo' | 'dica' | 'alerta' | 'citacao'
  conteudo: string
  emoji?: string
}

export interface CBTExercise {
  titulo: string
  instrucoes: string
  tipo: 'reflexao' | 'diario' | 'pratica' | 'escala'
  perguntas?: string[]
  escala_labels?: { min: string; max: string }
}

export type CategoriaCBT =
  | 'pensamentos'
  | 'emocoes'
  | 'comportamento'
  | 'habitos'
  | 'autoestima'
  | 'estresse'
  | 'motivacao'

export const CATEGORIAS_CBT = {
  pensamentos: { nome: 'Pensamentos', emoji: '🧠', cor: 'bg-purple-100 text-purple-800' },
  emocoes: { nome: 'Emoções', emoji: '💭', cor: 'bg-blue-100 text-blue-800' },
  comportamento: { nome: 'Comportamento', emoji: '🎯', cor: 'bg-green-100 text-green-800' },
  habitos: { nome: 'Hábitos', emoji: '🔄', cor: 'bg-amber-100 text-amber-800' },
  autoestima: { nome: 'Autoestima', emoji: '💪', cor: 'bg-pink-100 text-pink-800' },
  estresse: { nome: 'Estresse', emoji: '🧘', cor: 'bg-teal-100 text-teal-800' },
  motivacao: { nome: 'Motivação', emoji: '🌟', cor: 'bg-yellow-100 text-yellow-800' },
}

// Lições pré-definidas
export const LICOES_CBT: CBTLesson[] = [
  {
    id: 'cbt-001',
    titulo: 'Fome Física vs. Fome Emocional',
    subtitulo: 'Aprenda a diferença entre os dois tipos de fome',
    duracao_minutos: 5,
    categoria: 'emocoes',
    nivel: 'iniciante',
    conteudo: [
      {
        tipo: 'texto',
        conteudo:
          'Um dos maiores desafios do emagrecimento é distinguir quando você realmente precisa comer e quando está buscando comida por outros motivos.',
      },
      {
        tipo: 'exemplo',
        emoji: '🍽️',
        conteudo:
          'FOME FÍSICA: Surge gradualmente, qualquer alimento satisfaz, você para de comer quando satisfeito, não gera culpa.',
      },
      {
        tipo: 'exemplo',
        emoji: '💔',
        conteudo:
          'FOME EMOCIONAL: Surge de repente, quer alimentos específicos (geralmente doces/gordurosos), continua mesmo cheio, gera culpa depois.',
      },
      {
        tipo: 'dica',
        emoji: '💡',
        conteudo:
          'Antes de comer, pergunte: "Estou com fome ou estou sentindo outra coisa?" Se a fome surgiu de repente após uma emoção, provavelmente é emocional.',
      },
    ],
    exercicio: {
      titulo: 'Diário de Fome',
      instrucoes: 'Durante 24h, antes de cada refeição/lanche, identifique:',
      tipo: 'diario',
      perguntas: [
        'O que estava sentindo antes de comer?',
        'A fome surgiu gradualmente ou de repente?',
        'Qual alimento você queria especificamente?',
        'Como se sentiu depois de comer?',
      ],
    },
    reflexao:
      'Reconhecer a fome emocional não significa que você nunca pode comer por emoção. Significa ter consciência para fazer escolhas mais alinhadas com seus objetivos.',
  },
  {
    id: 'cbt-002',
    titulo: 'Pensamento Tudo-ou-Nada',
    subtitulo: 'O perigo do perfeccionismo na dieta',
    duracao_minutos: 5,
    categoria: 'pensamentos',
    nivel: 'iniciante',
    conteudo: [
      {
        tipo: 'texto',
        conteudo:
          'O pensamento "tudo-ou-nada" é quando você vê as coisas apenas em extremos: ou está 100% na dieta ou "já estragou tudo".',
      },
      {
        tipo: 'exemplo',
        emoji: '❌',
        conteudo:
          '"Comi um pedaço de bolo, estraguei a dieta, vou comer o resto do bolo já que já estraguei mesmo."',
      },
      {
        tipo: 'exemplo',
        emoji: '✅',
        conteudo:
          '"Comi um pedaço de bolo. Foi uma escolha, não um fracasso. Minha próxima refeição será equilibrada."',
      },
      {
        tipo: 'alerta',
        emoji: '⚠️',
        conteudo:
          'O pensamento tudo-ou-nada é a principal causa de desistência de dietas. Uma refeição não define sua jornada.',
      },
      {
        tipo: 'dica',
        emoji: '💡',
        conteudo:
          'Substitua "eu estraguei" por "eu escolhi". Escolhas podem ser diferentes na próxima vez.',
      },
    ],
    exercicio: {
      titulo: 'Escala de Cinza',
      instrucoes:
        'Quando perceber um pensamento extremo, avalie a situação numa escala:',
      tipo: 'escala',
      escala_labels: { min: '0% - Desastre total', max: '100% - Perfeição' },
      perguntas: [
        'Onde essa situação realmente está na escala?',
        'O que você diria para um amigo nessa situação?',
      ],
    },
    reflexao:
      'Emagrecimento sustentável acontece em tons de cinza, não em preto e branco. Progresso, não perfeição.',
  },
  {
    id: 'cbt-003',
    titulo: 'Gatilhos Emocionais',
    subtitulo: 'Identifique o que dispara a compulsão alimentar',
    duracao_minutos: 6,
    categoria: 'comportamento',
    nivel: 'iniciante',
    conteudo: [
      {
        tipo: 'texto',
        conteudo:
          'Gatilhos são situações, emoções ou pensamentos que disparam comportamentos automáticos com comida.',
      },
      {
        tipo: 'exemplo',
        emoji: '😰',
        conteudo:
          'GATILHOS COMUNS: Estresse no trabalho, discussões, tédio, solidão, cansaço, assistir TV, final de semana.',
      },
      {
        tipo: 'texto',
        conteudo:
          'O ciclo do gatilho funciona assim: Gatilho → Emoção desconfortável → Comportamento automático (comer) → Alívio temporário → Culpa → Novo ciclo',
      },
      {
        tipo: 'dica',
        emoji: '💡',
        conteudo:
          'O objetivo não é eliminar gatilhos (impossível), mas criar uma "pausa" entre o gatilho e a reação automática.',
      },
    ],
    exercicio: {
      titulo: 'Mapeamento de Gatilhos',
      instrucoes: 'Reflita sobre seus últimos episódios de comer emocional:',
      tipo: 'reflexao',
      perguntas: [
        'O que aconteceu antes?',
        'Que emoção você estava sentindo?',
        'Onde você estava?',
        'Que horas eram?',
        'Havia um padrão?',
      ],
    },
    reflexao:
      'Conhecer seus gatilhos é o primeiro passo para criar estratégias de enfrentamento que não envolvam comida.',
  },
  {
    id: 'cbt-004',
    titulo: 'A Técnica PARE',
    subtitulo: 'Uma ferramenta para momentos de urgência alimentar',
    duracao_minutos: 4,
    categoria: 'comportamento',
    nivel: 'iniciante',
    conteudo: [
      {
        tipo: 'texto',
        conteudo:
          'Quando sentir urgência de comer por emoção, use a técnica PARE:',
      },
      {
        tipo: 'exemplo',
        emoji: '🛑',
        conteudo: 'P - PAUSE. Pare o que está fazendo por 30 segundos.',
      },
      {
        tipo: 'exemplo',
        emoji: '🔍',
        conteudo:
          'A - AVALIE. Pergunte: Estou com fome física? O que estou sentindo?',
      },
      {
        tipo: 'exemplo',
        emoji: '🧘',
        conteudo:
          'R - RESPIRE. Faça 5 respirações profundas, contando até 4 na inspiração e 6 na expiração.',
      },
      {
        tipo: 'exemplo',
        emoji: '🎯',
        conteudo:
          'E - ESCOLHA. Agora, escolha conscientemente o que fazer. Comer ou não, a escolha é sua.',
      },
      {
        tipo: 'dica',
        emoji: '💡',
        conteudo:
          'A urgência por comida emocional geralmente passa em 10-15 minutos. A técnica PARE te dá esse tempo.',
      },
    ],
    exercicio: {
      titulo: 'Prática do PARE',
      instrucoes: 'Use a técnica PARE 3 vezes hoje (não precisa ser com comida):',
      tipo: 'pratica',
      perguntas: [
        'Em que momento você usou?',
        'O que sentiu durante a pausa?',
        'Qual foi sua escolha consciente?',
      ],
    },
    reflexao:
      'Quanto mais você pratica o PARE, mais automático ele se torna. E você recupera o poder de escolha.',
  },
  {
    id: 'cbt-005',
    titulo: 'Autocompaixão',
    subtitulo: 'Trate-se como trataria um amigo querido',
    duracao_minutos: 5,
    categoria: 'autoestima',
    nivel: 'iniciante',
    conteudo: [
      {
        tipo: 'texto',
        conteudo:
          'Autocompaixão não é auto-indulgência ou desculpa. É reconhecer suas dificuldades com gentileza ao invés de crítica.',
      },
      {
        tipo: 'citacao',
        emoji: '💬',
        conteudo:
          '"Você não pode se criticar até se tornar alguém que você ama. Só amor gera amor." - Kristin Neff',
      },
      {
        tipo: 'exemplo',
        emoji: '❌',
        conteudo:
          'CRÍTICA INTERNA: "Você é fraco, não tem força de vontade, sempre desiste, não adianta tentar."',
      },
      {
        tipo: 'exemplo',
        emoji: '✅',
        conteudo:
          'AUTOCOMPAIXÃO: "Está sendo difícil. Muitas pessoas passam por isso. O que posso fazer agora para me ajudar?"',
      },
      {
        tipo: 'dica',
        emoji: '💡',
        conteudo:
          'Pergunte-se: "O que eu diria para um amigo querido nessa situação?" Diga isso para você mesmo.',
      },
    ],
    exercicio: {
      titulo: 'Carta de Compaixão',
      instrucoes:
        'Escreva uma carta para você mesmo, como se fosse um amigo querido passando pelo mesmo desafio:',
      tipo: 'diario',
      perguntas: [
        'Reconheça a dificuldade sem minimizar',
        'Lembre que você não está sozinho nisso',
        'Ofereça palavras de encorajamento genuíno',
      ],
    },
    reflexao:
      'Pesquisas mostram que autocompaixão é mais efetiva que autocrítica para mudança de comportamento sustentável.',
  },
  {
    id: 'cbt-006',
    titulo: 'Mindful Eating Básico',
    subtitulo: 'Comer com atenção plena',
    duracao_minutos: 5,
    categoria: 'comportamento',
    nivel: 'iniciante',
    conteudo: [
      {
        tipo: 'texto',
        conteudo:
          'Mindful eating é comer com atenção plena, percebendo sabores, texturas, saciedade e a experiência completa.',
      },
      {
        tipo: 'alerta',
        emoji: '⚠️',
        conteudo:
          'Comer distraído (TV, celular, computador) faz você comer até 50% mais sem perceber.',
      },
      {
        tipo: 'dica',
        emoji: '1️⃣',
        conteudo: 'Sente-se para comer. Nada de comer em pé ou andando.',
      },
      {
        tipo: 'dica',
        emoji: '2️⃣',
        conteudo: 'Desligue telas. Uma refeição, uma atenção.',
      },
      {
        tipo: 'dica',
        emoji: '3️⃣',
        conteudo:
          'Mastigue 20-30 vezes. Perceba a textura mudando.',
      },
      {
        tipo: 'dica',
        emoji: '4️⃣',
        conteudo:
          'Pause no meio da refeição. Pergunte: Ainda estou com fome?',
      },
    ],
    exercicio: {
      titulo: 'Uma Refeição Consciente',
      instrucoes: 'Escolha UMA refeição hoje para praticar mindful eating:',
      tipo: 'pratica',
      perguntas: [
        'Que diferença você notou no sabor?',
        'Comeu mais, menos ou igual?',
        'Como se sentiu depois?',
      ],
    },
    reflexao:
      'Não é sobre comer devagar sempre. É sobre reconectar com os sinais do seu corpo.',
  },
  {
    id: 'cbt-007',
    titulo: 'Recompensas Não-Alimentares',
    subtitulo: 'Quebrando a associação comida = prazer',
    duracao_minutos: 5,
    categoria: 'habitos',
    nivel: 'intermediario',
    conteudo: [
      {
        tipo: 'texto',
        conteudo:
          'Desde criança, aprendemos a associar comida com recompensa, celebração e conforto. Podemos criar novas associações.',
      },
      {
        tipo: 'exemplo',
        emoji: '🎯',
        conteudo:
          'Em vez de "vou me recompensar com chocolate", tente: um banho relaxante, episódio de série favorita, 15 min de hobby, mensagem para amigo.',
      },
      {
        tipo: 'dica',
        emoji: '💡',
        conteudo:
          'Crie uma lista de 10 recompensas que não envolvem comida. Tenha-a no celular para momentos de tentação.',
      },
      {
        tipo: 'alerta',
        emoji: '⚠️',
        conteudo:
          'Isso não significa que comida nunca pode ser prazerosa. Significa ter OUTRAS opções de prazer.',
      },
    ],
    exercicio: {
      titulo: 'Lista de Prazer',
      instrucoes: 'Crie sua lista pessoal de 10 recompensas não-alimentares:',
      tipo: 'diario',
      perguntas: [
        'O que te relaxa?',
        'O que te diverte?',
        'O que te faz sentir bem consigo mesmo?',
        'O que você adia por falta de tempo?',
      ],
    },
    reflexao:
      'Quanto mais você pratica recompensas não-alimentares, mais fácil fica acessá-las naturalmente.',
  },
  {
    id: 'cbt-008',
    titulo: 'O Poder do Ambiente',
    subtitulo: 'Redesenhe seu ambiente para facilitar boas escolhas',
    duracao_minutos: 5,
    categoria: 'habitos',
    nivel: 'intermediario',
    conteudo: [
      {
        tipo: 'texto',
        conteudo:
          'Força de vontade é um recurso limitado. Modificar o ambiente é mais efetivo do que depender da força de vontade.',
      },
      {
        tipo: 'dica',
        emoji: '🏠',
        conteudo:
          'COZINHA: Deixe frutas visíveis, esconda tentações, use pratos menores.',
      },
      {
        tipo: 'dica',
        emoji: '🛒',
        conteudo:
          'COMPRAS: Vá alimentado, com lista, evite corredores de tentação.',
      },
      {
        tipo: 'dica',
        emoji: '💼',
        conteudo:
          'TRABALHO: Leve lanches saudáveis, não deixe dinheiro para máquinas.',
      },
      {
        tipo: 'dica',
        emoji: '📱',
        conteudo:
          'DIGITAL: Desinstale apps de delivery, silencie promoções de comida.',
      },
    ],
    exercicio: {
      titulo: 'Auditoria do Ambiente',
      instrucoes: 'Escolha UM ambiente para modificar esta semana:',
      tipo: 'reflexao',
      perguntas: [
        'Que tentações posso remover ou esconder?',
        'Que opções saudáveis posso tornar mais visíveis/fáceis?',
        'Que "gatilhos ambientais" posso eliminar?',
      ],
    },
    reflexao:
      'Pessoas com sucesso em emagrecimento não têm mais força de vontade. Elas criam ambientes que não exigem tanta.',
  },
]

// Calcular lição do dia baseada na data
export function getLicaoDoDia(data: Date = new Date()): CBTLesson {
  const inicioDaJornada = new Date('2024-01-01')
  const diff = Math.floor(
    (data.getTime() - inicioDaJornada.getTime()) / (1000 * 60 * 60 * 24)
  )
  const index = diff % LICOES_CBT.length
  return LICOES_CBT[index]
}

// Buscar lições por categoria
export function getLicoesPorCategoria(categoria: CategoriaCBT): CBTLesson[] {
  return LICOES_CBT.filter((l) => l.categoria === categoria)
}
