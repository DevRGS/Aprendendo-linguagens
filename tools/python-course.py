"""Gera e verifica os materiais de Python."""
import argparse
import json
import os
from pathlib import Path
import subprocess
import sys
from tempfile import TemporaryDirectory
from zipfile import ZIP_DEFLATED, ZipFile, ZipInfo

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "verify/python"
PUBLIC = ROOT / "content/python"
LAB = "https://jupyterlite.github.io/demo/lab/index.html"
CENTRAL = "https://devrgs.github.io/Aprendendo-linguagens/"
PACKAGES = {
    "projetos": ["numpy"],
    "numpy": ["numpy"],
    "pandas": ["pandas"],
    "exploracao": ["numpy", "pandas", "matplotlib"],
    "preparacao-ml": ["numpy", "pandas"],
    "projeto": ["numpy", "pandas", "matplotlib"],
}
STEPS = [
    ("e1", "exemplo.py", "E1 · Preveja e execute"),
    ("e2", "variacao.py", "E2 · Altere ou depure"),
    ("e3", "exercicio.py", "E3 · Resolva"),
]
TICK = chr(96)

def load(path):
    return json.loads(path.read_text(encoding="utf-8"))

def dump(value):
    return json.dumps(value, ensure_ascii=False, indent=2) + "\n"

def script(code):
    return code.rstrip() + "\n"

def block(code, language="python"):
    fence = TICK * 3
    return f"{fence}{language}\n{script(code)}{fence}"

def read_curriculum():
    for module in load(SOURCE / "modulos.json"):
        mid = module["id"]
        lessons = [(slug, load(SOURCE / "curriculo" / mid / f"{slug}.json")) for slug in module["lessons"]]
        for slug, lesson in lessons:
            counts = tuple(len(lesson[field]) for field in ("exercises", "questions", "cards"))
            if counts != (3, 4, 2):
                raise ValueError(f"{mid}/{slug} tem contagens {counts}, esperado (3, 4, 2)")
        yield module, lessons

def lab_links(mid, slug):
    base = f"content/python/praticas/{mid}/{slug}"
    return "\n".join([
        f'- <a href="{LAB}" target="_blank" rel="noopener noreferrer">Praticar no navegador</a>',
        f'- <a href="{base}.ipynb" download>Baixar o caderno desta aula</a>',
        f'- <a href="{base}-resolvido.ipynb" download>Baixar o caderno resolvido</a>',
        f'- <a href="content/python/kits/{mid}.zip" download>Baixar para o terminal</a>',
    ])

def commands(packaged, folder, name):
    bash_cmd = f"python3 {name}"
    ps_cmd = f"py {name}"
    if packaged:
        depth = len(folder.split("/"))
        up = "../" * depth
        windows = "..\\" * depth
        bash_cmd = f"{up}.venv/bin/python {name}"
        ps_cmd = f"{windows}.venv\\Scripts\\python.exe {name}"
    return f"**Bash**\n\n{block(f'cd {folder}\n{bash_cmd}', 'bash')}\n\n**PowerShell**\n\n{block(f'cd {folder}\n{ps_cmd}', 'powershell')}"

def expected(ex):
    message = []
    if "stdin" in ex:
        message.append("Digite cada entrada em uma linha.\n\n" + block(ex["stdin"], "text"))
    if ex["stdout"].strip():
        message.append("Saída esperada\n\n" + block(ex["stdout"], "text"))
    else:
        message.append("Confira os arquivos ou efeitos descritos no exercício.")
    return "\n\n".join(message)

