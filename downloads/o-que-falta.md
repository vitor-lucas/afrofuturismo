# O que ainda falta na metrópole

## Menu solicitado

O menu solicitado é o da **Metrópole Afrofuturista**, versão `13ba9c4`, anterior às reformulações da página inicial. O título e os oito botões foram restaurados: Explorar os oito distritos, Explorar a cidade, Iniciar visita guiada, Conhecer o conceito, Ver mapa, Percursos por tema, Transportes limpos e Abrir glossário. Os cinco botões da Vila Afrofuturista não eram a referência desejada.

## Prioridade 1 — funcionamento e validação

- Executar testes em navegador com WebGL: carregamento, console, movimentação, toque, mapas, menus, áudio e troca de interiores.
- Testar telas de 320 a 1920 pixels, celular na horizontal, teclado virtual, texto ampliado e leitor de tela.
- Atualizar e executar integralmente a suíte geral `tests/unit.js` e a suíte de navegador. Há verificações antigas incompatíveis com recursos novos, como a contagem fixa de três veículos em `tests/scenarios.js`; testes pontuais novos não substituem essa atualização.
- Auditar todas as portas, escadas, elevadores e passagens com o jogador em movimento. Os testes atuais não certificam todos os percursos internos.
- Liberar materiais e texturas exclusivos ao remover interiores do cache. A implementação atual de `getInterior` descarta geometrias, mas não cobre toda a limpeza dos recursos de cada interior.
- Medir FPS, uso de memória, chamadas de desenho e tempo de carregamento em aparelhos de entrada. Ocultar objetos distantes ainda não equivale a carregar distritos sob demanda.

## Prioridade 2 — arquitetura e realismo

- Desenhar projetos próprios para os edifícios principais. Muitos edifícios ainda compartilham estrutura, dimensões e famílias de plantas; nomes e coberturas diferentes não equivalem a projetos exclusivos.
- Conferir correspondência real entre janela, cômodo, fachada, piso e entrada.
- Integrar modelos detalhados de personagens, veículos e animais restantes, com licenças documentadas, animações e níveis de detalhe.
- Incorporar materiais fotográficos PBR e iluminação HDRI. Os materiais atuais continuam majoritariamente procedurais.
- Revisar sombras, reflexos, água, transparência e exposição de interiores com inspeção visual.
- Revisar a presença cultural com referências específicas e curadoria; artistas e colaborações não podem ser inventados.

## Prioridade 3 — cidade viva

- Completar trabalho animado por profissão e circulação social dos NPCs. Horários, ocupação e diálogo estão implementados parcialmente; não há ainda uma simulação social completa.
- Integrar pedestres, tráfego de fundo, semáforos e transportes em um mesmo conjunto de regras. A prioridade do jogador não comprova a coerência do tráfego inteiro.
- Completar os ciclos de vida e habitats por espécie. Quatro modelos de animais importados não substituem todos os animais restantes.
- Evoluir as missões para uma campanha com decisões que mudem os bairros.
- Implementar exposições personalizadas e álbum visual de descobertas. Jardins e diário já existem, mas não cobrem esses itens.

## Prioridade 4 — conteúdo, áudio e colaboração

- Produzir ou licenciar sons gravados e música original; o áudio atual é sintetizado.
- Implementar posicionamento espacial, oclusão acústica e legendas de todos os avisos.
- Concluir auditoria de licenças de modelos, imagens, fontes e bibliografia.
- Obter revisão cultural/docente especializada. O texto de pesquisa anexado foi preservado, não certificado como pesquisa verificada.
- Criar recursos cooperativos em rede, caso desejado. Hoje a cidade é estática, o progresso é local e as atividades de grupo exportadas não são multiplayer.

## Escopo técnico atual

Não há backend próprio, banco de dados ou sincronização entre dispositivos. O site roda no navegador e salva no armazenamento local. Portanto, não foi realizada uma “auditoria de backend” de um servidor que não existe.

## Evidência disponível

- `tests/start-screen.js`: menu original comparado ao histórico e cinco ações verificadas.
- `tests/afro-features-report.json`: busca, controles, restauração, dinâmica e funções de NPCs testadas em DOM/Three.js.
- `tests/community-report.json`: jardins, roteiros e pintura de veículo.
- `tests/design-report.json`: montagem de 12 programas de interiores e índice espacial.
- `tests/geometry-report.json`: última verificação de vias, sem validação visual em GPU.

Esses relatórios comprovam seus cenários específicos. Não comprovam fotorrealismo, ausência de todos os bugs ou funcionamento universal em celulares.

## Situação das 100 sugestões

- Parcial: 70.
- Pendente: 13.
- Dependência externa: 8.
- Implementado/testado: 9.

O detalhamento de cada item está em `STATUS-100-SUGESTOES.md`. A lista ainda não está concluída.
