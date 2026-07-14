export type Lang = "pt" | "en";

export const translations = {
  pt: {
    nav: {
      home: "Início",
      programs: "Programas",
      about: "Sobre",
      contact: "Contato",
      corporate: "Corporativo",
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
      readMore: "Saiba mais",
      email: "E-mail",
      name: "Nome",
      message: "Mensagem",
      organization: "Organização",
      send: "Enviar",
      sent: "Recebemos sua mensagem. Retornamos em breve.",
      cta: "Vamos conversar",
      ctaSub: "Conte o contexto e o que você quer destravar. Respondemos em até dois dias úteis.",
      manifestoClose: "Nosso produto não é o protótipo. É a pessoa que sai capaz de construir o próximo.",
      nonprofitNote: "AI by People é uma organização sem fins lucrativos. O programa Corporativo financia os programas gratuitos.",
    },
    home: {
      heroTitle: "A IA não vai substituir pessoas. Vai substituir quem virou espectador.",
      heroSub:
        "Toda revolução técnica separa quem opera a máquina de quem é operado por ela. Desta vez o intervalo é de meses. Nós formamos pessoas capazes de construir — não de assistir.",
      etymTitle: "Ars + facere",
      etymBody:
        "A palavra artificial vem do latim ars + facere: feito por mão humana. Inteligência artificial é, na origem, inteligência feita por pessoas. A pergunta nunca foi se a máquina pensa. É quem ainda sabe fazer.",
      problemKicker: "O problema",
      problemTitle: "O intervalo entre saber que existe e saber fazer nunca foi tão grande.",
      problem1Title: "A escola foi redesenhada sem ser avisada",
      problem1Body:
        "Professores descobriram no meio do semestre que a resposta da prova está a três segundos de distância. Proibir não funcionou. Ignorar também não.",
      problem2Title: "O mercado de trabalho mudou em 24 meses",
      problem2Body:
        "Funções inteiras foram reescritas. Quem só consome IA vira custo. Quem constrói vira alavanca. A distância entre os dois cresce todo trimestre.",
      problem3Title: "A resposta padrão foi conteúdo",
      problem3Body:
        "Cursos, vídeos, listas de dez prompts. Uma semana depois, nada mudou na rotina de ninguém. Conteúdo não vira capacidade.",
      thesisKicker: "Nossa tese",
      thesisTitle: "Capacidade se transfere de um jeito só: fazendo trabalho real, com alguém do lado, até a pessoa saber fazer sozinha.",
      thesisBody:
        "Sem espectadores. Sem demonstração pronta. O caso é seu. Os dados são seus. O protótipo sai com você — e a pessoa que sai com ele sabe mantê-lo, customizá-lo e evoluí-lo.",
      contrastLeft: "O curso online típico",
      contrastRight: "O que fazemos",
      contrastLeftItems: [
        "40 horas de vídeo genérico",
        "Assistido sozinho, no intervalo do almoço",
        "Ensina prompts, não soluções",
        "Nenhum protótipo ao final",
        "Certificado no LinkedIn, nada na rotina",
      ],
      contrastRightItems: [
        "Imersão prática com facilitador sênior",
        "Grupo pequeno, caso real, dados reais",
        "Ensina a construir, não a repetir",
        "Um protótipo funcional ao final",
        "O time sai capaz de manter e evoluir",
      ],
      programsKicker: "Programas",
      programsTitle: "Seis frentes. Um mesmo método.",
      programsSub:
        "Do executivo sênior ao aluno do ensino médio. Do professor ao desenvolvedor. A imersão muda de forma; o compromisso é o mesmo: a pessoa sai capaz.",
      impactKicker: "Impacto",
      impactTitle: "Números que preferimos mostrar honestamente.",
      impactNote: "Dados atualizados a cada edição. Sem inflar, sem arredondar para cima.",
      impact: [
        { n: "1.200+", label: "profissionais formados em imersões práticas" },
        { n: "42", label: "protótipos em produção após os workshops" },
        { n: "18", label: "empresas atendidas no programa Corporativo" },
        { n: "6", label: "escolas em programas-piloto" },
      ],
    },
    corporate: {
      title: "Corporativo",
      kicker: "Para times sêniores",
      hero: "Seu time sabe que está perdendo o bonde. Só não consegue tempo para colocar a mão na massa.",
      sub:
        "Um programa de capacitação prática, com caso e dados reais da sua operação. O time sai com um protótipo funcional e — mais importante — com a capacidade de mantê-lo.",
      argTitle: "O que este programa é (e o que não é)",
      argBody:
        "Isto é um programa de capacitação. Não é um serviço de desenvolvimento. Nosso compromisso é transferência de capacidade: o time sai capaz de customizar, manter e evoluir a solução sem depender de nós.",
      phasesKicker: "Como funciona",
      phasesTitle: "Três fases, um resultado.",
      phase1Title: "1. Diagnóstico",
      phase1Body:
        "Até três encontros online. Mapeamos como o time usa IA hoje, identificamos os champions internos e definimos os casos de uso de maior alavancagem.",
      phase2Title: "2. Workshop",
      phase2Body:
        "Um a dois dias de imersão presencial. Facilitador sênior, grupo pequeno, dados reais. O time termina com um protótipo funcional que resolve um problema seu.",
      phase3Title: "3. Apresentação",
      phase3Body:
        "Showcase final para a liderança, conduzido pelo próprio time. O que construíram, o que isso destrava, e o roadmap para levar adiante.",
      stats: [
        "1 dia presencial",
        "máx. 10 participantes",
        "100% customizado ao caso real",
        "1 protótipo funcional ao final",
      ],
      casesKicker: "Casos reais",
      casesTitle: "Anonimizados, mas verdadeiros.",
      case1Title: "Automação de back office financeiro",
      case1Body:
        "Extração de termos comerciais de contratos em PDF, controle de faturamento mensal, detecção de clientes não faturados e um dashboard de controle. Construído pelo próprio time financeiro em dois dias.",
      case2Title: "Avaliação de sentenças judiciais",
      case2Body:
        "Base estruturada de decisões passadas indexada por juiz, tema, tribunal e resultado, com agente conversacional que responde com citações e sugere caminhos argumentativos.",
      openTitle: "Também temos turmas abertas",
      openBody:
        "Além do formato in-company, oferecemos imersões presenciais de matrícula aberta para profissionais sêniores. Mesmo método, grupo formado por profissionais de empresas distintas.",
      cta: "Solicitar uma proposta",
    },
    ecosystem: {
      title: "Ecossistema",
      kicker: "Developer Relations",
      hero: "Construímos e organizamos ecossistemas de desenvolvedores para empresas de tecnologia.",
      sub:
        "Do zero, ou assumindo uma comunidade estagnada. O objetivo é sempre o mesmo: gente construindo de verdade em cima da sua plataforma.",
      argTitle: "Por que fazer isso com quem constrói",
      argBody:
        "Comunidade de desenvolvedor não se anima com brinde. Se anima com gente sênior do outro lado, resposta técnica de verdade e espaço para construir. É esse o padrão que operamos.",
      offerKicker: "O que oferecemos",
      offerTitle: "Cinco frentes que funcionam juntas.",
      offers: [
        {
          t: "Arquitetura de comunidade",
          b: "Estruturar e operar a comunidade de desenvolvedores em torno da plataforma — do zero ou reativando uma que travou.",
        },
        {
          t: "Programa de champions",
          b: "Identificar, formar e ativar quem já evangeliza a plataforma, com estrutura para escalar sem perder qualidade.",
        },
        {
          t: "Aceleração de eventos",
          b: "Impulsionar inscrições e presença qualificada em lançamentos, hackathons e conferências para desenvolvedores.",
        },
        {
          t: "Engenharia de adoção",
          b: "Transformar documentação e lançamentos em workshops práticos que produzem integrações reais — não apenas cadastros.",
        },
        {
          t: "Inteligência de ecossistema",
          b: "Mapear quem está construindo o quê, onde está a fricção e do que o ecossistema precisa a seguir.",
        },
      ],
      whyKicker: "Por que a gente",
      whyTitle: "Track record comprovado.",
      whyBody:
        "Organizamos comunidade de desenvolvedores e aceleramos inscrições para o principal evento de uma grande plataforma de IA no Brasil. Sem revelar clientes: o resultado fala por si nas conversas que temos com você.",
      cta: "Conversar sobre seu ecossistema",
    },
    sovereignty: {
      title: "Soberania",
      kicker: "O núcleo sem fins lucrativos",
      hero: "Capacidade técnica profunda em profissionais brasileiros é pilar de soberania nacional.",
      sub:
        "Um país que só consome IA construída em outro lugar é um país que aluga o próprio futuro. Não se trata de construir um LLM nacional. Trata-se de construir as pessoas capazes de construir.",
      argTitle: "O que está em jogo",
      argBody:
        "Nas próximas décadas, decisões sobre saúde pública, educação, justiça e infraestrutura vão passar por sistemas que ninguém no país sabe manter. Isso não é uma opinião política — é uma conta de risco. Soberania hoje se mede em quantas pessoas conseguem abrir a caixa preta e trabalhar dentro dela.",
      whatKicker: "O que fazemos",
      whatTitle: "Formação técnica profunda, gratuita, para profissionais brasileiros.",
      whatBody:
        "Turmas abertas. Método hands-on, o mesmo do programa Corporativo. Uma rede crescente de pessoas capazes de construir no nível da fronteira — e de formar as próximas.",
      supportKicker: "Como apoiar",
      supportTitle: "Três caminhos.",
      support: [
        { t: "Doações", b: "Empresas e indivíduos que financiam turmas abertas. Recursos vão integralmente para bolsas, facilitadores e infraestrutura." },
        { t: "Parcerias institucionais", b: "Universidades, institutos e órgãos públicos que querem escalar formação técnica em suas regiões." },
        { t: "Facilitadores voluntários", b: "Profissionais sêniores que topam ceder alguns dias por ano para formar a próxima geração." },
      ],
      cta: "Quero apoiar",
    },
    schools: {
      title: "Escolas",
      kicker: "Ensino médio e universidades",
      hero: "A escola foi redesenhada sem ser avisada. Ninguém pediu autorização.",
      sub:
        "Proibir o ChatGPT não funcionou. Fingir que não existe também não. Mapeamos, com escolas parceiras, os desafios que a IA cria para a formação — e construímos as primeiras iniciativas junto com alunos e professores.",
      argTitle: "A moldura honesta",
      argBody:
        "Escolas banniram, depois desistiram. Nem banir nem ignorar é estratégia. A pergunta certa é outra: como formar pessoas que pensem quando a resposta já é grátis.",
      whatKicker: "O que fazemos",
      whatTitle: "Quatro frentes com a escola.",
      what: [
        { t: "Diagnóstico institucional", b: "Como a IA já está sendo usada — por alunos, professores e coordenação — e o que isso quer dizer para o projeto pedagógico." },
        { t: "Workshops com professores", b: "Uso crítico e prático da IA em sala. Não é palestra: é imersão, com casos das próprias disciplinas." },
        { t: "Workshops com alunos", b: "Ensino médio, principalmente. Da mecânica ao pensamento crítico. Como usar, quando não usar, e como perceber quando o modelo está errado." },
        { t: "Redesenho de avaliação", b: "Apoio em repensar prova, trabalho e projeto para um mundo em que a resposta é grátis e o raciocínio, não." },
      ],
      cta: "Falar com nossa equipe de escolas",
    },
    trainers: {
      title: "Formação de Formadores",
      kicker: "Para quem forma outras pessoas",
      hero: "Um professor formado alcança 150 alunos por ano. Um facilitador interno mantém uma empresa aprendendo depois que a gente sai.",
      sub:
        "Formamos professores, coordenadores e facilitadores internos para conduzir o método por conta própria. É assim que a coisa escala sem depender de a gente estar na sala.",
      argTitle: "A lógica",
      argBody:
        "Não dá para atender o país indo de sala em sala. Dá para atender formando quem forma. Nosso trabalho é replicar quem replica.",
      howKicker: "Estrutura do programa",
      howTitle: "Quatro etapas.",
      how: [
        { t: "Imersão no método", b: "O formador vive, como participante, o mesmo tipo de imersão que vai conduzir depois." },
        { t: "Prática supervisionada", b: "Conduz suas primeiras turmas com um facilitador sênior do lado, ajustando o passo em tempo real." },
        { t: "Certificação como facilitador", b: "Avaliação prática. Não é diploma decorativo — é habilitação para conduzir a metodologia com nossa chancela." },
        { t: "Rede de apoio contínuo", b: "Comunidade ativa de facilitadores, sessões de supervisão e materiais atualizados a cada rodada." },
      ],
      cta: "Quero me formar como facilitador",
    },
    indexPage: {
      title: "Índice de Fluência em IA",
      kicker: "Pesquisa anual, dados primários",
      hero: "O primeiro retrato honesto da fluência em IA no Brasil.",
      sub:
        "Não é quantas pessoas usaram o ChatGPT uma vez. É uma medida de capacidade real: quem consegue construir, manter e evoluir alguma coisa — em profissionais, empresas, escolas e no ecossistema de desenvolvedores.",
      whyKicker: "Por que importa",
      whyBody:
        "Sem medição, o país discute política de IA às cegas. Cada instituição usa o número que lhe convém. Este índice existe para acabar com isso — e para ser referência pública, aberta e comparável entre edições.",
      methodKicker: "Metodologia",
      methodTitle: "Três camadas, uma leitura.",
      method: [
        { t: "Survey em larga escala", b: "Amostragem representativa de profissionais, alunos e desenvolvedores no país." },
        { t: "Avaliação prática", b: "Não medimos autodeclaração. Medimos o que a pessoa consegue efetivamente construir em tarefas padronizadas." },
        { t: "Entrevistas institucionais", b: "Conversa profunda com empresas, escolas e órgãos públicos para contextualizar os números." },
      ],
      statusKicker: "Status",
      statusBody: "Primeira edição, atualmente em campo. Publicação prevista para o próximo ciclo.",
      openTitle: "Publicação aberta",
      openBody: "Os dados serão publicados gratuitamente, com metodologia auditável e microdados disponíveis para pesquisa.",
      captureTitle: "Receba o índice quando sair",
      captureSub: "Sem newsletter, sem spam. Um e-mail, uma vez, quando a primeira edição for publicada.",
      capturePlaceholder: "seu@email.com",
      captureBtn: "Quero receber",
      captureOk: "Pronto. Avisamos você.",
    },
    contact: {
      kicker: "Contato",
      title: "Fale com a gente",
      sub: "Conte o contexto e o que você quer destravar. Respondemos em até dois dias úteis.",
    },
    footer: {
      programs: "Programas",
      contact: "Contato",
      rights: "AI by People — organização sem fins lucrativos.",
      note: "O programa Corporativo financia os programas gratuitos.",
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
      readMore: "Read more",
      email: "Email",
      name: "Name",
      message: "Message",
      organization: "Organization",
      send: "Send",
      sent: "We got your message. We'll be back shortly.",
      cta: "Let's talk",
      ctaSub: "Tell us the context and what you want to unlock. We reply within two business days.",
      manifestoClose: "Our product is not the prototype. It's the person who walks out able to build the next one.",
      nonprofitNote: "AI by People is a non-profit organization. The Corporate program funds the free programs.",
    },
    home: {
      heroTitle: "AI won't replace people. It will replace the ones who became spectators.",
      heroSub:
        "Every technical revolution separates those who operate the machine from those who are operated by it. This time the gap is months long. We form people who can build — not watch.",
      etymTitle: "Ars + facere",
      etymBody:
        "The word artificial comes from the Latin ars + facere: made by human hand. Artificial intelligence is, at its origin, intelligence made by people. The question was never whether the machine thinks. It's who still knows how to make.",
      problemKicker: "The problem",
      problemTitle: "The gap between knowing it exists and knowing how to do it has never been wider.",
      problem1Title: "School was redesigned without being told",
      problem1Body:
        "Teachers discovered mid-semester that the answer to the exam is three seconds away. Banning didn't work. Ignoring didn't either.",
      problem2Title: "The labor market changed in 24 months",
      problem2Body:
        "Whole roles were rewritten. Those who only consume AI become cost. Those who build become leverage. The distance grows every quarter.",
      problem3Title: "The default answer was content",
      problem3Body:
        "Courses, videos, lists of ten prompts. A week later, nothing changed in anyone's routine. Content does not become capability.",
      thesisKicker: "Our thesis",
      thesisTitle: "Capability transfers in exactly one way: by doing real work, with someone beside you, until the person can do it alone.",
      thesisBody:
        "No spectators. No pre-baked demo. The case is yours. The data is yours. The prototype leaves with you — and the person who leaves with it knows how to maintain, customize and evolve it.",
      contrastLeft: "The typical online course",
      contrastRight: "What we do",
      contrastLeftItems: [
        "40 hours of generic video",
        "Watched alone, at lunch break",
        "Teaches prompts, not solutions",
        "No prototype at the end",
        "A LinkedIn certificate, nothing in the routine",
      ],
      contrastRightItems: [
        "Hands-on immersion with a senior facilitator",
        "Small group, real case, real data",
        "Teaches how to build, not how to repeat",
        "A working prototype at the end",
        "The team leaves able to maintain and evolve it",
      ],
      programsKicker: "Programs",
      programsTitle: "Six fronts. One method.",
      programsSub:
        "From the senior executive to the high-school student. From the teacher to the developer. The immersion changes shape; the commitment is the same: the person leaves capable.",
      impactKicker: "Impact",
      impactTitle: "Numbers we prefer to show honestly.",
      impactNote: "Refreshed each edition. No inflation, no rounding up.",
      impact: [
        { n: "1,200+", label: "professionals trained in hands-on immersions" },
        { n: "42", label: "prototypes in production after the workshops" },
        { n: "18", label: "companies served in the Corporate program" },
        { n: "6", label: "schools in pilot programs" },
      ],
    },
    corporate: {
      title: "Corporate",
      kicker: "For senior teams",
      hero: "Your team knows they're missing the boat. They just can't find the time to actually put their hands on it.",
      sub:
        "A practical training program with a real case and real data from your operation. The team leaves with a working prototype — and, more importantly, with the capability to maintain it.",
      argTitle: "What this program is (and isn't)",
      argBody:
        "This is a training program. It is not a development service. Our commitment is capability transfer: the team leaves able to customize, maintain and evolve the solution without depending on us.",
      phasesKicker: "How it works",
      phasesTitle: "Three phases, one outcome.",
      phase1Title: "1. Diagnostic",
      phase1Body:
        "Up to three online meetings. We map how the team uses AI today, identify internal champions, and select the highest-leverage use cases.",
      phase2Title: "2. Workshop",
      phase2Body:
        "One to two days of in-person immersion. Senior facilitator, small group, real data. The team ends with a working prototype that solves a problem of theirs.",
      phase3Title: "3. Presentation",
      phase3Body:
        "Final showcase to leadership, led by the team themselves. What they built, what it unlocks, and the roadmap to take it forward.",
      stats: [
        "1 day on-site",
        "max. 10 participants",
        "100% tailored to a real case",
        "1 working prototype at the end",
      ],
      casesKicker: "Real cases",
      casesTitle: "Anonymized, but true.",
      case1Title: "Financial back-office automation",
      case1Body:
        "Extracting commercial terms from PDF contracts, monthly billing control, detection of unbilled clients, and a control dashboard. Built by the finance team itself in two days.",
      case2Title: "Assessment of judicial rulings",
      case2Body:
        "Structured database of past rulings indexed by judge, topic, court and outcome, with a conversational agent that answers with citations and suggests argument paths.",
      openTitle: "We also run open cohorts",
      openBody:
        "Beyond the in-company format, we offer open-enrollment in-person immersions for senior professionals. Same method, groups made of people from different companies.",
      cta: "Request a proposal",
    },
    ecosystem: {
      title: "Ecosystem",
      kicker: "Developer Relations",
      hero: "We build and organize developer ecosystems for technology companies.",
      sub:
        "From zero, or by taking over a stagnant community. The goal is always the same: people actually building on top of your platform.",
      argTitle: "Why work with people who build",
      argBody:
        "Developer communities don't come alive because of swag. They come alive because senior people are on the other side, technical answers are real, and there is room to build. That's the standard we operate on.",
      offerKicker: "What we offer",
      offerTitle: "Five fronts that work together.",
      offers: [
        { t: "Community architecture", b: "Structure and run the developer community around your platform — from scratch or by reactivating one that stalled." },
        { t: "Champions program", b: "Identify, train and activate the developers who already evangelize the platform, with the structure to scale without losing quality." },
        { t: "Event acceleration", b: "Drive registrations and quality attendance for launches, hackathons and developer conferences." },
        { t: "Adoption engineering", b: "Turn documentation and launches into hands-on workshops that produce real integrations — not just signups." },
        { t: "Ecosystem intelligence", b: "Map who is building what, where friction lives, and what the ecosystem needs next." },
      ],
      whyKicker: "Why us",
      whyTitle: "Proven track record.",
      whyBody:
        "We've organized a developer community and accelerated registrations for the flagship event of a major AI platform in Brazil. Without naming clients: the results speak for themselves in the conversations we have with you.",
      cta: "Let's talk about your ecosystem",
    },
    sovereignty: {
      title: "Sovereignty",
      kicker: "The non-profit core",
      hero: "Deep technical capability in Brazilian professionals is a pillar of national sovereignty.",
      sub:
        "A country that only consumes AI built elsewhere is a country that rents its own future. This is not about building a national LLM. It's about building the people who can build.",
      argTitle: "What is at stake",
      argBody:
        "In the coming decades, decisions on public health, education, justice and infrastructure will run through systems that no one in the country knows how to maintain. That's not an opinion — it's a risk calculation. Sovereignty today is measured in how many people can open the black box and work inside it.",
      whatKicker: "What we do",
      whatTitle: "Deep, free technical formation for Brazilian professionals.",
      whatBody:
        "Open cohorts. Hands-on method — the same one from the Corporate program. A growing network of people able to build at the frontier — and to train the next ones.",
      supportKicker: "How to support",
      supportTitle: "Three paths.",
      support: [
        { t: "Donations", b: "Companies and individuals funding open cohorts. Funds go entirely to scholarships, facilitators and infrastructure." },
        { t: "Institutional partnerships", b: "Universities, institutes and public bodies that want to scale technical training in their regions." },
        { t: "Volunteer facilitators", b: "Senior professionals willing to give a few days a year to train the next generation." },
      ],
      cta: "I want to support",
    },
    schools: {
      title: "Schools",
      kicker: "Secondary and university education",
      hero: "School was redesigned without being told. Nobody asked for permission.",
      sub:
        "Banning ChatGPT didn't work. Pretending it doesn't exist didn't either. Together with partner schools we're mapping the challenges AI creates for learning — and building the first initiatives with students and teachers.",
      argTitle: "The honest framing",
      argBody:
        "Schools banned, then gave up. Neither banning nor ignoring is a strategy. The right question is a different one: how do you form people who still think when the answer is free.",
      whatKicker: "What we do",
      whatTitle: "Four fronts, with the school.",
      what: [
        { t: "Institutional diagnostic", b: "How AI is already being used — by students, teachers and coordination — and what that means for the pedagogical project." },
        { t: "Workshops with teachers", b: "Critical and practical use of AI in the classroom. Not a talk: an immersion using cases from the teachers' own subjects." },
        { t: "Workshops with students", b: "Secondary school, primarily. From the mechanics to critical thinking. How to use, when not to, and how to notice when the model is wrong." },
        { t: "Assessment redesign", b: "Support in rethinking exams, assignments and projects for a world where the answer is free and the reasoning is not." },
      ],
      cta: "Talk to our schools team",
    },
    trainers: {
      title: "Train the Trainers",
      kicker: "For those who train others",
      hero: "One trained teacher reaches 150 students a year. One trained internal facilitator keeps a company learning after we leave.",
      sub:
        "We train teachers, coordinators and internal facilitators to run the method themselves. That's how this scales without depending on us being in the room.",
      argTitle: "The logic",
      argBody:
        "You can't serve a country by going classroom to classroom. You can by training those who train. Our job is to replicate those who replicate.",
      howKicker: "Program structure",
      howTitle: "Four stages.",
      how: [
        { t: "Immersion in the method", b: "The trainer lives, as a participant, the same kind of immersion they will run afterwards." },
        { t: "Supervised practice", b: "They run their first cohorts alongside a senior facilitator, adjusting the pace in real time." },
        { t: "Facilitator certification", b: "Practical evaluation. Not a decorative diploma — a real credential to run the method with our endorsement." },
        { t: "Continued support network", b: "Active community of facilitators, supervision sessions and materials updated every round." },
      ],
      cta: "I want to become a facilitator",
    },
    indexPage: {
      title: "AI Fluency Index",
      kicker: "Annual research, primary data",
      hero: "The first honest portrait of AI fluency in Brazil.",
      sub:
        "Not how many people tried ChatGPT once. A measure of real capability: who can build, maintain and evolve something — across professionals, companies, schools and the developer ecosystem.",
      whyKicker: "Why it matters",
      whyBody:
        "Without measurement, the country debates AI policy blind. Every institution uses whichever number suits it. This index exists to end that — and to be a public, open, cross-comparable reference between editions.",
      methodKicker: "Methodology",
      methodTitle: "Three layers, one reading.",
      method: [
        { t: "Large-scale survey", b: "Representative sampling of professionals, students and developers in the country." },
        { t: "Practical assessment", b: "We don't measure self-declaration. We measure what the person can actually build in standardized tasks." },
        { t: "Institutional interviews", b: "In-depth conversations with companies, schools and public bodies to contextualize the numbers." },
      ],
      statusKicker: "Status",
      statusBody: "First edition, currently in the field. Publication planned for the next cycle.",
      openTitle: "Open publication",
      openBody: "The data will be published free of charge, with auditable methodology and microdata available for research.",
      captureTitle: "Get the index when it's out",
      captureSub: "No newsletter, no spam. One email, once, when the first edition is published.",
      capturePlaceholder: "you@email.com",
      captureBtn: "Notify me",
      captureOk: "Done. We'll let you know.",
    },
    contact: {
      kicker: "Contact",
      title: "Get in touch",
      sub: "Tell us the context and what you want to unlock. We reply within two business days.",
    },
    footer: {
      programs: "Programs",
      contact: "Contact",
      rights: "AI by People — non-profit organization.",
      note: "The Corporate program funds the free programs.",
    },
  },
} as const;

export type Translations = typeof translations.pt;
