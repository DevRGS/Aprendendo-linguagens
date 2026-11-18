from pathlib import Path

from auditoria_viagens import auditar, ler_estacoes, ler_viagens, salvar_json
from preparacao_viagens import ajustar, exportar, extrair, particionar
from relatorio_viagens import publicar_relatorio


def executar(viagens_csv, estacoes_csv, saida):
    validas, auditoria = auditar(ler_viagens(viagens_csv), ler_estacoes(estacoes_csv))
    partes = particionar(validas)
    parametros = ajustar(partes["treino"])
    saida.mkdir(exist_ok=True, parents=True)
    salvar_json(saida / "auditoria.json", auditoria)
    salvar_json(saida / "parametros.json", parametros)
    tabelas = exportar(partes, parametros, saida)
    metricas = publicar_relatorio(tabelas, parametros, saida)
    return auditoria, parametros, tabelas, metricas


def mostrar(auditoria, parametros, tabelas, metricas):
    print(f"Auditoria: {auditoria['linhas_brutas']} brutas, {auditoria['linhas_validas']} válidas.")
    print(f"Mediana de km no treino: {parametros['km']['mediana']:.1f}")
    for nome, tabela in tabelas.items():
        X, y, ids = extrair(tabela)
        print(nome, X.shape, y.shape, ids.tolist())
    print(f"MAE de validação: {metricas['validacao']:.1f} min")
    print(f"MAE de teste: {metricas['teste']:.1f} min")


if __name__ == "__main__":
    pasta = Path(__file__).resolve().parent
    resultados = executar(pasta / "dados" / "viagens.csv", pasta / "dados" / "estacoes.csv",
                         pasta / "saida")
    mostrar(*resultados)
