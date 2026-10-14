// verifica: a aula heranca-e-polimorfismo (cast para o tipo errado)
// espera: excecao ClassCastException
class Main {
    public static void main(String[] args) {
        Animal a = new Gato();
        Cachorro c = (Cachorro) a;
        System.out.println(c);
    }
}

class Animal {}

class Cachorro extends Animal {}

class Gato extends Animal {}
