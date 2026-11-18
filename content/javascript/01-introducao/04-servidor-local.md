# Arquivos locais e servidor de estudo

Alguns recursos, como **módulos JavaScript** e leitura de JSON local por `fetch`, precisam de um endereço HTTP. Abrir um arquivo com `file://` não oferece as mesmas regras de origem. Um servidor estático local entrega seus arquivos; ele não transforma o curso em um projeto de backend.

## Preparar Python 3 quando necessário

Use uma pasta nova apenas para os exemplos desta trilha. No Windows, abra o PowerShell e tente `py --version`; no Linux/macOS, tente `python3 --version`. Se faltar Python 3, baixe pelo site oficial `python.org/downloads`, escolha seu sistema e siga as instruções de instalação de Python 3. No Windows, o instalador/gerenciador oficial fornece o comando `py`; se o gerenciador pedir instalar o runtime, siga essa etapa. Feche e reabra o terminal e confira a versão novamente. Em Linux, você também pode usar o gerenciador de pacotes da sua distribuição.

Não é necessário WSL nem Node para este servidor. Se já tem um servidor do seu editor, pode usá-lo, desde que abra os arquivos por HTTP. Se o Python do seu sistema é acessível como `python` e informa versão 3, use esse comando no lugar de `py`/`python3`.

## Iniciar, abrir e parar

Entre na pasta que contém seu `index.html` usando `cd`. **No PowerShell do Windows**, execute:

```powershell
py -m http.server 8000 --bind 127.0.0.1
```

**No terminal Linux/macOS**, execute:

```bash
python3 -m http.server 8000 --bind 127.0.0.1
```

Deixe o terminal aberto e acesse **http://127.0.0.1:8000/** no navegador. Se aparecer uma lista de arquivos, clique em seu HTML ou confira se ele se chama `index.html`. Se a porta estiver ocupada, troque `8000` por `8001` no comando **e** no endereço. Para parar, volte ao terminal e pressione Ctrl+C.

O endereço `localhost` também aponta para a máquina local, mas origem inclui protocolo, host e porta; mantenha o mesmo endereço ao testar armazenamento e arquivos relativos. Servir uma pasta pode disponibilizar os arquivos dela: por isso use só a pasta de exercícios e vincule a 127.0.0.1. `http.server` é uma ferramenta de desenvolvimento, não de publicação em produção.

O exemplo de console abaixo mostra como um caminho relativo é resolvido a partir de uma URL de base; não faz nenhuma requisição.

## Execute e observe

```javascript
{
const url = new URL("dados.json", "http://127.0.0.1:8000/");
console.log(url.href);
}
```

Saída das chamadas de `console.log`:

```text
http://127.0.0.1:8000/dados.json
```

## Sua vez

Sirva a página da aula anterior e abra-a pelo endereço HTTP. Clique no botão e depois pare o servidor.

<details>
<summary>Ver uma solução comentada</summary>

O comportamento do botão deve continuar igual. O que mudou foi a origem da página: agora HTTP, em vez de `file://`.

</details>

## Fontes

- [MDN — preparar servidor local](https://developer.mozilla.org/en-US/docs/Learn_web_development/Howto/Tools_and_setup/set_up_a_local_testing_server)
- [Python — downloads oficiais](https://www.python.org/downloads/)
- [Python — http.server](https://docs.python.org/3/library/http.server.html)
- [MDN — módulos](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)
