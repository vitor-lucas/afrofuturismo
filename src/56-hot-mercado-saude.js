/* ============================================================
   PONTOS DE INTERESSE — Mercado Comunitário e Centro de Saúde
   ============================================================ */
Object.assign(SRC, {
  ibge_censo: 'IBGE. Censo Demográfico 2022: cor ou raça (resultados do universo). censo2022.ibge.gov.br',
  ibge: 'IBGE. Produção Agrícola Municipal (PAM): castanha de caju. sidra.ibge.gov.br',
  cascudo: 'CASCUDO, Luís da Câmara. História da alimentação no Brasil. São Paulo: Global (várias edições).',
  iphan_reg: 'IPHAN. Bens culturais registrados: Ofício das Paneleiras de Goiabeiras (2002); Ofício das Baianas de Acarajé (2005); Roda de Capoeira e Ofício dos Mestres de Capoeira (2008). portal.iphan.gov.br',
  unesco_cap: 'UNESCO. Capoeira circle (Roda de Capoeira), Lista do Patrimônio Cultural Imaterial da Humanidade, 2014. ich.unesco.org',
  palmas: 'INSTITUTO BANCO PALMAS. Conjunto Palmeira, Fortaleza (CE): história do banco comunitário e da moeda social "palma". institutobancopalmas.org',
  cf196: 'BRASIL. Constituição Federal de 1988, art. 196 (saúde como direito de todos e dever do Estado). planalto.gov.br',
  l8080: 'BRASIL. Lei nº 8.080, de 19 de setembro de 1990 (Lei Orgânica da Saúde, que organiza o SUS). planalto.gov.br',
  pni: 'BRASIL. Ministério da Saúde. Programa Nacional de Imunizações (PNI), criado em 1973. gov.br/saude',
  pnsipn: 'BRASIL. Ministério da Saúde. Política Nacional de Saúde Integral da População Negra (Portaria nº 992/2009). gov.br/saude',
  ppmf: 'BRASIL. Decreto nº 5.813/2006 (Política Nacional de Plantas Medicinais e Fitoterápicos) e Portaria GM/MS nº 886/2010 (Farmácia Viva no SUS). planalto.gov.br',
  ulrich: 'ULRICH, Roger S. View through a window may influence recovery from surgery. Science, v. 224, n. 4647, p. 420-421, 1984.',
});

/* ---- Mercado ---- */
H('mer_entrada', 'Galpão do Mercado Comunitário', 'ARP', 'Doze bancas, uma praça de encontro, cozinha comunitária e espaço de trocas sob um telhado alto e ventilado.',
  '{R} Feiras e mercados são centrais na vida de muitas comunidades africanas e afro-brasileiras: lugares de comércio, notícia, música e encontro.\n{A} Janelas altas e telhado elevado deixam o ar quente sair e a luz entrar; vigas de madeira e panos coloridos dão sombra e identidade às bancas.\n{A} Comprar de quem mora perto mantém o dinheiro circulando na vila: é isso que se chama economia local.\n{P} Balanças conectadas e pagamento por celular facilitariam o dia a dia, com opção de moeda social. Nada disso existe de fato: é uma proposta.',
  'Quem produz o que você compra? Você sabe onde fica essa pessoa?', 'economiasol,agroecologia');
H('mer_frutas', 'Frutas, raízes e hortaliças', 'FRA', 'Alimentos da agricultura familiar, organizados por tipo e cor.',
  '{F} O dendê e o feijão-fradinho chegaram da África ao Brasil pela diáspora. O quiabo é muito ligado à cozinha afro-brasileira, mas sua origem é debatida. O inhame africano (Dioscorea) não é o mesmo que o \"inhame\" mais vendido no Brasil, que costuma ser o taro, de origem asiática. A mandioca, ao contrário, é originária da América do Sul e foi levada à África no século XVI.\n{A} Os alimentos vêm de hortas da vila e de produtores do entorno, o que encurta a viagem e reduz o desperdício.\n{A} As bancas ficam voltadas para o corredor central, com balcão de madeira, prateleiras e uma lona colorida para sombra.\n{A} Todos os produtos são modelos 3D estilizados, sem rótulos de marcas.',
  'Que alimento do seu prato tem história africana? Você consegue descobrir qual?', 'agroecologia', 'cascudo');
H('mer_graos', 'Grãos, farinhas e castanhas', 'FRA', 'Sacos de grãos e farinhas, e potes de temperos na parede.',
  '{F} O Ceará lidera a produção brasileira de castanha de caju, segundo dados do IBGE.\n{F} O cuscuz, muito presente no Nordeste, tem origem no Norte da África (Magrebe). Chegou ao Brasil com os colonizadores portugueses e aqui passou a ser feito com milho.\n{A} Vender a granel, em cestos e sacos reutilizáveis, reduz embalagens descartáveis.\n{A} A banca fica perto da cozinha comunitária, para oficinas com os ingredientes do dia.',
  'Que prato típico da sua região usa grãos ou farinhas? De onde vem a receita?', 'agroecologia', 'ibge,cascudo');
