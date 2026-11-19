# Bancada de Git e GitHub

Use Git 2.28 ou posterior e Bash. Confira com `git --version` e `bash --version`. No Windows, abra Git Bash após instalar Git for Windows ou use Bash no WSL. No macOS ou Linux, use Bash no terminal. Se faltar Git, siga o [guia de instalação do projeto Git](https://git-scm.com/downloads). Os exemplos trabalham com arquivos fictícios em diretórios temporários. Só a aula de pull request usa uma conta no GitHub.

<a href="content/git/projetos/projeto.zip" download>Baixar laboratório, material inicial e solução do projeto</a>

Extraia o pacote. Da pasta que contém `preparar.sh`, rode `aula=$(bash preparar.sh 1) && cd "$aula"`. Cada número cria um cenário novo. O script imprime o diretório do aluno e, nos módulos colaborativos, cria também um repositório central sem árvore de trabalho e uma cópia de colega. O nome e o e-mail de treinamento são locais. No primeiro cenário você os configura à mão. Para o desafio abra `projeto/README.md` do pacote.

| Dúvida | Inspeção |
|---|---|
| Onde estou? | `pwd`, depois `git rev-parse --show-toplevel` |
| O que entrará no próximo commit? | `git diff --cached` |
| Qual branch vou enviar? | `git branch --show-current` e `git remote -v` |
| O paginador ocupou a tela? | Pressione q para sair. |

[Pro Git, livro em português](https://git-scm.com/book/pt-br/v2) · [Manual oficial dos comandos Git](https://git-scm.com/docs/git) · [Criar um pull request no GitHub](https://docs.github.com/pt/pull-requests/how-tos/create-pull-requests/creating-a-pull-request)
