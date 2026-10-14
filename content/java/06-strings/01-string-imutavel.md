# Strings são imutáveis

`String` é uma classe, e os objetos dela têm uma característica importante: **depois de criados, nunca mudam**.

```java
String s = "java";
s.toUpperCase();          // cria "JAVA", mas ninguém guardou
System.out.println(s);    // java

s = s.toUpperCase();      // agora sim: s passa a apontar para a String nova
System.out.println(s);    // JAVA
```

Todo método que parece "alterar" uma String (`toUpperCase`, `replace`, `trim`...) na verdade **devolve uma String nova**. A original continua igual.

## Comparando textos: `equals`, não `==`

```java
String a = "java";
String b = new String("java");

System.out.println(a == b);        // false: são objetos diferentes
System.out.println(a.equals(b));   // true: o conteúdo é igual
```

- `==` compara **referências**: se as duas variáveis apontam para o mesmo objeto.
- `equals` compara o **conteúdo**, caractere por caractere.

> [!WARNING]
> Às vezes o `==` parece funcionar: com dois textos escritos direto no código, `"java" == "java"` dá `true`, porque o Java reaproveita literais iguais num *pool* de Strings. Não conte com isso. Textos que vêm do teclado, de arquivos ou de contas são objetos novos. Compare sempre com `equals`.

## Outras comparações

```java
"Java".equalsIgnoreCase("JAVA")   // true: ignora maiúsculas e minúsculas
"abc".compareTo("abd")            // negativo: "abc" vem antes
"abc".compareTo("abc")            // 0: são iguais
```

> [!TIP]
> Se a variável puder ser `null`, escreva o texto fixo primeiro: `"sim".equals(resposta)` devolve `false` quando `resposta` é `null`, enquanto `resposta.equals("sim")` lançaria `NullPointerException`.
