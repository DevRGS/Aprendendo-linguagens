# Entrega de um guia revisável

Você recebeu inicial/README.md. O leitor perguntou “Qual arquivo devo abrir e com qual programa?”. Entregue uma branch de proposta, uma resposta à revisão, a versão marcada e um roteiro que outra pessoa consiga repetir. Use Bash com Git 2.28+ na pasta extraída que contém preparar.sh. Configure seu nome de autoria apenas no laboratório.

1. Crie o cenário com `kit=$PWD`, `aula=$(bash preparar.sh 13) && cd "$aula"`. Copie o material inicial com `cp "$kit/projeto/inicial/README.md" README.md`. Registre-o e publique main.
2. Em uma nova branch guia, troque a instrução vaga por “Abra README.md.”, registre e publique a proposta. Compare main...guia. Use a pergunta do leitor como revisão individual ou abra um pull request conforme a aula de colaboração.
3. Em outro commit, incorpore a revisão. A frase acordada para o teste é “Abra README.md em um editor de texto.”. A primeira linha do arquivo deve permanecer “Guia de estudos”.
4. Integre em main. Marque a entrega com a tag anotada guia-v1. Publique main e a tag no remoto do laboratório. Entregue ao avaliador o caminho de central.git, o nome da tag, sua resposta ao leitor e a comparação do conteúdo antes e depois de preparar um arquivo.
5. Rode `bash "$kit/projeto/verificar.sh" ../central.git`. O verificador clona em uma pasta nova e confere a tag, o conteúdo, a branch proposta e suas relações com main.

Solução comentada: na raiz original do kit, leia e execute `bash projeto/solucao.sh`. Ela cria outro laboratório e executa a verificação.

**Variação inédita.** Um leitor usa o terminal. A partir da versão marcada, crie uma branch terminal com um segundo caminho: “No terminal, use cat README.md.”. Integre, entregue guia-v2 e use dois clones, um por tag. Só o clone de guia-v2 deve exibir o novo caminho. Preserve a versão guia-v1 para quem ainda usa as instruções originais.
