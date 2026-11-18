# Validação da expansão metropolitana

## Método

Node.js, jsdom e Three.js r128 real. A suíte monta a cena, testa geometria com raycasting, colisores, rotas, modelos, interiores, estados de simulação e eventos DOM. Canvas 2D e renderer são substitutos de teste: esta evidência não é inspeção visual nem benchmark GPU.

Execute `npm test`. O resultado detalhado fica em `tests/unit-report.json`. O HTML é montado por `npm run build`.

## Cobertura atual

- 3.507 amostras em anéis e avenidas; 5.736 amostras nas ruas dos distritos. Asfalto e colisões examinados na geometria montada.
- 124 destinos com entrada/acesso alcançáveis pela malha pavimentada desde o núcleo original.
- 109 interiores montados e 1.115 pontos de interesse registrados após a montagem completa.
- Três veículos controláveis: deslocamento, frenagem, rodas, bateria, recarga, limites da via e desembarque.
- Micro-ônibus automático: volta circular e quatro paradas.
- Sete modalidades de transporte regional: embarque fora da estação rejeitado, origem igual ao destino rejeitada, viagem e chegada verificadas.
- Elevador: mudança de nível e altura do jogador; porta: alteração da malha/colisor; iluminação: mudança de estado.
- 48 moradores: mudança de rotina, deslocamento, diálogo, liberação do estado de conversa e reação a tempestade.
- Onze espécies/robôs: observação registrada; cultivo: plantio, crescimento e colheita com mudança de estado.
- Evento: contribuição registrada no armazenamento local.
- Cinco condições ambientais: estados e partículas; os efeitos visuais ainda precisam de inspeção em GPU.
- Atlas: filtros, zoom e encerramento do temporizador ao fechar.
- Primeira/terceira pessoa: visibilidade do avatar e atualização da câmera.
- Viagem espacial: lançamento, interior orbital e retorno ao distrito de origem.
- Leitura sem WebGL, busca, preferências, remapeamento, foco no modal, percursos e qualidade automática.
- Integração com o laço principal nos modos orbital, caminhada e direção.

A geração de rotas é dividida entre quadros, com cancelamento seguro. A verificação específica fica em `tests/routes-report.json`.

`tests/browser.js` prepara os fluxos atuais em três tamanhos de tela para uma futura sessão com navegador disponível; não foi executado aqui.

## Limites explícitos

A ferramenta de prévia do navegador requerida pelo fluxo Sites não estava disponível. Não foram executados nesta expansão: inspeção visual, console de um navegador real, áudio/narração real, eventos multitoque, auditoria de leitor de tela, FPS, bateria ou memória em celulares. A publicação confirma que o artefato foi hospedado, não substitui esses testes.

Os antigos `tests/validation-report.json`, `tests/mobile-interaction-report.json` e `tests/validate.js` pertencem à primeira revisão da vila e são mantidos como histórico. Não constituem evidência de validação visual da metrópole.

Personagens, animais e arquitetura são procedurais estilizados. Testes de lógica não comprovam naturalismo, fidelidade cultural ou validade de projetos arquitetônicos. Não houve revisão docente/especializada das referências nesta expansão.

## Evidência desta revisão de menu

- `tests/afro-features-report.json`: arte autoral/contexto, busca da gaveta, busca tolerante, ajustes de toque, cópias inválidas, rollback, ocupação de edifícios, separação local de pedestres e funções de direção/frenagem.
- `tests/start-screen.js`: ações da tela inicial e retomada condicionada à existência de posição salva.
- `tests/design-report.json`: construção de 12 programas de interiores e índice espacial de colisão.
- `tests/suggestions-status.json`: estado item a item, sem afirmar conclusão integral.

Prévia de navegador continua indisponível: `cua_repl.js` não foi oferecido. Não foram gerados screenshots nem executados testes de renderização nesta revisão.

## Restauração do menu e projetos comunitários

A função `renderStart` foi comparada com a versão anterior `8a507d3a490ec99a9db7afe02de2964201be1b48`; a alteração visual mais recente foi removida. `tests/community-report.json` registra os testes de jardim, roteiro e pintura. Não houve inspeção visual nem testes em aparelhos físicos nesta revisão.
