// verifica: a aula heranca-e-polimorfismo (pela variável Animal, só se chama o que Animal declara)
// espera: erro-de-compilacao
// erro-contem: cannot find symbol
class Main {
    public static void main(String[] args) {
        Animal a = new Cachorro();
        a.buscarBolinha();
    }
}

class Animal {}

class Cachorro extends Animal {
    void buscarBolinha() {
        System.out.println("Buscando!");
    }
}