def lesson_page(mid, slug, lesson, next_link):
    path = f"aulas/{slug}"
    packaged = mid in PACKAGES
    parts = [
        "# " + lesson["title"], lesson["intro"], "## Prepare a prática", lab_links(mid, slug),
        "Escolha um percurso. No navegador, use **Upload Files** para carregar o caderno baixado. "
        "Abra-o, selecione **Python (Pyodide)**, aguarde o kernel e execute célula por célula com "
        "**Shift+Enter**. Quando houver entrada, digite no campo da célula e pressione Enter.",
        "No terminal, extraia o ZIP, abra um terminal na raiz extraída e leia o README do kit. "
        "Os blocos de comando partem dessa raiz. Volte à raiz antes do próximo exercício. "
        "No Windows, use python no lugar de py se só o primeiro comando localizar a instalação.",
        "[Preparação, versões e solução de problemas](#/python/referencia)",
    ]
    if packaged:
        parts.append("Prepare a pasta .venv conforme o README do kit antes de executar os comandos.")
    for i, (folder, name, label) in enumerate(STEPS):
        ex = lesson["exercises"][i]
        parts.extend([f"## {label}", ex["prompt"]])
        if i == 2:
            parts.append("Complete a célula do caderno ou edite o arquivo exercicio.py da pasta abaixo antes de rodar.")
        parts.append(commands(packaged, f"{path}/{folder}", name))
        if i < 2:
            parts.extend([block(ex["code"]), expected(ex), ex["explanation"]])
        else:
            parts.extend([
                block(ex["starter"]), expected(ex),
                f"<details>\n<summary>Ver uma pista</summary>\n\n{ex['hint']}\n\n</details>",
                "\n\n".join([
                    "<details>\n<summary>Conferir solução comentada</summary>",
                    block(ex["code"]), expected(ex), ex["explanation"],
                    f"No ZIP, a solução está em {TICK}{path}/e3-resolvido/solucao.py{TICK}.",
                    "</details>",
                ]),
            ])
    if next_link:
        parts.append(f"[Próxima etapa]({next_link})")
    parts.append("## Fontes\n\n" + "\n".join(f"- [{name}]({url})" for name, url in lesson["sources"]))
    return "\n\n".join(parts) + "\n"

def safe_extensions(ex, starter=False):
    has_starter_files = "starter_extensions" in ex or "starter_support" in ex
    prefix = "starter_" if starter and has_starter_files else ""
    texts = ex.get(prefix + "extensions", {})
    names = ex.get(prefix + "support", [])
    for name in [*texts, *names]:
        parts = name.split("/")
        if any(part in {"", ".", ".."} or "\\" in part or ":" in part for part in parts):
            raise ValueError(f"Caminho inválido: {name}")
    included = {name: (SOURCE / "apoio" / name).read_text(encoding="utf-8") for name in names}
    return {**included, **texts}


