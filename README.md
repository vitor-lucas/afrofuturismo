# Metrópole Afrofuturista — GitHub Pages

**Site:** https://vitor-lucas.github.io/afrofuturismo/

O GitHub Pages publica a branch `main`, pasta `/ (root)`. A página de entrada é `index.html`, e os downloads estão em https://vitor-lucas.github.io/afrofuturismo/downloads/.

## Modo apresentador

Abra **Modo apresentador · acesso por token** na tela inicial, no menu de exploração ou no menu gaveta do celular. Link direto: https://vitor-lucas.github.io/afrofuturismo/#apresentador. O token deve ser fornecido pela equipe; não é um token do GitHub.

O roteiro tem 15 etapas: abertura, 11 lugares da visita guiada, distritos, pesquisas e créditos. Os controles incluem seleção de etapa, anterior/próxima, cronômetro com pausa, roteiro de fala, tela cheia e dia/noite. Nos lugares compatíveis, **Visitar interior** permite entrar e voltar à fachada. Sem WebGL, a apresentação permanece disponível em texto na tela de erro do 3D.

- **← / →** ou **Page Up / Page Down**: mudar etapa.
- **P**: pausar/retomar cronômetro. **F**: tela cheia, quando suportada pelo navegador.
- **Esc**: opções da apresentação. Em celulares, use os botões na tela; **Recolher texto** libera espaço para a cena.
- **Sair e bloquear** encerra o acesso. A sessão expira após duas horas; recarregar ou sair da página exige o token novamente.

O GitHub Pages serve arquivos públicos e não executa um servidor de autenticação. Por isso, o token é um **bloqueio local dos controles**, adequado para conduzir uma apresentação pública; não protege dados privados nem impede alterações pelo console do navegador. O projeto guarda apenas o hash SHA-256 do token. O valor digitado não é enviado, colocado na URL ou salvo no armazenamento do navegador. O roteiro de fala contém orientações públicas, não notas confidenciais.

Para trocar o token:

```sh
npm run presenter:token
npm run pages
```

Guarde o novo token mostrado no terminal, compartilhe apenas com os apresentadores e envie os arquivos gerados para `main`. A próxima versão publicada aceita apenas o novo token; páginas já abertas devem ser recarregadas para receber a troca. Não coloque o token em commits, no README ou no link do site. O hash e a duração da sessão estão em `src/09-presenter-config.js`.

Para verificar a lógica e os controles sem renderização GPU: instale as dependências de desenvolvimento e execute `npm run test:presenter`. Esses testes de DOM não substituem a conferência visual em dispositivos reais.

## Atualizar o site

1. Edite os arquivos de `src/`.
2. Execute `npm run pages` (Node.js 18 ou superior e Python 3; não precisa instalar dependências para gerar o site).
3. Faça commit dos arquivos alterados e envie para `main`.
4. Acompanhe a publicação automática em **Actions → pages build and deployment**.

O comando gera o HTML com Three.js, carregador de modelos e imagens incorporadas, verifica os scripts e caminhos, prepara os downloads e atualiza os arquivos publicados na raiz. O arquivo `.nojekyll` permite servir o projeto como arquivos estáticos.

A configuração existente em **Settings → Pages** deve continuar como **Deploy from a branch → main → / (root)**. Nenhuma configuração adicional é necessária. A versão `vila-afrofuturista.html` continua disponível para preservar links antigos.

O jogo também pode ser aberto diretamente em `index.html`. WebGL é necessário para a cena 3D; a visita em texto continua disponível quando a GPU não consegue iniciar. Os arquivos de pesquisa e créditos estão no próprio site. Este repositório não usa servidor, banco de dados ou chaves privadas.

---

# Metrópole Afrofuturista

Expansão da Vila Afrofuturista em uma simulação educativa 3D, construída em Three.js r128. O núcleo original, suas moradias, os 12 interiores e os 124 pontos educativos foram preservados.

## Explorar

Abra `dist/vila-afrofuturista-offline.html` ou `dist/index.html`. O motor 3D está incluído; fontes externas são opcionais. WebGL é necessário para a cena. A visita em texto permanece disponível quando o WebGL falha.

- **Explorar os oito distritos** abre o mapa metropolitano com busca, filtros, zoom e deslocamento.
- **Cidade viva** reúne transportes, agricultura, eventos, atividades, clima, gestão de recursos e exploração espacial.
- **WASD** move, **Shift** corre, **E** interage, **C** alterna primeira/terceira pessoa, **M** abre o mapa e **V** seleciona carro, bicicleta ou micro-ônibus.
- Nos veículos: **W/S** aceleração/ré, **A/D** direção, **Espaço** freio e **E** desembarque com o veículo parado.
- No celular: joystick, botão E, pedais e botões de direção. Menus e leitura se adaptam à largura disponível.

