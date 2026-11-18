/* ============================================================
   PONTOS DE INTERESSE — Casa-pátio, Sobrado com comércio e Bloco de vizinhança
   ============================================================ */
Object.assign(SRC, {
  jacobs: 'JACOBS, Jane. Morte e vida de grandes cidades. São Paulo: WMF Martins Fontes (1ª ed. 1961).',
  oms_hap: 'WHO. Household air pollution (fact sheet). who.int',
  aneel_tb: 'ANEEL. Tarifa Branca (tarifa com preços diferentes por horário de consumo). gov.br/aneel',
  nbr15575: 'ABNT. NBR 15575: Edificações habitacionais, desempenho.',
  lc128: 'BRASIL. Lei Complementar nº 128, de 19 de dezembro de 2008 (cria o Microempreendedor Individual, MEI). planalto.gov.br',
  l11888: 'BRASIL. Lei nº 11.888, de 24 de dezembro de 2008 (assistência técnica pública e gratuita para habitação de interesse social). planalto.gov.br',
  l13312: 'BRASIL. Lei nº 13.312, de 12 de julho de 2016 (medição individualizada de água em novas edificações). planalto.gov.br',
});

/* ---- Casa-pátio ---- */
H('cp_sala', 'Sala de estar', 'ARF', 'Sala com sofá, estante e janelas, aberta para a entrada e o pátio.',
  '{A} A sala fica na frente da casa e se abre para a entrada e para o jantar. Portas largas e janelas altas deixam o ar atravessar.\n{R} O pátio interno aparece em casas de climas quentes de vários continentes, e a "casa de varanda" é comum no Nordeste brasileiro. Esta casa reinterpreta essas ideias, sem copiar um modelo específico.\n{A} A estante é baixa, com livros e objetos da família: a sala é também lugar de memória.\n{F} A norma ABNT NBR 15220 trata do desempenho térmico de edificações e orienta o tamanho das aberturas e o uso de proteções solares conforme o clima.',
  'Como a sala da sua casa é usada? Dá para receber visitas sem ligar o ar-condicionado?', 'patio,ventilacao', 'nbr15220');
H('cp_cozinha', 'Cozinha', 'FAP', 'Bancada, pia, fogão e geladeira, com porta e janela para o pátio.',
  '{F} A Organização Mundial da Saúde alerta que a poluição do ar dentro de casa, causada por cozinhar com lenha, carvão ou querosene em locais mal ventilados, está ligada a milhões de mortes por ano no mundo.\n{A} A cozinha tem porta e janela para o pátio, o que ajuda a tirar fumaça e calor. A mesa ao lado da bancada convida a família a cozinhar e comer junto.\n{P} Um fogão elétrico de indução, alimentado pelo painel solar do telhado, dispensaria o gás e a fumaça. É uma proposta; nada disso é mostrado como instalado.\n{R} A cozinha é lugar de transmissão de saberes: receitas, histórias e cuidado passam de pessoa para pessoa.',
  'Que receita da sua família é preparada por muitas mãos? Como a cozinha da sua casa ajuda ou atrapalha?', 'ventilacao', 'oms_hap');
H('cp_energia', 'Medidor de energia e água (simulado)', 'FPX', 'Um painel na cozinha mostra o consumo da casa e a geração do painel solar.',
  '{F} A Tarifa Branca, criada pela ANEEL, cobra preços diferentes conforme o horário em que a energia é consumida. Quem desloca o uso para horários mais baratos pode economizar.\n{F} A Lei 14.300/2022 organiza a geração de energia em casa, como com painéis solares, e permite receber créditos pelo excedente enviado à rede.\n{P} Um medidor que mostra o consumo em tempo real ajudaria a família a perceber o que gasta mais.\n{X} Os números do painel (0,4 kW de energia, 0,9 kW de solar, 55% de água na cisterna) são inventados para a visita e não vêm de nenhum medidor real.',
  'Qual aparelho da sua casa gasta mais energia? Você já olhou a conta de luz para descobrir?', 'iot,fotovoltaico,economiasol', 'aneel_tb,l14300');
H('cp_quarto', 'Quartos', 'AF', 'Dois quartos com cama, armário e janela, voltados para o pátio.',
  '{A} Cada quarto tem uma janela para a rua ou para o lado externo e uma porta para o pátio, de modo que o ar atravesse o cômodo durante a noite.\n{A} Móveis simples e baixos deixam o ar circular e facilitam a limpeza.\n{F} A norma ABNT NBR 15575 define critérios de desempenho para habitações, incluindo conforto térmico e acústico, que devem ser considerados no projeto.\n{A} A casa pode crescer por módulos: quando a família aumenta, um novo quarto pode ser acrescentado em torno do pátio.',
  'O que faz seu quarto ficar quente à noite? O que poderia mudar sem gastar energia?', 'ventilacao,inercia', 'nbr15575,nbr15220');
