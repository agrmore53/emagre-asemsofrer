'use client'

import { BarcodeScanner } from '@/components/barcode'

export default function ScannerPage() {
  return (
    <div className="container max-w-2xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Scanner de Alimentos</h1>
        <p className="text-muted-foreground mt-1">
          Escaneie códigos de barras para ver informações nutricionais
        </p>
      </div>

      <BarcodeScanner />
    </div>
  )
}