def notebook(mid, slug, lesson, solved):
    cells = []
    def cell(kind, content, **metadata):
        entry = {"id": f"passo-{len(cells) + 1}", "cell_type": kind, "metadata": metadata,
                 "source": script(content).splitlines(keepends=True)}
        if kind == "code":
            entry.update(execution_count=None, outputs=[])
        cells.append(entry)

    intro = lesson["intro"].replace("](#/python", f"]({CENTRAL}#/python")
    cell("markdown", f"# {lesson['title']}\n\n{intro}\n\n"
                     "Execute as células na ordem com **Shift+Enter**. A preparação cria uma pasta nova na "
                     "área de arquivos do caderno. Baixe o caderno editado e os resultados que quiser guardar.")
    imports = "\n".join(f"import {package}" for package in PACKAGES.get(mid, []))
    cell("code", f"""from pathlib import Path as _Path
from tempfile import mkdtemp as _mkdtemp
import os as _os
import sys as _sys
from importlib import invalidate_caches as _refresh_imports

# Auxiliares editáveis devem ser relidos sem aproveitar bytecode antigo.
_sys.dont_write_bytecode = True

_raiz = _Path.cwd()
_trabalho = _Path(_mkdtemp(prefix={f'python-{slug}-'!r}, dir=_raiz))
{imports}""")
    for i, (folder, _, label) in enumerate(STEPS):
        ex = lesson["exercises"][i]
        is_solution = solved or i < 2
        prompt = ex["prompt"].replace("](#/python", f"]({CENTRAL}#/python")
        section = f"## {label}\n\n{prompt}"
        if "stdin" in ex:
            section += "\n\nEntradas de teste, uma por linha:\n\n" + block(ex["stdin"], "text")
        if not is_solution:
            section += "\n\n**Pista.** " + ex["hint"] + "\n\n" + expected(ex)
        if any(name.endswith(".py") for name in safe_extensions(ex, starter=not is_solution)):
            section += (
                "\n\nSe editar um auxiliar no painel de arquivos, salve a edição. "
                "Execute novamente a preparação desta etapa e a célula do exercício. "
                "A preparação inicial do caderno cria outra pasta."
            )
        cell("markdown", section)
        prep = [
            f"_pasta = _trabalho / {folder!r}",
            "_pasta.mkdir(exist_ok=True)",
            "_os.chdir(_pasta)",
            "for _nome, _modulo in list(_sys.modules.items()):",
            "    _origem = getattr(_modulo, '__file__', None)",
            "    if _origem and _Path(_origem).is_relative_to(_pasta):",
            "        del _sys.modules[_nome]",
            "if str(_pasta) not in _sys.path:",
            "    _sys.path.insert(0, str(_pasta))",
        ]
        for name, data in safe_extensions(ex, starter=not is_solution).items():
            prep.extend([
                f"_arquivo = _pasta / {name!r}",
                "_arquivo.parent.mkdir(parents=True, exist_ok=True)",
                "if not _arquivo.exists():",
                f"    _arquivo.write_text({data!r}, encoding='utf-8')",
            ])
        prep.append("_refresh_imports()")
        if solved and "stdin" in ex:
            prep.extend([f"_entradas = iter({ex['stdin'].splitlines()!r})",
                         "def input(prompt=''):",
                         "    print(prompt, end='')",
                         "    return next(_entradas)"])
        cell("code", "\n".join(prep))
        cell("code", ex["code"] if is_solution else ex["starter"], etapa=i)
        if is_solution and ex.get("images"):
            cell("code", "from IPython.display import Image, display\n" +
                 "\n".join(f"display(Image(filename={name!r}))" for name in ex["images"]), imagem=True)
        cleanup = [
            "# Voltar à pasta do caderno para a etapa seguinte.",
            "_os.chdir(_raiz)",
            "if str(_pasta) in _sys.path:",
            "    _sys.path.remove(str(_pasta))",
            "# Liberar módulos locais para a próxima etapa importar sua própria versão.",
            "for _nome, _modulo in list(_sys.modules.items()):",
            "    _origem = getattr(_modulo, '__file__', None)",
            "    if _origem and _Path(_origem).is_relative_to(_pasta):",
            "        del _sys.modules[_nome]",
        ]
        if solved and "stdin" in ex:
            cleanup.append("del input")
        cell("code", "\n".join(cleanup))
        if is_solution:
            cell("markdown", expected(ex) + "\n\n" + ex["explanation"])
        else:
            cell("markdown", "Compare com a solução comentada na aula e faça o caso de borda antes de concluir.")
    return dump({
        "nbformat": 4, "nbformat_minor": 5,
        "metadata": {"kernelspec": {"display_name": "Python (Pyodide)", "language": "python", "name": "python"},
                     "language_info": {"name": "python", "file_extension": ".py"}},
        "cells": cells,
    })

def kit_lesson(slug, lesson):
    files = {}
    checks = []
    for i, (folder, filename, title) in enumerate(STEPS):
        ex = lesson["exercises"][i]
        base = f"aulas/{slug}/{folder}"
        files[f"{base}/{filename}"] = script(ex.get("starter", ex["code"]))
        files[f"{base}/README.md"] = f"# {title}\n\n{ex['prompt']}\n\n{expected(ex)}\n"
        for name, data in safe_extensions(ex, starter=(i == 2)).items():
            files[f"{base}/{name}"] = data
        if i == 2:
            base = f"aulas/{slug}/e3-resolvido"
            filename = "solucao.py"
            files[f"{base}/{filename}"] = script(ex["code"])
            files[f"{base}/README.md"] = f"# Solução comentada\n\n{ex['explanation']}\n\n{expected(ex)}\n"
            for name, data in safe_extensions(ex).items():
                files[f"{base}/{name}"] = data
        checks.append({"file": f"{base}/{filename}", "stdin": ex.get("stdin", ""),
                       "stdout": ex["stdout"].rstrip("\n"), "images": ex.get("images", [])})
    return files, checks

