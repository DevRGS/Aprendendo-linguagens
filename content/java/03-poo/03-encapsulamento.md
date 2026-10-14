# Encapsulamento

Se qualquer parte do programa pode mexer direto nos atributos, nada impede um saldo negativo ou uma idade de -5. **Encapsular** é esconder os atributos e oferecer métodos que controlam o acesso a eles.

## Modificadores de acesso

| Modificador | A própria classe | Mesmo pacote | Subclasse em outro pacote | Qualquer classe |
|---|---|---|---|---|
| `private` | sim | não | não | não |
| (nenhum) | sim | sim | não | não |
| `protected` | sim | sim | sim | não |
| `public` | sim | sim | sim | sim |

> [!NOTE]
> **Pacote** é um grupo de classes relacionadas, como `java.util`. Sem modificador, o acesso fica restrito ao pacote; por isso esse nível se chama *acesso de pacote*.

## Atributos privados, métodos públicos

```java
public class Conta {
    private double saldo;

    public double getSaldo() {      // lê o saldo
        return saldo;
    }

    public void depositar(double valor) {
        if (valor > 0) {            // a regra fica num lugar só
            saldo += valor;
        }
    }
}
```

```java
Conta c = new Conta();
c.depositar(100);
c.depositar(-50);                    // ignorado pela validação
System.out.println(c.getSaldo());    // 100.0
c.saldo = 1000;                      // não compila: saldo has private access in Conta
```

## Getters e setters

A convenção do Java (chamada JavaBeans) usa `getAtributo()` para ler e `setAtributo(valor)` para alterar. Para `boolean`, o getter costuma começar com `is`, como `isAtivo()`.

```java
public class Pessoa {
    private String nome;
    private int idade;

    public Pessoa(String nome) {
        this.nome = nome;
    }

    public String getNome() { return nome; }

    public int getIdade() { return idade; }

    public void setIdade(int idade) {
        if (idade < 0) {
            System.out.println("Idade inválida: " + idade);
            return;
        }
        this.idade = idade;
    }
}
```

```java
Pessoa p = new Pessoa("Ana");
p.setIdade(-5);     // Idade inválida: -5
p.setIdade(20);
System.out.println(p.getNome() + ", " + p.getIdade());  // Ana, 20
```

> [!TIP]
> Não crie um setter para cada atributo por hábito. Se um dado não deve mudar depois da criação (como o nome acima), receba-o no construtor e ofereça só o getter.
