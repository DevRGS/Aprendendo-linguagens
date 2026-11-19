"""Execute python -m inicial.projeto. Substitua cada TODO e explique suas escolhas."""
from laboratorio import alternativas, carregar
from sklearn.metrics import mean_absolute_error

ids, X, y = carregar("serie.csv")
print("Desenvolvimento:", ids[0], ids[99], "• Avaliação reservada:", ids[100], ids[-1])
base = alternativas()["mediana"].fit(X[:40], y[:40])
print("Primeira janela, MAE de referência (min):", mean_absolute_error(y[40:60], base.predict(X[40:60])))
# TODO: repita as três janelas (cortes 40, 60, 80, horizonte 20) para cada alternativa.
# TODO: congele o menor MAE médio, reajuste nos 100 dias e avalie nas 20 linhas finais.
# TODO: desenhe os resíduos e indique uma limitação dos dados sintéticos.
