// verifica: java.poo.q07 e a aula construtores (no Java 21, this(...) precisa ser a primeira instrução)
// espera: erro-de-compilacao
// erro-contem: call to this must be first statement in constructor
class Main {
    public static void main(String[] args) {
        new Pessoa("Ana");
    }
}

class Pessoa {
    String nome;
    int idade;

    Pessoa(String nome, int idade) {
        this.nome = nome;
        this.idade = idade;
    }

    Pessoa(String nome) {
        System.out.println("criando");
        this(nome, 0);
    }
}
