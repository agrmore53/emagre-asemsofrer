'use client'

import { MealPhotoLogger } from '@/components/meal-photo'

export default function RefeicoesPage() {
  return (
    <div className="container max-w-2xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Foto das Refeições</h1>
        <p className="text-muted-foreground mt-1">
          Fotografe suas refeições para análise nutricional com IA
        </p>
      </div>

      <MealPhotoLogger />
    </div>
  )
}
