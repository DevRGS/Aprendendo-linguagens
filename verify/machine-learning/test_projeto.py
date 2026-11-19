from pathlib import Path
from tempfile import TemporaryDirectory
import unittest
import numpy as np
from sklearn.metrics import mean_absolute_error
from laboratorio import alternativas, carregar
from solucao.projeto import avaliar, selecionar


class Viagens(unittest.TestCase):
    def test_ponte_python(self):
        ids, X, y = carregar()
        self.assertEqual((len(ids), len(set(ids))), (10, 10))
        previsoes = alternativas()["mediana"].fit(X[:6], y[:6]).predict(X[6:8])
        self.assertEqual(mean_absolute_error(y[6:8], previsoes), 3.5)

    def test_reserva(self):
        _, X, y = carregar("serie.csv")
        nome, modelo, erros = selecionar(X[:100], y[:100])
        previsto = modelo.predict(X[100:])
        y[100:] += 7
        outro, novo, medidas = selecionar(X[:100], y[:100])
        self.assertEqual((nome, erros), (outro, medidas))
        np.testing.assert_allclose(previsto, novo.predict(X[100:]))
        with TemporaryDirectory() as pasta:
            destino = Path(pasta) / "residuos.png"
            np.testing.assert_allclose(avaliar(destino), previsto)
            self.assertTrue(destino.read_bytes().startswith(b"\x89PNG"))