## Conteúdo implementado

- Oito distritos: N’Kanda, Ubuntu, Sankofa, Wakanda Verde, Maat, Kemet, Nzinga e Dandara. São nomes de regiões ficcionais, sem representar todas as culturas africanas como uma única tradição.
- 96 edifícios novos com entradas individuais, fachadas variadas, painéis solares, endereços e interiores gerados sob demanda. Tipos: residências, trabalho, ensino, ciência, saúde, comércio, cultura, indústria, estufas e estações.
- Anel metropolitano, conexão sul com o núcleo e ruas dos bairros. A geometria, as colisões, o mapa e as rotas usam a mesma planta.
- 109 interiores registrados: 12 originais, 96 dos distritos e uma estação orbital. Os novos interiores têm diferentes níveis, mobiliário, portas articuladas com colisão, elevadores e controles de iluminação.
- Carro, bicicleta de carga e micro-ônibus controláveis. Frenagem, bateria e recarga são simuladas.
- Viagens entre estações por ônibus, metrô, trem elevado, teleférico, táxi aéreo, barco e veículo logístico; escolha de origem/destino, espera, acompanhamento e desembarque. Horários e velocidades são simulados.
- 48 personagens novos com nome, profissão, personalidade, residência, trabalho, rotina e diálogo. Reagem ao horário e procuram abrigo em tempestades.
- Onze representações de espécies/robôs na reserva, com animação, comportamento e registro de observação. Espécies reais de continentes diferentes ocupam uma reserva ficcional, sem sugerir coexistência natural.
- Quatro cultivos com plantio, crescimento visível, colheita e salvamento. Um ciclo dura 30 segundos para fins didáticos.
- Agenda de cinco eventos com avanço do relógio, atividades e contribuições salvas no navegador.
- Ciclo de dia/noite, chuva por partículas, tempestade, neblina, vento, mudança de iluminação e aparência do asfalto molhado.
- Lançamento espacial animado, visita ao observatório orbital e retorno ao distrito científico.
- Central de recursos com energia, armazenamento, água, reciclagem e iluminação; indicadores e recomendações seguem regras explícitas, sem sensores reais ou IA externa.
- Primeira e terceira pessoa, busca, rotas no chão, mapa vivo, percursos educativos, narração do navegador, ambiente sonoro opcional, alto contraste, texto ajustável e teclas remapeáveis.
- Preferências, posição da caminhada, cultivo, descobertas, participações e contribuições ficam no armazenamento local deste navegador. Não há contas, sincronização ou envio das contribuições a outras pessoas.

## Ajustes de movimento e estruturas

Caminhada com aceleração e desaceleração progressivas; direção suavizada e resposta reduzida em piso molhado. Passos de simulação limitados para reduzir saltos após travamentos. Veículos detectam pedestres e NPCs consultam colisores do cenário. A envoltória dos edifícios novos usa vãos de entrada e pavimentos coerentes com seus interiores. Estes são modelos simplificados de movimento e colisão, sem simulação física de suspensão ou deformação.

## Gráficos e desempenho

Cinco perfis: Automática, Baixa, Média, Alta e Ultra HD. Ultra amplia a resolução de renderização com limite de 8,3 milhões de pixels, sombras de até 4096 px e texturas procedurais de 1024 px, respeitando limites informados pela GPU. Não representa uma promessa de 4K ou FPS em qualquer tela.

Geometria estática é agrupada por material. Vegetação e população do núcleo usam instanciamento. Grupos dos distritos e personagens distantes são ocultados. Interiores são gerados sob demanda, com cache limitado para os novos edifícios. A qualidade automática reduz detalhes quando o tempo de quadro piora.

## Desenvolvimento e testes

Node 18+ e Python 3 para empacotamento:

```sh
npm ci
npm run build
npm test
python scripts/package-downloads.py
```

`npm test` verifica geometria real do Three.js e interações DOM com jsdom, sem renderização GPU. `npm run test:browser` contém verificações dos fluxos atuais em Chromium e três tamanhos de tela; foi preparada, mas não executada nesta sessão. Instale o navegador do Playwright ou indique `CHROMIUM_PATH`. A suíte antiga `tests/validate.js` permanece como histórico.

