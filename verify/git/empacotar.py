"""Gera a distribuição reproduzível do laboratório Git."""
from pathlib import Path
from zipfile import ZIP_DEFLATED, ZipFile, ZipInfo

base = Path(__file__).resolve().parent
kit = base / "kit"
destino = base.parents[1] / "content/git/projetos/projeto.zip"
with ZipFile(destino, "w") as pacote:
    for arquivo in sorted(kit.rglob("*")):
        if arquivo.is_file():
            nome = arquivo.relative_to(kit).as_posix()
            pacote.writestr(ZipInfo(nome), arquivo.read_bytes(), compress_type=ZIP_DEFLATED)
