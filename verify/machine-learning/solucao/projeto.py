"""Execute python -m solucao.projeto a partir da raiz do kit."""
from pathlib import Path
import numpy as np
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from sklearn.metrics import mean_absolute_error
from laboratorio import alternativas, carregar


def selecionar(X, y):
    # A função só recebe as 100 datas de desenvolvimento.
    erros = {}
    for nome, modelo in alternativas().items():
        janelas = []
        for corte in (40, 60, 80):
            modelo.fit(X[:corte], y[:corte])
            previsao = modelo.predict(X[corte:corte + 20])
            janelas.append(mean_absolute_error(y[corte:corte + 20], previsao))
        erros[nome] = float(np.mean(janelas))
    nome = min(erros, key=erros.get)
    return nome, alternativas()[nome].fit(X, y), erros


def avaliar(saida=Path("residuos.png")):
    ids, X, y = carregar("serie.csv")
    nome, vencedor, erros = selecionar(X[:100], y[:100])
    previstos = vencedor.predict(X[100:])
    ref = alternativas()["mediana"].fit(X[:100], y[:100]).predict(X[100:])
    print("MAE de validação (min):", {k: round(v, 2) for k, v in erros.items()})
    print(f"Congelado: {nome}; período final: {ids[100]} a {ids[-1]}")
    for rotulo, resultado in [("selecionado", previstos), ("referência", ref)]:
        print(f"MAE final {rotulo}: {mean_absolute_error(y[100:], resultado):.2f} min")
    fig, ax = plt.subplots()
    ax.scatter(np.arange(101, len(ids) + 1), y[100:] - previstos)
    ax.axhline(0, color="black")
    ax.set(xlabel="Viagem no período final", ylabel="Real − previsto (min)")
    fig.savefig(saida, bbox_inches="tight")
    plt.close(fig)
    return previstos


if __name__ == "__main__":
    avaliar()