H('cp_banheiro', 'Banheiro e área de serviço', 'FA', 'Vaso, pia, chuveiro, máquina de lavar e janela alta.',
  '{F} Bacias sanitárias de volume reduzido, com cerca de 6 litros por descarga, gastam bem menos água do que modelos antigos.\n{F} Aquecedores solares de água são usados em várias regiões do Brasil e reduzem o uso do chuveiro elétrico, um dos maiores consumidores de energia das casas.\n{A} A janela alta mantém a privacidade e deixa sair o vapor. A área de serviço fica junto ao banheiro e abre para o pátio, onde a roupa seca ao sol.\n{A} A cisterna do pátio fornece água para limpeza e descarga.',
  'Quanta água sua casa gasta por dia? Onde seria fácil economizar?', 'cisterna', 'ana_reuso');
H('cp_patio', 'Pátio central', 'ARF', 'Árvore, bancos e sombra: o coração da casa.',
  '{A} Os cômodos se abrem para o pátio, que traz luz e ventilação para o interior e serve de sala ao ar livre.\n{R} Pátios internos são usados há milênios em casas de climas quentes, da África ao Oriente Médio e à América Latina. Aqui ele é uma interpretação e não a cópia de uma casa específica.\n{F} A sombra e a vegetação reduzem a temperatura do ambiente. O piso de pedra clara e a água da cisterna ajudam a refrescar.\n{A} O pátio também é onde se encontra a família, se estende a roupa e se conversa com os vizinhos.',
  'Qual é o lugar de encontro da sua casa? Ele é confortável no calor?', 'patio,ventilacao', 'nbr15220');
H('cp_ventilacao', 'Por que a casa é fresca', 'AF', 'Um esquema mostra como o ar entra, aquece, sobe e sai.',
  '{F} Ventilação cruzada acontece quando há aberturas em lados opostos de um ambiente, e o vento atravessa o espaço. O efeito chaminé usa o fato de o ar quente subir para puxar ar fresco por baixo.\n{A} Paredes grossas de terra demoram a esquentar (inércia térmica), o beiral dá sombra e o pátio, com árvore, resfria o ar que entra.\n{A} O desenho é um esquema didático, sem escala, para mostrar a ideia. Os efeitos reais dependem do vento, do sol e das aberturas.\n{F} A NBR 15220 apresenta estratégias para o clima de cada região do Brasil.',
  'Onde o vento entra e onde sai na sua casa? Dá para abrir uma janela do outro lado para ajudar?', 'ventilacao,inercia,terracrua', 'nbr15220');

/* ---- Sobrado ---- */
H('sob_loja', 'Loja-ateliê do térreo', 'ARF', 'Costura, conserto e venda de panos, num ateliê aberto para a rua.',
  '{R} Sobrados com comércio no térreo são tradição em cidades brasileiras antigas e em bairros populares. Hoje esse tipo de uso é chamado de uso misto.\n{A} Juntar casa e trabalho reduz deslocamentos, dá vida à rua e permite que a família cuide do negócio e da casa ao mesmo tempo.\n{F} A Lei Complementar 128/2008 criou o Microempreendedor Individual (MEI), que permite formalizar pequenos negócios com custos reduzidos.\n{A} Prateleiras com rolos de pano, mesa de corte, máquina de costura e um balcão: o ateliê se liga à banca de tecidos do mercado comunitário.',
  'Que negócios funcionam em casas na sua rua? Como o espaço ajuda ou atrapalha?', 'usomisto,economiasol', 'lc128');
H('sob_escada', 'Entrada da moradia e escada', 'AF', 'Uma porta própria leva da rua direto à escada da moradia.',
  '{A} A entrada da casa é separada da entrada da loja: a família circula sem passar pelo ateliê, e os clientes não entram na casa.\n{A} Uma janela ilumina o pé da escada, e o corrimão dá apoio.\n{F} A norma ABNT NBR 9050 indica medidas para degraus acessíveis. A escada deste modelo é compacta e estilizada: numa obra real, seriam seguidas as regras de altura e profundidade dos degraus.\n{A} A escada interna liga o térreo ao segundo andar e deixa o térreo livre para o negócio.',
  'Quem tem dificuldade para subir uma escada na sua casa? O que poderia ajudar?', 'acessibilidade,usomisto', 'nbr9050');
