"""Empacota as páginas iniciais independentes das 20 aulas e o desafio."""
from pathlib import Path
from zipfile import ZIP_DEFLATED, ZipFile, ZipInfo

BASE = Path(__file__).resolve().parent
KIT = BASE / "kit"
SOLUCAO = KIT / "projeto/solucao"
DESTINO = BASE.parents[1] / "content/html-css/projetos/projeto.zip"

def documento(titulo, corpo, folha="estilo.css"):
    return f"""<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{titulo}</title>
  <link rel="stylesheet" href="{folha}">
</head>
<body>
{corpo}
</body>
</html>
"""

def detalhe_dados():
    return documento(
        "Trilha de dados",
        '<main><h1>Trilha de dados</h1><a href="../index.html">Voltar ao catálogo</a></main>',
        "../estilo.css",
    )

CARTOES = """<main>
  <h1>Catálogo</h1>
  <div class="colecao">
    <article><h2>Web</h2><p>Crie páginas.</p><a href="trilhas/web.html">Abrir Web</a></article>
    <article><h2>Dados</h2><p>Leia tabelas.</p><a href="trilhas/dados.html">Abrir Dados</a></article>
    <article><h2>Revisão</h2><p>Retome o percurso de Web.</p><a href="trilhas/web.html">Revisar Web</a></article>
  </div>
</main>"""
MENU = """<nav class="menu" aria-label="Trilhas">
  <a href="trilhas/web.html">Abrir Web</a>
  <a href="trilhas/dados.html">Abrir Dados</a>
  <a href="trilhas/web.html">Revisar a introdução de Web</a>
</nav>"""
NAVEGACAO = """<h1>Catálogo</h1>
<nav aria-label="Trilhas">
  <a href="trilhas/web.html">Abrir Web</a>
  <a href="trilhas/dados.html">Abrir Dados</a>
</nav>"""

def arquivos_aula(numero):
    if numero == 20:
        return {p.relative_to(SOLUCAO).as_posix(): p.read_bytes()
                for p in SOLUCAO.rglob("*") if p.is_file()}
    corpo = {
        9: '<main><h1>Catálogo</h1><p class="aviso">Revise o guia.</p><p>Escolha uma trilha.</p></main>',
        10: '<main><h1>Catálogo</h1><p class="aviso">Revise o guia.</p></main>',
        11: '<main><h1>Caixa do cartão</h1><div class="caixa">Trilha Web</div></main>',
        12: '<main><h1>Catálogo</h1><a href="trilhas/web.html">Abrir Web</a> <button type="button">Revisão de foco</button></main>',
        13: CARTOES, 14: MENU, 15: CARTOES, 16: CARTOES,
        17: NAVEGACAO, 18: NAVEGACAO, 19: NAVEGACAO,
    }.get(numero, "<h1>Meu rascunho</h1>")
    arquivos = {"index.html": documento("Catálogo", corpo),
                "estilo.css": "/* Escreva aqui as regras da aula. */\n"}
    if numero in {3, 5, 6, 12, 13, 14, 15, 16, 17, 18, 19}:
        arquivos["trilhas/web.html"] = (SOLUCAO / "trilhas/web.html").read_bytes()
        arquivos["mapa.svg"] = (SOLUCAO / "mapa.svg").read_bytes()
    if numero in {13, 14, 15, 16, 17, 18, 19}:
        arquivos["trilhas/dados.html"] = detalhe_dados()
    if numero == 4:
        arquivos["mapa.svg"] = (SOLUCAO / "mapa.svg").read_bytes()
    if numero == 8:
        arquivos["obrigado.html"] = (SOLUCAO / "obrigado.html").read_bytes()
    return arquivos

if __name__ == "__main__":
    arquivos = {p.relative_to(KIT).as_posix(): p.read_bytes()
                for p in KIT.rglob("*") if p.is_file()}
    for numero in range(1, 21):
        for nome, conteudo in arquivos_aula(numero).items():
            arquivos[f"aulas/{numero:02d}/{nome}"] = conteudo
    with ZipFile(DESTINO, "w") as pacote:
        for nome, conteudo in sorted(arquivos.items()):
            pacote.writestr(ZipInfo(nome), conteudo, compress_type=ZIP_DEFLATED)