- `src/`: fontes numeradas, concatenadas pelo build.
- `src/36-metropolis.js`: territórios, vias, edifícios e registro de interiores.
- `src/37-living-world.js`: habitantes, fauna, cultivo, atividades e eventos.
- `src/38-regional-transit.js`: transportes e exploração espacial.
- `src/39-climate.js`: clima e gestão de recursos.
- `src/49-int-metropolitan.js`: interiores, objetos e elevadores.
- `src/63-atlas.js`: mapa metropolitano.
- `tests/unit-report.json`: resultado detalhado da verificação atual.
- `ESCOPO-METROPOLE.md`: pedido original, mantido para rastreabilidade.

## Limites da entrega

É uma simulação procedural estilizada, não um jogo com captura de movimentos, personagens fotorrealistas ou inteligência artificial generativa. Rotinas, diálogos e administração seguem regras programadas. Interiores usam plantas reutilizáveis com variações; não são projetos arquitetônicos executivos. Viagens espaciais, tecnologias e números simulados estão identificados como ficção/proposta.

A expansão foi verificada em Node/jsdom com geometria real. Renderização, áudio, desempenho, controles em aparelhos físicos e compatibilidade visual entre navegadores ainda precisam de validação em navegador/GPU. A ferramenta de prévia exigida pela hospedagem não estava disponível nesta sessão. Não há garantia de “100% validado” ou de fotorrealismo. Consulte `VALIDACAO.md` e `SUGESTOES.md` para o alcance exato.

A bibliografia e as interpretações culturais do núcleo foram preservadas; a expansão não constitui revisão docente ou confirmação integral das fontes originais.

## Estado do realismo visual

Perfis Alta e Ultra agora derivam mapas de normais das texturas procedurais, mantendo o relevo coerente e reservando o processamento aos perfis de maior qualidade. Isso é refinamento de materiais, não texturas fotográficas ou personagens fotorrealistas. A tentativa de obter materiais Poly Haven nesta revisão recebeu HTTP 403; nenhum material externo foi incorporado.

## Espaços públicos adicionais

A versão local inclui 24 praças, quadras, jardins de chuva, feiras e parques de leitura entre os distritos. Têm mobiliário, acessos pavimentados, pontos de interação e marcação no mapa. A densidade e o desempenho visual precisam ser conferidos em navegador.

## Revisão: menu com direção afrofuturista

A tela de entrada e a gaveta agora usam uma ilustração SVG original de arquitetura de terra, trama geométrica autoral e cores de cobre, terra e vegetação. As referências culturais são explicadas em painel próprio; os desenhos não são identificados como símbolos tradicionais.

Busca tolerante a acentos/um erro de edição, controles de toque ajustáveis, recuperação atômica de cópias, ocupação de edifícios por NPCs, separação de pedestres e direção/frenagem foram refinadas. `node tests/check-afro-features.js` cobre esses fluxos em DOM/Three.js simulado; não comprova fotorrealismo nem experiência em celular real.

As 100 sugestões não estão completas. `STATUS-100-SUGESTOES.md` registra o estado de cada item. Colaboração de artistas, produção musical autoral, revisão especializada e testes físicos não foram substituídos por declarações automáticas.

## Revisão: restauração do menu e ateliê comunitário

O menu inicial e a gaveta voltaram ao visual anterior à última alteração afrofuturista, conforme solicitado. As correções de física, controles e salvamento foram mantidas.

O Ateliê da comunidade permite criar jardins (flores, alimentos e sombra), salvar até oito roteiros de aula, iniciar os percursos salvos e escolher pintura gratuita para o próximo veículo. Jardins persistem e se alteram no cenário; os troncos têm colisores. O ateliê não é um editor arquitetônico nem um sistema multiplayer.

`node tests/check-community.js` verifica criação/substituição de jardins, persistência, rejeição de projetos inválidos, roteiros sem duplicação, exportação de atividade de turma e pintura. `tests/afro-features-report.json` agora verifica também a restauração do menu. As pendências externas da lista de 100 sugestões permanecem documentadas.

## Menu original e auditoria de pendências

A tela inicial voltou ao menu da primeira revisão, `d66358cf9ea80bcf22acba5a1e3ca8b05abef422`, anterior às reformulações. Mantém cinco ações e a aparência original; o mapa abre o atlas atual. `O-QUE-FALTA.md` documenta as lacunas funcionais, arquitetônicas, visuais e de validação identificadas. Nenhum relatório declara conclusão das 100 sugestões.

## Correção da referência do menu

O menu correto solicitado é o da **Metrópole Afrofuturista**, restaurado da versão `13ba9c4`, com oito ações e acesso aos distritos. A restauração anterior do menu da Vila, com cinco ações, foi substituída. As funcionalidades da cidade foram preservadas.
