// Dados de demonstracao para o sistema funcionar sem banco de dados

export const DEMO_USER = {
  id: 'demo-user-123',
  email: 'maria@demo.com',
  user_metadata: {
    nome: 'Maria Silva',
  },
}

export const DEMO_PROFILE = {
  id: 'demo-user-123',
  nome: 'Maria Silva',
  email: 'maria@demo.com',
  peso_inicial: 78,
  peso_meta: 65,
  altura_cm: 165,
  sexo: 'feminino',
  data_nascimento: '1985-03-15',
  nivel_atividade: 'moderado',
  plano: 'premium',
  created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 dias atras
}

export const DEMO_TRACKER_REGISTROS = [
  { id: 'rec-1', user_id: 'demo-user-123', data: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], peso_kg: 78, cintura_cm: 90, quadril_cm: 105 },
  { id: 'rec-2', user_id: 'demo-user-123', data: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], peso_kg: 77.5, cintura_cm: 89, quadril_cm: 104 },
  { id: 'rec-3', user_id: 'demo-user-123', data: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], peso_kg: 76.8, cintura_cm: 88, quadril_cm: 103 },
  { id: 'rec-4', user_id: 'demo-user-123', data: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], peso_kg: 76.2, cintura_cm: 87, quadril_cm: 102 },
  { id: 'rec-5', user_id: 'demo-user-123', data: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], peso_kg: 75.5, cintura_cm: 86, quadril_cm: 101 },
  { id: 'rec-6', user_id: 'demo-user-123', data: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], peso_kg: 74.8, cintura_cm: 85, quadril_cm: 100 },
  { id: 'rec-7', user_id: 'demo-user-123', data: new Date().toISOString().split('T')[0], peso_kg: 74.2, cintura_cm: 84, quadril_cm: 99 },
]

export const DEMO_CONTEUDO_PROGRESSO = [
  { id: 'prog-1', user_id: 'demo-user-123', capitulo_id: 'cap-1', concluido: true, concluido_em: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'prog-2', user_id: 'demo-user-123', capitulo_id: 'cap-2', concluido: true, concluido_em: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'prog-3', user_id: 'demo-user-123', capitulo_id: 'cap-3', concluido: true, concluido_em: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'prog-4', user_id: 'demo-user-123', capitulo_id: 'cap-4', concluido: true, concluido_em: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'prog-5', user_id: 'demo-user-123', capitulo_id: 'cap-5', concluido: false, concluido_em: null },
]

export const DEMO_STREAK = {
  id: 'streak-1',
  user_id: 'demo-user-123',
  streak_atual: 12,
  maior_streak: 15,
  ultimo_registro: new Date().toISOString().split('T')[0],
}

export const DEMO_CONQUISTAS = [
  { id: 'conq-1', codigo: 'primeiro-registro', nome: 'Primeiro Passo', descricao: 'Fez seu primeiro registro de peso', icone: '🎯', pontos: 10, ordem: 1 },
  { id: 'conq-2', codigo: 'streak-7', nome: 'Semana Firme', descricao: '7 dias consecutivos de registro', icone: '🔥', pontos: 50, ordem: 2 },
  { id: 'conq-3', codigo: 'streak-30', nome: 'Mes de Ouro', descricao: '30 dias consecutivos de registro', icone: '🏆', pontos: 200, ordem: 3 },
  { id: 'conq-4', codigo: 'primeiro-kg', nome: 'Primeiro Quilo', descricao: 'Perdeu seu primeiro quilograma', icone: '⚖️', pontos: 100, ordem: 4 },
  { id: 'conq-5', codigo: 'cinco-kg', nome: 'Cinco Quilos', descricao: 'Perdeu 5 quilogramas', icone: '💪', pontos: 300, ordem: 5 },
  { id: 'conq-6', codigo: 'cap-1', nome: 'Leitor Iniciante', descricao: 'Completou o primeiro capitulo', icone: '📖', pontos: 20, ordem: 6 },
  { id: 'conq-7', codigo: 'cap-todos', nome: 'Estudioso', descricao: 'Completou todos os capitulos', icone: '🎓', pontos: 500, ordem: 7 },
  { id: 'conq-8', codigo: 'cardapio-1', nome: 'Planejador', descricao: 'Gerou seu primeiro cardapio', icone: '🍽️', pontos: 30, ordem: 8 },
]

