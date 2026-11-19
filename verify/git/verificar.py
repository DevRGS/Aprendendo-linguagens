"""Executa as demonstrações copiáveis de Git e o desafio em cópias descartáveis."""
import json
import os
from pathlib import Path
import re
import subprocess
from tempfile import TemporaryDirectory
from zipfile import ZipFile

TRILHA = Path(__file__).resolve().parents[2] / "content/git"


def executar(pasta, ambiente, texto):
    subprocess.run(["bash", "-ec", texto], cwd=pasta, env=ambiente,
                   check=True, capture_output=True, text=True)


def demonstracao(texto):
    preparo = re.search(r"```bash\n(aula=.*?)\n```", texto, re.S)[1]
    etapa = texto.split("## E1", 1)[1].split("## E2", 1)[0]
    # O bloco seguinte na aula de pull request envia para a conta do aluno.
    # A demonstração local termina antes desse percurso opcional.
    bloco = re.search(r"```bash\n(.*?)\n```", etapa, re.S)[1]
    return preparo + "\n" + bloco


def conferir():
    manifesto = json.loads((TRILHA / "language.json").read_text(encoding="utf-8"))
    with TemporaryDirectory() as temporario:
        kit = Path(temporario) / "kit"
        with ZipFile(TRILHA / "projetos/projeto.zip") as pacote:
            pacote.extractall(kit)
        ambiente = dict(os.environ, TMPDIR=temporario, GIT_CONFIG_GLOBAL=os.devnull,
                        GIT_CONFIG_NOSYSTEM="1", GIT_TERMINAL_PROMPT="0")
        for modulo in manifesto["modules"]:
            for aula in modulo["lessons"]:
                arquivo = TRILHA / modulo["dir"] / aula["file"]
                texto = demonstracao(arquivo.read_text(encoding="utf-8"))
                if aula["id"] == "resolver-conflito-de-texto":
                    texto = texto.replace("git merge docs", "if git merge docs; then exit 1; fi")
                    texto += """
test "$(git status --short)" = 'UU README.md'
git show :2:README.md | grep -Fx 'Abra o guia pelo terminal.'
git show :3:README.md | grep -Fx 'Abra o guia no editor.'
echo 'Abra o guia pelo terminal ou no editor.' > README.md
git add README.md
git commit -m 'Concilia as instruções'
test "$(git rev-list --parents -1 HEAD | wc -w)" -eq 3
"""
                    executar(kit, ambiente, texto)
                executar(kit, ambiente, texto)
        executar(kit, ambiente, "bash projeto/solucao.sh")
    print("20 demonstrações, dois conflitos resolvidos e projeto reproduzido.")


if __name__ == "__main__":
    conferir()
