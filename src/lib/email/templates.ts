// Templates de Email

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

// Estilo base para todos os emails
const baseStyle = `
  body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f5f5f5; }
  .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
  .header { background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); color: white; padding: 30px 20px; text-align: center; }
  .header h1 { margin: 0; font-size: 24px; }
  .header p { margin: 10px 0 0; opacity: 0.9; }
  .content { padding: 30px 20px; }
  .content h2 { color: #22c55e; margin-top: 0; }
  .button { display: inline-block; background: #22c55e; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
  .button:hover { background: #16a34a; }
  .footer { background: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #666; }
  .tip-box { background: #f0fdf4; border-left: 4px solid #22c55e; padding: 15px; margin: 20px 0; border-radius: 0 8px 8px 0; }
  .badge { display: inline-block; background: #fef3c7; color: #92400e; padding: 8px 16px; border-radius: 20px; font-weight: bold; margin: 10px 5px; }
  .stats { display: flex; justify-content: space-around; background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0; }
  .stat { text-align: center; }
  .stat-value { font-size: 28px; font-weight: bold; color: #22c55e; }
  .stat-label { font-size: 12px; color: #666; }
`

// Template base
function wrapTemplate(content: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Emagreça Sem Sofrer</title>
  <style>${baseStyle}</style>
</head>
<body>
  <div class="container">
    ${content}
    <div class="footer">
      <p>Emagreça Sem Sofrer - Sua jornada de transformação</p>
      <p>
        <a href="${BASE_URL}/termos">Termos</a> |
        <a href="${BASE_URL}/privacidade">Privacidade</a> |
        <a href="${BASE_URL}/dashboard">Acessar Plataforma</a>
      </p>
    </div>
  </div>
</body>
</html>
`
}

// ========================================
// TEMPLATE: Boas-vindas
// ========================================
export function templateBoasVindas(nome: string): string {
  return wrapTemplate(`
    <div class="header">
      <h1>Bem-vindo(a) ao Emagreça Sem Sofrer!</h1>
      <p>Sua jornada de transformação começa agora</p>
    </div>
    <div class="content">
      <h2>Olá, ${nome}! 👋</h2>
      <p>
        Estamos muito felizes em ter você conosco! Você acaba de dar o primeiro passo
        para uma vida mais saudável e leve.
      </p>

      <div class="tip-box">
        <strong>💡 Dica de ouro:</strong> O segredo do emagrecimento sustentável não está em
        dietas restritivas, mas em criar hábitos que você consiga manter para sempre.
      </div>

      <h3>Seus próximos passos:</h3>
      <ol>
        <li><strong>Complete seu perfil</strong> - Informe peso, altura e meta para personalizarmos sua experiência</li>
        <li><strong>Leia o Capítulo 1</strong> - Entenda a mentalidade certa para emagrecer</li>
        <li><strong>Registre seu peso</strong> - O primeiro registro é o mais importante!</li>
      </ol>

      <center>
        <a href="${BASE_URL}/dashboard" class="button">Acessar Minha Conta →</a>
      </center>

      <p>
        Se tiver qualquer dúvida, estamos aqui para ajudar.
        Basta responder este email!
      </p>

      <p>Com carinho,<br><strong>Equipe Emagreça Sem Sofrer</strong></p>
    </div>
  `)
}

// ========================================
// TEMPLATE: Lembrete de Peso
// ========================================
export function templateLembretePeso(nome: string, diasSemRegistro: number): string {
  return wrapTemplate(`
    <div class="header">
      <h1>Hora de se pesar! ⚖️</h1>
      <p>Não perca o controle do seu progresso</p>
    </div>
    <div class="content">
      <h2>Oi, ${nome}!</h2>
      <p>
        Notamos que você está há <strong>${diasSemRegistro} dias</strong> sem registrar seu peso.
        Sabemos que a balança pode assustar às vezes, mas lembre-se:
      </p>

      <div class="tip-box">
        <strong>O número na balança não define você!</strong><br>
        Ele é apenas uma ferramenta de acompanhamento. Flutuações são normais e
        fazem parte do processo.
      </div>

      <p>
        Registrar regularmente ajuda você a:
      </p>
      <ul>
        <li>✅ Identificar padrões</li>
        <li>✅ Manter a motivação</li>
        <li>✅ Celebrar pequenas vitórias</li>
        <li>✅ Ajustar a estratégia quando necessário</li>
      </ul>

      <center>
        <a href="${BASE_URL}/tracker" class="button">Registrar Meu Peso →</a>
      </center>

      <p style="font-size: 14px; color: #666;">
        Dica: Pese-se sempre no mesmo horário, de preferência pela manhã,
        após ir ao banheiro e antes de comer.
      </p>
    </div>
  `)
}

// ========================================
// TEMPLATE: Nova Conquista
// ========================================
export function templateConquista(
  nome: string,
  conquista: { titulo: string; descricao: string; icone: string }
): string {
  return wrapTemplate(`
    <div class="header">
      <h1>🏆 Nova Conquista Desbloqueada!</h1>
      <p>Você está arrasando!</p>
    </div>
    <div class="content">
      <h2>Parabéns, ${nome}!</h2>

      <center>
        <div style="font-size: 64px; margin: 20px 0;">${conquista.icone}</div>
        <div class="badge">${conquista.titulo}</div>
        <p style="color: #666; max-width: 400px; margin: 20px auto;">
          ${conquista.descricao}
        </p>
      </center>

      <div class="tip-box">
        <strong>Continue assim!</strong> Cada pequena vitória te aproxima do seu objetivo.
        Você está no caminho certo! 💪
      </div>

      <center>
        <a href="${BASE_URL}/dashboard" class="button">Ver Minhas Conquistas →</a>
      </center>
    </div>
  `)
}

// ========================================
// TEMPLATE: Dica Semanal
// ========================================
export function templateDicaSemanal(
  nome: string,
  dica: { titulo: string; conteudo: string; capitulo?: string }
): string {
  return wrapTemplate(`
    <div class="header">
      <h1>💡 Sua Dica da Semana</h1>
      <p>Conhecimento que transforma</p>
    </div>
    <div class="content">
      <h2>Olá, ${nome}!</h2>

      <p>Aqui está sua dica semanal para continuar evoluindo:</p>

      <div class="tip-box">
        <strong>${dica.titulo}</strong><br><br>
        ${dica.conteudo}
      </div>

      ${dica.capitulo ? `
        <p>
          <strong>Quer se aprofundar?</strong><br>
          Esta dica é baseada no <a href="${BASE_URL}/conteudo/${dica.capitulo}">${dica.capitulo}</a> do método.
        </p>
      ` : ''}

      <center>
        <a href="${BASE_URL}/conteudo" class="button">Continuar Aprendendo →</a>
      </center>

      <p style="font-size: 14px; color: #666;">
        Você está recebendo este email porque se cadastrou no Emagreça Sem Sofrer.
      </p>
    </div>
  `)
}

// ========================================
// TEMPLATE: Assinatura Ativada
// ========================================
export function templateAssinaturaAtiva(nome: string, plano: string): string {
  return wrapTemplate(`
    <div class="header">
      <h1>🎉 Assinatura Confirmada!</h1>
      <p>Bem-vindo(a) ao ${plano}!</p>
    </div>
    <div class="content">
      <h2>Oba, ${nome}!</h2>

      <p>
        Sua assinatura do <strong>Plano ${plano}</strong> foi confirmada com sucesso!
        Agora você tem acesso completo a todos os recursos.
      </p>

      <h3>O que você pode fazer agora:</h3>
      <ul>
        <li>📖 Acessar todos os 8 capítulos do método</li>
        <li>📊 Usar o tracker de peso ilimitado</li>
        <li>🍽️ Gerar cardápios personalizados</li>
        <li>🛒 Criar listas de compras automáticas</li>
      </ul>

      <center>
        <a href="${BASE_URL}/cardapio" class="button">Gerar Meu Primeiro Cardápio →</a>
      </center>

      <div class="tip-box">
        <strong>Suporte:</strong> Se precisar de ajuda, responda este email
        ou acesse o chat de suporte na plataforma.
      </div>
    </div>
  `)
}

// ========================================
// TEMPLATE: Resumo Semanal
// ========================================
export function templateResumoSemanal(
  nome: string,
  stats: {
    pesoAtual?: number
    variacaoSemana?: number
    diasRegistrados: number
    capitulosLidos: number
    streak: number
  }
): string {
  return wrapTemplate(`
    <div class="header">
      <h1>📊 Seu Resumo Semanal</h1>
      <p>Veja como foi sua semana</p>
    </div>
    <div class="content">
      <h2>Oi, ${nome}!</h2>

      <p>Aqui está o resumo da sua semana:</p>

      <div class="stats">
        <div class="stat">
          <div class="stat-value">${stats.pesoAtual ? `${stats.pesoAtual}kg` : '--'}</div>
          <div class="stat-label">Peso Atual</div>
        </div>
        <div class="stat">
          <div class="stat-value" style="color: ${stats.variacaoSemana && stats.variacaoSemana < 0 ? '#22c55e' : '#666'}">
            ${stats.variacaoSemana ? `${stats.variacaoSemana > 0 ? '+' : ''}${stats.variacaoSemana.toFixed(1)}kg` : '--'}
          </div>
          <div class="stat-label">Variação</div>
        </div>
        <div class="stat">
          <div class="stat-value">🔥 ${stats.streak}</div>
          <div class="stat-label">Dias Seguidos</div>
        </div>
      </div>

      <ul>
        <li>📝 <strong>${stats.diasRegistrados}</strong> registros de peso esta semana</li>
        <li>📖 <strong>${stats.capitulosLidos}</strong> capítulos concluídos</li>
      </ul>

      ${stats.variacaoSemana && stats.variacaoSemana < 0 ? `
        <div class="tip-box">
          <strong>🎉 Parabéns!</strong> Você perdeu ${Math.abs(stats.variacaoSemana).toFixed(1)}kg esta semana!
          Continue assim!
        </div>
      ` : `
        <div class="tip-box">
          <strong>💪 Não desanime!</strong> Flutuações são normais.
          O importante é manter a consistência!
        </div>
      `}

      <center>
        <a href="${BASE_URL}/dashboard" class="button">Ver Mais Detalhes →</a>
      </center>
    </div>
  `)
}
