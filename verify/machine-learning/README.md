# Laboratório de previsão de viagens

Use Python 3.14. Extraia o ZIP e abra o terminal na pasta que contém este README. No Linux/macOS, execute os comandos abaixo. No Windows, crie o ambiente com `py -3.14 -m venv .venv` e substitua `.venv/bin/python` por `.venv\Scripts\python.exe` nos demais comandos.

```sh
python3.14 -m venv .venv
.venv/bin/python -m pip install -r requirements.txt
.venv/bin/python -m inicial.projeto
.venv/bin/python -m solucao.projeto
.venv/bin/python -m unittest -v
```

Para acompanhar uma aula no terminal, salve os blocos Python da aula, na ordem, em um arquivo estudo.py na raiz extraída. Execute-o com o Python da pasta .venv. Também é possível abrir o caderno da trilha no Jupyter com esse mesmo ambiente. O caderno contém os dados, a biblioteca e a solução, além dos exemplos e três atividades por aula.

## Dados fornecidos

viagens.csv contém as dez viagens fictícias válidas da trilha Python, ordenadas por data e ID depois de retirar uma duplicata exata e uma distância negativa. O campo minutos_faturados só existe depois da viagem. Conserve-o fora dos atributos. Na primeira avaliação, treine com V01–V06 e valide em V07–V08. Reserve V09–V10.

serie.csv tem 120 dias fictícios, uma viagem por dia, a partir de 01/02/2026. No gerador com semente 73 a distância real planejada varia entre 2 e 18 km e as paradas entre 0 e 6. A duração usa 6 + 1,3 × km + 2 × paradas, ruído normal com desvio de 3 minutos e um acréscimo de 3 minutos a partir da viagem 96. O CSV omite uma distância a cada 11 linhas, começando na primeira. Todos os registros são didáticos. Os IDs identificam observações, e as datas definem a fronteira temporal.

## Entrega

Parta de inicial/projeto.py. Compare nas mesmas janelas as referências e os dois valores de alpha. Registre seus MAEs em minutos. Congele a escolha antes de abrir os últimos 20 alvos. Reajuste nos primeiros 100 dias, avalie uma vez nos últimos 20 e escreva um parágrafo que explique o sinal dos resíduos em residuos.png. Cite os atributos conhecidos antes da partida e uma limitação que impeça generalizar o resultado para viagens reais. Compare seu relatório com a saída da solução comentada.

**Variação inédita.** Um atraso operacional acrescenta sete minutos aos alvos do último período. Antes de executar, preveja quais números mudariam. Em uma cópia do experimento, some 7 a y[100:] depois de congelar o modelo. Seu código deve preservar a escolha, os erros de validação e cada previsão. O resíduo de cada viagem final deve aumentar exatamente 7 minutos. A mudança no MAE depende dos sinais. O teste de reserva verifica a independência do ajuste. Use a variação como análise de sensibilidade posterior.
