# Catálogo de estudos acessível

Extraia o kit. Copie a pasta inicial com o nome catalogo e abra seu index.html. O material inicial tem um catálogo, um detalhe e uma imagem. Descubra por que o controle “Web” não entra na sequência de teclado, por que a imagem não tem alternativa e por que o campo aceita um envio vazio. Altere somente sua cópia.

1. Transforme a indicação Web em um link para trilhas/web.html. Crie o retorno na página de detalhe. Use nomes que identifiquem o destino.
2. No detalhe, descreva as três etapas mostradas por mapa.svg. Ligue a folha compartilhada corrigindo o caminho relativo em cada página.
3. Na inicial, associe um rótulo ao campo, use type=email e required. Explique antes do envio que se trata de uma conferência local. Remova o name do campo para evitar que o valor seja incluído na consulta. Crie obrigado.html com uma mensagem de confirmação e um link de volta.
4. Substitua a largura fixa por dimensões flexíveis. Preserve o contorno nos controles focados, a leitura a 390 px e os textos a 200% de zoom.
5. Sirva a pasta pai com o servidor opcional da aula de publicação e abra /catalogo/. Outra pessoa deve conseguir percorrer o catálogo usando o roteiro abaixo. Também é possível entregar o pacote e abrir o index.html localmente.

| Tarefa | Aceite |
|---|---|
| Apertar Tab até Abrir trilha Web e Enter | O detalhe exibe seu próprio título; um link volta à inicial. |
| Examinar a imagem no detalhe | A alternativa comunica HTML, depois CSS, depois projeto. |
| Ativar Conferir sem preencher | O navegador mantém a inicial e foca o campo rotulado como obrigatório. |
| Enviar estudo@example.org | A página obrigado.html abre e seu endereço não contém o dado digitado. |
| Repetir com 390 px, com zoom e sob uma pasta renomeada | Botão, links e foco são alcançáveis e não há rolagem lateral inesperada. |

**Solução comentada.** Abra solucao/index.html. O link nativo entra na sequência de Tab. O par for/id dá nome ao input; sem name o valor não entra nos parâmetros. O estilo limita a largura máxima e respeita o espaço dos controles. Na subpasta trilhas, o prefixo ../ encontra a folha e a figura.

**Variação.** Acrescente “Dados” como segundo cartão. Crie trilhas/dados.html com título e retorno próprios. Um colega deve chegar aos dois destinos por teclado e distingui-los pelo nome. Depois mova a figura para uma pasta recursos. Confira o novo caminho a partir dos dois detalhes.
