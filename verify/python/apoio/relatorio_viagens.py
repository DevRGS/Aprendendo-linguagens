import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

from preparacao_viagens import extrair, mae


def publicar_relatorio(tabelas, parametros, saida):
    referencia = parametros["referencia_minutos"]
    _, treino, _ = extrair(tabelas["treino"])
    metricas = {}
    for nome in ("validacao", "teste"):
        _, alvos, _ = extrair(tabelas[nome])
        metricas[nome] = mae(alvos, referencia)

    fig, ax = plt.subplots(layout="constrained")
    contagens, _, _ = ax.hist(treino, bins=4, edgecolor="black")
    ax.set(xlabel="Duração real (min)", ylabel="Viagens de treino (contagem)",
           title="Distribuição da duração no treino")
    fig.savefig(saida / "duracoes_treino.png")
    plt.close(fig)

    alturas = ", ".join(str(int(contagem)) for contagem in contagens)
    linhas = [
        "# Duração de viagens",
        "",
        "Objetivo: estimar duração em minutos antes da partida usando dados sintéticos.",
        "",
        f"A referência prevê {referencia:.1f} min para cada viagem, mediana do alvo no treino.",
        "A imputação e a escala também foram calculadas apenas com o treino.",
        "A referência ficou congelada antes da avaliação de teste.",
        "",
        "| Partição | Viagens | MAE |",
        "|---|---:|---:|",
        f"| Validação | {len(tabelas['validacao'])} | {metricas['validacao']:.1f} min |",
        f"| Teste | {len(tabelas['teste'])} | {metricas['teste']:.1f} min |",
        "",
        f"![Histograma de duração no treino com quatro barras de alturas {alturas}.](duracoes_treino.png)",
        "",
        "| Viagem | Duração real no treino (min) |",
        "|---|---:|",
    ]
    for chave, duracao in tabelas["treino"][["id", "minutos_reais"]].itertuples(index=False):
        linhas.append(f"| {chave} | {duracao:g} |")
    linhas.extend([
        "",
        "O MAE é a média dos erros absolutos em minutos. Cada linha tem o mesmo peso.",
        "Os resultados descrevem estas poucas viagens e podem variar muito com novos dias.",
        "O gráfico foi produzido só com dados de treino, e as estações são usadas para auditoria.",
        "",
    ])
    (saida / "relatorio.md").write_text("\n".join(linhas), encoding="utf-8")
    return metricas
