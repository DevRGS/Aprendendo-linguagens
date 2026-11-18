# Projeto: lista de estudos completa

Vamos combinar formulário, array de objetos, eventos, DOM e armazenamento numa **lista de estudos**. O programa permite adicionar, marcar e remover tarefas. Recarregar pelo mesmo endereço HTTP restaura os dados quando o navegador permite gravá-los.

O exemplo é um HTML completo. Crie uma pasta nova, salve como index.html e abra pelo servidor local da introdução. Não depende do código de nenhuma aula anterior. Não o cole no console da própria plataforma: trabalhe na sua página de estudos.

## Como as partes se conectam

- `tarefas` é o estado em memória: cada registro tem texto e concluida.
- `formatoValido` confere os dados restaurados. Um JSON válido ainda pode conter valores com o tipo errado.
- `desenhar` cria nós com textContent, sem interpretar o texto digitado como HTML.
- O submit valida o texto, altera o estado, salva e redesenha. A checkbox atualiza o registro; o botão de remover elimina a entrada.
- `salvar` trata bloqueio/limite de armazenamento e avisa quando só a aba mantém os dados.

As tarefas ficam nesta origem e neste navegador, não em uma conta remota. Se houver dados salvos inválidos, a página avisa e começa vazia em memória; uma ação posterior pode substituir a chave pela nova lista válida. Este projeto é um exercício local, sem sincronização ou autenticação.

## Página completa para praticar

Salve o HTML inteiro como index.html e abra pelo servidor HTTP. Todos os elementos e funções estão incluídos.

```html
<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Prática de JavaScript</title>
<style>
body { font-family: system-ui, sans-serif; max-width: 42rem; margin: 0 auto; padding: 1rem; overflow-wrap: anywhere; }
form { display: grid; gap: .5rem; }
input, button { font: inherit; max-width: 100%; box-sizing: border-box; }
li { margin-block: .5rem; }
</style>
</head>
<body>
<h1>Minha lista de estudos</h1>
<form id="formulario">
  <label for="tarefa">O que você vai estudar?</label>
  <input id="tarefa" name="tarefa" required maxlength="120">
  <button type="submit">Adicionar</button>
</form>
<p id="aviso" aria-live="polite"></p>
<ul id="lista"></ul>
<script>
const chave = "trilha-js:tarefas:v1";
const formulario = document.querySelector("#formulario");
const campo = document.querySelector("#tarefa");
const aviso = document.querySelector("#aviso");
const lista = document.querySelector("#lista");
let tarefas = [];

function formatoValido(valor) {
  return Array.isArray(valor) && valor.every(item =>
    item !== null && typeof item === "object" &&
    typeof item.texto === "string" &&
    item.texto.trim().length > 0 && item.texto.length <= 120 &&
    typeof item.concluida === "boolean"
  );
}

try {
  const salvo = localStorage.getItem(chave);
  if (salvo !== null) {
    const dados = JSON.parse(salvo);
    if (!formatoValido(dados)) throw new Error("Formato inválido");
    tarefas = dados;
  }
} catch {
  aviso.textContent = "Não foi possível ler os dados salvos. Começamos uma lista vazia nesta aba.";
}

function salvar() {
  try {
    localStorage.setItem(chave, JSON.stringify(tarefas));
    aviso.textContent = "Lista salva neste navegador.";
  } catch {
    aviso.textContent = "Não foi possível salvar. A lista continua apenas nesta aba.";
  }
}

function desenhar() {
  lista.replaceChildren();
  tarefas.forEach((tarefa, indice) => {
    const item = document.createElement("li");
    const rotulo = document.createElement("label");
    const marcar = document.createElement("input");
    marcar.type = "checkbox";
    marcar.checked = tarefa.concluida;
    const texto = document.createElement("span");
    texto.textContent = tarefa.texto;
    rotulo.append(marcar, texto);
    marcar.addEventListener("change", () => {
      tarefas[indice].concluida = marcar.checked;
      salvar();
    });
    const remover = document.createElement("button");
    remover.type = "button";
    remover.textContent = "Remover";
    remover.setAttribute("aria-label", `Remover ${tarefa.texto}`);
    remover.addEventListener("click", () => {
      tarefas.splice(indice, 1);
      salvar();
      desenhar();
      campo.focus();
    });
    item.append(rotulo, remover);
    lista.append(item);
  });
}

formulario.addEventListener("submit", evento => {
  evento.preventDefault();
  const texto = campo.value.trim();
  if (!texto || texto.length > 120) {
    aviso.textContent = "Digite uma tarefa de 1 a 120 caracteres.";
    return;
  }
  tarefas.push({ texto, concluida: false });
  salvar();
  desenhar();
  campo.value = "";
  campo.focus();
});

desenhar();
</script>
</body>
</html>
```

## Sua vez

Adicione duas tarefas, marque uma, recarregue e confira o estado. Remova uma tarefa. Teste texto com `<b>estudar</b>`: ele deve aparecer literalmente, sem criar uma tag. Teste também entrada só com espaços.

<details>
<summary>Ver uma solução comentada</summary>

A checkbox marcada deve continuar assim após a recarga quando a gravação funciona. A remoção atualiza o array e o armazenamento. O texto com sinais de HTML é exibido como texto pelo span; entradas vazias após trim são recusadas.

</details>

## Fontes

- [MDN — evento submit](https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement/submit_event)
- [MDN — addEventListener](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener)
- [MDN — localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
- [MDN — JSON](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON)
- [MDN — createElement](https://developer.mozilla.org/en-US/docs/Web/API/Document/createElement)