H('sob_sala', 'Sala de estar do segundo andar', 'AF', 'Sala com sofá, estante e saída para a varanda.',
  '{A} A sala fica no andar de cima, longe do barulho e da poeira da loja, com vista para a rua.\n{A} A porta larga para a varanda e as janelas do lado deixam a luz e o ar entrarem.\n{A} Como a sala e a varanda são contínuas, a família pode ampliar o espaço de convivência nos dias de festa.\n{F} A norma ABNT NBR 15220 trata de estratégias de ventilação e de sombreamento para o clima de cada região do Brasil.',
  'A sua sala é um lugar agradável? O que a deixa mais fresca ou mais quente?', 'ventilacao,brise', 'nbr15220');
H('sob_varanda', 'Varanda', 'ARF', 'Um espaço sombreado, voltado para a rua.',
  '{R} Varandas são tradição na arquitetura brasileira, onde servem para sombrear a casa, conversar e observar a rua.\n{F} A urbanista Jane Jacobs defendeu a ideia dos "olhos da rua" (vigilância natural): quando moradores olham para a calçada, a rua tende a ficar mais segura.\n{A} A varanda tem guarda-corpo de metal e vasos de plantas. O beiral dá sombra e protege da chuva.\n{A} Mostra que moradia popular pode ser bonita e produtiva.',
  'De onde você observa a rua em que mora? Isso faz você se sentir mais seguro?', 'brise', 'jacobs');
H('sob_cozinha', 'Cozinha e medidor', 'AP', 'Bancada, mesa e um medidor inteligente.',
  '{A} A cozinha fica ao lado da escada e da sala, com janela para o lado e porta para os quartos.\n{P} O medidor inteligente mostraria o consumo de energia e de água em tempo real, incentivando a economia.\n{X} Os números mostrados no medidor (0,3 kW e 2 L/min) são inventados para a visita.\n{A} A lâmpada de LED e o painel solar no telhado reduziriam o consumo de energia.',
  'Que hábito de cozinha gasta mais água ou energia na sua casa? Dá para mudar?', 'iot,fotovoltaico');
H('sob_quarto', 'Quartos', 'A', 'Dois quartos nos fundos, longe da rua, com janela e armário.',
  '{A} Os quartos ficam nos fundos do segundo andar, onde há menos ruído. A janela alta no fundo dá luz e deixa o ar quente sair.\n{A} Cada quarto tem um armário embutido que aproveita a parede e deixa o centro livre.\n{A} O tijolo e o reboco colorido da fachada protegem do sol e se mantêm sem muita manutenção.',
  'Que barulhos atrapalham seu sono? Como a arquitetura poderia ajudar?', 'ventilacao');
H('sob_banheiro', 'Banheiro', 'FA', 'Banheiro pequeno com chuveiro, vaso e pia.',
  '{F} Bacias sanitárias de volume reduzido gastam menos água por descarga do que modelos antigos.\n{A} O banheiro fica junto à cozinha para concentrar a tubulação de água e esgoto numa mesma parede, o que reduz custos e vazamentos.\n{A} A janela alta ventila e protege a privacidade.',
  'O que você faria para gastar menos água no banho?', 'cisterna', 'ana_reuso');

/* ---- Bloco de vizinhança ---- */
H('viz_entrada', 'Hall de entrada e escada', 'AF', 'Caixas de correio, quadro de avisos e escada central.',
  '{F} A Lei 11.888/2008 garante assistência técnica pública e gratuita de arquitetura e engenharia para famílias de baixa renda projetarem, reformarem ou ampliarem sua moradia.\n{A} O hall reúne caixas de correio e um quadro de avisos, para que os moradores se encontrem e se informem.\n{A} A escada fica no centro, bem iluminada, e leva à circulação aberta do andar de cima.\n{A} O bloco foi pensado como uma pequena vizinhança: tudo o que é compartilhado fica no térreo.',
  'Onde, no prédio ou na rua onde você mora, as pessoas se encontram sem querer?', 'mutirao', 'l11888');
