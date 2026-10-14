// verifica: f04 e a aula construtores (com Pessoa(String, int) declarado, new Pessoa() não compila)
// espera: erro-de-compilacao
// erro-contem: constructor Pessoa in class Pessoa cannot be applied to given types
class Main {
    public static void main(String[] args) {
        new Pessoa();
    }
}

class Pessoa {
    String nome;
    int idade;

    Pessoa(String nome, int idade) {
        this.nome = nome;
        this.idade = idade;
    }
}
