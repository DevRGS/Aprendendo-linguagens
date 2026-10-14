// verifica: q13, f08, f10 e a aula heranca-e-polimorfismo (extends, super, @Override, polimorfismo, super.metodo, toString e Object)
// saida:
// Rex faz Au
// Au
// Miau
// ...
// Au (fininho)
// Gato Mimi
// true
class Main {
    public static void main(String[] args) {
        Cachorro rex = new Cachorro("Rex");
        System.out.println(rex.apresentar());

        Animal[] animais = { new Cachorro("Rex"), new Gato("Mimi"), new Animal("Bicho") };
        for (Animal a : animais) {
            System.out.println(a.som());
        }

        System.out.println(new Filhote("Toby").som());
        System.out.println(new Gato("Mimi"));
        System.out.println(new Animal("Bicho") instanceof Object);
    }
}

class Animal {
    protected String nome;

    Animal(String nome) {
        this.nome = nome;
    }

    String som() {
        return "...";
    }

    String apresentar() {
        return nome + " faz " + som();
    }
}

class Cachorro extends Animal {
    Cachorro(String nome) {
        super(nome);
    }

    @Override
    String som() {
        return "Au";
    }
}

class Gato extends Animal {
    Gato(String nome) {
        super(nome);
    }

    @Override
    String som() {
        return "Miau";
    }

    @Override
    public String toString() {
        return "Gato " + nome;
    }
}

class Filhote extends Cachorro {
    Filhote(String nome) {
        super(nome);
    }

    @Override
    String som() {
        return super.som() + " (fininho)";
    }
}
