// verifica: java.poo.q05 (com só Pessoa(String nome) declarado, new Pessoa() não compila)
// espera: erro-de-compilacao
// erro-contem: constructor Pessoa in class Pessoa cannot be applied to given types
class Main {
    public static void main(String[] args) {
        new Pessoa();
    }
}

class Pessoa {
    String nome;

    Pessoa(String nome) {
        this.nome = nome;
    }
}