H('mer_tecidos', 'Tecidos, moda e empreendedorismo negro', 'FRA', 'Panos coloridos e uma banca de costura: ofício, arte e renda.',
  '{R} Tecidos listrados ou estampados, como o kente (Gana) e o bògòlanfini (Mali), fazem parte de tradições reais. Os panos da banca são apenas inspirados nesses padrões, sem copiar nenhum específico nem atribuir significados.\n{F} O Censo 2022 do IBGE mostrou que 55,5% da população brasileira se declara preta ou parda.\n{A} Apoiar negócios de pessoas negras, com crédito, formação e espaço de venda, é uma forma de promover equidade econômica.\n{A} A banca de costura vende e conserta: reaproveitar tecido é economia circular.',
  'Que negócio de uma pessoa negra do seu bairro você conhece? O que poderia ajudá-lo a crescer?', 'kente,bogolan,equidade,economiasol', 'ibge_censo');
H('mer_artesanato', 'Cerâmica e cestaria', 'RFA', 'Panelas de barro, vasos e cestos feitos à mão.',
  '{R} Cerâmica e cestaria são saberes tradicionais de muitos povos indígenas, africanos e afro-brasileiros, passados de geração em geração.\n{F} O Ofício das Paneleiras de Goiabeiras (Vitória, ES) foi o primeiro bem registrado como patrimônio imaterial no Livro dos Saberes do IPHAN, em 2002.\n{A} Valorizar o artesanato significa pagar preço justo, usar materiais locais e reconhecer quem faz como mestre ou mestra de um saber.',
  'Quem, na sua família ou bairro, sabe fazer algo à mão? Esse saber está sendo passado adiante?', 'ancestralidade', 'iphan_reg');
H('mer_tambor', 'Instrumentos e música', 'FRA', 'Tambores, berimbaus e cabaças: música que também é patrimônio.',
  '{F} Berimbau, atabaque e agogô são instrumentos de origem ou influência africana, usados na capoeira, no samba, em festas e em religiões afro-brasileiras.\n{F} A Roda de Capoeira e o Ofício dos Mestres de Capoeira foram registrados pelo IPHAN em 2008, e a roda de capoeira foi reconhecida pela UNESCO como Patrimônio Cultural Imaterial da Humanidade em 2014.\n{A} No mercado, apresentações musicais aos sábados atraem visitantes e ajudam as bancas vizinhas.',
  'Que música ou ritmo do seu dia a dia tem raiz africana?', 'samba', 'iphan_reg,unesco_cap');
H('mer_praca', 'Praça de encontro do mercado', 'AR', 'Um pátio ao ar livre com árvore, bancos e mural, ao fundo do galpão.',
  '{R} Em muitas culturas, mercado e praça são o mesmo lugar: onde se compra, se conversa e se decide junto.\n{A} O pátio aberto traz luz natural ao centro do galpão e serve de lugar de descanso, festa ou assembleia de feirantes.\n{A} A árvore dá sombra e baixa a temperatura do entorno. Os bancos de madeira circulam em torno dela, como numa roda.',
  'Onde, no seu bairro, as pessoas se encontram para conversar sem gastar dinheiro?', 'ubuntu');
H('mer_trocas', 'Banco de trocas e moeda social', 'FAP', 'Objetos para trocar e uma moeda local: o dinheiro que circula no bairro.',
  '{F} O Banco Palmas, criado em 1998 no Conjunto Palmeira, em Fortaleza (CE), é um banco comunitário que criou uma moeda social própria, a palma, para que o dinheiro gasto no bairro permaneça no bairro. A experiência inspirou iniciativas semelhantes em outros lugares do Brasil.\n{A} O banco de trocas desta vila funciona como uma prateleira aberta: deixe o que sobra, leve o que precisa.\n{P} A moeda social poderia ser digital, com aplicativo e extrato. Aqui, é só uma proposta.',
  'O que você tem em casa que sobra e poderia ajudar outra pessoa?', 'economiasol,mutirao', 'palmas');
H('mer_cozinha', 'Cozinha comunitária', 'FRA', 'Fogões, bancadas e uma mesa grande: onde se cozinha e se aprende junto.',
  '{F} O Ofício das Baianas de Acarajé foi registrado como patrimônio cultural do Brasil pelo IPHAN em 2005. O acarajé tem origem em tradições culinárias de povos iorubás.\n{R} A cozinha é lugar de transmissão de saberes: receitas, histórias e cuidado passam de pessoa para pessoa.\n{A} Refeições a preço social e oficinas de culinária usam os alimentos das bancas e da horta, reduzindo desperdício.\n{P} Fogões de indução alimentados pela energia solar da vila diminuiriam o consumo de gás.',
  'Qual é a receita que sua família guarda? Quem ensinou?', 'agroecologia,ancestralidade', 'iphan_reg');

