'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TOPIC_STARTERS } from '@/lib/ai/coach-prompts'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface AICoachChatProps {
  userName?: string
  compact?: boolean
}

export function AICoachChat({ userName, compact = false }: AICoachChatProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(!compact)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    // Mensagem de boas-vindas
    if (messages.length === 0) {
      const welcomeMessage: Message = {
        id: 'welcome',
        role: 'assistant',
        content: userName
          ? `Olá, ${userName}! Sou a Dra. Ana, sua coach virtual. Como posso te ajudar hoje?`
          : 'Olá! Sou a Dra. Ana, sua coach virtual de emagrecimento. Estou aqui para te apoiar 24/7. Como posso te ajudar?',
        timestamp: new Date(),
      }
      setMessages([welcomeMessage])
    }
  }, [userName, messages.length])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const sendMessage = async (messageText: string) => {
    if (!messageText.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText.trim(),
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: messageText,
          conversationHistory: messages
            .filter(m => m.id !== 'welcome')
            .slice(-10)
            .map(m => ({ role: m.role, content: m.content })),
        }),
      })

      if (!response.ok) throw new Error('Erro na API')

      const data = await response.json()

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Desculpe, tive um problema técnico. Pode tentar de novo?',
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendMessage(input)
  }

  const handleTopicClick = (prompt: string) => {
    sendMessage(prompt)
  }

  // Versão compacta (botão flutuante)
  if (compact && !isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
        aria-label="Abrir chat com coach"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      </button>
    )
  }

  const chatContent = (
    <>
      {/* Mensagens */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(message => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg px-4 py-2 ${
                message.role === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              <p className="text-xs opacity-60 mt-1">
                {message.timestamp.toLocaleTimeString('pt-BR', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-muted rounded-lg px-4 py-2">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce delay-100" />
                <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce delay-200" />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Sugestões de tópicos */}
      {messages.length <= 1 && (
        <div className="px-4 pb-2">
          <p className="text-xs text-muted-foreground mb-2">
            Ou escolha um tópico:
          </p>
          <div className="flex flex-wrap gap-2">
            {TOPIC_STARTERS.slice(0, 4).map(topic => (
              <Badge
                key={topic.id}
                variant="outline"
                className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                onClick={() => handleTopicClick(topic.prompt)}
              >
                {topic.icon} {topic.label}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Digite sua mensagem..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button type="submit" disabled={isLoading || !input.trim()}>
            Enviar
          </Button>
        </div>
      </form>
    </>
  )

  // Versão compacta (modal flutuante)
  if (compact) {
    return (
      <div className="fixed bottom-6 right-6 z-50 w-96 h-[500px] flex flex-col bg-background border rounded-lg shadow-xl">
        <div className="flex items-center justify-between p-4 border-b bg-primary text-primary-foreground rounded-t-lg">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary-foreground/20 flex items-center justify-center">
              <span className="text-lg">👩‍⚕️</span>
            </div>
            <div>
              <h3 className="font-semibold text-sm">Dra. Ana</h3>
              <p className="text-xs opacity-80">Coach Virtual</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 hover:bg-primary-foreground/20 rounded"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        {chatContent}
      </div>
    )
  }

  // Versão completa (página inteira)
  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-2xl">👩‍⚕️</span>
          </div>
          <div>
            <CardTitle>Dra. Ana - Sua Coach Virtual</CardTitle>
            <p className="text-sm text-muted-foreground">
              Disponível 24/7 para te apoiar
            </p>
          </div>
          <Badge variant="outline" className="ml-auto">
            Online
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col p-0">
        {chatContent}
      </CardContent>
    </Card>
  )
}

export default AICoachChat
