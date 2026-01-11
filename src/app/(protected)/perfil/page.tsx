'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import type { Profile, NivelAtividade, Sexo, FaseHormonal, ObjetivoSaude } from '@/types'
import { getFaixaEtaria, sugerirFaseHormonal, gerarPerfilNutricionalCompleto } from '@/lib/nutricao/faixas-etarias'
import { RecomendacoesIdade } from '@/components/nutricao/RecomendacoesIdade'

export default function PerfilPage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Form states
  const [nome, setNome] = useState('')
  const [dataNascimento, setDataNascimento] = useState('')
  const [sexo, setSexo] = useState<Sexo | ''>('')
  const [alturaCm, setAlturaCm] = useState('')
  const [pesoInicial, setPesoInicial] = useState('')
  const [pesoMeta, setPesoMeta] = useState('')
  const [nivelAtividade, setNivelAtividade] = useState<NivelAtividade>('sedentario')
  // Novos campos para nutrição por idade
  const [faseHormonal, setFaseHormonal] = useState<FaseHormonal | ''>('')
  const [objetivoSaude, setObjetivoSaude] = useState<ObjetivoSaude | ''>('')
  const [condicoesSaude, setCondicoesSaude] = useState<string[]>([])
  const [showRecomendacoes, setShowRecomendacoes] = useState(false)

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (data) {
        setProfile(data as Profile)
        setNome(data.nome || '')
        setDataNascimento(data.data_nascimento || '')
        setSexo(data.sexo || '')
        setAlturaCm(data.altura_cm?.toString() || '')
        setPesoInicial(data.peso_inicial?.toString() || '')
        setPesoMeta(data.peso_meta?.toString() || '')
        setNivelAtividade(data.nivel_atividade || 'sedentario')
        setFaseHormonal(data.fase_hormonal || '')
        setObjetivoSaude(data.objetivo_saude || '')
        setCondicoesSaude(data.condicoes_saude || [])
      }
    }
    setLoading(false)
  }

  const handleSave = async () => {
    setSaving(true)

    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('profiles')
        .update({
          nome,
          data_nascimento: dataNascimento || null,
          sexo: sexo || null,
          altura_cm: alturaCm ? parseInt(alturaCm) : null,
          peso_inicial: pesoInicial ? parseFloat(pesoInicial) : null,
          peso_meta: pesoMeta ? parseFloat(pesoMeta) : null,
          nivel_atividade: nivelAtividade,
          fase_hormonal: faseHormonal || null,
          objetivo_saude: objetivoSaude || null,
          condicoes_saude: condicoesSaude.length > 0 ? condicoesSaude : null,
        })
        .eq('id', profile?.id)

      if (error) throw error

      toast.success('Perfil atualizado com sucesso!')
      loadProfile()
    } catch {
      toast.error('Erro ao salvar perfil. Tente novamente.')
    } finally {
      setSaving(false)
    }
  }

  // Calcula idade a partir da data de nascimento
  const calcularIdade = (): number | null => {
    if (!dataNascimento) return null
    return Math.floor((Date.now() - new Date(dataNascimento).getTime()) / (365.25 * 24 * 60 * 60 * 1000))
  }

  const idade = calcularIdade()

  // Gera perfil nutricional completo por idade
  const perfilNutricional = idade && sexo && pesoInicial && alturaCm ?
    gerarPerfilNutricionalCompleto(
      idade,
      sexo as 'masculino' | 'feminino',
      parseFloat(pesoInicial),
      parseInt(alturaCm),
      nivelAtividade,
      (objetivoSaude as 'perder_peso' | 'manter_peso' | 'ganhar_massa' | 'longevidade' | 'energia' | 'saude_hormonal') || 'perder_peso',
      (faseHormonal as FaseHormonal) || undefined
    ) : null

  // Sugere fase hormonal automaticamente
  const faseHormonalSugerida = idade && sexo ? sugerirFaseHormonal(idade, sexo) : null

  // Calcula TMB e gasto calórico
  const calcularGastoCaloricoInfo = () => {
    if (!pesoInicial || !alturaCm || !dataNascimento || !sexo) {
      return null
    }

    const peso = parseFloat(pesoInicial)
    const altura = parseInt(alturaCm)
    const idade = Math.floor((Date.now() - new Date(dataNascimento).getTime()) / (365.25 * 24 * 60 * 60 * 1000))

    // Fórmula de Mifflin-St Jeor
    let tmb: number
    if (sexo === 'masculino') {
      tmb = 10 * peso + 6.25 * altura - 5 * idade + 5
    } else {
      tmb = 10 * peso + 6.25 * altura - 5 * idade - 161
    }

    const multiplicadores: Record<NivelAtividade, number> = {
      sedentario: 1.2,
      leve: 1.375,
      moderado: 1.55,
      intenso: 1.725,
    }

    const gastoTotal = Math.round(tmb * multiplicadores[nivelAtividade])
    const paraEmagrecer = Math.round(gastoTotal - 400)

    return { tmb: Math.round(tmb), gastoTotal, paraEmagrecer }
  }

  const gastoInfo = calcularGastoCaloricoInfo()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Meu Perfil</h1>
        <p className="text-muted-foreground mt-2">
          Gerencie suas informações pessoais e preferências
        </p>
      </div>

      <Tabs defaultValue="dados" className="space-y-6">
        <TabsList className="flex flex-wrap">
          <TabsTrigger value="dados">Dados Pessoais</TabsTrigger>
          <TabsTrigger value="metas">Metas</TabsTrigger>
          <TabsTrigger value="saude">Saúde por Idade</TabsTrigger>
          <TabsTrigger value="assinatura">Assinatura</TabsTrigger>
        </TabsList>

        {/* Dados Pessoais */}
        <TabsContent value="dados">
          <Card>
            <CardHeader>
              <CardTitle>Informações Pessoais</CardTitle>
              <CardDescription>
                Esses dados são usados para personalizar seu cardápio e calcular suas necessidades calóricas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome</Label>
                  <Input
                    id="nome"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    placeholder="Seu nome"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    value={profile?.email || ''}
                    disabled
                    className="bg-muted"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dataNascimento">Data de Nascimento</Label>
                  <Input
                    id="dataNascimento"
                    type="date"
                    value={dataNascimento}
                    onChange={(e) => setDataNascimento(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sexo">Sexo</Label>
                  <select
                    id="sexo"
                    value={sexo}
                    onChange={(e) => setSexo(e.target.value as Sexo)}
                    className="w-full h-10 px-3 rounded-md border border-input bg-background"
                  >
                    <option value="">Selecione</option>
                    <option value="feminino">Feminino</option>
                    <option value="masculino">Masculino</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="altura">Altura (cm)</Label>
                  <Input
                    id="altura"
                    type="number"
                    value={alturaCm}
                    onChange={(e) => setAlturaCm(e.target.value)}
                    placeholder="Ex: 165"
                    min="100"
                    max="250"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nivelAtividade">Nível de Atividade</Label>
                  <select
                    id="nivelAtividade"
                    value={nivelAtividade}
                    onChange={(e) => setNivelAtividade(e.target.value as NivelAtividade)}
                    className="w-full h-10 px-3 rounded-md border border-input bg-background"
                  >
                    <option value="sedentario">Sedentário (pouco ou nenhum exercício)</option>
                    <option value="leve">Levemente ativo (1-3x/semana)</option>
                    <option value="moderado">Moderadamente ativo (3-5x/semana)</option>
                    <option value="intenso">Muito ativo (6-7x/semana)</option>
                  </select>
                </div>
              </div>

              <Button onClick={handleSave} disabled={saving}>
                {saving ? 'Salvando...' : 'Salvar Alterações'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Metas */}
        <TabsContent value="metas">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Suas Metas de Peso</CardTitle>
                <CardDescription>
                  Defina seu peso inicial e sua meta para acompanhar o progresso
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="pesoInicial">Peso Inicial (kg)</Label>
                    <Input
                      id="pesoInicial"
                      type="number"
                      step="0.1"
                      value={pesoInicial}
                      onChange={(e) => setPesoInicial(e.target.value)}
                      placeholder="Ex: 75.5"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pesoMeta">Peso Meta (kg)</Label>
                    <Input
                      id="pesoMeta"
                      type="number"
                      step="0.1"
                      value={pesoMeta}
                      onChange={(e) => setPesoMeta(e.target.value)}
                      placeholder="Ex: 65.0"
                    />
                  </div>
                </div>

                {pesoInicial && pesoMeta && (
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="font-medium">
                      Meta: perder {(parseFloat(pesoInicial) - parseFloat(pesoMeta)).toFixed(1)}kg
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Com um déficit moderado, isso levará aproximadamente{' '}
                      {Math.ceil((parseFloat(pesoInicial) - parseFloat(pesoMeta)) / 0.5)} semanas
                    </p>
                  </div>
                )}

                <Button onClick={handleSave} disabled={saving}>
                  {saving ? 'Salvando...' : 'Salvar Metas'}
                </Button>
              </CardContent>
            </Card>

            {/* Gasto Calórico */}
            {gastoInfo && (
              <Card>
                <CardHeader>
                  <CardTitle>Seu Gasto Calórico</CardTitle>
                  <CardDescription>
                    Calculado com base nos seus dados pessoais
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="p-4 bg-muted rounded-lg text-center">
                      <p className="text-sm text-muted-foreground">Metabolismo Basal</p>
                      <p className="text-2xl font-bold">{gastoInfo.tmb}</p>
                      <p className="text-xs text-muted-foreground">calorias/dia</p>
                    </div>
                    <div className="p-4 bg-muted rounded-lg text-center">
                      <p className="text-sm text-muted-foreground">Gasto Total</p>
                      <p className="text-2xl font-bold">{gastoInfo.gastoTotal}</p>
                      <p className="text-xs text-muted-foreground">calorias/dia</p>
                    </div>
                    <div className="p-4 bg-primary/10 rounded-lg text-center border-2 border-primary">
                      <p className="text-sm text-primary font-medium">Para Emagrecer</p>
                      <p className="text-2xl font-bold text-primary">{gastoInfo.paraEmagrecer}</p>
                      <p className="text-xs text-muted-foreground">calorias/dia</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-4">
                    * Consumindo ~{gastoInfo.paraEmagrecer} calorias por dia, você perderá aproximadamente 0.5kg por semana de forma saudável.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Saúde por Idade */}
        <TabsContent value="saude">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Perfil de Saúde por Idade</CardTitle>
                <CardDescription>
                  Personalize suas recomendações nutricionais baseadas na sua idade e fase da vida
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {idade && (
                  <div className="p-4 bg-muted rounded-lg">
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Sua idade</p>
                        <p className="text-2xl font-bold">{idade} anos</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Faixa etária</p>
                        <Badge variant="outline" className="text-lg">
                          {getFaixaEtaria(idade)}
                        </Badge>
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="faseHormonal">Fase Hormonal</Label>
                    <select
                      id="faseHormonal"
                      value={faseHormonal}
                      onChange={(e) => setFaseHormonal(e.target.value as FaseHormonal)}
                      className="w-full h-10 px-3 rounded-md border border-input bg-background"
                    >
                      <option value="">
                        {faseHormonalSugerida
                          ? `Automático (${faseHormonalSugerida.replace('_', ' ')})`
                          : 'Selecione'}
                      </option>
                      {sexo === 'feminino' ? (
                        <>
                          <option value="regular">Regular (ciclo normal)</option>
                          <option value="pre_menopausa">Pré-menopausa (40-45 anos)</option>
                          <option value="perimenopausa">Perimenopausa (45-50 anos)</option>
                          <option value="menopausa">Menopausa (50+ anos)</option>
                        </>
                      ) : (
                        <>
                          <option value="regular">Regular</option>
                          <option value="andropausa_inicial">Andropausa inicial (45-55 anos)</option>
                          <option value="andropausa">Andropausa (55+ anos)</option>
                        </>
                      )}
                    </select>
                    <p className="text-xs text-muted-foreground">
                      Afeta recomendações de nutrientes específicos
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="objetivoSaude">Objetivo de Saúde</Label>
                    <select
                      id="objetivoSaude"
                      value={objetivoSaude}
                      onChange={(e) => setObjetivoSaude(e.target.value as ObjetivoSaude)}
                      className="w-full h-10 px-3 rounded-md border border-input bg-background"
                    >
                      <option value="">Selecione seu objetivo principal</option>
                      <option value="perder_peso">Perder peso</option>
                      <option value="manter_peso">Manter peso</option>
                      <option value="ganhar_massa">Ganhar massa muscular</option>
                      <option value="longevidade">Longevidade e anti-aging</option>
                      <option value="energia">Mais energia e disposição</option>
                      <option value="saude_hormonal">Saúde hormonal</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Condições de Saúde (opcional)</Label>
                  <div className="flex flex-wrap gap-2">
                    {['diabetes', 'hipertensao', 'colesterol_alto', 'tireoide', 'osteoporose', 'artrite'].map((condicao) => (
                      <Badge
                        key={condicao}
                        variant={condicoesSaude.includes(condicao) ? 'default' : 'outline'}
                        className="cursor-pointer"
                        onClick={() => {
                          if (condicoesSaude.includes(condicao)) {
                            setCondicoesSaude(condicoesSaude.filter(c => c !== condicao))
                          } else {
                            setCondicoesSaude([...condicoesSaude, condicao])
                          }
                        }}
                      >
                        {condicao.replace('_', ' ')}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Clique para selecionar/deselecionar
                  </p>
                </div>

                <Button onClick={handleSave} disabled={saving}>
                  {saving ? 'Salvando...' : 'Salvar Configurações de Saúde'}
                </Button>
              </CardContent>
            </Card>

            {/* Recomendações Personalizadas */}
            {perfilNutricional && (
              <Card>
                <CardHeader>
                  <CardTitle>Suas Recomendações Personalizadas</CardTitle>
                  <CardDescription>
                    Baseadas na sua idade ({idade} anos), sexo e objetivos
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <RecomendacoesIdade
                    idade={idade!}
                    sexo={sexo as 'masculino' | 'feminino'}
                    peso={parseFloat(pesoInicial)}
                    altura={parseInt(alturaCm)}
                    nivelAtividade={nivelAtividade}
                    objetivo={(objetivoSaude as 'perder_peso' | 'manter_peso' | 'ganhar_massa' | 'longevidade' | 'energia' | 'saude_hormonal') || 'perder_peso'}
                    faseHormonal={faseHormonal as FaseHormonal || undefined}
                  />
                </CardContent>
              </Card>
            )}

            {!perfilNutricional && (
              <Card>
                <CardContent className="p-6">
                  <p className="text-center text-muted-foreground">
                    Preencha seus dados pessoais (data de nascimento, sexo, peso e altura) para ver suas recomendações personalizadas por idade.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Assinatura */}
        <TabsContent value="assinatura">
          <Card>
            <CardHeader>
              <CardTitle>Sua Assinatura</CardTitle>
              <CardDescription>
                Gerencie seu plano e pagamentos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Plano atual</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant={profile?.plano === 'premium' ? 'default' : 'secondary'}>
                      {profile?.plano === 'premium' ? '⭐ Premium' : profile?.plano === 'basico' ? 'Básico' : 'Grátis'}
                    </Badge>
                    <Badge variant="outline">
                      {profile?.status_assinatura === 'ativo' ? '✓ Ativo' : 'Inativo'}
                    </Badge>
                  </div>
                </div>
              </div>

              {profile?.plano === 'free' && (
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium">Faça upgrade para desbloquear:</h4>
                  <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                    <li>✓ Acesso a todos os 8 capítulos</li>
                    <li>✓ Tracker de peso ilimitado</li>
                    <li>✓ Cardápios personalizados (Premium)</li>
                    <li>✓ Lista de compras automática (Premium)</li>
                  </ul>
                  <Button className="mt-4">
                    Fazer Upgrade
                  </Button>
                </div>
              )}

              {profile?.plano !== 'free' && (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Membro desde: {profile?.created_at && new Date(profile.created_at).toLocaleDateString('pt-BR')}
                  </p>
                  <Button variant="outline">
                    Gerenciar Assinatura
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
