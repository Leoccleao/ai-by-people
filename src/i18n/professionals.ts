/**
 * Formação Profissional — programa 02.
 * Conteúdo isolado do translations.ts principal por volume: são seis pilares,
 * cada um com sua própria página em /profissionais/$pilar.
 * `professionalsEn` é tipado a partir do PT para as duas línguas não saírem de sincronia.
 */

export const professionalsPt = {
  eyebrow: "Formação Profissional · Direto com quem faz",
  headline: "Fluência em IA não é um assunto. É a sua função, feita de outro jeito.",
  sub: "Trabalhamos direto com o profissional. O upskilling é pela função que a pessoa exerce — não por um curso genérico de IA.",

  argKicker: "O argumento",
  argTitle: "Um curso genérico ensina a ferramenta. Ninguém é pago para operar a ferramenta.",
  argBody:
    "Quem trabalha com finanças não precisa saber o que é um modelo de linguagem. Precisa fechar o mês mais rápido, reconciliar o que hoje é conferência manual e defender o número numa reunião. Quem trabalha com marketing precisa de campanha no ar, não de prompt bonito. Por isso a formação parte da função: os casos são os da rotina de quem está na sala, os dados se parecem com os dados reais, e o que sai de lá entra no trabalho de segunda-feira.",

  pillarsKicker: "Os pilares",
  pillarsTitle: "Seis funções. Seis programas diferentes.",
  pillarsSub:
    "Cada pilar tem seus próprios casos, materiais e critérios de qualidade. O método é o mesmo; o trabalho, não.",

  methodKicker: "Como funciona",
  methodTitle: "Três movimentos, sempre nessa ordem.",
  method: [
    {
      t: "Trazer o trabalho real",
      b: "Cada participante chega com uma tarefa que já faz — a que consome tempo, a que ninguém gosta, a que atrasa o resto. Nada de exercício inventado.",
    },
    {
      t: "Construir com alguém do lado",
      b: "Facilitador sênior da área, grupo pequeno, tempo de trabalho de verdade. A pessoa constrói; a gente corrige o caminho enquanto ela constrói.",
    },
    {
      t: "Sair conseguindo repetir",
      b: "O critério de conclusão não é ter assistido. É a pessoa refazer sozinha, com outro caso, na frente do grupo.",
    },
  ],

  platformKicker: "Depois da sala",
  platformTitle: "Cada pilar tem webinar gravado e material follow along.",
  platformBody:
    "Quem participa recebe acesso à plataforma: o webinar do seu pilar, o guia do workshop e todos os arquivos para refazer os exercícios com os dados da própria empresa. Os outros pilares ficam abertos para explorar.",
  platformCta: "Acessar a plataforma",

  cta: "Quero formação por função no meu time",

  /** Blocos compartilhados por todas as páginas de pilar. */
  pillarPage: {
    back: "Formação Profissional",
    eyebrowPrefix: "Formação Profissional · Pilar",
    changesKicker: "O que muda na função",
    changesTitle: "Onde a IA realmente entra no seu dia.",
    buildKicker: "O que você constrói",
    buildTitle: "Você sai com coisas funcionando, não com anotações.",
    whoKicker: "Para quem é",
    otherPillars: "Outros pilares",
  },

  pillars: [
    {
      slug: "financas",
      nav: "Finanças",
      blurb:
        "Fechamento, reconciliação, análise de variação e a defesa do número. IA no que hoje é planilha, cópia e conferência manual.",
      headline: "O mês fecha do mesmo jeito. O caminho até lá é que muda.",
      sub: "Para quem responde por número: controladoria, FP&A, contabilidade, tesouraria.",
      who: "Analistas, coordenadores e gerentes de controladoria, FP&A, contabilidade e tesouraria.",
      changes: [
        {
          t: "Reconciliação deixa de ser leitura linha a linha",
          b: "Cruzar extrato, razão e relatório de sistema vira uma rotina assistida, com a exceção apontada em vez de procurada.",
        },
        {
          t: "Análise de variação vira texto que alguém lê",
          b: "Do número que saiu fora ao parágrafo que explica por quê — com a fonte de cada afirmação anexada.",
        },
        {
          t: "Fórmula complicada deixa de ser herança",
          b: "Planilha que ninguém entende passa a ser explicada, documentada e refeita de forma auditável.",
        },
        {
          t: "A conferência sobe de nível",
          b: "Você para de conferir dígito e passa a conferir premissa. É aí que o erro caro mora.",
        },
      ],
      builds: [
        {
          t: "Um fechamento assistido ponta a ponta",
          b: "Uma etapa real do seu fechamento, refeita com IA e com checagem embutida.",
        },
        {
          t: "Um comentário de variação padrão",
          b: "Modelo que produz o comentário do mês a partir dos seus próprios números.",
        },
        {
          t: "Um revisor de planilha",
          b: "Rotina que lê a planilha, descreve o que ela faz e aponta o que não bate.",
        },
        {
          t: "Seu checklist de confiabilidade",
          b: "O que precisa ser verificado antes de qualquer número gerado com IA sair da sua mão.",
        },
      ],
    },
    {
      slug: "marketing",
      nav: "Marketing",
      blurb:
        "Da pesquisa de público ao copy que vai ao ar. Produção com padrão de marca e revisão que segura o que não presta.",
      headline: "Produzir mais rápido é fácil. Produzir mais rápido no padrão é o trabalho.",
      sub: "Para quem tem calendário para cumprir e marca para defender.",
      who: "Times de conteúdo, performance, produto de marketing, brand e agências internas.",
      changes: [
        {
          t: "Pesquisa de público deixa de ser achismo",
          b: "Sintetizar entrevista, ticket de suporte e review vira etapa de rotina, não projeto anual.",
        },
        {
          t: "O briefing passa a ser o ativo",
          b: "Quem escreve um bom briefing de marca extrai bom material. Quem não escreve, extrai texto genérico.",
        },
        {
          t: "Variação vira volume controlado",
          b: "Dez versões de um anúncio com a mesma promessa e o mesmo tom, prontas para teste.",
        },
        {
          t: "Revisão vira critério explícito",
          b: "O que reprova um texto deixa de ser gosto pessoal e vira lista que a máquina também aplica.",
        },
      ],
      builds: [
        {
          t: "Seu guia de marca em formato utilizável",
          b: "Tom, vocabulário, proibições e exemplos — no formato que a IA consegue seguir de fato.",
        },
        {
          t: "Uma campanha real, do briefing ao copy final",
          b: "Peça de verdade do seu calendário, produzida na sala e aprovada pelos seus critérios.",
        },
        {
          t: "Um sintetizador de pesquisa",
          b: "Rotina que transforma entrevistas e feedback bruto em insumo de posicionamento.",
        },
        {
          t: "Um crivo de qualidade",
          b: "Checklist que reprova o texto ruim antes de ele chegar em alguém.",
        },
      ],
    },
    {
      slug: "vendas",
      nav: "Vendas",
      blurb:
        "Pesquisa de conta, preparação de reunião, proposta e follow-up. O pipeline andando com menos trabalho morto.",
      headline: "O tempo que some entre uma reunião e outra é o que a gente ataca.",
      sub: "Para quem vive de pipeline: campo, inside sales, pré-vendas e liderança comercial.",
      who: "Executivos de conta, SDR/BDR, pré-vendas, gerentes e diretores comerciais.",
      changes: [
        {
          t: "Pesquisa de conta em minutos, não em noites",
          b: "Do release ao balanço, do site ao LinkedIn: um retrato útil da conta antes da primeira ligação.",
        },
        {
          t: "Preparação de reunião deixa de ser improviso",
          b: "Hipótese de dor, perguntas certas e objeções previstas — escritas antes, não lembradas depois.",
        },
        {
          t: "Proposta para de ser copiar-colar da última",
          b: "Proposta montada sobre o que foi dito na reunião, com o que a conta precisa ouvir.",
        },
        {
          t: "Follow-up deixa de morrer",
          b: "A nota da reunião vira o próximo passo, o e-mail e o registro no CRM — no mesmo movimento.",
        },
      ],
      builds: [
        {
          t: "Seu dossiê de conta",
          b: "Rotina que produz o pré-briefing de qualquer conta a partir de fontes públicas.",
        },
        {
          t: "Um preparador de reunião",
          b: "Da agenda às perguntas e às objeções prováveis, no seu formato de venda.",
        },
        {
          t: "Um gerador de proposta",
          b: "Proposta real do seu funil, montada a partir das notas da reunião.",
        },
        {
          t: "Um fechador de loop",
          b: "Nota de reunião vira resumo, próximo passo e e-mail de follow-up prontos para revisão.",
        },
      ],
    },
    {
      slug: "estrategia-operacoes",
      nav: "Estratégia & Operações",
      blurb:
        "Diagnóstico, priorização, desenho de processo e o acompanhamento que normalmente ninguém faz. Menos deck, mais decisão.",
      headline: "Menos deck. Mais decisão que sobrevive à semana seguinte.",
      sub: "Para quem desenha o processo, prioriza a fila e responde pelo que foi combinado.",
      who: "Estratégia, PMO, BizOps, excelência operacional e lideranças de operação.",
      changes: [
        {
          t: "Diagnóstico deixa de depender de agenda",
          b: "Entrevistas, documentos e dados soltos viram um mapa do problema em dias, não em trimestres.",
        },
        {
          t: "Priorização passa a ter critério escrito",
          b: "O que entra e o que fica de fora deixa de ser negociação de corredor e vira regra defensável.",
        },
        {
          t: "Processo vira documento vivo",
          b: "Desenhar, testar e revisar o fluxo com IA em vez de manter um manual que ninguém abre.",
        },
        {
          t: "Acompanhamento deixa de ser um deck mensal",
          b: "O que foi combinado, quem ficou com o quê e o que travou — atualizado sem uma reunião para isso.",
        },
      ],
      builds: [
        {
          t: "Um diagnóstico real",
          b: "Um problema da sua operação, mapeado com o material que você já tem na mão.",
        },
        {
          t: "Sua matriz de priorização",
          b: "Critérios explícitos aplicados à sua fila atual, com o corte justificado.",
        },
        {
          t: "Um desenho de processo revisado",
          b: "Fluxo atual descrito, gargalo apontado e proposta de novo desenho.",
        },
        {
          t: "Um acompanhamento automatizado",
          b: "Rotina que transforma as notas das reuniões no status da iniciativa.",
        },
      ],
    },
    {
      slug: "dados",
      nav: "Análise de Dados",
      blurb:
        "Da pergunta de negócio à consulta, do resultado à narrativa. Análise que aguenta ser questionada.",
      headline: "A consulta é a parte fácil. Sustentar a resposta é que é análise.",
      sub: "Para quem responde perguntas com dado — e precisa que a resposta se sustente.",
      who: "Analistas de dados e BI, analistas de negócio e times que vivem de relatório.",
      changes: [
        {
          t: "A pergunta de negócio vira consulta mais rápido",
          b: "Da frase vaga do stakeholder à consulta escrita, com as premissas explicitadas antes de rodar.",
        },
        {
          t: "Exploração deixa de ser trabalho braçal",
          b: "Perfilar tabela nova, achar o que está sujo e entender o que a coluna significa em minutos.",
        },
        {
          t: "O resultado vira narrativa",
          b: "Do gráfico à frase que a diretoria entende — sem inventar causa onde só há correlação.",
        },
        {
          t: "A checagem entra no fluxo",
          b: "Toda resposta gerada com IA passa por verificação contra a fonte antes de virar slide.",
        },
      ],
      builds: [
        {
          t: "Uma análise real, do pedido à resposta",
          b: "Uma pergunta de verdade do seu negócio, respondida e defendida na sala.",
        },
        {
          t: "Um perfilador de base",
          b: "Rotina que descreve uma tabela nova: o que tem, o que falta, o que não confia.",
        },
        {
          t: "Um tradutor de resultado",
          b: "Do output técnico ao parágrafo executivo, com as ressalvas no lugar certo.",
        },
        {
          t: "Seu protocolo de verificação",
          b: "O que precisa ser conferido antes de um número gerado com IA circular na empresa.",
        },
      ],
    },
    {
      slug: "juridico",
      nav: "Jurídico",
      blurb:
        "Revisão de contrato, pesquisa, minuta e a checagem que separa o que a IA sugeriu do que se pode assinar.",
      headline:
        "A IA acelera a leitura. A responsabilidade continua sendo sua — e é por isso que o método importa.",
      sub: "Para departamento jurídico e escritório: velocidade sem abrir mão de verificação.",
      who: "Jurídico interno, compliance, contratos e escritórios de advocacia.",
      changes: [
        {
          t: "Revisão de contrato começa pelo desvio",
          b: "Comparar a minuta recebida com o seu padrão e chegar direto no que fugiu — em vez de reler tudo.",
        },
        {
          t: "Pesquisa muda de ponto de partida",
          b: "Levantar tese e material de apoio mais rápido, com a fonte sempre conferida antes de citar.",
        },
        {
          t: "Minuta deixa de nascer do zero",
          b: "Primeira versão montada a partir das suas cláusulas aprovadas, não de um modelo qualquer da internet.",
        },
        {
          t: "A verificação vira etapa formal",
          b: "Nada gerado por IA sai sem checagem contra a fonte oficial. O método é o que torna o uso defensável.",
        },
      ],
      builds: [
        {
          t: "Um revisor de contrato contra o seu padrão",
          b: "Rotina que aponta desvio de cláusula em relação ao seu modelo aprovado.",
        },
        {
          t: "Sua biblioteca de cláusulas utilizável",
          b: "O que já está aprovado, organizado no formato que a IA consegue reaproveitar.",
        },
        {
          t: "Uma minuta real",
          b: "Um documento do seu dia a dia, produzido e revisado na sala.",
        },
        {
          t: "Seu protocolo de checagem",
          b: "A regra escrita do que precisa ser verificado — citação, referência e fonte — antes de qualquer entrega.",
        },
      ],
    },
  ],
};