def make_zip(files, path):
    with ZipFile(path, "w") as archive:
        for filename, data in sorted(files.items()):
            archive.writestr(ZipInfo(filename), data, compress_type=ZIP_DEFLATED)

def verify_case(ex):
    with TemporaryDirectory(prefix="central-python-") as folder:
        cwd = Path(folder)
        for name, data in safe_extensions(ex).items():
            dest = cwd / name
            dest.parent.mkdir(parents=True, exist_ok=True)
            dest.write_text(data, encoding="utf-8")
        (cwd / "caso.py").write_text(script(ex["code"]), encoding="utf-8")
        proc = subprocess.run([sys.executable, "caso.py"], cwd=cwd, text=True, encoding="utf-8",
                              env={**os.environ, "PYTHONUTF8": "1", "MPLBACKEND": "Agg"},
                              input=ex.get("stdin", ""), capture_output=True, timeout=45)
        if proc.returncode or proc.stdout.rstrip("\n") != ex["stdout"].rstrip("\n"):
            raise ValueError(f"Saída esperada {ex['stdout']!r}, recebida {proc.stdout!r}\n{proc.stderr}")
        for name in ex.get("images", []):
            if not (cwd / name).read_bytes().startswith(b"\x89PNG\r\n\x1a\n"):
                raise ValueError(f"Imagem PNG inválida: {name}")

def verify_notebook(mid, slug, lesson):
    content = notebook(mid, slug, lesson, solved=True)
    with TemporaryDirectory(prefix="central-python-caderno-") as folder:
        proc = subprocess.run(
            [sys.executable, str(SOURCE / "verify_notebook.py")],
            cwd=folder, input=content, capture_output=True, text=True, encoding="utf-8",
            env={**os.environ, "PYTHONUTF8": "1", "MPLBACKEND": "Agg"}, timeout=45,
        )
    if proc.returncode:
        raise ValueError(proc.stderr)
    expected = [ex["stdout"].rstrip("\n") for ex in lesson["exercises"]]
    outputs = [output.rstrip("\n") for output in json.loads(proc.stdout)]
    if outputs != expected:
        raise ValueError(f"Saídas do caderno {outputs!r}, esperadas {expected!r}")

def verify_sources(curriculum):
    count = 0
    errors = []
    for mod, lessons in curriculum:
        for slug, lesson in lessons:
            exercises = lesson["exercises"]
            variants = [case for exercise in exercises for case in exercise.get("checks", [])]
            for index, ex in enumerate(exercises + variants + lesson.get("checks", []), 1):
                try:
                    verify_case(ex)
                except (ValueError, OSError, subprocess.TimeoutExpired) as err:
                    errors.append(f"{mod['id']}/{slug}, caso {index}: {err}")
                count += 1
            try:
                verify_notebook(mod["id"], slug, lesson)
            except (ValueError, OSError, subprocess.TimeoutExpired) as err:
                errors.append(f"{mod['id']}/{slug}, caderno: {err}")
    if errors:
        raise ValueError("\n" + "\n".join(errors))
    print(f"{count} casos de Python e {sum(len(lessons) for _, lessons in curriculum)} cadernos executados")

