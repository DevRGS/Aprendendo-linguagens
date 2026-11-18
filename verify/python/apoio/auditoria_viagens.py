import json

import numpy as np
import pandas as pd

TIPOS = {
    "id": "string",
    "data": "string",
    "estacao": "string",
    "km_planejados": "float64",
    "paradas_planejadas": "Int64",
    "minutos_reais": "float64",
    "minutos_faturados": "float64",
}

UNIDADES = {
    "id": "chave de viagem",
    "data": "dia (AAAA-MM-DD)",
    "estacao": "chave de estação",
    "km_planejados": "km",
    "paradas_planejadas": "paradas (contagem)",
    "minutos_reais": "min",
    "minutos_faturados": "min",
}


def ler_viagens(caminho):
    viagens = pd.read_csv(caminho, dtype=TIPOS, keep_default_na=False, na_values=[""])
    if set(viagens.columns) != set(TIPOS):
        raise ValueError("colunas de viagens diferentes do esquema")
    if viagens[["id", "data", "estacao"]].isna().any().any():
        raise ValueError("id, data e estacao devem ser preenchidos")
    if not viagens["data"].str.fullmatch(r"[0-9]{4}-[0-9]{2}-[0-9]{2}").all():
        raise ValueError("data deve estar no formato AAAA-MM-DD")
    viagens["data"] = pd.to_datetime(viagens["data"], format="%Y-%m-%d")
    return viagens


def ler_estacoes(caminho):
    estacoes = pd.read_csv(caminho, dtype="string", keep_default_na=False, na_values=[""])
    if set(estacoes.columns) != {"estacao", "nome"} or estacoes.isna().any().any():
        raise ValueError("estacoes.csv deve ter chave e nome preenchidos")
    return estacoes


def auditar(brutas, estacoes):
    duplicatas = brutas.loc[brutas.duplicated(), "id"].value_counts().sort_index()
    unicas = brutas.drop_duplicates()
    conflitos = sorted(unicas.loc[unicas["id"].duplicated(keep=False), "id"].unique())
    if conflitos:
        prefixo = "ID em conflito: " if len(conflitos) == 1 else "IDs em conflito: "
        raise ValueError(prefixo + ", ".join(conflitos))

    regras = {
        "km_planejados negativo": unicas["km_planejados"].lt(0),
        "km_planejados infinito": np.isinf(unicas["km_planejados"]),
        "paradas_planejadas ausente": unicas["paradas_planejadas"].isna(),
        "paradas_planejadas negativo": unicas["paradas_planejadas"].lt(0).fillna(False),
        "minutos_reais ausente": unicas["minutos_reais"].isna(),
        "minutos_reais negativo": unicas["minutos_reais"].lt(0),
        "minutos_reais infinito": np.isinf(unicas["minutos_reais"]),
    }
    rejeitadas = {}
    for regra, mascara in regras.items():
        for chave in sorted(unicas.loc[mascara, "id"]):
            rejeitadas.setdefault(chave, []).append(regra)
    validas = unicas.loc[~unicas["id"].isin(rejeitadas)].copy()
    validas["paradas_planejadas"] = validas["paradas_planejadas"].astype("int64")
    uniao = validas.merge(estacoes, on="estacao", how="left", validate="many_to_one", indicator=True)
    auditoria = {
        "linhas_brutas": len(brutas),
        "linhas_validas": len(uniao),
        "duplicatas_excedentes": {chave: int(n) for chave, n in duplicatas.items()},
        "total_duplicatas_excedentes": int(duplicatas.sum()),
        "rejeitadas": rejeitadas,
        "total_rejeitadas": len(rejeitadas),
        "km_ausentes_validas": sorted(validas.loc[validas["km_planejados"].isna(), "id"]),
        "viagens_sem_cadastro": sorted(uniao.loc[uniao["_merge"] == "left_only", "id"]),
        "decisoes": [
            "Conservar o original e remover só cópias de linhas idênticas.",
            "Interromper quando registros diferentes usam o mesmo id.",
            "Conservar km ausente para imputação no preparo.",
            "Conservar zero paradas e distâncias altas dentro do domínio.",
            "Manter em auditoria as viagens sem cadastro de estação.",
        ],
        "unidades": UNIDADES,
    }
    return uniao.drop(columns="_merge"), auditoria


def salvar_json(caminho, dados):
    caminho.write_text(
        json.dumps(dados, ensure_ascii=False, indent=2, sort_keys=True) + "\n",
        encoding="utf-8",
    )
