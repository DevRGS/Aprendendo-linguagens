"""Conferência dos exemplos e das soluções a partir dos arquivos entregues."""
import json
import os
from pathlib import Path
import shutil
import subprocess
import sys
from tempfile import TemporaryDirectory
import unittest

KIT = Path(__file__).resolve().parents[1]

class Atividades(unittest.TestCase):
    def test_saidas(self):
        casos = json.loads((KIT / "testes/casos.json").read_text(encoding="utf-8"))
        for caso in casos:
            arquivo = KIT / caso["file"]
            with self.subTest(arquivo=caso["file"]), TemporaryDirectory() as pasta:
                trabalho = Path(pasta) / "atividade"
                shutil.copytree(arquivo.parent, trabalho)
                result = subprocess.run(
                    [sys.executable, arquivo.name], cwd=trabalho, input=caso["stdin"],
                    text=True, encoding="utf-8", capture_output=True, timeout=45,
                    env={**os.environ, "PYTHONUTF8": "1", "MPLBACKEND": "Agg"},
                )
                self.assertEqual(result.returncode, 0, result.stderr)
                self.assertEqual(result.stdout.rstrip("\n"), caso["stdout"])
                for name in caso["images"]:
                    self.assertTrue((trabalho / name).read_bytes().startswith(b"\x89PNG\r\n\x1a\n"))
