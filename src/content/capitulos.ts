// Conteúdo dos capítulos do ebook

export interface Secao {
  titulo: string
  conteudo: string
}

export interface CapituloCompleto {
  id: string
  numero: number
  titulo: string
  subtitulo: string
  descricao: string
  slug: string
  tempoLeitura: number
  secoes: Secao[]
  resumo: string[]
  proximoCapitulo?: string
  capituloAnterior?: string
}

export const CAPITULOS_CONTEUDO: CapituloCompleto[] = [
  {
    id: 'cap-1',
    numero: 1,
    titulo: 'Por Que Toda Dieta Que Você Fez Falhou',
    subtitulo: 'A verdade que a indústria das dietas não quer que você saiba',
    descricao: 'Descubra por que as dietas tradicionais não funcionam e como quebrar o ciclo vicioso.',
    slug: 'por-que-dietas-falham',
    tempoLeitura: 8,
    proximoCapitulo: 'principio-que-funciona',
    secoes: [
      {
        titulo: 'Seja honesto comigo',
        conteudo: `Quantas dietas você já tentou?

Low carb. Cetogênica. Dieta da sopa. Jejum intermitente. Dieta dos pontos. Dukan. Whole30. Aquela dieta maluca que sua colega de trabalho indicou.

E o resultado foi sempre o mesmo, não foi?

Funciona por algumas semanas. Você perde peso, fica animado, começa a acreditar que dessa vez vai ser diferente. Aí chega o final de semana. Ou uma festa. Ou um dia estressante no trabalho.

E você "escorrega".

Um pedaço de pizza. Um chocolate. Uma cerveja. E de repente você pensa: "Já estraguei tudo mesmo, vou aproveitar."

Na segunda-feira, a culpa vem. Você sobe na balança e vê que recuperou metade do que tinha perdido. O desânimo bate. Você abandona a dieta. Engorda tudo de volta. Às vezes engorda mais do que pesava antes.

Se isso descreve sua história, eu preciso te dizer algo importante:

**A culpa não é sua.**`
      },
      {
        titulo: 'O Problema Não É Falta de Disciplina',
        conteudo: `A indústria das dietas lucra bilhões de reais por ano te convencendo de uma mentira: que emagrecer é questão de força de vontade.

"É só fechar a boca."
"É só ter disciplina."
"É só querer de verdade."

Isso é crueldade disfarçada de conselho.

Se fosse só questão de querer, você já teria emagrecido há muito tempo. Você já tentou. Você já se esforçou. Você já passou fome, recusou convites, comeu salada sem graça enquanto todo mundo comia bem.

E não funcionou.

Não porque você é fraco. Mas porque **o método estava errado desde o início**.`
      },
      {
        titulo: 'A Armadilha da Restrição',
        conteudo: `Toda dieta tradicional funciona da mesma forma:

1. Te dão uma lista de alimentos "proibidos"
2. Te dão uma lista de alimentos "permitidos"
3. Te mandam seguir isso pelo resto da vida

O problema? Seu cérebro não funciona assim.

Quando você proíbe algo, seu cérebro quer mais. É como dizer para uma criança não pensar em um elefante rosa. O que ela faz? Pensa no elefante rosa.

Pesquisas mostram que quanto mais você restringe um alimento, mais você pensa nele. Mais você deseja. Mais você sonha com ele.

E quando você finalmente come — porque uma hora você vai comer — você não come um pedaço. Você come a caixa inteira.

Isso não é falta de controle. **Isso é biologia.**`
      },
      {
        titulo: 'O Ciclo Vicioso',
        conteudo: `Veja como funciona:

**DIETA RESTRITIVA** → Você corta tudo que gosta
↓
**PRIVAÇÃO** → Seu corpo e mente sentem falta
↓
**COMPULSÃO** → Você não aguenta e come demais
↓
**CULPA** → Você se sente um fracasso
↓
**DESISTÊNCIA** → Você abandona a dieta
↓
**GANHO DE PESO** → Você engorda tudo de volta (às vezes mais)
↓
**NOVA DIETA** → Você tenta de novo, mais restritivo ainda

E o ciclo se repete. Cada vez mais difícil. Cada vez mais frustrante.`
      },
      {
        titulo: 'Por Que Você Engorda Mais Depois',
        conteudo: `Quando você faz dieta muito restritiva, seu corpo entra em modo de sobrevivência.

Ele não sabe que você está tentando emagrecer para ficar bonito. Ele acha que está passando fome. Que comida está escassa. Que precisa economizar energia.

O que acontece:

• **Seu metabolismo desacelera** — Você queima menos calorias em repouso
• **Sua fome aumenta** — Hormônios como a grelina disparam
• **Sua saciedade diminui** — Você precisa comer mais pra se sentir satisfeito
• **Seu corpo guarda gordura** — Ele se prepara para a "próxima fome"

Então quando você volta a comer normal, seu corpo — que agora está mais eficiente em estocar gordura e queimando menos calorias — faz você engordar mais rápido.

Não é culpa sua. **É adaptação biológica.**`
      },
      {
        titulo: 'O Caminho Diferente',
        conteudo: `O erro não é comer pizza.
O erro não é beber no final de semana.
O erro não é gostar de chocolate.

O erro é acreditar que você precisa eliminar tudo isso para emagrecer.

**Você não precisa.**

Nos próximos capítulos, você vai descobrir que é possível emagrecer comendo as coisas que você ama. Sem passar fome. Sem viver de salada. Sem se sentir um alienígena nos churrascos de família.

Mas primeiro, você precisa desaprender o que as dietas te ensinaram.`
      }
    ],
    resumo: [
      'Dietas restritivas falham porque vão contra a biologia humana',
      'O ciclo restrição → compulsão → culpa é inevitável com dietas tradicionais',
      'Seu metabolismo se adapta e dificulta o emagrecimento',
      'Existe outro caminho que funciona com seu corpo, não contra ele'
    ]
  },
  {
    id: 'cap-2',
    numero: 2,
    titulo: 'O Único Princípio Que Realmente Funciona',
    subtitulo: 'A lei da física que governa o emagrecimento',
    descricao: 'Entenda o déficit calórico de forma simples e libertadora.',
    slug: 'principio-que-funciona',
    tempoLeitura: 10,
    capituloAnterior: 'por-que-dietas-falham',
    proximoCapitulo: 'comer-o-que-gosta',
    secoes: [
      {
        titulo: 'A Revelação Simples',
        conteudo: `Prepare-se para a revelação mais simples — e mais libertadora — sobre emagrecimento.

Não é um chá especial.
Não é um suplemento milagroso.
Não é cortar carboidrato.
Não é eliminar glúten.
Não é comer de 3 em 3 horas.

É algo muito mais simples. E depois que você entender isso, tudo vai fazer sentido.`
      },
      {
        titulo: 'A Lei Que Ninguém Pode Escapar',
        conteudo: `Existe uma lei da física que governa o emagrecimento. Não importa se você é homem ou mulher. Alto ou baixo. Jovem ou mais velho. Seu corpo obedece essa lei:

**Se você consome menos energia do que gasta, você emagrece.**

Isso se chama **déficit calórico**.

Ponto. Não tem exceção. Não tem "mas o meu corpo é diferente". A lei da termodinâmica vale pra todo mundo.`
      },
      {
        titulo: 'Entendendo de Forma Simples',
        conteudo: `Imagine que seu corpo é uma conta bancária.

• **Calorias que você come** = dinheiro entrando
• **Calorias que você gasta** = dinheiro saindo
• **Gordura corporal** = saldo na conta

Se entra mais do que sai → o saldo aumenta → **você engorda**.

Se sai mais do que entra → o saldo diminui → **você emagrece**.

Simples assim.`
      },
      {
        titulo: 'Por Que As Dietas Parecem Funcionar',
        conteudo: `Toda dieta que "funciona" só funciona porque, de alguma forma, te coloca em déficit calórico.

**Low carb funciona?** Sim, porque cortando carboidrato você acaba comendo menos calorias no total.

**Jejum intermitente funciona?** Sim, porque pulando refeições você acaba comendo menos calorias no total.

**Dieta da sopa funciona?** Sim, porque sopa tem poucas calorias e você acaba comendo menos no total.

Percebe o padrão?

Não é a mágica do carboidrato. Não é o poder do jejum. Não é o segredo da sopa.

**É o déficit calórico. Sempre foi.**`
      },
      {
        titulo: 'A Grande Libertação',
        conteudo: `Quando você entende isso, você é libertado.

Você não precisa mais seguir regras malucas.
Você não precisa cortar grupos alimentares inteiros.
Você não precisa comer só alimentos "limpos".

Você só precisa de uma coisa: **comer um pouco menos do que gasta**.

E aqui está a melhor parte:

**Você pode comer qualquer coisa e ainda assim emagrecer — desde que esteja em déficit calórico.**

Pizza? Pode.
Chocolate? Pode.
Hambúrguer? Pode.
Sorvete? Pode.

Desde que no final do dia, da semana, você tenha consumido menos do que gastou.`
      },
      {
        titulo: 'Calculando Seu Gasto',
        conteudo: `Cada pessoa tem um número diferente. Isso depende de sua idade, peso, altura, nível de atividade e metabolismo.

Mas existe uma forma simples de estimar:

**Passo 1:** Multiplique seu peso (em kg) por 22.
Exemplo: 80kg × 22 = 1.760 calorias (metabolismo basal)

**Passo 2:** Multiplique pelo seu nível de atividade.
• Sedentário: × 1.2
• Levemente ativo: × 1.375
• Moderadamente ativo: × 1.55
• Muito ativo: × 1.725

Exemplo: 1.760 × 1.2 = **2.112 calorias por dia**

**Passo 3:** Subtraia 300 a 500 calorias para emagrecer.
Exemplo: 2.112 - 400 = **1.712 calorias por dia**

Comendo essa quantidade, você vai perder aproximadamente 0.5kg por semana. De forma sustentável. Sem passar fome.`
      },
      {
        titulo: 'Por Que Não Cortar Mais?',
        conteudo: `Você pode estar pensando: "Se eu cortar 1000 calorias, vou emagrecer mais rápido!"

**Não faça isso.** E aqui está o porquê:

1. **Você vai passar fome** — E fome leva à compulsão
2. **Seu metabolismo vai desacelerar** — Seu corpo vai se adaptar
3. **Você vai perder músculo** — O que deixa seu corpo flácido
4. **Você não vai aguentar** — É insustentável a longo prazo

Um déficit pequeno (300-500 calorias) é:
• Fácil de manter
• Não dispara fome extrema
• Preserva seu metabolismo
• Permite que você coma bem

**Devagar e consistente ganha de rápido e insustentável. Sempre.**`
      }
    ],
    resumo: [
      'O déficit calórico é o único princípio que faz você emagrecer',
      'Toda dieta que funciona só funciona porque cria déficit',
      'Você pode comer qualquer alimento, desde que esteja em déficit',
      'Um déficit de 300-500 calorias por dia é ideal',
      'Não precisa contar calorias — existem métodos mais simples'
    ]
  },
  {
    id: 'cap-3',
    numero: 3,
    titulo: 'Como Comer o Que Gosta e Ainda Assim Emagrecer',
    subtitulo: 'A regra 80/20 que muda tudo',
    descricao: 'A regra 80/20 e o método do encaixe para comer sem culpa.',
    slug: 'comer-o-que-gosta',
    tempoLeitura: 12,
    capituloAnterior: 'principio-que-funciona',
    proximoCapitulo: 'prato-inteligente',
    secoes: [
      {
        titulo: 'A Regra 80/20',
        conteudo: `Este é o capítulo que vai mudar sua relação com a comida para sempre.

Aqui está o segredo das pessoas que emagrecem e mantêm o peso sem sofrer:

**80% do tempo:** Alimentos nutritivos, que saciam e nutrem seu corpo.

**20% do tempo:** O que você quiser. Sem culpa. Sem restrição.

Isso significa que se você faz 21 refeições por semana (3 por dia × 7 dias), cerca de 4 delas podem ser "livres".

Quer pizza no sábado à noite? Encaixa.
Quer um chocolate depois do almoço? Encaixa.
Quer uma cerveja com os amigos? Encaixa.

Desde que os outros 80% sejam equilibrados.`
      },
      {
        titulo: 'Por Que Isso Funciona',
        conteudo: `Quando você sabe que pode comer seu alimento favorito, você para de pensar nele obsessivamente.

Quando você sabe que sábado tem pizza, você não fica a semana inteira sofrendo.

Quando você sabe que pode comer chocolate, você não devora uma caixa inteira quando finalmente "cede".

**A permissão elimina a compulsão.**`
      },
      {
        titulo: 'O Método do Encaixe',
        conteudo: `Vou te ensinar como encaixar qualquer alimento na sua alimentação.

**Passo 1: Saiba o "custo" calórico**

Alguns exemplos:
• 1 fatia de pizza: 250-300 cal
• 1 hambúrguer: 500-700 cal
• 1 cerveja: ~150 cal
• 1 taça de vinho: ~120 cal
• 1 bola de sorvete: 150-200 cal
• 1 barra de chocolate (25g): ~130 cal

**Passo 2: Faça a compensação**

Se você sabe que vai comer algo mais calórico, compense em outra refeição.

**Exemplo:** Pizza no jantar
Você sabe que vai comer 3 fatias (900 cal) no jantar.
No almoço, faz uma refeição mais leve: salada com frango (400 cal em vez de 700).
Você "economizou" 300 calorias. A pizza está encaixada.`
      },
      {
        titulo: 'A Mentalidade Certa',
        conteudo: `Dietas tradicionais te ensinam a pensar assim:

"Comi pizza = estraguei tudo = desisto"

**Isso está errado.**

A mentalidade correta é:

"Comi pizza = foi uma refeição = vida segue"

Uma refeição não estraga nada. O que estraga é transformar uma refeição em uma semana de descontrole.

Se você comeu demais no almoço, janta mais leve.
Se você exagerou no sábado, volta ao normal no domingo.
Se você teve uma semana difícil, a próxima semana você compensa.

**Não existe "estragar". Existe ajustar.**`
      },
      {
        titulo: 'O Poder da Quantidade',
        conteudo: `Muitas vezes, você não precisa cortar o alimento. Precisa apenas ajustar a quantidade.

Veja a diferença:

| Antes | Depois |
|-------|--------|
| 5 fatias de pizza | 2 fatias + salada |
| 1 barra de chocolate | 2 quadradinhos |
| 3 cervejas | 1 cerveja |
| Prato cheio de macarrão | Meia porção + proteína |

Você ainda come o que gosta. Só ajusta a quantidade. E a diferença calórica é enorme.`
      },
      {
        titulo: 'Comer Consciente',
        conteudo: `Quando for comer algo "especial", faça isso:

1. **Coloque no prato** — Não coma da embalagem
2. **Sente-se** — Não coma em pé ou andando
3. **Preste atenção** — Sinta o sabor, a textura
4. **Coma devagar** — Mastigue, aproveite
5. **Pare quando satisfeito** — Não quando estufado

Quando você come consciente, você precisa de menos para se satisfazer.

Um quadrado de chocolate saboreado devagar satisfaz mais do que uma barra inteira comida no automático.`
      }
    ],
    resumo: [
      '80% nutritivo, 20% livre — essa é a proporção que funciona',
      'Compense em outras refeições quando for comer algo mais calórico',
      'Não existe alimento proibido, existe frequência e quantidade',
      'Coma consciente para precisar de menos e aproveitar mais',
      'Uma refeição nunca estraga tudo — ajuste e siga em frente'
    ]
  },
  {
    id: 'cap-4',
    numero: 4,
    titulo: 'O Método do Prato Inteligente',
    subtitulo: 'Monte suas refeições sem contar calorias',
    descricao: 'Monte suas refeições de forma visual, sem contar calorias.',
    slug: 'prato-inteligente',
    tempoLeitura: 10,
    capituloAnterior: 'comer-o-que-gosta',
    proximoCapitulo: 'estrategias-dia-a-dia',
    secoes: [
      {
        titulo: 'Sem Neura, Sem Balança',
        conteudo: `Você não quer contar calorias. Eu entendo.

Ficar pesando comida, anotando tudo em aplicativo, calculando números... para muita gente isso é um saco.

A boa notícia: **você não precisa**.

O Método do Prato Inteligente é uma forma visual e simples de montar suas refeições. Sem balança. Sem aplicativo. Sem neura.`
      },
      {
        titulo: 'A Divisão do Prato',
        conteudo: `Olhe para seu prato e divida mentalmente assim:

**METADE DO PRATO: Vegetais e Salada**
• Folhas verdes (alface, rúcula, espinafre)
• Legumes (brócolis, couve-flor, abobrinha, cenoura)
• Tomate, pepino, cebola
• Verduras refogadas

Por que metade? Porque vegetais têm poucas calorias e muita fibra. Eles enchem seu estômago sem encher de calorias.

**UM QUARTO DO PRATO: Proteína**
• Frango, carne, peixe, ovos, porco
• Quantidade: tamanho da palma da sua mão

Por que proteína? Porque ela sacia. Você fica satisfeito por mais tempo.

**UM QUARTO DO PRATO: Carboidrato**
• Arroz, feijão, batata, macarrão, pão
• Quantidade: tamanho do seu punho fechado

Por que só um quarto? Porque carboidratos são mais calóricos. Não são vilões, mas em quantidade controlada.`
      },
      {
        titulo: 'Exemplos Práticos',
        conteudo: `**Almoço 1:**
• Metade: Salada verde + brócolis refogado
• 1/4: Filé de frango grelhado
• 1/4: Arroz com feijão

**Almoço 2:**
• Metade: Couve refogada + salada de repolho
• 1/4: Carne moída
• 1/4: Purê de batata

**Jantar 1:**
• Metade: Salada grande variada
• 1/4: Omelete de 2 ovos
• 1/4: Torrada integral

**Jantar 2:**
• Metade: Sopa de legumes
• 1/4: Frango desfiado (dentro da sopa)
• 1/4: Batata (dentro da sopa)`
      },
      {
        titulo: 'Medindo Sem Balança',
        conteudo: `Use suas mãos como referência:

• **Proteína** (carne, frango, peixe): Palma da mão
• **Carboidrato** (arroz, massa): Punho fechado
• **Gordura** (azeite, manteiga): Ponta do polegar
• **Vegetais**: À vontade (quanto mais, melhor)

Suas mãos são proporcionais ao seu corpo. Pessoa maior, mão maior, porção maior. Pessoa menor, mão menor, porção menor.

**Funciona automaticamente.**`
      },
      {
        titulo: 'O Segredo: Comece Pelos Vegetais',
        conteudo: `Quando for montar o prato, coloque os vegetais primeiro.

Preencha metade do prato com salada e legumes ANTES de colocar o resto.

Isso garante que você vai comer uma boa quantidade de vegetais — porque eles já estão ali.

Se você deixar por último, sempre vai faltar espaço (ou vontade).`
      },
      {
        titulo: 'Não Gosta de Salada?',
        conteudo: `Tudo bem. Você não precisa comer salada crua.

Alternativas:
• Legumes refogados (abobrinha, berinjela, chuchu)
• Legumes assados (cenoura, abóbora, beterraba)
• Legumes no vapor (brócolis, couve-flor)
• Sopas de legumes
• Purê de legumes

O importante é que metade do prato seja vegetal. **O formato é flexível.**`
      }
    ],
    resumo: [
      'Metade do prato: vegetais e salada (à vontade)',
      '1/4 do prato: proteína (palma da mão)',
      '1/4 do prato: carboidrato (punho fechado)',
      'Comece sempre pelos vegetais',
      'Use suas mãos como medida — funciona para qualquer pessoa'
    ]
  },
  {
    id: 'cap-5',
    numero: 5,
    titulo: 'Estratégias Para o Dia a Dia Real',
    subtitulo: 'Festas, restaurantes e finais de semana',
    descricao: 'Como lidar com festas, restaurantes e finais de semana.',
    slug: 'estrategias-dia-a-dia',
    tempoLeitura: 10,
    capituloAnterior: 'prato-inteligente',
    proximoCapitulo: 'pequenos-ajustes',
    secoes: [
      {
        titulo: 'O Vilão Escondido: Final de Semana',
        conteudo: `Muita gente faz tudo certo de segunda a sexta. E destrói no final de semana.

A matemática cruel:
• Segunda a sexta: -400 cal/dia = -2.000 cal na semana
• Sábado e domingo: +1.000 cal/dia = +2.000 cal no final de semana
• Resultado: **ZERO**. Você não emagreceu nada.

**Como resolver:**

1. **Escolha uma refeição livre** — Sábado à noite, por exemplo. O resto do dia, come equilibrado.

2. **Compense no mesmo dia** — Vai jantar pesado? Almoça leve.

3. **Não repita dois dias** — Exagerou no sábado? Domingo volta ao normal.`
      },
      {
        titulo: 'Festas e Eventos',
        conteudo: `**Antes de ir:**
• Não vá com fome extrema — Coma algo leve antes
• Decida antecipadamente — "Vou comer um pedaço de bolo"

**Durante o evento:**
• Coma proteína primeiro — Reduz a fome
• Não fique perto da mesa de comida
• Segure um copo de água — Mãos ocupadas comem menos
• Escolha 2-3 coisas que você realmente quer

**Sobre bebida alcoólica:**
• 1 cerveja: ~150 cal
• 1 caipirinha: ~300 cal
• 1 taça de vinho: ~120 cal

Alterne uma dose de bebida com um copo de água.`
      },
      {
        titulo: 'Restaurantes',
        conteudo: `**Por quilo:**
• Monte o prato usando o Método do Prato Inteligente
• Comece pela salada
• Não repita

**À la carte:**
• Não tenha vergonha de pedir modificações
• Peça molhos à parte
• Considere dividir ou levar metade pra casa

**Fast food:**
• Peça o sanduíche menor
• Troque batata por salada
• Não peça refrigerante (ou peça zero)
• Um hambúrguer simples (~400 cal) cabe no seu dia`
      },
      {
        titulo: 'Delivery',
        conteudo: `**Melhores escolhas:**
• Marmita fit
• Salada com proteína
• Poke bowl
• Comida japonesa (sashimi, temaki)
• Grelhado + acompanhamento

**Escolhas razoáveis:**
• Pizza (2 fatias, não a pizza inteira)
• Hambúrguer (sem batata e refrigerante)

**Armadilhas:**
• Combo gigante de fast food
• Porções "família" pra uma pessoa
• Sobremesa que você não planejou`
      },
      {
        titulo: 'Dias Ruins',
        conteudo: `Teve um dia estressante. Brigou com alguém. Está exausto. A tentação é afundar na comida.

**O que fazer:**

1. **Reconheça** — "Estou querendo comer porque estou estressado, não porque estou com fome."

2. **Respire** — 5 respirações profundas. Isso reduz a urgência.

3. **Pergunte** — "Isso vai me ajudar ou piorar daqui a 30 minutos?"

4. **Se for comer, coma consciente** — Sente, coloque num prato, coma devagar.

5. **Não se culpe** — Se você exagerou, passou. Amanhã é outro dia.`
      }
    ],
    resumo: [
      'Final de semana pode anular todo o progresso da semana',
      'Em festas: vá alimentado, escolha 2-3 coisas, não fique perto da comida',
      'Restaurantes: use o Prato Inteligente, peça modificações',
      'Dias ruins: reconheça a emoção, respire, não se culpe',
      'Uma refeição não define seu resultado — o padrão define'
    ]
  },
  {
    id: 'cap-6',
    numero: 6,
    titulo: 'O Poder dos Pequenos Ajustes',
    subtitulo: 'Trocas simples, grandes resultados',
    descricao: 'Trocas simples que fazem grande diferença.',
    slug: 'pequenos-ajustes',
    tempoLeitura: 8,
    capituloAnterior: 'estrategias-dia-a-dia',
    proximoCapitulo: 'fome-emocional',
    secoes: [
      {
        titulo: 'A Matemática dos Pequenos Ajustes',
        conteudo: `Economizar 100 calorias por dia parece pouco.

Mas: 100 cal/dia × 365 dias = 36.500 cal/ano

36.500 ÷ 7.700 (cal em 1kg de gordura) = **4,7kg de gordura**

Quase 5kg em um ano. Com UM pequeno ajuste.

Imagine fazer 3 ou 4 pequenos ajustes.`
      },
      {
        titulo: 'Trocas de Bebidas',
        conteudo: `Bebidas são o jeito mais fácil de economizar calorias.

| Em vez de... | Troque por... | Economia |
|--------------|---------------|----------|
| Refrigerante normal | Refrigerante zero ou água | ~150 cal |
| Suco de caixinha | Água com limão | ~120 cal |
| Café com açúcar (3 colheres) | Café com 1 colher | ~50 cal |
| Cappuccino cremoso | Café com leite | ~100 cal |
| Cerveja (3 latas) | Cerveja (1 lata) | ~300 cal |

**Só trocando o refrigerante por zero todo dia, você pode perder 5kg em um ano.**`
      },
      {
        titulo: 'Trocas no Preparo',
        conteudo: `O jeito que você prepara a comida faz diferença enorme.

| Em vez de... | Troque por... | Economia |
|--------------|---------------|----------|
| Fritar com óleo | Grelhar ou assar | ~100-200 cal |
| Empanar e fritar | Assar no forno | ~150 cal |
| Refogar com muito óleo | Refogar com pouco óleo | ~100 cal |
| Maionese na salada | Azeite + limão | ~80 cal |
| Molho cremoso | Molho de tomate | ~150 cal |

**A mesma comida, preparada diferente, pode ter metade das calorias.**`
      },
      {
        titulo: 'Trocas de Porção',
        conteudo: `Às vezes a troca não é o alimento. É a quantidade.

| Em vez de... | Troque por... | Economia |
|--------------|---------------|----------|
| Prato cheio de arroz | Meia porção | ~150 cal |
| 4 fatias de pizza | 2 fatias + salada | ~400 cal |
| Sobremesa grande | Sobremesa pequena | ~200 cal |
| Repetir o prato | Comer um prato só | ~300-500 cal |

**Comer no prato de sobremesa (menor) faz você naturalmente comer menos.**`
      },
      {
        titulo: 'Pequenos Hábitos',
        conteudo: `1. **Beba água antes das refeições** — Você come menos

2. **Use pratos menores** — Satisfação visual com menos comida

3. **Coma devagar** — O sinal de saciedade leva 20 minutos

4. **Não coma da embalagem** — Coloque em um prato

5. **Escove os dentes depois do jantar** — Reduz vontade de beliscar

6. **Não faça compras com fome** — Você compra mais besteira

7. **Frutas visíveis, besteiras escondidas** — Você come o que está fácil`
      }
    ],
    resumo: [
      'Pequenos ajustes somam grande resultado ao longo do tempo',
      'Trocas em bebidas são as mais fáceis e impactantes',
      'O preparo importa tanto quanto o alimento',
      'Reduzir porção é mais fácil que eliminar',
      'Escolha 3 ajustes e comece hoje'
    ]
  },
  {
    id: 'cap-7',
    numero: 7,
    titulo: 'Lidando Com a Fome Emocional',
    subtitulo: 'Quando a fome não é física',
    descricao: 'Identifique seus gatilhos e encontre alternativas.',
    slug: 'fome-emocional',
    tempoLeitura: 10,
    capituloAnterior: 'pequenos-ajustes',
    proximoCapitulo: 'plano-de-acao',
    secoes: [
      {
        titulo: 'Fome Física vs. Fome Emocional',
        conteudo: `É importante saber a diferença.

| Fome Física | Fome Emocional |
|-------------|----------------|
| Vem gradualmente | Vem de repente |
| Qualquer comida satisfaz | Só uma comida específica resolve |
| Você pode esperar | Parece urgente |
| Para quando está satisfeito | Continua mesmo cheio |
| Está no estômago | Está na cabeça |
| Não gera culpa | Gera culpa depois |

Se você está "morrendo de vontade" de um chocolate específico e nenhuma outra comida serve, provavelmente é fome emocional.`
      },
      {
        titulo: 'Os Gatilhos Mais Comuns',
        conteudo: `**Estresse** — O cortisol aumenta a vontade de comer doces e gorduras

**Tédio** — Sem nada para fazer, comer vira entretenimento

**Solidão** — Comida vira companhia

**Cansaço** — Força de vontade baixa, qualquer tentação vence

**Hábito** — TV = pipoca. Cinema = chocolate. Trabalho = café com biscoito.

**Recompensa** — "Mereço porque trabalhei muito"`
      },
      {
        titulo: 'Como Lidar',
        conteudo: `**Passo 1: Identifique**
Antes de comer, pergunte: "Estou com fome de verdade? Comeria uma maçã agora?"

**Passo 2: Pause**
Dê 10 minutos antes de comer. Muitas vezes a urgência passa.

**Passo 3: Substitua**
Encontre outra forma de lidar com a emoção:

| Emoção | Em vez de comer, tente... |
|--------|---------------------------|
| Estresse | Respiração, caminhada, música |
| Tédio | Ler, ver série, ligar pra alguém |
| Solidão | Mensagem pra amigo, sair de casa |
| Cansaço | Descansar, cochilo, banho |

**Passo 4: Se for comer, coma consciente**
Coloque no prato, sente-se, coma devagar, pare quando a vontade passar.`
      },
      {
        titulo: 'Quebrando o Ciclo',
        conteudo: `**Diário Alimentar Emocional**
Por uma semana, anote: o que comeu, que horas, se estava com fome física, o que estava sentindo antes.

Você vai começar a ver padrões.

**Planeje Alternativas**
"Quando eu sentir vontade de comer às 15h, vou levantar e tomar um café."
"Quando eu chegar estressado em casa, vou tomar banho antes de abrir a geladeira."

**Não Tenha Gatilhos em Casa**
Se você sabe que come a caixa de biscoito quando está estressado, não tenha caixa de biscoito em casa.

Não é sobre força de vontade. É sobre **não precisar** de força de vontade.`
      },
      {
        titulo: 'Sobre Culpa',
        conteudo: `Se você comeu emocionalmente, **não se torture**.

A culpa é inútil. Não queima calorias. Só te faz sentir pior — o que frequentemente leva a comer mais.

O que aconteceu, aconteceu. A próxima refeição é uma nova oportunidade.

"Ok, comi o chocolate inteiro. Estava estressado. Acontece. Agora vou jantar normalmente."

**Autocrítica destrutiva não te ajuda. Autocompaixão sim.**`
      }
    ],
    resumo: [
      'Fome emocional é diferente de fome física — aprenda a distinguir',
      'Identifique seus gatilhos: estresse, tédio, solidão, cansaço',
      'Pause 10 minutos antes de comer por impulso',
      'Encontre alternativas para cada emoção',
      'Não se culpe — siga em frente'
    ]
  },
  {
    id: 'cap-8',
    numero: 8,
    titulo: 'Seu Plano de Ação Simples',
    subtitulo: 'Comece hoje, não amanhã',
    descricao: 'Comece hoje com passos práticos e expectativas realistas.',
    slug: 'plano-de-acao',
    tempoLeitura: 8,
    capituloAnterior: 'fome-emocional',
    secoes: [
      {
        titulo: 'Semana 1: Fundação',
        conteudo: `O objetivo da primeira semana não é perder peso. É criar a base.

**1. Escolha 3 pequenos ajustes** (do Capítulo 6)
• Trocar refrigerante por água/zero
• Usar prato menor
• Beber água antes das refeições

**2. Aplique o Prato Inteligente**
• Metade: vegetais
• 1/4: proteína
• 1/4: carboidrato

**3. Observe seus padrões**
• Em que momentos você come sem fome?
• Quais são seus gatilhos?

Não precisa ser perfeito. Faça o melhor que puder.`
      },
      {
        titulo: 'Semana 2: Consistência',
        conteudo: `**1. Continue os 3 ajustes**
Se ficou fácil, adicione mais 1 ou 2.

**2. Continue o Prato Inteligente**
Tente aplicar em todas as refeições principais.

**3. Planeje o final de semana**
Escolha UMA refeição livre.
O resto, mantenha equilibrado.

**4. Use o Tracker**
Registre seu peso e veja sua evolução.`
      },
      {
        titulo: 'Semana 3-4: Ajustes',
        conteudo: `**1. Avalie o que está funcionando**
• Os ajustes estão fáceis ou difíceis?
• Você está conseguindo aplicar o Prato Inteligente?
• Como estão os finais de semana?

**2. Faça correções**
Se algum ajuste está muito difícil, troque por outro.
Se está fácil demais, adicione mais um.

**3. Lide com os gatilhos emocionais**
Aplique as estratégias do Capítulo 7.

**4. Pese-se semanalmente**
Mesmo dia, mesmo horário, de manhã.`
      },
      {
        titulo: 'Expectativas Realistas',
        conteudo: `**Quanto você vai perder:**
• 0,5kg a 1kg por semana é saudável
• 2kg a 4kg por mês é realista
• Em 6 meses: 12-24kg
• Em 1 ano: 24-48kg

**O peso flutua:**
Você não vai perder peso toda semana. Às vezes vai reter líquido, especialmente mulheres no ciclo.
Não se desespere. Olhe a tendência, não o dia a dia.

**Haverá semanas ruins:**
Viagem. Festa. Estresse. Normal. Faz parte.
Significa que você viveu. Depois você volta ao normal.`
      },
      {
        titulo: 'Quando Escorregar',
        conteudo: `Porque você vai escorregar. Todo mundo escorrega.

**1. Não transforme um deslize em desistência**
Comeu demais no almoço? O jantar não precisa ser igual.

**2. Não se puna**
Nada de "vou ficar sem comer amanhã". Isso só perpetua o ciclo.

**3. Analise sem julgamento**
O que aconteceu? O que você pode fazer diferente?

**4. Siga em frente**
O passado não muda. O futuro está na sua mão.`
      },
      {
        titulo: 'Você Consegue',
        conteudo: `Eu sei que você já tentou antes.
Eu sei que já falhou.
Eu sei que às vezes parece impossível.

Mas dessa vez é diferente. Porque dessa vez você não está fazendo dieta.

Você está aprendendo a comer de um jeito que funciona — **pra sempre**.

Sem proibições. Sem sofrimento. Sem data pra acabar.

Só você, fazendo escolhas um pouco melhores, um dia de cada vez.

E isso você consegue.

**Comece hoje. Não amanhã. Não segunda-feira. Hoje.**`
      }
    ],
    resumo: [
      'Semana 1: 3 ajustes + Prato Inteligente + observar padrões',
      'Semana 2: Consistência + planejar final de semana',
      'Semana 3-4: Avaliar, ajustar, lidar com emoções',
      'Expectativa: 0,5-1kg por semana, 2-4kg por mês',
      'Quando escorregar: não desista, não se puna, siga em frente'
    ]
  }
]

// Função para buscar capítulo por slug
export function getCapituloBySlug(slug: string): CapituloCompleto | undefined {
  return CAPITULOS_CONTEUDO.find(cap => cap.slug === slug)
}

// Função para buscar capítulo por número
export function getCapituloByNumero(numero: number): CapituloCompleto | undefined {
  return CAPITULOS_CONTEUDO.find(cap => cap.numero === numero)
}
