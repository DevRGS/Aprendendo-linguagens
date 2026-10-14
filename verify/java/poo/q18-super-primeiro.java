// verifica: java.poo.q18 e f10 (a ordem certa compila: super(...) primeiro)
// saida:
// Rex, vira-lata
class Main {
    public static void main(String[] args) {
        Cachorro c = new Cachorro("Rex", "vira-lata");
        System.out.println(c.nome + ", " + c.raca);
    }
}

class Animal {
    protected String nome;

    Animal(String nome) {
        this.nome = nome;
    }
}

class Cachorro extends Animal {
    String raca;

    Cachorro(String nome, String raca) {
        super(nome);
        this.raca = raca;
    }
}