/* ---- Saúde ---- */
H('saude_recepcao', 'Recepção e sala de espera', 'FA', 'Atendimento acolhedor, acessível e sem filas longas.',
  '{F} A Constituição de 1988 (art. 196) diz que a saúde é direito de todos e dever do Estado; a Lei 8.080/1990 organiza o SUS, o Sistema Único de Saúde.\n{A} A recepção prioriza quem precisa de atendimento mais urgente e quem está em maior vulnerabilidade.\n{A} Rampa, piso tátil e balcão baixo seguem a ideia de acessibilidade universal da NBR 9050.\n{P} Senhas pelo celular reduziriam o tempo de espera em pé.',
  'Que barreiras uma pessoa idosa, com deficiência ou com criança no colo enfrenta para ser atendida?', 'acessibilidade,equidade', 'cf196,l8080,nbr9050');
H('saude_consultorio', 'Consultórios', 'FAP', 'Atendimento de família, pré-natal e acompanhamento da criança.',
  '{F} A atenção primária é a porta de entrada do SUS. O Programa Saúde da Família (hoje Estratégia Saúde da Família), iniciado em 1994, organiza equipes e agentes comunitários que acompanham as pessoas em casa.\n{A} Cada consultório tem janela, luz natural e privacidade; as macas e mesas são adaptáveis.\n{R} Saberes de benzedeiras, parteiras e raizeiras são reconhecidos em diálogo com a medicina científica.\n{P} Telemedicina permitiria atendimento por vídeo com especialistas de outras cidades.',
  'Quem cuida da saúde na sua família? Que saberes de cuidado vêm das gerações mais velhas?', 'equidade', 'l8080');
H('saude_vacinas', 'Sala de vacinas', 'FAP', 'Geladeira própria, cadeira confortável e calendário de vacinação.',
  '{F} O Programa Nacional de Imunizações foi criado em 1973. O último caso de poliomielite no Brasil foi em 1989, e o país recebeu o certificado de eliminação em 1994.\n{F} O mascote Zé Gotinha foi criado em 1986 para campanhas contra a poliomielite.\n{A} Uma geladeira exclusiva e um fluxo curto entre sala e recepção mantêm as vacinas conservadas.\n{P} Sensores avisariam se a temperatura da geladeira saísse da faixa segura.',
  'Você sabe se a sua caderneta de vacinação está em dia? Onde conferir?', 'iot', 'pni');
H('saude_farmacia', 'Farmácia viva · plantas medicinais', 'FRA', 'Plantas medicinais cultivadas na vila e preparadas com orientação.',
  '{F} O projeto Farmácias Vivas foi criado na década de 1980 pelo professor Francisco José de Abreu Matos, da Universidade Federal do Ceará, e hoje é reconhecido no SUS por portaria de 2010.\n{F} Plantas medicinais têm princípios ativos: identificar a espécie correta e usar a dose certa importa. Por isso, a orientação de profissionais de saúde é essencial. Esta visita não é indicação de tratamento.\n{R} O conhecimento de raizeiras, benzedeiras e quilombolas sobre ervas é parte da história do cuidado e é estudado pela ciência.\n{A} A farmácia fica ao lado do jardim, perto da horta de plantas medicinais.',
  'Que planta sua família usa em chás ou remédios caseiros? Como confirmar se é segura?', 'agroecologia,ancestralidade', 'ppmf');
H('saude_prevencao', 'Orientação preventiva', 'FA', 'Rodas de conversa e atividades para cuidar antes de adoecer.',
  '{F} A Política Nacional de Saúde Integral da População Negra (2009) reconhece que o racismo e as desigualdades sociais afetam a saúde e o acesso ao cuidado.\n{F} A doença falciforme é uma condição genética hereditária, mais frequente entre pessoas negras e pardas no Brasil, e o teste do pezinho ajuda a identificá-la cedo.\n{A} A sala reúne grupos de gestantes, de atividade física, de alimentação e de saúde mental, em rodas de conversa.\n{A} Tapetes e mesa redonda facilitam um ambiente informal e de confiança.',
  'Que cuidados com a saúde você poderia fazer hoje para evitar problemas amanhã?', 'racismoestrutural,equidade', 'pnsipn');
H('saude_jardim', 'Jardim de descanso', 'FAR', 'Um pátio verde com água e sombra, no centro do edifício.',
  '{F} Em 1984, o pesquisador Roger Ulrich publicou um estudo em que pacientes com vista para árvores se recuperaram de cirurgia em menos tempo do que os que viam uma parede.\n{F} Áreas verdes reduzem a temperatura do entorno e ajudam a diminuir o estresse.\n{A} O jardim leva luz e ventilação às salas ao redor; o espelho d\'água refresca o ar.\n{R} Jardins e quintais são lugares de cuidado em muitas culturas, onde se plantam ervas, conversa-se e descansa-se.',
  'Qual lugar verde perto de você deixa você mais calmo? Ele é fácil de chegar para todo mundo?', 'telhadoverde', 'ulrich');
