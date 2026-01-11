'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { ShoppingCart, Copy, Check, Printer } from 'lucide-react'
import { toast } from 'sonner'
import type { Alimento, CategoriaAlimento } from '@/lib/data/alimentos'

interface ItemCompra {
  alimento: Alimento
  quantidadeTotal: number
  unidade: string
}

interface ListaComprasProps {
  itens: ItemCompra[]
}

const CATEGORIAS_NOMES: Record<CategoriaAlimento, string> = {
  proteina: 'Proteínas',
  carboidrato: 'Carboidratos',
  vegetal: 'Vegetais',
  fruta: 'Frutas',
  gordura_boa: 'Gorduras Boas',
  laticinio: 'Laticínios',
  bebida: 'Bebidas',
}

const CATEGORIAS_ORDEM: CategoriaAlimento[] = [
  'proteina',
  'vegetal',
  'fruta',
  'carboidrato',
  'laticinio',
  'gordura_boa',
  'bebida',
]

export function ListaCompras({ itens }: ListaComprasProps) {
  const [marcados, setMarcados] = useState<Set<string>>(new Set())
  const [copiado, setCopiado] = useState(false)

  // Agrupa por categoria
  const itensPorCategoria = CATEGORIAS_ORDEM.reduce((acc, categoria) => {
    const itensCategoria = itens.filter((i) => i.alimento.categoria === categoria)
    if (itensCategoria.length > 0) {
      acc[categoria] = itensCategoria
    }
    return acc
  }, {} as Record<CategoriaAlimento, ItemCompra[]>)

  const toggleMarcado = (id: string) => {
    const novosMarcados = new Set(marcados)
    if (novosMarcados.has(id)) {
      novosMarcados.delete(id)
    } else {
      novosMarcados.add(id)
    }
    setMarcados(novosMarcados)
  }

  const formatarQuantidade = (item: ItemCompra): string => {
    if (item.quantidadeTotal >= 1000) {
      return `${(item.quantidadeTotal / 1000).toFixed(1)}kg`
    }
    return `${item.quantidadeTotal}g`
  }

  const copiarLista = () => {
    const texto = Object.entries(itensPorCategoria)
      .map(([categoria, itensCategoria]) => {
        const nomeCategoria = CATEGORIAS_NOMES[categoria as CategoriaAlimento]
        const listaItens = itensCategoria
          .map((item) => `  • ${item.alimento.nome} - ${formatarQuantidade(item)}`)
          .join('\n')
        return `${nomeCategoria}:\n${listaItens}`
      })
      .join('\n\n')

    navigator.clipboard.writeText(texto)
    setCopiado(true)
    toast.success('Lista copiada!')
    setTimeout(() => setCopiado(false), 2000)
  }

  const imprimirLista = () => {
    const printWindow = window.open('', '_blank')
    if (!printWindow) return

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Lista de Compras - Emagreça Sem Sofrer</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { font-size: 18px; margin-bottom: 20px; }
            h2 { font-size: 14px; margin: 15px 0 10px; color: #666; }
            ul { list-style: none; padding: 0; margin: 0; }
            li { padding: 5px 0; border-bottom: 1px dotted #ddd; }
            .quantidade { color: #888; }
            @media print { button { display: none; } }
          </style>
        </head>
        <body>
          <h1>Lista de Compras</h1>
          ${Object.entries(itensPorCategoria)
            .map(
              ([categoria, itensCategoria]) => `
              <h2>${CATEGORIAS_NOMES[categoria as CategoriaAlimento]}</h2>
              <ul>
                ${itensCategoria
                  .map(
                    (item) => `
                  <li>
                    ☐ ${item.alimento.nome}
                    <span class="quantidade">(${formatarQuantidade(item)})</span>
                  </li>
                `
                  )
                  .join('')}
              </ul>
            `
            )
            .join('')}
          <script>window.print();</script>
        </body>
      </html>
    `

    printWindow.document.write(html)
    printWindow.document.close()
  }

  const totalItens = itens.length
  const itensMarcados = marcados.size
  const progresso = totalItens > 0 ? Math.round((itensMarcados / totalItens) * 100) : 0

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-primary" />
            <div>
              <CardTitle className="text-lg">Lista de Compras</CardTitle>
              <CardDescription>
                {totalItens} itens • {itensMarcados} marcados ({progresso}%)
              </CardDescription>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={copiarLista}>
              {copiado ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
            <Button variant="outline" size="sm" onClick={imprimirLista}>
              <Printer className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {Object.entries(itensPorCategoria).map(([categoria, itensCategoria]) => (
          <div key={categoria}>
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="outline" className="font-medium">
                {CATEGORIAS_NOMES[categoria as CategoriaAlimento]}
              </Badge>
              <span className="text-xs text-muted-foreground">
                ({itensCategoria.length} itens)
              </span>
            </div>

            <div className="space-y-2">
              {itensCategoria.map((item) => {
                const isMarcado = marcados.has(item.alimento.id)
                return (
                  <div
                    key={item.alimento.id}
                    className={`flex items-center gap-3 p-2 rounded-lg border transition-colors ${
                      isMarcado ? 'bg-muted/50 opacity-60' : 'hover:bg-muted/30'
                    }`}
                  >
                    <Checkbox
                      checked={isMarcado}
                      onCheckedChange={() => toggleMarcado(item.alimento.id)}
                    />
                    <div className="flex-1">
                      <span className={isMarcado ? 'line-through' : ''}>
                        {item.alimento.nome}
                      </span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {formatarQuantidade(item)}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
