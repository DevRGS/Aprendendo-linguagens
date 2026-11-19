# Projeto de conclusão · Duração de viagens

As viagens e estações deste projeto são sintéticas. Os originais ficam em
`dados/viagens.csv` e `dados/estacoes.csv`. Cada viagem representa uma observação.
Queremos estimar sua duração em minutos antes da partida.

## Terminal

A partir da raiz do kit, siga a instalação de CPython 3.14 e
`requirements.txt` no README do kit. Confira o ambiente com
`python -c "import sys, numpy, pandas, matplotlib; print(sys.version); print(numpy.__version__, pandas.__version__, matplotlib.__version__)"`.
Use no lugar de `python` o executável da venv indicado no README, em Bash ou
PowerShell. Os pacotes usados neste projeto são NumPy, pandas e Matplotlib e
suas versões de referência estão no arquivo de requisitos do kit.

Rode `executar_projeto.py` com esse interpretador e o caminho para o script.
Exemplo Bash a partir da raiz do kit do projeto

```bash
.venv/bin/python aulas/reproduzir/e3-resolvido/executar_projeto.py
.venv/bin/python aulas/reproduzir/e3-resolvido/testes_projeto.py
```

Em PowerShell

```powershell
.\.venv\Scripts\python.exe aulas/reproduzir/e3-resolvido/executar_projeto.py
.\.venv\Scripts\python.exe aulas/reproduzir/e3-resolvido/testes_projeto.py
```

A pasta `saida` é criada ao lado de `executar_projeto.py`. Leia
`relatorio.md` junto ao PNG e confira os arquivos em texto. Para experimentar
outras entradas, faça uma cópia de `dados` e chame a função `executar` com os
caminhos da cópia e uma nova pasta de saída. Os testes já isolam suas cópias
em pastas temporárias.

## Navegador

Abra a variante resolvida do caderno de Reproduzir e execute desde a
preparação. A primeira célula cria uma pasta de estudo independente. Para
conferir as versões do kernel, execute a linha de Python acima depois de
retirar `python -c` e as aspas externas. As células preparam os CSVs e módulos
auxiliares, executam o projeto, fazem os testes e mostram o PNG. No painel de
arquivos, abra a pasta `python-reproduzir-…/e3/saida` e baixe os arquivos que
quer guardar. Baixe também o caderno editável e guarde juntos relatório e
figura. Para reler um módulo que você editou, salve o arquivo e execute novamente a
preparação dessa etapa. A preparação inicial cria outra pasta.

## Arquivos produzidos

- `auditoria.json` registra regras, unidades e IDs afetados.
- `parametros.json` congela fronteiras, ordem de atributos, imputação,
  escala, convenção de amplitude zero e referência.
- `treino.csv`, `validacao.csv` e `teste.csv` mantêm id para alinhar atributos e alvo.
- `rastreio.csv` preserva data e partição por ID.
- `relatorio.md` e `duracoes_treino.png` mostram as métricas em minutos e
  a distribuição exploratória do alvo de treino.

### Rubrica (100 pontos)

Avalie cinco itens com 0, 10 ou 20 pontos. Use 0 para ausente ou contraditório, 10 para parcial e 20 para evidência completa.

1. Contagens e decisões auditáveis, com IDs e unidades.
2. Partições cronológicas e atributos disponíveis antes da partida.
3. Imputação e escala ajustadas no treino, parâmetros persistidos e saídas conferidas.
4. Referência, MAE, gráfico, tabela e limites explicados.
5. Reprodução limpa e testes dos casos de borda.

Meta para seguir a machine learning: 80 pontos, com 20 nos itens 2 e 3.
