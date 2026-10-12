// verifica: java.poo.q08, f05 e a aula construtores (this.nome = nome; this(...) chama outro construtor)
// saida:
// Ana, 30
// Bia, 0
class Main {
    public static void main(String[] args) {
        Pessoa ana = new Pessoa("Ana", 30);
        Pessoa bia = new Pessoa("Bia");
        System.out.println(ana.nome + ", " + ana.idade);
        System.out.println(bia.nome + ", " + bia.idade);
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
        this(nome, 0);
    }
}
