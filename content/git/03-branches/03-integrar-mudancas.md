# Integrar mudanças

A integração parte da branch que vai receber o trabalho. Quando seu commit atual é ancestral direto da ponta da outra branch, ela pode avançar até essa ponta por fast-forward.

## Prepare a prática

<a href="content/git/projetos/projeto.zip" download>Baixar material da trilha e projeto</a>

Extraia o kit em uma pasta sua. Na raiz extraída, abra Bash (Linux, macOS, WSL ou Git Bash no Windows). Confira Git 2.28 ou superior com `git --version`. O comando cria uma pasta descartável e entra no ponto inicial da aula. A identidade usada nos exercícios é configurada apenas no repositório de treino. Para recomeçar, volte à pasta extraída e repita.

```bash
aula=$(bash preparar.sh 11) && cd "$aula"
```

O cenário tem docs um commit à frente de main. Você está na branch receptora main.

## E1 · Preveja e experimente

```bash
git branch --show-current
git log --oneline main..docs
git merge --ff-only docs
cat editor.txt
```

**Confira.** A mensagem da proposta aparece antes da integração e editor.txt passa a existir em main.

## E2 · Investigue uma variação

Repita a comparação main..docs e explique a saída vazia.

**Solução comentada.** `git log --oneline main..docs` não encontra commit alcançável por docs que falte em main.

## E3 · Aplique em outra situação

Acrescente uma instrução em docs e faça uma segunda entrega por avanço rápido.

**Solução comentada.** Use `git switch docs`, `echo 'Salve em UTF-8.' >> editor.txt`, `git commit -am 'Explica como salvar o texto'`, `git switch main` e `git merge --ff-only docs`. O arquivo agora tem duas linhas em main.

[Preparação e fontes oficiais](#/git/referencia)
