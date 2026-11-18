# Carregamento, falhas e concorrência

Uma interface assíncrona precisa explicar o estado do pedido. O projeto usa busy para recusar ações sobrepostas na mesma aba e desabilitar controles durante o trabalho. O finally libera a interface, inclusive depois de erro. Valide o formulário antes de desabilitar os campos: controles desabilitados não participam da validação nativa.

Isso reduz cliques duplicados, mas não substitui regras do servidor nem impede pedidos de outra aba. A API continua validando tipo, sessão e proprietário. A implementação não oferece idempotency keys para criação ou versionamento para detectar toda atualização concorrente; esses são contratos adicionais.

Quando a sessão expira, o servidor devolve 401. O cliente limpa o estado da conta e pede novo login, em vez de continuar mostrando uma lista como se ainda estivesse autorizada. Falhas de validação aparecem como mensagem sem transformar o HTML digitado em marcação.

Se a rede cai depois de enviar uma escrita, o cliente talvez não saiba se o servidor já a concluiu. A mensagem pede conferir a lista antes de reenviar. Repetir automaticamente um POST pode duplicar dados. Uma resposta JSON inválida também exige diagnóstico de URL/proxy/servidor, não assumir uma lista vazia bem-sucedida.

O tratamento deve preservar a intenção da pessoa quando possível. Campo inválido mantém o texto; edição com falha mantém o rascunho; a checkbox volta ao estado confirmado. O código não promete que um processo local sobreviva a falta de energia ou que uma tela desatualizada seja sempre equivalente ao banco.

## Material e preparação

[Baixe o projeto API de estudos](content/javascript/projetos/api-estudos.zip) e extraia a pasta. Os caminhos desta etapa partem de `api-estudos/`, onde fica package.json. O README do pacote contém instalação, comandos Windows/Bash e todo o contrato HTTP. A API roda no seu computador; o site da trilha apenas mostra o material.

## Código em contexto

Corpo de run em public/app.js, depois de guardar document.activeElement em previousFocus, marcar busy e desabilitar controles. action é a operação recebida; as funções de interface são locais ao mesmo arquivo. focusOn agenda o próximo campo em nextFocus; o foco só é aplicado depois de reativar os controles.

```javascript
try {
  await action();
} catch (error) {
  if (error.status === 401) setSession(null);
  message(error.message);
} finally {
  busy = false;
  controls();
  const target = nextFocus?.() ?? previousFocus;
  nextFocus = null;
  if (target?.isConnected && !target.closest('[hidden]')) target.focus();
}
```

## Prática guiada

Com a lista aberta, pare o Node no terminal e tente adicionar. Depois reinicie, confira a lista e só então decida reenviar. Não teste com dados importantes.

<details>
<summary>Conferir resultado e solução</summary>

A interface mostra falha de rede e volta a liberar controles. Não deve inserir uma tarefa fictícia como se o banco tivesse confirmado. Uma operação pode ter resultado ambíguo se a conexão caiu em outro momento.

</details>

## Fontes

- [MDN — fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch)
- [MDN — status HTTP](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status)
