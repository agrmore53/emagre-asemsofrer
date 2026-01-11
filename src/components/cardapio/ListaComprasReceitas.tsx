'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import {
  ShoppingCart,
  Download,
  Share2,
  Check,
  Lightbulb,
  Package,
  Search,
  Printer,
} from 'lucide-react'
import { toast } from 'sonner'
import type { ListaComprasInteligente, ItemListaCompras } from '@/lib/cardapio/motor-recomendacao'

interface ListaComprasReceitasProps {
  lista: ListaComprasInteligente
}

const CATEGORIA_ICONES: Record<string, string> = {
  'Carnes e Proteinas': '🥩',
  'Graos e Cereais': '🌾',
  'Hortifruti': '🥬',
  'Oleos e Gorduras': '🫒',
  'Temperos e Condimentos': '🧂',
  'Laticinios': '🧀',
  'Outros': '📦',
}

export function ListaComprasReceitas({ lista }: ListaComprasReceitasProps) {
  const [itensComprados, setItensComprados] = useState<Set<string>>(new Set())
  const [busca, setBusca] = useState('')

  const toggleItem = (itemId: string) => {
    const novosItens = new Set(itensComprados)
    if (novosItens.has(itemId)) {
      novosItens.delete(itemId)
    } else {
      novosItens.add(itemId)
    }
    setItensComprados(novosItens)
  }

  const marcarTodosCategoria = (categoria: string) => {
    const itensCategoria = lista.porCategoria[categoria] || []
    const novosItens = new Set(itensComprados)

    const todosComprados = itensCategoria.every((item) =>
      novosItens.has(`${item.ingrediente}-${item.unidade}`)
    )

    itensCategoria.forEach((item) => {
      const itemId = `${item.ingrediente}-${item.unidade}`
      if (todosComprados) {
        novosItens.delete(itemId)
      } else {
        novosItens.add(itemId)
      }
    })

    setItensComprados(novosItens)
  }

  const progresso = Math.round((itensComprados.size / lista.totalItens) * 100)

  // Filtra itens por busca
  const itensFiltraPorCategoria = (categoria: string): ItemListaCompras[] => {
    const itens = lista.porCategoria[categoria] || []
    if (!busca) return itens
    return itens.filter((item) =>
      item.ingrediente.toLowerCase().includes(busca.toLowerCase())
    )
  }

  const exportarLista = () => {
    let texto = `LISTA DE COMPRAS\n${'='.repeat(40)}\n`
    texto += `Periodo: ${lista.semana}\n\n`

    Object.entries(lista.porCategoria).forEach(([categoria, itens]) => {
      texto += `\n${CATEGORIA_ICONES[categoria] || '📦'} ${categoria.toUpperCase()}\n`
      texto += '-'.repeat(30) + '\n'
      itens.forEach((item) => {
        const comprado = itensComprados.has(`${item.ingrediente}-${item.unidade}`)
        texto += `${comprado ? '[X]' : '[ ]'} ${item.ingrediente}`
        texto += ` - ${item.quantidadeTotal} ${item.unidade}\n`
      })
    })

    texto += `\n${'='.repeat(40)}\n`
    texto += `DICAS DE COMPRA\n`
    lista.dicasCompra.forEach((dica) => {
      texto += `• ${dica}\n`
    })

    const blob = new Blob([texto], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `lista-compras.txt`
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Lista exportada!')
  }

  const compartilharLista = async () => {
    let texto = `🛒 LISTA DE COMPRAS\n\n`

    Object.entries(lista.porCategoria).forEach(([categoria, itens]) => {
      texto += `${CATEGORIA_ICONES[categoria] || '📦'} ${categoria}\n`
      itens.forEach((item) => {
        texto += `  • ${item.ingrediente}: ${item.quantidadeTotal}${item.unidade}\n`
      })
      texto += '\n'
    })

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Lista de Compras',
          text: texto,
        })
      } catch {
        await navigator.clipboard.writeText(texto)
        toast.success('Lista copiada!')
      }
    } else {
      await navigator.clipboard.writeText(texto)
      toast.success('Lista copiada para area de transferencia!')
    }
  }

  const imprimirLista = () => {
    const printWindow = window.open('', '_blank')
    if (!printWindow) {
      toast.error('Bloqueador de pop-up ativo')
      return
    }

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Lista de Compras</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto; }
            h1 { font-size: 20px; border-bottom: 2px solid #000; padding-bottom: 10px; }
            h2 { font-size: 14px; color: #666; margin-top: 20px; margin-bottom: 10px; }
            ul { list-style: none; padding: 0; margin: 0; }
            li { padding: 8px 0; border-bottom: 1px dotted #ddd; display: flex; align-items: center; }
            .checkbox { width: 20px; height: 20px; border: 2px solid #333; margin-right: 10px; }
            .quantidade { margin-left: auto; color: #666; }
            .dicas { background: #fffbeb; padding: 15px; border-radius: 8px; margin-top: 20px; }
            .dicas h3 { margin: 0 0 10px; font-size: 14px; }
            .dicas li { border: none; padding: 4px 0; }
            @media print { body { padding: 0; } }
          </style>
        </head>
        <body>
          <h1>🛒 Lista de Compras</h1>
          <p style="color: #666; font-size: 12px;">${lista.semana}</p>

          ${Object.entries(lista.porCategoria)
            .map(([categoria, itens]) => `
              <h2>${CATEGORIA_ICONES[categoria] || '📦'} ${categoria}</h2>
              <ul>
                ${itens.map((item) => `
                  <li>
                    <div class="checkbox"></div>
                    <span>${item.ingrediente}</span>
                    <span class="quantidade">${item.quantidadeTotal} ${item.unidade}</span>
                  </li>
                `).join('')}
              </ul>
            `).join('')}

          <div class="dicas">
            <h3>💡 Dicas</h3>
            <ul>
              ${lista.dicasCompra.map((dica) => `<li>• ${dica}</li>`).join('')}
            </ul>
          </div>

          <script>window.print(); window.close();</script>
        </body>
      </html>
    `

    printWindow.document.write(html)
    printWindow.document.close()
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Lista de Compras
            </CardTitle>
            <CardDescription>{lista.semana}</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={imprimirLista}>
              <Printer className="h-4 w-4 mr-1" />
              Imprimir
            </Button>
            <Button variant="outline" size="sm" onClick={exportarLista}>
              <Download className="h-4 w-4 mr-1" />
              Exportar
            </Button>
            <Button variant="outline" size="sm" onClick={compartilharLista}>
              <Share2 className="h-4 w-4 mr-1" />
              Compartilhar
            </Button>
          </div>
        </div>

        {/* Barra de progresso */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="text-muted-foreground">
              {itensComprados.size} de {lista.totalItens} itens
            </span>
            <span className="font-medium">{progresso}% concluido</span>
          </div>
          <div className="h-3 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-green-400 to-green-600 transition-all duration-300"
              style={{ width: `${progresso}%` }}
            />
          </div>
        </div>

        {/* Campo de busca */}
        <div className="relative mt-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar ingrediente..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="pl-9"
          />
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Dicas de compra */}
        <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
          <h4 className="font-medium text-amber-800 flex items-center gap-2 mb-2">
            <Lightbulb className="h-4 w-4" />
            Dicas de Compra
          </h4>
          <ul className="space-y-1">
            {lista.dicasCompra.map((dica, i) => (
              <li key={i} className="text-sm text-amber-700 flex items-start gap-2">
                <span className="text-amber-500">•</span>
                <span>{dica}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Lista por categoria */}
        <Accordion type="multiple" defaultValue={Object.keys(lista.porCategoria)}>
          {Object.entries(lista.porCategoria).map(([categoria, itens]) => {
            const itensFiltrados = itensFiltraPorCategoria(categoria)
            const itensCompradosCategoria = itensFiltrados.filter((item) =>
              itensComprados.has(`${item.ingrediente}-${item.unidade}`)
            ).length

            if (itensFiltrados.length === 0) return null

            return (
              <AccordionItem key={categoria} value={categoria}>
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-3 flex-1">
                    <span className="text-2xl">
                      {CATEGORIA_ICONES[categoria] || '📦'}
                    </span>
                    <span className="font-medium">{categoria}</span>
                    <Badge
                      variant={
                        itensCompradosCategoria === itensFiltrados.length
                          ? 'default'
                          : 'secondary'
                      }
                      className="ml-auto mr-2"
                    >
                      {itensCompradosCategoria}/{itensFiltrados.length}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 px-2"
                      onClick={(e) => {
                        e.stopPropagation()
                        marcarTodosCategoria(categoria)
                      }}
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2 pl-10">
                    {itensFiltrados.map((item, i) => {
                      const itemId = `${item.ingrediente}-${item.unidade}`
                      const comprado = itensComprados.has(itemId)

                      return (
                        <div
                          key={i}
                          className={`flex items-center justify-between p-3 rounded-lg transition-all cursor-pointer ${
                            comprado
                              ? 'bg-green-50 border border-green-200'
                              : 'bg-muted/50 hover:bg-muted border border-transparent'
                          }`}
                          onClick={() => toggleItem(itemId)}
                        >
                          <div className="flex items-center gap-3">
                            <Checkbox
                              checked={comprado}
                              onCheckedChange={() => toggleItem(itemId)}
                            />
                            <span
                              className={
                                comprado
                                  ? 'line-through text-muted-foreground'
                                  : ''
                              }
                            >
                              {item.ingrediente}
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="font-medium">
                              {item.quantidadeTotal} {item.unidade}
                            </span>
                            {item.receitas.length > 0 && (
                              <p className="text-xs text-muted-foreground">
                                {item.receitas.length}{' '}
                                {item.receitas.length === 1
                                  ? 'receita'
                                  : 'receitas'}
                              </p>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </AccordionContent>
              </AccordionItem>
            )
          })}
        </Accordion>

        {/* Resumo */}
        <div className="pt-4 border-t">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground flex items-center gap-2">
              <Package className="h-4 w-4" />
              Total de itens
            </span>
            <span className="font-bold text-lg">{lista.totalItens} itens</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