def make_public(curriculum, dist):
    manifest = {"id": "python", "name": "Python", "color": "#70a9dc", "icon": "🐍",
                "highlight": "python", "reference": "referencia.md", "modules": []}
    all_lessons = [(m["id"], slug) for m, lessons in curriculum for slug, _ in lessons]
    next_by_lesson = dict(zip(all_lessons, all_lessons[1:]))
    kits = dist / "kits"
    kits.mkdir(parents=True, exist_ok=True)
    integral = {"README.md": (SOURCE / "kit-completo.md").read_text(encoding="utf-8"),
                "requirements.txt": (SOURCE / "requirements.txt").read_text(encoding="utf-8")}
    for mod, lessons in curriculum:
        mid = mod["id"]
        module = {**mod, "description": " · ".join(lesson["title"] for _, lesson in lessons), "lessons": []}
        manifest["modules"].append(module)
        path = dist / mod["dir"]
        nb = dist / "praticas" / mid
        for folder in (path, nb):
            folder.mkdir(parents=True, exist_ok=True)
        kit = {}
        checks = []
        questions, cards = [], []
        for i, (slug, lesson) in enumerate(lessons, 1):
            name = f"{i:02}-{slug}.md"
            module["lessons"].append({"id": slug, "file": name, "title": lesson["title"], "minutes": lesson["minutes"]})
            following = next_by_lesson.get((mid, slug))
            route = "#/python/" + "/".join(following) if following else "#/python/prova"
            (path / name).write_text(lesson_page(mid, slug, lesson, route), encoding="utf-8")
            for solved in (False, True):
                target = f"{slug}-resolvido.ipynb" if solved else f"{slug}.ipynb"
                (nb / target).write_text(notebook(mid, slug, lesson, solved), encoding="utf-8")
            for items, dest, prefix in ((lesson["questions"], questions, "q"), (lesson["cards"], cards, "f")):
                for item in items:
                    dest.append({**item, "id": f"python.{mid}.{prefix}{len(dest) + 1:02}", "lesson": slug})
            files, test_cases = kit_lesson(slug, lesson)
            kit.update(files)
            checks.extend(test_cases)
        for filename, key, data in (("questions.json", "questions", questions), ("flashcards.json", "cards", cards)):
            (path / filename).write_text(dump({key: data}), encoding="utf-8")
        readme = (SOURCE / "kit.md").read_text(encoding="utf-8")
        if mid in PACKAGES:
            readme += (SOURCE / "kit-dependencias.md").read_text(encoding="utf-8")
            kit["requirements.txt"] = integral["requirements.txt"]
        else:
            readme += (SOURCE / "kit-sem-dependencias.md").read_text(encoding="utf-8")
        kit["README.md"] = f"# Python · {mod['title']}\n\n" + readme + "\n" + "\n".join(
            f"- {TICK}aulas/{slug}/{TICK} · {lesson['title']}" for slug, lesson in lessons) + "\n"
        kit["testes/casos.json"] = dump(checks)
        kit["testes/test_atividades.py"] = (SOURCE / "test_atividades.py").read_text(encoding="utf-8")
        make_zip(kit, kits / f"{mid}.zip")
        integral.update({f"{mod['dir']}/{name}": data for name, data in kit.items()})
    make_zip(integral, kits / "python-completo.zip")
    (dist / "language.json").write_text(dump(manifest), encoding="utf-8")

def same_artifact(source, target):
    if not target.is_file():
        return False
    if source.suffix == ".zip":
        with ZipFile(source) as expected, ZipFile(target) as actual:
            return expected.namelist() == actual.namelist() and all(
                expected.read(name) == actual.read(name) for name in expected.namelist()
            )
    return source.read_text(encoding="utf-8") == target.read_text(encoding="utf-8")

def verify_public(curriculum):
    with TemporaryDirectory(prefix="central-python-artefatos-") as folder:
        dist = Path(folder)
        make_public(curriculum, dist)
        for source in dist.rglob("*"):
            if source.is_file():
                target = PUBLIC / source.relative_to(dist)
                if not same_artifact(source, target):
                    raise ValueError(f"Regenere o material: {target.relative_to(ROOT)}")
    print("Aulas, cadernos e kits conferem com a fonte")

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("action", choices=["build", "check", "run"])
    args = parser.parse_args()
    curriculum = list(read_curriculum())
    if args.action == "build":
        make_public(curriculum, PUBLIC)
    elif args.action == "check":
        verify_public(curriculum)
    else:
        verify_sources(curriculum)

if __name__ == "__main__":
    main()
