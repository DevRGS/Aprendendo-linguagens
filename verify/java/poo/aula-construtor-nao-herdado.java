// verifica: a aula heranca-e-polimorfismo (construtores não são herdados: Cachorro não ganha o Cachorro(String))
// espera: erro-de-compilacao
// erro-contem: constructor Cachorro in class Cachorro cannot be applied to given types
class Main {
    public static void main(String[] args) {
        new Cachorro("Rex");
    }
}

class Animal {
    protected String nome;

    Animal() {
    }

    Animal(String nome) {
        this.nome = nome;
    }
}

class Cachorro extends Animal {
}