export const DEMO_USUARIO_CONQUISTAS = [
  { id: 'uc-1', user_id: 'demo-user-123', conquista_id: 'conq-1', desbloqueada_em: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), conquista: DEMO_CONQUISTAS[0] },
  { id: 'uc-2', user_id: 'demo-user-123', conquista_id: 'conq-2', desbloqueada_em: new Date(Date.now() - 23 * 24 * 60 * 60 * 1000).toISOString(), conquista: DEMO_CONQUISTAS[1] },
  { id: 'uc-3', user_id: 'demo-user-123', conquista_id: 'conq-4', desbloqueada_em: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(), conquista: DEMO_CONQUISTAS[3] },
  { id: 'uc-4', user_id: 'demo-user-123', conquista_id: 'conq-6', desbloqueada_em: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(), conquista: DEMO_CONQUISTAS[5] },
  { id: 'uc-5', user_id: 'demo-user-123', conquista_id: 'conq-8', desbloqueada_em: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), conquista: DEMO_CONQUISTAS[7] },
]

export const DEMO_CARDAPIOS = [
  {
    id: 'card-1',
    user_id: 'demo-user-123',
    data: new Date().toISOString().split('T')[0],
    calorias_total: 1400,
    refeicoes: {
      cafe_manha: {
        nome: 'Cafe da Manha',
        horario: '07:00',
        alimentos: [
          { nome: 'Ovo mexido (2 unidades)', calorias: 180, proteinas: 12, carboidratos: 2, gorduras: 14 },
          { nome: 'Pao integral (1 fatia)', calorias: 70, proteinas: 3, carboidratos: 12, gorduras: 1 },
          { nome: 'Cafe com leite desnatado', calorias: 50, proteinas: 4, carboidratos: 6, gorduras: 0 },
        ]
      },
      lanche_manha: {
        nome: 'Lanche da Manha',
        horario: '10:00',
        alimentos: [
          { nome: 'Maca (1 unidade)', calorias: 95, proteinas: 0, carboidratos: 25, gorduras: 0 },
          { nome: 'Castanhas (10 unidades)', calorias: 80, proteinas: 2, carboidratos: 3, gorduras: 7 },
        ]
      },
      almoco: {
        nome: 'Almoco',
        horario: '12:30',
        alimentos: [
          { nome: 'Frango grelhado (120g)', calorias: 165, proteinas: 31, carboidratos: 0, gorduras: 4 },
          { nome: 'Arroz integral (4 colheres)', calorias: 110, proteinas: 2, carboidratos: 23, gorduras: 1 },
          { nome: 'Feijao (2 colheres)', calorias: 70, proteinas: 4, carboidratos: 13, gorduras: 0 },
          { nome: 'Salada verde', calorias: 20, proteinas: 1, carboidratos: 4, gorduras: 0 },
        ]
      },
      lanche_tarde: {
        nome: 'Lanche da Tarde',
        horario: '16:00',
        alimentos: [
          { nome: 'Iogurte natural', calorias: 100, proteinas: 8, carboidratos: 12, gorduras: 2 },
          { nome: 'Granola (2 colheres)', calorias: 80, proteinas: 2, carboidratos: 14, gorduras: 2 },
        ]
      },
      jantar: {
        nome: 'Jantar',
        horario: '19:30',
        alimentos: [
          { nome: 'Peixe assado (120g)', calorias: 140, proteinas: 26, carboidratos: 0, gorduras: 3 },
          { nome: 'Legumes no vapor', calorias: 50, proteinas: 2, carboidratos: 10, gorduras: 0 },
          { nome: 'Batata doce (100g)', calorias: 90, proteinas: 2, carboidratos: 21, gorduras: 0 },
        ]
      }
    },
    created_at: new Date().toISOString(),
  }
]

export const DEMO_CHALLENGES = [
  {
    id: 'chal-1',
    nome: 'Desafio 30 Dias',
    descricao: 'Perca peso por 30 dias consecutivos',
    criador_id: 'outro-user',
    data_inicio: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    data_fim: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    meta_tipo: 'peso_perdido',
    meta_valor: 3,
    status: 'ativo',
    participantes_count: 5,
  },
  {
    id: 'chal-2',
    nome: 'Verao Fitness',
    descricao: 'Prepare-se para o verao!',
    criador_id: 'demo-user-123',
    data_inicio: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    data_fim: new Date(Date.now() + 55 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    meta_tipo: 'peso_perdido',
    meta_valor: 5,
    status: 'ativo',
    participantes_count: 8,
  }
]
