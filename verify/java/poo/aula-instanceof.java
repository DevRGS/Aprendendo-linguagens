// verifica: a aula heranca-e-polimorfismo (instanceof antes do cast)
// saida:
// true
// Buscando!
// false
class Main {
    public static void main(String[] args) {
        Animal a = new Cachorro();
        System.out.println(a instanceof Cachorro);
        if (a instanceof Cachorro) {
            Cachorro c = (Cachorro) a;
            c.buscarBolinha();
        }
        Animal g = new Gato();
        System.out.println(g instanceof Cachorro);
    }
}

class Animal {}

class Cachorro extends Animal {
    void buscarBolinha() {
        System.out.println("Buscando!");
    }
}

class Gato extends Animal {}