H('viz_sala', 'Sala comunitária', 'RAF', 'Mesa grande, cozinha coletiva e canto das crianças.',
  '{R} Mutirão (palavra de origem tupi) e ajuda entre vizinhos são práticas presentes em comunidades indígenas, rurais, quilombolas e periféricas do Brasil. No Brasil há experiências de moradia construída em mutirão e gerida pelos próprios moradores, como as de movimentos de moradia de várias cidades.\n{A} A sala serve para reuniões do condomínio, festas, aulas e cuidado compartilhado de crianças. A cozinha ao fundo permite preparar comida para muita gente.\n{A} O painel na parede mostra o que o bloco compartilha: telhado verde, cisterna, energia solar coletiva e medição individual.\n{A} Reduz o custo de moradia e aumenta as redes de apoio.',
  'O que você compartilha hoje com os vizinhos? O que poderia compartilhar?', 'mutirao,ubuntu,telhadoverde');
H('viz_lavanderia', 'Lavanderia compartilhada', 'AP', 'Máquinas, tanque e varais para todo o bloco.',
  '{A} Em vez de uma máquina em cada apartamento, o bloco tem uma lavanderia com várias máquinas, o que reduz custo, espaço e materiais.\n{A} A roupa seca nos varais, ao ar livre e ao sol, em vez de máquina de secar. Um tanque grande armazena a água de reúso.\n{F} A Lei 13.312/2016 passou a exigir medição individualizada de água em novas edificações coletivas.\n{P} Um cartão de uso, por morador, registraria o consumo de cada máquina para a divisão justa dos custos.',
  'Quais aparelhos ou ferramentas da sua casa ficam parados a maior parte do tempo? Dá para compartilhar?', 'economiasol,cisterna', 'l13312');
H('viz_pateio', 'Pátio comunitário', 'AFR', 'Horta, cisterna, árvore e bancos no fundo do bloco.',
  '{A} O pátio é o quintal comum: a horta dá hortaliças e temperos, a árvore dá sombra e os bancos convidam à conversa.\n{A} A cisterna guarda a água da chuva do telhado para irrigar a horta e lavar o chão.\n{F} Áreas verdes e árvores reduzem a temperatura do ambiente e melhoram o conforto de quem vive ao redor.\n{R} Quintais comunitários e roças coletivas são parte da vida de comunidades tradicionais e periféricas.',
  'Qual espaço verde perto de você poderia virar uma horta ou um pátio comunitário?', 'telhadoverde,agroecologia,cisterna');
H('viz_cobogo', 'Circulação aberta com cobogó', 'FAR', 'Um painel vazado deixa o vento passar e filtra o sol.',
  '{F} O cobogó é um elemento vazado, de concreto ou cerâmica, muito usado em construções do Brasil, especialmente no Nordeste. Ele ventila, deixa passar a luz e protege o interior do sol direto.\n{A} Aqui, a parede de cobogó fica na circulação do andar de cima e deixa entrar luz e vento sem expor os moradores.\n{A} O desenho do painel é uma composição simples, sem inspiração em obra específica.\n{R} Soluções que misturam privacidade, luz e ventilação, como treliças e muxarabis, existem em várias culturas de clima quente.',
  'Que elementos da sua casa deixam passar ar e luz, mas protegem do sol e dos olhares?', 'cobogo,ventilacao', 'nbr15220');
H('viz_apto', 'Apartamento: sala e cozinha', 'AFP', 'Sala e cozinha integradas, com janelas para a rua.',
  '{A} Os apartamentos são compactos: sala e cozinha formam um só espaço, com mesa pequena e bancada, para aproveitar bem a área.\n{F} A Lei 13.312/2016 exige medição individualizada de água em novas edificações coletivas, para que cada família pague só o que usa.\n{P} Medidores individuais de luz e água mostrariam o consumo de cada apartamento, com divisão justa de áreas comuns.\n{A} A janela da sala dá para a rua, e a do banheiro, alta, ventila e protege a privacidade.',
  'Que espaço da sua casa fica pouco usado? Como poderia ser aproveitado melhor?', 'iot,usomisto', 'l13312');
H('viz_quarto', 'Apartamento: quarto', 'AF', 'Quarto com cama, armário e janela, ligado à sala e ao banheiro.',
  '{A} O quarto tem uma porta para a sala e é vizinho do banheiro, o que agrupa as instalações de água num lado do apartamento.\n{A} O armário fica na parede, o que deixa o espaço livre. A janela alta, ao norte, traz luz sem calor excessivo.\n{F} A norma ABNT NBR 15575 define critérios de desempenho para habitações, entre eles conforto térmico e acústico.',
  'O que torna um quarto pequeno agradável? Que detalhes de projeto ajudariam?', 'ventilacao', 'nbr15575');
