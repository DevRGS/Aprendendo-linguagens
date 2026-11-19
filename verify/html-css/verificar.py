"""Exercita o projeto distribuído sob um prefixo HTTP com Playwright."""
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
import os
from pathlib import Path
from tempfile import TemporaryDirectory
from threading import Thread
from zipfile import ZipFile

from playwright.sync_api import expect, sync_playwright

PACOTE = Path(__file__).resolve().parents[2] / "content/html-css/projetos/projeto.zip"


class ServidorSilencioso(SimpleHTTPRequestHandler):
    def log_message(self, format, *args):
        pass


def conferir_pagina(pagina, url, largura):
    pagina.set_viewport_size({"width": largura, "height": 800})
    pagina.goto(url)
    assert pagina.evaluate("document.documentElement.scrollWidth <= innerWidth")
    pagina.keyboard.press("Tab")
    expect(pagina.get_by_role("link", name="Abrir trilha Web")).to_be_focused()
    pagina.keyboard.press("Enter")
    expect(pagina.get_by_role("heading", name="Trilha web")).to_be_visible()
    imagem = pagina.get_by_role("img", name="Percurso: HTML, depois CSS, depois projeto.")
    expect(imagem).to_be_visible()
    assert imagem.evaluate("img => img.complete && img.naturalWidth > 0")
    assert pagina.evaluate("document.documentElement.scrollWidth <= innerWidth")
    pagina.keyboard.press("Tab")
    pagina.keyboard.press("Enter")
    campo = pagina.get_by_role("textbox", name="E-mail fictício (obrigatório)")
    pagina.get_by_role("button").click()
    expect(campo).to_be_focused()
    campo.fill("estudo@example.org")
    pagina.get_by_role("button").click()
    expect(pagina.get_by_role("heading", name="Conferência concluída")).to_be_visible()
    assert "estudo" not in pagina.url


def conferir():
    with TemporaryDirectory() as temporario, sync_playwright() as pw:
        with ZipFile(PACOTE) as pacote:
            pacote.extractall(Path(temporario) / "catalogo")
        handler = partial(ServidorSilencioso, directory=temporario)
        with ThreadingHTTPServer(("127.0.0.1", 0), handler) as servidor:
            Thread(target=servidor.serve_forever, daemon=True).start()
            try:
                browser = pw.chromium.launch(executable_path=os.getenv("CHROME_BIN"))
                pagina = browser.new_page()
                erros = []
                pagina.on("response", lambda r: erros.append(r.url) if r.status >= 400 else None)
                url = f"http://127.0.0.1:{servidor.server_port}/catalogo/projeto/solucao/"
                for largura in (195, 390, 1280):
                    conferir_pagina(pagina, url, largura)
                assert not erros, erros
                browser.close()
            finally:
                servidor.shutdown()
    print("Projeto HTML validado em 195, 390 e 1280 px com teclado e formulário.")


if __name__ == "__main__":
    conferir()
