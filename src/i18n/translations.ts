export type Lang = "pt" | "en";

export const translations = {
  pt: {
    nav: {
      home: "Início",
      programs: "Programas",
      about: "Sobre",
      contact: "Contato",
      corporate: "Corporate",
      ecosystem: "Ecossistema",
      sovereignty: "Soberania",
      schools: "Escolas",
      trainers: "Formação de Formadores",
      index: "Índice de Fluência em IA",
    },
    common: {
      tagline: "IA feita por pessoas",
      getInTouch: "Fale com a gente",
      exploreProgram: "Conheça o programa",
      explorePrograms: "Conheça os programas",
      backToContact: "Fale com a gente",
      email: "E-mail",
      name: "Nome",
      message: "Mensagem",
      organization: "Organização",
      programOfInterest: "Programa de interesse",
      selectPlaceholder: "Selecione",
      send: "Enviar",
      toastSent: "Mensagem enviada. Voltamos em até dois dias úteis.",
      manifestoClose: "Nosso produto não é o protótipo. É a pessoa que sai capaz de construir o próximo.",
      nonprofitEyebrow: "Organização sem fins lucrativos",
      readMore: "Ler mais",
      soon: "Em breve",
    },
    home: {
      heroTitle: "A IA não vai substituir pessoas. Vai substituir quem virou espectador.",
      heroSub:
        "Existimos para desenvolver pessoas num mundo em que a IA está redesenhando o trabalho e a educação. Não com conteúdo. Com trabalho real, feito por elas.",
      etymTitle: "Ars + facere",
      etymBody:
        "A palavra artificial vem de ars + facere — feito por mão humana. Inteligência artificial é, na origem, inteligência feita por gente. A pergunta nunca foi se a máquina pensa. É quem ainda sabe fazer.",
      problemKicker: "O problema",
      problemTitle: "Três coisas aconteceram ao mesmo tempo.",
      problems: [
        {
          t: "O mercado de trabalho mudou em 24 meses.",
          b: "Toda revolução técnica separou quem opera a máquina de quem é operado por ela. A IA está fazendo de novo, mais rápido, e não pediu autorização.",
        },
        {
          t: "A escola foi redesenhada sem ser avisada.",
          b: "Escolas banniram o ChatGPT, depois desistiram. Nem banir nem ignorar é estratégia. A prova de sempre não descreve mais o aluno que a fez.",
        },
        {
          t: "A resposta padrão foi conteúdo.",
          b: "Cursos, vídeos, listas de dez prompts que vão mudar sua vida. Conteúdo não vira capacidade. Uma semana depois, nada mudou na rotina de ninguém.",
        },
      ],
      thesisKicker: "Nossa tese",
      thesisTitle:
        "Capacidade se transfere de um jeito só: fazendo trabalho real, com alguém do lado, até a pessoa conseguir sozinha.",
      contrastLeft: "O curso online típico",
      contrastRight: "O nosso método",
      contrastLeftItems: [
        "40h de vídeo genérico",
        "Assistido sozinho, depois do expediente",
        "Construído sobre exemplos genéricos",
        "Ensina prompts, não soluções",
        "Sem protótipo, sem alinhamento de time",
      ],
      contrastRightItems: [
        "Imersão hands-on, dentro do horário de trabalho",
        "Caso de uso e dado real",
        "Grupo pequeno, facilitador sênior, presencial",
        "Ensina a construir, entregar e manter",
        "Protótipo funcional que o time evolui sozinho",
      ],
      thesisClose: "Sem espectador. Sem demo pronta.",
      programsKicker: "Programas",
      programsTitle: "Seis frentes. Um mesmo método.",
      programsSub:
        "Do executivo sênior ao aluno do ensino médio. Do professor ao desenvolvedor. A imersão muda de forma; o compromisso é o mesmo.",
      impactKicker: "Impacto",
      impactTitle: "Números que preferimos mostrar honestamente.",
      impactNote: "Primeira edição institucional em campo. Dados publicados quando fecharmos a rodada.",
      impactLabels: [
        "profissionais formados",
        "empresas atendidas",
        "escolas parceiras",
        "turmas gratuitas",
      ],
    },
    contact: {
      kicker: "Contato",
      title: "Fale com a gente",
      sub: "Conte o contexto e o que você quer destravar. Respondemos em até dois dias úteis.",
    },
    footer: {
      programs: "Programas",
      contact: "Contato",
      note1: "AI by People é uma organização sem fins lucrativos.",
      note2: "O programa Corporate financia os programas gratuitos.",
    },
    programBlurbs: {
      corporate:
        "Imersão hands-on para times e executivos. Caso real, protótipo funcional, time capaz de manter. É o programa que financia todos os outros.",
      ecosystem:
        "Construímos e organizamos ecossistemas de desenvolvedores para empresas de tecnologia.",
      sovereignty:
        "Capacidade técnica profunda em profissionais brasileiros, de graça. Um país que só consome IA feita fora aluga o próprio futuro.",
      schools:
        "Fluência em IA no ensino médio e na universidade, com escolas e professores, não contra eles.",
      trainers:
        "Um professor formado alcança 150 alunos por ano. É assim que o método escala sem a gente na sala.",
      index:
        "Pesquisa anual com dado primário. Sem medida, o país debate política de IA no escuro.",
    },
    stub: {
      body:
        "Esta página está em construção. Enquanto isso, escreva para contato@aibypeople.org e conte o que você quer resolver.",
    },
    pages: {
      corporate: {
        eyebrow: "Programa Corporate · O motor que financia a ONG",
        headline: "Seu time sabe que está perdendo o bonde. Só não consegue tempo para colocar a mão na massa.",
        sub: "Imersão presencial de 1 a 2 dias, em torno de um caso de uso real do seu time. Sai um protótipo funcional — e um time capaz de mantê-lo e evoluí-lo sem depender de ninguém.",
        fundingNote:
          "Este é o único programa pago da AI by People. A receita dele financia Soberania, Escolas, Formação de Formadores e o Índice.",
        realityKicker: "A realidade na maioria das empresas",
        realityTitle: "Quatro coisas que a gente escuta em quase toda diagnóstico.",
        reality: [
          { t: "Sem tempo para cursos online", b: "Executivos e operadores ocupados não vão maratonar 40h de vídeo on-demand. Precisam aprender enquanto fazem trabalho real." },
          { t: "Não sabem o que é possível", b: "Sem experiência prática, líderes não separam 'truque de chatbot' de 'isso substitui um workflow inteiro'." },
          { t: "Existem entusiastas, mas isolados", b: "Quase todo time tem um ou dois champions experimentando por conta. O trabalho deles raramente escala." },
          { t: "Treinamento genérico não cola", b: "Workshops prontos ensinam prompts, não soluções. Uma semana depois, nada mudou na rotina." },
        ],
        phasesKicker: "Como funciona",
        phasesTitle: "Três fases. Um resultado.",
        phases: [
          {
            t: "Diagnóstico",
            b: "Até três reuniões online. Mapeamos como o time já usa IA hoje, identificamos os champions internos e priorizamos os casos de uso de maior alavancagem.",
            deliverables: [
              "entrevistas com stakeholders",
              "identificação de champions",
              "shortlist de casos de uso",
              "diagnóstico de maturidade",
            ],
          },
          {
            t: "Workshop",
            b: "Sessão presencial de 1 a 2 dias, facilitador sênior, grupo pequeno, dado real. Três blocos no dia: calibração (nivelamento e revisão do escopo) → hands-on (o time começa a construir com dados reais) → iteração e robustez (refinamento, exceções, testes e documentação).",
            deliverables: [
              "currículo customizado",
              "caso de uso e dados reais",
              "protótipo funcional",
            ],
          },
          {
            t: "Apresentação",
            b: "O próprio time apresenta para a liderança: o que construiu, o que isso destrava e quais os próximos passos.",
            deliverables: ["apresentação executiva", "roadmap para escalar"],
          },
        ],
        stats: [
          { n: "1 dia", l: "presencial" },
          { n: "10", l: "participantes máx." },
          { n: "100%", l: "customizado ao caso real" },
          { n: "1", l: "protótipo funcional" },
        ],
        callout:
          "Isto é um programa de capacitação. Não é um serviço de desenvolvimento. Embora o workshop quase sempre entregue um artefato funcional ligado ao workflow real do time, nosso compromisso é com a transferência de capacidade. O time sai preparado para customizar, manter e evoluir.",
        casesKicker: "Casos reais",
        casesTitle: "Anonimizados, mas verdadeiros.",
        cases: [
          {
            t: "Automação de back office financeiro",
            items: [
              "extração automática de condições comerciais de contratos em PDF",
              "controle mensal de faturamento consolidando ERP, planilhas e e-mail",
              "identificação do que bloqueia cada fatura",
              "alertas de clientes não faturados",
              "dashboard de controle",
            ],
          },
          {
            t: "Avaliação de sentenças judiciais",
            items: [
              "base estruturada de sentenças indexada por juiz, tema, vara e resultado",
              "agente conversacional de busca em linguagem natural, com fonte e citações",
              "identificação de argumentos recorrentes e da posição típica de cada juiz",
              "sugestão de caminho argumentativo",
            ],
          },
        ],
        formatsKicker: "Formatos",
        formatsTitle: "Duas maneiras de entrar.",
        formats: [
          { t: "In company", b: "Customizado, no seu escritório, com seu dado. Um caso real, um time, um protótipo." },
          { t: "Turma aberta", b: "Imersão presencial para profissionais sêniores de mercado. Turmas pequenas, datas periódicas." },
        ],
        cta: "Solicitar uma proposta",
      },
      ecosystem: {
        eyebrow: "Programa Ecossistema · Para empresas de tecnologia",
        headline: "Uma plataforma não vale nada sem quem constrói em cima dela.",
        sub: "Construímos e organizamos ecossistemas de desenvolvedores. Comunidade, champions, eventos e adoção real — não números de vaidade.",
        argKicker: "O argumento",
        argTitle: "Signup é fácil de medir. Adoção é difícil de fingir.",
        argBody:
          "Toda empresa de tecnologia sabe medir signups. Poucas sabem medir quem realmente construiu algo que funciona. Documentação não vira integração. Lançamento não vira adoção. Entre a plataforma e o desenvolvedor existe uma distância que só se atravessa com gente — organizando comunidade, formando champions e colocando desenvolvedores para construir de verdade.",
        offerKicker: "O que fazemos",
        offerTitle: "Cinco frentes que funcionam juntas.",
        offers: [
          { t: "Arquitetura de comunidade", b: "Construir e operar a comunidade de desenvolvedores em torno da plataforma. Do zero, ou assumindo uma comunidade estagnada." },
          { t: "Programa de champions", b: "Identificar, formar e ativar os desenvolvedores que já evangelizam a plataforma, e dar a eles estrutura para escalar." },
          { t: "Aceleração de eventos", b: "Inscrições e presença qualificada em lançamentos, hackathons e conferências de desenvolvedores." },
          { t: "Engenharia de adoção", b: "Transformar documentação e lançamentos em workshops hands-on que produzem integrações funcionando, não só cadastros." },
          { t: "Inteligência de ecossistema", b: "Mapear quem está construindo o quê, onde está o atrito e o que o ecossistema precisa a seguir." },
        ],
        trackKicker: "Track record",
        trackTitle: "Onde já operamos.",
        trackBody:
          "Já organizamos uma comunidade de desenvolvedores do zero e aceleramos as inscrições do evento brasileiro de uma das maiores plataformas de IA do mundo. Sabemos onde o ecossistema trava — porque estivemos dentro dele.",
        engageKicker: "Como engajamos",
        engageTitle: "Três tipos de contrato.",
        engage: [
          { t: "Diagnóstico do ecossistema", b: "Um retrato do estado atual: quem constrói, o que trava, onde está a alavanca." },
          { t: "Programa de ativação (3 a 6 meses)", b: "Uma frente clara, com metas e time dedicado. Champions, evento, adoção — escolhemos junto." },
          { t: "Operação contínua da comunidade", b: "A gente toca a comunidade no dia a dia. Ritmo, conteúdo, relacionamento e leitura do ecossistema." },
        ],
        cta: "Vamos falar sobre seu ecossistema",
      },
      sovereignty: {
        eyebrow: "Programa Soberania · Gratuito",
        headline: "Um país que só consome IA feita fora está alugando o próprio futuro.",
        sub: "Formação técnica profunda, de graça, para profissionais brasileiros. Não se trata de construir um modelo nacional. Trata-se de construir as pessoas que saberiam construir.",
        manifestoKicker: "O argumento",
        manifesto: [
          "Soberania tecnológica não é um datacenter. Não é um modelo com bandeira. É a capacidade instalada de um povo entender, construir, auditar e adaptar a tecnologia que organiza a sua vida.",
          "Um país pode importar chips. Pode importar modelos. Não pode importar julgamento. No dia em que a decisão for difícil — sobre o que automatizar, o que auditar, o que recusar — a resposta vai depender de quantas pessoas ali dentro sabem realmente como a coisa funciona.",
          "Hoje esse número é pequeno demais. E não é falta de talento. É falta de acesso: a formação de fronteira acontece em inglês, em círculos fechados, dentro de empresas que não estão aqui.",
          "Por isso este programa é gratuito, e sempre será.",
        ],
        whatKicker: "O que fazemos",
        whatTitle: "Formação profunda, sem cobrar.",
        what: [
          { t: "Turmas gratuitas", b: "Formação técnica profunda, aberta e sem custo para quem for selecionado." },
          { t: "Construir, não assistir", b: "O foco é fazer trabalho real, no mesmo método que usamos com empresas." },
          { t: "Currículo de fronteira", b: "No nível do que se pratica hoje nas melhores empresas do mundo." },
          { t: "Rede que forma rede", b: "Uma comunidade crescente de pessoas capazes de construir nesse nível — e de formar as próximas." },
        ],
        whoKicker: "Quem pode participar",
        whoTitle: "Capacidade e compromisso, não diploma.",
        whoBody:
          "Profissionais técnicos brasileiros, com seleção por capacidade e compromisso — não por diploma ou pedigree.",
        supportKicker: "Como apoiar",
        supportTitle: "Três caminhos.",
        support: [
          { t: "Doe", b: "A doação financia turmas gratuitas. Vai integralmente para bolsas, facilitadores e infraestrutura." },
          { t: "Faça uma parceria", b: "Empresas e instituições que queiram patrocinar turmas ou abrir formação em suas regiões." },
          { t: "Seja facilitador voluntário", b: "Profissionais sêniores que topem ceder alguns dias por ano para formar a próxima geração." },
        ],
        cta: "Quero apoiar",
      },
    },
  },
  en: {
    nav: {
      home: "Home",
      programs: "Programs",
      about: "About",
      contact: "Contact",
      corporate: "Corporate",
      ecosystem: "Ecosystem",
      sovereignty: "Sovereignty",
      schools: "Schools",
      trainers: "Train the Trainers",
      index: "AI Fluency Index",
    },
    common: {
      tagline: "AI made by people",
      getInTouch: "Get in touch",
      exploreProgram: "Explore the program",
      explorePrograms: "Explore the programs",
      backToContact: "Get in touch",
      email: "Email",
      name: "Name",
      message: "Message",
      organization: "Organization",
      programOfInterest: "Program of interest",
      selectPlaceholder: "Select",
      send: "Send",
      toastSent: "Message sent. We'll be back within two business days.",
      manifestoClose: "Our product is not the prototype. It's the person who walks out able to build the next one.",
      nonprofitEyebrow: "A non-profit organization",
      readMore: "Read more",
      soon: "Coming soon",
    },
    home: {
      heroTitle: "AI won't replace people. It will replace the ones who became spectators.",
      heroSub:
        "We exist to develop people in a world where AI is redesigning work and education. Not with content. With real work, done by them.",
      etymTitle: "Ars + facere",
      etymBody:
        "The word artificial comes from ars + facere — made by human hand. Artificial intelligence is, at its origin, intelligence made by people. The question was never whether the machine thinks. It's who still knows how to make.",
      problemKicker: "The problem",
      problemTitle: "Three things happened at the same time.",
      problems: [
        {
          t: "The labor market changed in 24 months.",
          b: "Every technical revolution separated those who operate the machine from those who are operated by it. AI is doing it again, faster, and it didn't ask permission.",
        },
        {
          t: "The classroom was redesigned without being told.",
          b: "Schools banned ChatGPT, then gave up. Neither banning nor ignoring is a strategy. The old exam no longer describes the student who took it.",
        },
        {
          t: "The default answer was content.",
          b: "Courses, videos, lists of ten prompts that will change your life. Content does not become capability. A week later nothing changed in anyone's routine.",
        },
      ],
      thesisKicker: "Our thesis",
      thesisTitle:
        "Capability transfers in exactly one way: doing real work, with someone beside you, until the person can do it alone.",
      contrastLeft: "The typical online course",
      contrastRight: "Our method",
      contrastLeftItems: [
        "40 hours of generic video",
        "Watched alone, after work",
        "Built on generic examples",
        "Teaches prompts, not solutions",
        "No prototype, no team alignment",
      ],
      contrastRightItems: [
        "Hands-on immersion, inside working hours",
        "Real use case, real data",
        "Small group, senior facilitator, in person",
        "Teaches how to build, ship and maintain",
        "A working prototype the team evolves on its own",
      ],
      thesisClose: "No spectators. No pre-baked demos.",
      programsKicker: "Programs",
      programsTitle: "Six fronts. One method.",
      programsSub:
        "From the senior executive to the high-school student. From the teacher to the developer. The immersion changes shape; the commitment is the same.",
      impactKicker: "Impact",
      impactTitle: "Numbers we prefer to show honestly.",
      impactNote: "First institutional edition in the field. Data will be published once the round closes.",
      impactLabels: [
        "professionals trained",
        "companies served",
        "partner schools",
        "free cohorts",
      ],
    },
    contact: {
      kicker: "Contact",
      title: "Get in touch",
      sub: "Tell us the context and what you want to unlock. We reply within two business days.",
    },
    footer: {
      programs: "Programs",
      contact: "Contact",
      note1: "AI by People is a non-profit organization.",
      note2: "The Corporate program funds the free programs.",
    },
    programBlurbs: {
      corporate:
        "Hands-on immersion for teams and executives. Real use case, working prototype, a team that can maintain it. This is the program that funds all the others.",
      ecosystem:
        "We build and organize developer ecosystems for technology companies.",
      sovereignty:
        "Deep technical capability in Brazilian professionals, free of charge. A country that only consumes AI built elsewhere is renting its own future.",
      schools:
        "AI fluency in high school and university — with schools and teachers, not against them.",
      trainers:
        "One trained teacher reaches 150 students a year. This is how the method scales without us in the room.",
      index:
        "Annual research with primary data. Without a measurement, the country debates AI policy blind.",
    },
    stub: {
      body:
        "This page is being written. Meanwhile, email contato@aibypeople.org and tell us what you want to solve.",
    },
  },
};

export type Translations = typeof translations.pt;

export const PROGRAM_ROUTES = [
  { to: "/corporativo", key: "corporate" as const, num: "01" },
  { to: "/ecossistema", key: "ecosystem" as const, num: "02" },
  { to: "/soberania", key: "sovereignty" as const, num: "03" },
  { to: "/escolas", key: "schools" as const, num: "04" },
  { to: "/formadores", key: "trainers" as const, num: "05" },
  { to: "/indice", key: "index" as const, num: "06" },
];