export const professionalsEn: typeof professionalsPt = {
  eyebrow: "Professional Upskilling · Straight to the practitioner",
  headline: "AI fluency is not a subject. It is your job, done a different way.",
  sub: "We work directly with the professional. The upskilling follows the function the person actually performs — not a generic AI course.",

  argKicker: "The argument",
  argTitle: "A generic course teaches the tool. Nobody is paid to operate the tool.",
  argBody:
    "A finance professional does not need to know what a language model is. They need to close the month faster, reconcile what is manual checking today and defend the number in a meeting. A marketing professional needs a campaign live, not a clever prompt. That is why the training starts from the function: the cases come from the routine of the people in the room, the data looks like real data, and what comes out of it goes into Monday's work.",

  pillarsKicker: "The pillars",
  pillarsTitle: "Six functions. Six different programs.",
  pillarsSub:
    "Each pillar has its own cases, materials and quality bar. The method is the same; the work is not.",

  methodKicker: "How it works",
  methodTitle: "Three moves, always in this order.",
  method: [
    {
      t: "Bring the real work",
      b: "Everyone arrives with a task they already do — the one that eats time, the one nobody likes, the one that delays everything else. No invented exercises.",
    },
    {
      t: "Build with someone beside you",
      b: "A senior facilitator from the field, a small group, real working time. The person builds; we correct the path while they build.",
    },
    {
      t: "Leave able to repeat it",
      b: "Completion is not measured by attendance. It is the person doing it again alone, with a different case, in front of the group.",
    },
  ],

  platformKicker: "After the room",
  platformTitle: "Every pillar has a recorded webinar and follow-along material.",
  platformBody:
    "Participants get access to the platform: their pillar's webinar, the workshop guide and every file needed to redo the exercises with their own company's data. The other pillars stay open to explore.",
  platformCta: "Go to the platform",

  cta: "I want function-based training for my team",

  pillarPage: {
    back: "Professional Upskilling",
    eyebrowPrefix: "Professional Upskilling · Pillar",
    changesKicker: "What changes in the function",
    changesTitle: "Where AI actually enters your day.",
    buildKicker: "What you build",
    buildTitle: "You leave with things that work, not with notes.",
    whoKicker: "Who it is for",
    otherPillars: "Other pillars",
  },

  pillars: [
    {
      slug: "financas",
      nav: "Finance",
      blurb:
        "Closing, reconciliation, variance analysis and defending the number. AI where today there is spreadsheet, copy-paste and manual checking.",
      headline: "The month closes the same way. What changes is the path to get there.",
      sub: "For the people accountable for the number: controlling, FP&A, accounting, treasury.",
      who: "Analysts, coordinators and managers in controlling, FP&A, accounting and treasury.",
      changes: [
        {
          t: "Reconciliation stops being line-by-line reading",
          b: "Matching statement, ledger and system report becomes an assisted routine, with the exception surfaced instead of hunted.",
        },
        {
          t: "Variance analysis becomes text someone reads",
          b: "From the number that came out off to the paragraph explaining why — with the source of every claim attached.",
        },
        {
          t: "The complicated formula stops being an inheritance",
          b: "The spreadsheet nobody understands gets explained, documented and rebuilt in an auditable way.",
        },
        {
          t: "Checking moves up a level",
          b: "You stop checking digits and start checking assumptions. That is where the expensive mistake lives.",
        },
      ],
      builds: [
        {
          t: "An assisted close, end to end",
          b: "One real step of your close, rebuilt with AI and with verification built in.",
        },
        {
          t: "A standard variance commentary",
          b: "A routine that produces the month's commentary from your own numbers.",
        },
        {
          t: "A spreadsheet reviewer",
          b: "A routine that reads the spreadsheet, describes what it does and flags what does not add up.",
        },
        {
          t: "Your reliability checklist",
          b: "What must be verified before any AI-generated number leaves your hands.",
        },
      ],
    },
    {
      slug: "marketing",
      nav: "Marketing",
      blurb:
        "From audience research to the copy that goes live. Production at brand standard, with review that holds back what is not good enough.",
      headline: "Producing faster is easy. Producing faster at standard is the work.",
      sub: "For people with a calendar to hit and a brand to defend.",
      who: "Content, performance, product marketing, brand teams and in-house agencies.",
      changes: [
        {
          t: "Audience research stops being guesswork",
          b: "Synthesizing interviews, support tickets and reviews becomes routine, not an annual project.",
        },
        {
          t: "The brief becomes the asset",
          b: "Whoever writes a good brand brief gets good material out. Whoever does not, gets generic text.",
        },
        {
          t: "Variation becomes controlled volume",
          b: "Ten versions of an ad with the same promise and the same tone, ready to test.",
        },
        {
          t: "Review becomes an explicit standard",
          b: "What kills a piece of copy stops being personal taste and becomes a list the machine applies too.",
        },
      ],
      builds: [
        {
          t: "Your brand guide in a usable format",
          b: "Tone, vocabulary, prohibitions and examples — in the format AI can actually follow.",
        },
        {
          t: "A real campaign, from brief to final copy",
          b: "An actual piece from your calendar, produced in the room and approved against your own criteria.",
        },
        {
          t: "A research synthesizer",
          b: "A routine that turns interviews and raw feedback into positioning input.",
        },
        {
          t: "A quality gate",
          b: "A checklist that rejects bad copy before it reaches anyone.",
        },
      ],
    },
    {
      slug: "vendas",
      nav: "Sales",
      blurb:
        "Account research, meeting prep, proposal and follow-up. The pipeline moving with less dead work.",
      headline: "The time that disappears between one meeting and the next is what we attack.",
      sub: "For people who live on pipeline: field, inside sales, pre-sales and commercial leadership.",
      who: "Account executives, SDR/BDR, pre-sales, commercial managers and directors.",
      changes: [
        {
          t: "Account research in minutes, not evenings",
          b: "From press release to financials, from website to LinkedIn: a useful picture of the account before the first call.",
        },
        {
          t: "Meeting prep stops being improvisation",
          b: "Pain hypothesis, the right questions and expected objections — written before, not remembered after.",
        },
        {
          t: "The proposal stops being a copy of the last one",
          b: "A proposal built on what was actually said in the meeting, with what the account needs to hear.",
        },
        {
          t: "Follow-up stops dying",
          b: "Meeting notes become the next step, the email and the CRM record — in one move.",
        },
      ],
      builds: [
        {
          t: "Your account dossier",
          b: "A routine that produces the pre-brief for any account from public sources.",
        },
        {
          t: "A meeting preparer",
          b: "From the agenda to the questions and likely objections, in your sales format.",
        },
        {
          t: "A proposal generator",
          b: "A real proposal from your funnel, assembled from the meeting notes.",
        },
        {
          t: "A loop closer",
          b: "Meeting notes become a summary, a next step and a follow-up email ready for review.",
        },
      ],
    },
    {
      slug: "estrategia-operacoes",
      nav: "Strategy & Operations",
      blurb:
        "Diagnosis, prioritization, process design and the follow-through nobody usually does. Fewer decks, more decisions.",
      headline: "Fewer decks. More decisions that survive the following week.",
      sub: "For people who design the process, prioritize the queue and answer for what was agreed.",
      who: "Strategy, PMO, BizOps, operational excellence and operations leadership.",
      changes: [
        {
          t: "Diagnosis stops depending on calendars",
          b: "Interviews, documents and scattered data become a map of the problem in days, not quarters.",
        },
        {
          t: "Prioritization gets written criteria",
          b: "What gets in and what stays out stops being a hallway negotiation and becomes a defensible rule.",
        },
        {
          t: "Process becomes a living document",
          b: "Design, test and revise the flow with AI instead of maintaining a manual nobody opens.",
        },
        {
          t: "Follow-through stops being a monthly deck",
          b: "What was agreed, who owns what and what got stuck — updated without a meeting for it.",
        },
      ],
      builds: [
        {
          t: "A real diagnosis",
          b: "One problem from your operation, mapped with the material you already have.",
        },
        {
          t: "Your prioritization matrix",
          b: "Explicit criteria applied to your current queue, with the cut justified.",
        },
        {
          t: "A revised process design",
          b: "Current flow described, bottleneck identified and a proposed new design.",
        },
        {
          t: "Automated follow-through",
          b: "A routine that turns meeting notes into the status of the initiative.",
        },
      ],
    },
    {
      slug: "dados",
      nav: "Data Analysis",
      blurb:
        "From the business question to the query, from the result to the narrative. Analysis that holds up when questioned.",
      headline: "The query is the easy part. Standing behind the answer is the analysis.",
      sub: "For people who answer questions with data — and need the answer to hold.",
      who: "Data and BI analysts, business analysts and teams that live on reporting.",
      changes: [
        {
          t: "The business question becomes a query faster",
          b: "From the stakeholder's vague sentence to a written query, with assumptions made explicit before running it.",
        },
        {
          t: "Exploration stops being manual labor",
          b: "Profile a new table, find what is dirty and understand what a column means, in minutes.",
        },
        {
          t: "The result becomes a narrative",
          b: "From the chart to the sentence leadership understands — without inventing causation where there is only correlation.",
        },
        {
          t: "Verification enters the flow",
          b: "Every AI-generated answer is checked against the source before it becomes a slide.",
        },
      ],
      builds: [
        {
          t: "A real analysis, from request to answer",
          b: "An actual question from your business, answered and defended in the room.",
        },
        {
          t: "A dataset profiler",
          b: "A routine that describes a new table: what it has, what is missing, what not to trust.",
        },
        {
          t: "A result translator",
          b: "From technical output to an executive paragraph, with the caveats in the right place.",
        },
        {
          t: "Your verification protocol",
          b: "What must be checked before an AI-generated number circulates in the company.",
        },
      ],
    },
    {
      slug: "juridico",
      nav: "Legal",
      blurb:
        "Contract review, research, drafting and the check that separates what AI suggested from what can be signed.",
      headline:
        "AI speeds up the reading. The responsibility is still yours — which is exactly why method matters.",
      sub: "For legal departments and law firms: speed without giving up verification.",
      who: "In-house legal, compliance, contracts and law firms.",
      changes: [
        {
          t: "Contract review starts from the deviation",
          b: "Compare the received draft against your standard and go straight to what departed — instead of rereading everything.",
        },
        {
          t: "Research changes its starting point",
          b: "Build up the argument and supporting material faster, with the source always checked before citing.",
        },
        {
          t: "Drafts stop starting from zero",
          b: "A first version assembled from your approved clauses, not from some template found online.",
        },
        {
          t: "Verification becomes a formal step",
          b: "Nothing AI-generated goes out without being checked against the official source. The method is what makes the use defensible.",
        },
      ],
      builds: [
        {
          t: "A contract reviewer against your standard",
          b: "A routine that flags clause deviations relative to your approved model.",
        },
        {
          t: "Your clause library, made usable",
          b: "What is already approved, organized in the format AI can actually reuse.",
        },
        {
          t: "A real draft",
          b: "A document from your day-to-day, produced and reviewed in the room.",
        },
        {
          t: "Your checking protocol",
          b: "The written rule for what must be verified — citation, reference and source — before anything is delivered.",
        },
      ],
    },
  ],
};
