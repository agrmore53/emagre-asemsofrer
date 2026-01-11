// Sistema de Video Progress - Antes/Depois

export interface VideoEntry {
  id: string
  user_id: string
  tipo: 'antes' | 'durante' | 'depois'
  data: string
  peso_kg?: number
  video_url: string
  thumbnail_url?: string
  descricao?: string
  is_public: boolean
  created_at: string
}

export interface TransformationPair {
  antes: VideoEntry
  depois: VideoEntry
  dias_diferenca: number
  peso_perdido: number
  percentual_perdido: number
}

export interface VideoUploadResult {
  success: boolean
  url?: string
  error?: string
}

// Marcos de progresso para vídeos
export const MARCOS_VIDEO = [
  { dias: 0, tipo: 'antes' as const, titulo: 'Início da Jornada', descricao: 'Seu ponto de partida' },
  { dias: 7, tipo: 'durante' as const, titulo: '1 Semana', descricao: 'Primeira semana completada!' },
  { dias: 14, tipo: 'durante' as const, titulo: '2 Semanas', descricao: 'Meio mês de dedicação' },
  { dias: 30, tipo: 'durante' as const, titulo: '1 Mês', descricao: 'Marco de um mês!' },
  { dias: 60, tipo: 'durante' as const, titulo: '2 Meses', descricao: 'Dois meses de progresso' },
  { dias: 90, tipo: 'depois' as const, titulo: '3 Meses', descricao: 'Transformação completa!' },
]

// Dicas para gravação de vídeo
export const DICAS_GRAVACAO = [
  {
    titulo: 'Iluminação',
    icone: '💡',
    dica: 'Grave em local bem iluminado, de preferência com luz natural'
  },
  {
    titulo: 'Posição',
    icone: '📐',
    dica: 'Mantenha a mesma distância e ângulo em todos os vídeos'
  },
  {
    titulo: 'Roupa',
    icone: '👕',
    dica: 'Use roupas justas ou de academia para mostrar o progresso'
  },
  {
    titulo: 'Fundo',
    icone: '🏠',
    dica: 'Use o mesmo local/fundo para facilitar a comparação'
  },
  {
    titulo: 'Duração',
    icone: '⏱️',
    dica: 'Vídeos de 10-30 segundos são ideais'
  },
  {
    titulo: 'Poses',
    icone: '🧍',
    dica: 'Faça poses de frente, lado e costas para ver todas as mudanças'
  },
]

// Poses sugeridas para o vídeo
export const POSES_SUGERIDAS = [
  { nome: 'Frente relaxado', descricao: 'De frente, braços ao lado do corpo' },
  { nome: 'Frente contraído', descricao: 'De frente, flexionando músculos' },
  { nome: 'Perfil esquerdo', descricao: 'Virado para a esquerda' },
  { nome: 'Perfil direito', descricao: 'Virado para a direita' },
  { nome: 'Costas', descricao: 'De costas para a câmera' },
  { nome: 'Giro completo', descricao: 'Gire 360° lentamente' },
]

// Calcular progresso entre dois vídeos
export function calcularTransformacao(antes: VideoEntry, depois: VideoEntry): TransformationPair | null {
  if (!antes.peso_kg || !depois.peso_kg) return null

  const dataAntes = new Date(antes.data)
  const dataDepois = new Date(depois.data)
  const dias_diferenca = Math.floor((dataDepois.getTime() - dataAntes.getTime()) / (1000 * 60 * 60 * 24))

  const peso_perdido = antes.peso_kg - depois.peso_kg
  const percentual_perdido = (peso_perdido / antes.peso_kg) * 100

  return {
    antes,
    depois,
    dias_diferenca,
    peso_perdido: Math.round(peso_perdido * 10) / 10,
    percentual_perdido: Math.round(percentual_perdido * 10) / 10
  }
}

// Verificar suporte a gravação de vídeo
export function verificarSuporteVideo(): boolean {
  if (typeof navigator === 'undefined') return false
  return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)
}

// Verificar se é mobile (câmera traseira disponível)
export function isMobile(): boolean {
  if (typeof navigator === 'undefined') return false
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
}

// Formatar duração do vídeo
export function formatarDuracao(segundos: number): string {
  const mins = Math.floor(segundos / 60)
  const secs = segundos % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

// Calcular próximo marco
export function proximoMarco(diasDesdeInicio: number): typeof MARCOS_VIDEO[0] | null {
  return MARCOS_VIDEO.find(marco => marco.dias > diasDesdeInicio) || null
}

// Gerar thumbnail de vídeo (em produção, usaria serviço como Mux ou Cloudinary)
export async function gerarThumbnail(videoFile: File): Promise<string> {
  return new Promise((resolve) => {
    const video = document.createElement('video')
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    video.onloadedmetadata = () => {
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
    }

    video.onseeked = () => {
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
        resolve(canvas.toDataURL('image/jpeg', 0.7))
      }
    }

    video.src = URL.createObjectURL(videoFile)
    video.currentTime = 0.5 // Captura frame em 0.5s
  })
}

// Comprimir vídeo (básico - em produção usaria FFmpeg.wasm ou backend)
export function getVideoConstraints(qualidade: 'baixa' | 'media' | 'alta' = 'media'): MediaStreamConstraints {
  const configs = {
    baixa: { width: 640, height: 480, frameRate: 15 },
    media: { width: 1280, height: 720, frameRate: 30 },
    alta: { width: 1920, height: 1080, frameRate: 30 }
  }

  const config = configs[qualidade]

  return {
    video: {
      facingMode: 'environment', // Câmera traseira em mobile
      width: { ideal: config.width },
      height: { ideal: config.height },
      frameRate: { ideal: config.frameRate }
    },
    audio: false
  }
}
