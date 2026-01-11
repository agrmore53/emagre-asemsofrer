// Sistema de Scanner de Código de Barras - Produtos Brasileiros

export interface ProdutoInfo {
  codigo: string
  nome: string
  marca?: string
  porcao: string
  calorias: number
  proteinas: number
  carboidratos: number
  gorduras: number
  fibras?: number
  sodio?: number
  categoria: CategoriaProduto
  imagem_url?: string
}

export type CategoriaProduto =
  | 'bebidas'
  | 'laticinios'
  | 'carnes'
  | 'graos'
  | 'frutas'
  | 'vegetais'
  | 'snacks'
  | 'processados'
  | 'outros'

export const CATEGORIAS_PRODUTO: Record<CategoriaProduto, { nome: string; icone: string }> = {
  bebidas: { nome: 'Bebidas', icone: '🥤' },
  laticinios: { nome: 'Laticínios', icone: '🥛' },
  carnes: { nome: 'Carnes', icone: '🥩' },
  graos: { nome: 'Grãos', icone: '🌾' },
  frutas: { nome: 'Frutas', icone: '🍎' },
  vegetais: { nome: 'Vegetais', icone: '🥗' },
  snacks: { nome: 'Snacks', icone: '🍿' },
  processados: { nome: 'Processados', icone: '🍔' },
  outros: { nome: 'Outros', icone: '📦' },
}

// Base de dados local de produtos brasileiros populares
// Em produção, isso viria de uma API como Open Food Facts
export const PRODUTOS_BR: Record<string, ProdutoInfo> = {
  '7891000100103': {
    codigo: '7891000100103',
    nome: 'Leite Integral',
    marca: 'Ninho',
    porcao: '200ml',
    calorias: 124,
    proteinas: 6,
    carboidratos: 9.4,
    gorduras: 6.4,
    categoria: 'laticinios',
  },
  '7891910000197': {
    codigo: '7891910000197',
    nome: 'Iogurte Natural',
    marca: 'Nestlé',
    porcao: '170g',
    calorias: 95,
    proteinas: 5.5,
    carboidratos: 8,
    gorduras: 4.5,
    categoria: 'laticinios',
  },
  '7896045104574': {
    codigo: '7896045104574',
    nome: 'Peito de Frango',
    marca: 'Sadia',
    porcao: '100g',
    calorias: 159,
    proteinas: 32,
    carboidratos: 0,
    gorduras: 3,
    categoria: 'carnes',
  },
  '7891149103010': {
    codigo: '7891149103010',
    nome: 'Arroz Integral',
    marca: 'Camil',
    porcao: '50g (cru)',
    calorias: 175,
    proteinas: 3.5,
    carboidratos: 37,
    gorduras: 1.5,
    fibras: 2,
    categoria: 'graos',
  },
  '7891000053508': {
    codigo: '7891000053508',
    nome: 'Feijão Preto',
    marca: 'Camil',
    porcao: '50g (cru)',
    calorias: 165,
    proteinas: 10,
    carboidratos: 30,
    gorduras: 0.5,
    fibras: 8,
    categoria: 'graos',
  },
  '7894900011517': {
    codigo: '7894900011517',
    nome: 'Coca-Cola Zero',
    marca: 'Coca-Cola',
    porcao: '350ml',
    calorias: 0,
    proteinas: 0,
    carboidratos: 0,
    gorduras: 0,
    categoria: 'bebidas',
  },
  '7891000315040': {
    codigo: '7891000315040',
    nome: 'Aveia em Flocos',
    marca: 'Quaker',
    porcao: '30g',
    calorias: 110,
    proteinas: 4,
    carboidratos: 20,
    gorduras: 2,
    fibras: 3,
    categoria: 'graos',
  },
  '7896004400013': {
    codigo: '7896004400013',
    nome: 'Ovo de Galinha',
    marca: 'Mantiqueira',
    porcao: '1 unidade (50g)',
    calorias: 72,
    proteinas: 6,
    carboidratos: 0.4,
    gorduras: 5,
    categoria: 'outros',
  },
  '7891000244203': {
    codigo: '7891000244203',
    nome: 'Banana Passa',
    marca: 'Nestlé',
    porcao: '25g',
    calorias: 80,
    proteinas: 0.8,
    carboidratos: 20,
    gorduras: 0,
    fibras: 1.5,
    categoria: 'frutas',
  },
  '7896036093085': {
    codigo: '7896036093085',
    nome: 'Whey Protein',
    marca: 'Growth',
    porcao: '30g',
    calorias: 115,
    proteinas: 24,
    carboidratos: 2,
    gorduras: 1.5,
    categoria: 'outros',
  },
}

// Buscar produto local
export function buscarProdutoLocal(codigo: string): ProdutoInfo | null {
  return PRODUTOS_BR[codigo] || null
}

// Buscar produto na API Open Food Facts (fallback)
export async function buscarProdutoAPI(codigo: string): Promise<ProdutoInfo | null> {
  try {
    const response = await fetch(
      `https://world.openfoodfacts.org/api/v0/product/${codigo}.json`
    )
    const data = await response.json()

    if (data.status !== 1 || !data.product) {
      return null
    }

    const p = data.product
    const nutriments = p.nutriments || {}

    return {
      codigo,
      nome: p.product_name_pt || p.product_name || 'Produto sem nome',
      marca: p.brands,
      porcao: p.serving_size || '100g',
      calorias: Math.round(nutriments['energy-kcal_100g'] || nutriments['energy-kcal'] || 0),
      proteinas: Math.round((nutriments.proteins_100g || 0) * 10) / 10,
      carboidratos: Math.round((nutriments.carbohydrates_100g || 0) * 10) / 10,
      gorduras: Math.round((nutriments.fat_100g || 0) * 10) / 10,
      fibras: nutriments.fiber_100g,
      sodio: nutriments.sodium_100g ? Math.round(nutriments.sodium_100g * 1000) : undefined,
      categoria: detectarCategoria(p.categories_tags || []),
      imagem_url: p.image_url,
    }
  } catch (error) {
    console.error('Erro ao buscar produto:', error)
    return null
  }
}

// Detectar categoria baseado nas tags
function detectarCategoria(tags: string[]): CategoriaProduto {
  const tagsStr = tags.join(' ').toLowerCase()

  if (tagsStr.includes('beverage') || tagsStr.includes('drink')) return 'bebidas'
  if (tagsStr.includes('dairy') || tagsStr.includes('milk') || tagsStr.includes('yogurt')) return 'laticinios'
  if (tagsStr.includes('meat') || tagsStr.includes('chicken') || tagsStr.includes('beef')) return 'carnes'
  if (tagsStr.includes('cereal') || tagsStr.includes('rice') || tagsStr.includes('bean')) return 'graos'
  if (tagsStr.includes('fruit')) return 'frutas'
  if (tagsStr.includes('vegetable') || tagsStr.includes('salad')) return 'vegetais'
  if (tagsStr.includes('snack') || tagsStr.includes('chip')) return 'snacks'
  if (tagsStr.includes('processed') || tagsStr.includes('fast-food')) return 'processados'

  return 'outros'
}

// Verificar suporte à câmera
export function verificarSuporteCamera(): boolean {
  if (typeof navigator === 'undefined') return false
  return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)
}
