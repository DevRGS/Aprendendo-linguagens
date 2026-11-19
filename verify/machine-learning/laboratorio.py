"""Dados cronológicos e ferramentas compartilhadas pelas aulas. Execute na raiz do kit."""
from pathlib import Path
import csv
import numpy as np
from sklearn.dummy import DummyRegressor
from sklearn.impute import SimpleImputer
from sklearn.linear_model import Ridge
from sklearn.pipeline import make_pipeline

DADOS = Path(__file__).resolve().parent / "dados"


def carregar(nome="viagens.csv"):
    with (DADOS / nome).open(encoding="utf-8", newline="") as arquivo:
        linhas = sorted(csv.DictReader(arquivo), key=lambda item: (item["data"], item["id"]))
    ids = [linha["id"] for linha in linhas]
    if len(ids) != len(set(ids)):
        raise ValueError("ID repetido")
    X = np.array([[float(r["km_planejados"] or "nan"), float(r["paradas_planejadas"])] for r in linhas])
    y = np.array([float(r["minutos_reais"]) for r in linhas])
    return ids, X, y


def alternativas():
    # A mediana minimiza a soma dos erros absolutos de uma previsão constante no treino.
    return {"mediana": DummyRegressor(strategy="median"),
            "ridge-1": make_pipeline(SimpleImputer(strategy="median"), Ridge(alpha=1)),
            "ridge-10": make_pipeline(SimpleImputer(strategy="median"), Ridge(alpha=10))}
