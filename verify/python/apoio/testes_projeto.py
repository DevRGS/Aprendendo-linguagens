import json
from pathlib import Path
import shutil
from tempfile import TemporaryDirectory
import unittest

import numpy as np
import pandas as pd

from executar_projeto import executar
from preparacao_viagens import ajustar, aplicar, extrair


class ProjetoTest(unittest.TestCase):
    def setUp(self):
        temporario = TemporaryDirectory()
        self.addCleanup(temporario.cleanup)
        self.base = Path(temporario.name)
        shutil.copytree(Path(__file__).resolve().parent / "dados", self.base / "dados")
        self.saida = self.base / "saida"
        self.estacoes = self.base / "dados" / "estacoes.csv"
        self.viagens = self.base / "dados" / "viagens.csv"

    def executar(self, nome):
        return executar(self.viagens, self.estacoes, self.base / nome)

    def dados(self):
        return pd.read_csv(self.viagens)

    def substituir(self, tabela):
        tabela.to_csv(self.viagens, index=False)

    def test_controles_e_artefatos(self):
        auditoria, parametros, tabelas, metricas = self.executar("saida")
        self.assertEqual(auditoria["linhas_brutas"], 12)
        self.assertEqual(auditoria["linhas_validas"], 10)
        self.assertEqual(auditoria["duplicatas_excedentes"], {"V04": 1})
        self.assertEqual(auditoria["rejeitadas"], {"V11": ["km_planejados negativo"]})
        self.assertEqual(auditoria["km_ausentes_validas"], ["V03", "V08"])
        self.assertEqual(auditoria["viagens_sem_cadastro"], ["V08"])
        self.assertEqual(parametros["km"], {"mediana": 4.0, "minimo": 2.0, "maximo": 8.0})
        self.assertEqual(parametros["referencia_minutos"], 10.0)
        self.assertEqual(metricas, {"validacao": 3.5, "teste": 10.0})
        for nome, ids in {"treino": range(1, 7), "validacao": range(7, 9), "teste": range(9, 11)}.items():
            ids = [f"V{i:02d}" for i in ids]
            tabela = pd.read_csv(self.saida / f"{nome}.csv")
            self.assertEqual(tabela["id"].tolist(), ids)
            X, y, chaves = extrair(tabela)
            self.assertEqual(X.shape, (len(ids), 2))
            self.assertEqual(y.shape, (len(ids),))
            self.assertEqual(chaves.tolist(), ids)
        unidas = pd.concat(tabelas.values()).set_index("id")
        for chave, esperado in {
            "V01": [0, 0], "V03": [1 / 3, 1], "V07": [98 / 6, 1],
            "V08": [1 / 3, 0], "V09": [0.5, 2], "V10": [7 / 6, 3],
        }.items():
            np.testing.assert_allclose(unidas.loc[chave, ["km_escalados", "paradas_planejadas"]].astype(float),
                                       esperado, atol=1e-6, rtol=0)
        dados = json.loads((self.saida / "parametros.json").read_text(encoding="utf-8"))
        self.assertEqual(dados, parametros)
        rastreio = pd.read_csv(self.saida / "rastreio.csv")
        tabela = unidas.loc[rastreio["id"]]
        self.assertEqual(tabela.index.tolist(), rastreio["id"].tolist())
        self.assertTrue((self.saida / "duracoes_treino.png").read_bytes().startswith(b"\x89PNG\r\n\x1a\n"))
        relatorio = (self.saida / "relatorio.md").read_text(encoding="utf-8")
        self.assertIn("duracoes_treino.png", relatorio)
        self.assertIn("3.5 min", relatorio)
        self.assertIn("10.0 min", relatorio)

    def test_reordenar_preserva_parametros_e_particoes(self):
        _, ref, tabelas_ref, _ = self.executar("original")
        self.substituir(self.dados().iloc[::-1])
        _, params, tabelas, _ = self.executar("reordenado")
        self.assertEqual(params, ref)
        for nome in tabelas:
            pd.testing.assert_frame_equal(tabelas[nome], tabelas_ref[nome])

    def test_mudancas_so_no_teste(self):
        _, ref, tabelas_ref, _ = self.executar("original")
        orig = self.dados()
        for coluna, valor in (("km_planejados", 50), ("minutos_reais", 50)):
            with self.subTest(coluna=coluna):
                dados = orig.copy()
                dados.loc[dados["id"] == "V09", coluna] = valor
                self.substituir(dados)
                _, params, tabelas, metricas = self.executar(coluna)
                self.assertEqual(params, ref)
                self.assertEqual((self.base / coluna / "parametros.json").read_bytes(),
                                 (self.base / "original" / "parametros.json").read_bytes())
                for nome in ("treino", "validacao"):
                    pd.testing.assert_frame_equal(tabelas[nome], tabelas_ref[nome])
                self.assertEqual(tabelas["teste"]["id"].tolist(), ["V09", "V10"])
                linha = tabelas["teste"].iloc[0]
                if coluna == "km_planejados":
                    self.assertAlmostEqual(linha["km_escalados"], 8, delta=1e-6)
                    self.assertEqual(metricas["teste"], 10.0)
                else:
                    self.assertEqual(linha["minutos_reais"], 50)
                    self.assertEqual(metricas["teste"], 26.0)

    def test_troca_de_datas_muda_particoes_e_parametros(self):
        dados = self.dados()
        datas = dados.set_index("id")["data"]
        dados.loc[dados["id"] == "V06", "data"] = datas["V07"]
        dados.loc[dados["id"] == "V07", "data"] = datas["V06"]
        self.substituir(dados)
        _, params, tabelas, _ = self.executar("trocadas")
        self.assertEqual(tabelas["treino"]["id"].iloc[-1], "V07")
        self.assertEqual(tabelas["validacao"]["id"].tolist(), ["V06", "V08"])
        self.assertEqual(params["km"]["mediana"], 4.0)
        self.assertEqual(params["km"]["maximo"], 100.0)
        self.assertEqual(params["referencia_minutos"], 9.0)

    def test_conflito_de_id_e_erro(self):
        dados = self.dados()
        conflito = dados.iloc[[0]].assign(km_planejados=99)
        self.substituir(pd.concat([dados, conflito], ignore_index=True))
        with self.assertRaisesRegex(ValueError, "ID em conflito: V01"):
            self.executar("conflito")
        self.assertFalse((self.base / "conflito").exists())

    def test_escala_constante_e_todos_ausentes(self):
        dados = self.dados().iloc[:6].assign(km_planejados=4.0)
        params = ajustar(dados)
        self.assertTrue(aplicar(dados.assign(km_planejados=10.0), params)["km_escalados"].eq(0).all())
        with self.assertRaisesRegex(ValueError, "treino sem distâncias observadas"):
            ajustar(dados.assign(km_planejados=float("nan")))

    def test_alvo_obrigatorio_e_nao_negativo(self):
        dados = self.dados()
        dados.loc[dados["id"] == "V01", "minutos_reais"] = float("nan")
        dados.loc[dados["id"] == "V02", "minutos_reais"] = -2
        self.substituir(dados)
        auditoria, _, tabelas, _ = self.executar("alvos_invalidos")
        self.assertEqual(auditoria["rejeitadas"]["V01"], ["minutos_reais ausente"])
        self.assertEqual(auditoria["rejeitadas"]["V02"], ["minutos_reais negativo"])
        self.assertEqual(tabelas["treino"]["id"].tolist(), ["V03", "V04", "V05", "V06"])


if __name__ == "__main__":
    unittest.main()
