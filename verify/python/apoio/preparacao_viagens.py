from statistics import median

import numpy as np
import pandas as pd

ATRIBUTOS = ["km_escalados", "paradas_planejadas"]
ALVO = "minutos_reais"
FIM_TREINO = pd.Timestamp("2026-01-06")
FIM_VALIDACAO = pd.Timestamp("2026-01-08")


def particionar(validas):
    ordenadas = validas.sort_values(["data", "id"])
    datas = ordenadas["data"]
    partes = {
        "treino": ordenadas.loc[datas <= FIM_TREINO],
        "validacao": ordenadas.loc[(datas > FIM_TREINO) & (datas <= FIM_VALIDACAO)],
        "teste": ordenadas.loc[datas > FIM_VALIDACAO],
    }
    if any(parte.empty for parte in partes.values()):
        raise ValueError("treino, validação e teste devem ter pelo menos uma viagem")
    return partes


def ajustar(treino):
    km = treino["km_planejados"]
    observados = km.dropna()
    if observados.empty:
        raise ValueError("treino sem distâncias observadas")
    mediana = float(observados.median())
    preenchidos = km.fillna(mediana)
    return {
        "km": {
            "mediana": mediana,
            "minimo": float(preenchidos.min()),
            "maximo": float(preenchidos.max()),
        },
        "referencia_minutos": float(median(treino[ALVO])),
        "atributos": ATRIBUTOS.copy(),
        "alvo": ALVO,
        "convencao_amplitude_zero": "km_escalados vale 0 em todas as partições",
        "fronteiras_inclusivas": {
            "fim_treino": FIM_TREINO.date().isoformat(),
            "fim_validacao": FIM_VALIDACAO.date().isoformat(),
        },
        "instante_previsao": "antes da partida",
        "fora_de_X": {
            "id": "chave de rastreio",
            "data": "define partições e fica para rastreio",
            "estacao": "chave para auditoria",
            "nome": "nome para auditoria",
            "minutos_reais": "alvo conhecido depois da chegada",
            "minutos_faturados": "calculado após a chegada",
        },
    }


def aplicar(parte, parametros):
    escala = parametros["km"]
    km = parte["km_planejados"].fillna(escala["mediana"])
    amplitude = escala["maximo"] - escala["minimo"]
    escalados = (km - escala["minimo"]) / amplitude if amplitude else pd.Series(0.0, index=parte.index)
    return parte.assign(km_escalados=escalados)[["id", *ATRIBUTOS, ALVO]].reset_index(drop=True)


def extrair(tabela):
    X = tabela[ATRIBUTOS].to_numpy(dtype=float)
    y = tabela[ALVO].to_numpy(dtype=float)
    ids = tabela["id"].to_numpy(dtype=str)
    return X, y, ids


def exportar(partes, parametros, saida):
    tabelas = {}
    rastreio = []
    for nome, parte in partes.items():
        tabela = aplicar(parte, parametros)
        tabelas[nome] = tabela
        tabela.to_csv(saida / f"{nome}.csv", index=False)
        rastreio.append(parte[["id", "data"]].assign(particao=nome))
    pd.concat(rastreio).to_csv(saida / "rastreio.csv", index=False, date_format="%Y-%m-%d")
    return tabelas


def mae(alvos, previsao):
    if len(alvos) == 0:
        raise ValueError("MAE requer ao menos um alvo")
    return float(np.abs(np.asarray(alvos, dtype=float) - previsao).mean())
