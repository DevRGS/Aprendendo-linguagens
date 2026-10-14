// verifica: a aula heranca-e-polimorfismo (sem construtor vazio na superclasse, a subclasse precisa chamar super(...))
// espera: erro-de-compilacao
// erro-contem: constructor Animal in class Animal cannot be applied to given types
class Main {
    public static void main(String[] args) {
        new Cachorro();
    }
}

class Animal {
    protected String nome;

    Animal(String nome) {
        this.nome = nome;
    }
}

class Cachorro extends Animal {
    Cachorro() {
        System.out.println("sem super(nome)");
    }
}
