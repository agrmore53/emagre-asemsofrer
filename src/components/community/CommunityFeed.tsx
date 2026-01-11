'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  CommunityGroup,
  CommunityPost,
  CATEGORIAS_GRUPO,
  TIPOS_POST,
  formatarTempoRelativo,
  CategoriaGrupo,
} from '@/lib/community'

export function CommunityFeed() {
  const [grupos, setGrupos] = useState<(CommunityGroup & { sou_membro: boolean })[]>([])
  const [meusGrupos, setMeusGrupos] = useState<CommunityGroup[]>([])
  const [posts, setPosts] = useState<CommunityPost[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'feed' | 'grupos' | 'descobrir'>('feed')
  const [selectedGroup, setSelectedGroup] = useState<CommunityGroup | null>(null)

  // Modais
  const [showNewPost, setShowNewPost] = useState(false)
  const [showNewGroup, setShowNewGroup] = useState(false)
  const [newPostContent, setNewPostContent] = useState('')
  const [newPostType, setNewPostType] = useState('texto')
  const [saving, setSaving] = useState(false)

  // Novo grupo
  const [newGroupName, setNewGroupName] = useState('')
  const [newGroupDesc, setNewGroupDesc] = useState('')
  const [newGroupCategoria, setNewGroupCategoria] = useState<CategoriaGrupo>('geral')

  useEffect(() => {
    fetchData()
  }, [activeTab, selectedGroup])

  const fetchData = async () => {
    setLoading(true)
    try {
      if (activeTab === 'feed') {
        const res = await fetch('/api/community?tipo=feed')
        const data = await res.json()
        if (res.ok) setPosts(data.posts || [])
      } else if (activeTab === 'grupos') {
        const res = await fetch('/api/community?tipo=meus_grupos')
        const data = await res.json()
        if (res.ok) setMeusGrupos(data.grupos || [])
      } else if (activeTab === 'descobrir') {
        const res = await fetch('/api/community?tipo=grupos')
        const data = await res.json()
        if (res.ok) setGrupos(data.grupos || [])
      }

      if (selectedGroup) {
        const res = await fetch(`/api/community?tipo=posts&group_id=${selectedGroup.id}`)
        const data = await res.json()
        if (res.ok) setPosts(data.posts || [])
      }
    } catch (error) {
      console.error('Erro:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleJoinGroup = async (groupId: string) => {
    try {
      const res = await fetch('/api/community', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ acao: 'entrar_grupo', group_id: groupId })
      })
      if (res.ok) fetchData()
    } catch (error) {
      console.error('Erro:', error)
    }
  }

  const handleLeaveGroup = async (groupId: string) => {
    try {
      const res = await fetch('/api/community', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ acao: 'sair_grupo', group_id: groupId })
      })
      if (res.ok) {
        setSelectedGroup(null)
        fetchData()
      }
    } catch (error) {
      console.error('Erro:', error)
    }
  }

  const handleCreatePost = async () => {
    if (!newPostContent.trim() || !selectedGroup) return
    setSaving(true)
    try {
      const res = await fetch('/api/community', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          acao: 'criar_post',
          group_id: selectedGroup.id,
          conteudo: newPostContent,
          tipo: newPostType
        })
      })
      if (res.ok) {
        setNewPostContent('')
        setShowNewPost(false)
        fetchData()
      }
    } catch (error) {
      console.error('Erro:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleCreateGroup = async () => {
    if (!newGroupName.trim()) return
    setSaving(true)
    try {
      const res = await fetch('/api/community', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          acao: 'criar_grupo',
          nome: newGroupName,
          descricao: newGroupDesc,
          categoria: newGroupCategoria,
          icone: CATEGORIAS_GRUPO[newGroupCategoria].icone
        })
      })
      if (res.ok) {
        setNewGroupName('')
        setNewGroupDesc('')
        setShowNewGroup(false)
        setActiveTab('grupos')
        fetchData()
      }
    } catch (error) {
      console.error('Erro:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleLike = async (postId: string) => {
    try {
      await fetch('/api/community', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ acao: 'curtir', post_id: postId })
      })
      fetchData()
    } catch (error) {
      console.error('Erro:', error)
    }
  }

  // Renderizar post
  const renderPost = (post: CommunityPost & { group_nome?: string; group_icone?: string }) => {
    const tipoInfo = TIPOS_POST.find(t => t.id === post.tipo)

    return (
      <Card key={post.id} className="mb-3">
        <CardContent className="pt-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-lg">
              {post.user_nome?.[0]?.toUpperCase() || '?'}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-medium">{post.user_nome}</span>
                {post.group_nome && (
                  <span className="text-sm text-muted-foreground">
                    em {post.group_icone} {post.group_nome}
                  </span>
                )}
                <span className="text-xs text-muted-foreground">
                  · {formatarTempoRelativo(post.created_at)}
                </span>
              </div>
              {tipoInfo && post.tipo !== 'texto' && (
                <Badge variant="secondary" className="text-xs mt-1">
                  {tipoInfo.icone} {tipoInfo.nome}
                </Badge>
              )}
              <p className="mt-2 whitespace-pre-wrap">{post.conteudo}</p>
              <div className="flex gap-4 mt-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleLike(post.id)}
                  className={post.liked_by_me ? 'text-red-500' : ''}
                >
                  {post.liked_by_me ? '❤️' : '🤍'} {post.likes_count || 0}
                </Button>
                <Button variant="ghost" size="sm">
                  💬 {post.comments_count || 0}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Renderizar grupo
  const renderGroup = (grupo: CommunityGroup & { sou_membro?: boolean }) => {
    const catInfo = CATEGORIAS_GRUPO[grupo.categoria as CategoriaGrupo]

    return (
      <Card
        key={grupo.id}
        className="cursor-pointer hover:shadow-md transition-shadow"
        onClick={() => grupo.sou_membro && setSelectedGroup(grupo)}
      >
        <CardContent className="pt-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-2xl">
                {grupo.icone}
              </div>
              <div>
                <h3 className="font-semibold">{grupo.nome}</h3>
                <p className="text-sm text-muted-foreground line-clamp-1">
                  {grupo.descricao}
                </p>
                <div className="flex gap-2 mt-1">
                  <Badge variant="secondary" className={catInfo?.cor}>
                    {catInfo?.nome}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {grupo.membros_count} membros
                  </span>
                </div>
              </div>
            </div>
            {grupo.sou_membro ? (
              <Badge variant="outline">Membro</Badge>
            ) : (
              <Button size="sm" onClick={(e) => {
                e.stopPropagation()
                handleJoinGroup(grupo.id)
              }}>
                Entrar
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  // View de grupo selecionado
  if (selectedGroup) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => setSelectedGroup(null)}>
            ← Voltar
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleLeaveGroup(selectedGroup.id)}>
            Sair do Grupo
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center text-3xl">
                {selectedGroup.icone}
              </div>
              <div>
                <CardTitle>{selectedGroup.nome}</CardTitle>
                <p className="text-sm text-muted-foreground">{selectedGroup.descricao}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {selectedGroup.membros_count} membros · {selectedGroup.posts_count} posts
                </p>
              </div>
            </div>
          </CardHeader>
        </Card>

        <Button className="w-full" onClick={() => setShowNewPost(true)}>
          Criar Post
        </Button>

        {loading ? (
          <p className="text-center py-8 text-muted-foreground">Carregando...</p>
        ) : posts.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              Nenhum post ainda. Seja o primeiro!
            </CardContent>
          </Card>
        ) : (
          posts.map(renderPost)
        )}

        {/* Modal novo post */}
        <Dialog open={showNewPost} onOpenChange={setShowNewPost}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Novo Post</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Select value={newPostType} onValueChange={setNewPostType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TIPOS_POST.map(t => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.icone} {t.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Textarea
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                placeholder="O que você quer compartilhar?"
                rows={4}
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowNewPost(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreatePost} disabled={saving || !newPostContent.trim()}>
                {saving ? 'Publicando...' : 'Publicar'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex gap-2">
        {(['feed', 'grupos', 'descobrir'] as const).map(tab => (
          <Button
            key={tab}
            variant={activeTab === tab ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'feed' ? '📰 Feed' : tab === 'grupos' ? '👥 Meus Grupos' : '🔍 Descobrir'}
          </Button>
        ))}
      </div>

      {/* Conteúdo */}
      {loading ? (
        <p className="text-center py-8 text-muted-foreground">Carregando...</p>
      ) : activeTab === 'feed' ? (
        posts.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-4xl mb-2">👥</p>
              <p className="font-medium">Seu feed está vazio</p>
              <p className="text-sm text-muted-foreground">Entre em grupos para ver posts</p>
              <Button className="mt-4" onClick={() => setActiveTab('descobrir')}>
                Descobrir Grupos
              </Button>
            </CardContent>
          </Card>
        ) : (
          posts.map(renderPost)
        )
      ) : activeTab === 'grupos' ? (
        <>
          <Button className="w-full" variant="outline" onClick={() => setShowNewGroup(true)}>
            + Criar Novo Grupo
          </Button>
          {meusGrupos.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                Você ainda não participa de nenhum grupo
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {meusGrupos.map(g => renderGroup({ ...g, sou_membro: true }))}
            </div>
          )}
        </>
      ) : (
        <div className="space-y-3">
          {grupos.map(renderGroup)}
        </div>
      )}

      {/* Modal criar grupo */}
      <Dialog open={showNewGroup} onOpenChange={setShowNewGroup}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Criar Grupo</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Nome do Grupo</label>
              <Input
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                placeholder="Ex: Mães Fit"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Descrição</label>
              <Textarea
                value={newGroupDesc}
                onChange={(e) => setNewGroupDesc(e.target.value)}
                placeholder="Sobre o que é esse grupo?"
                rows={2}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Categoria</label>
              <Select value={newGroupCategoria} onValueChange={(v) => setNewGroupCategoria(v as CategoriaGrupo)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(CATEGORIAS_GRUPO).map(([key, val]) => (
                    <SelectItem key={key} value={key}>
                      {val.icone} {val.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewGroup(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCreateGroup} disabled={saving || !newGroupName.trim()}>
              {saving ? 'Criando...' : 'Criar Grupo'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default CommunityFeed
