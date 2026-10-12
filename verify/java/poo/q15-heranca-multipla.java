// verifica: java.poo.q15 e a aula heranca-e-polimorfismo (uma classe estende uma só classe)
// espera: erro-de-compilacao
class Main {
    public static void main(String[] args) {
        System.out.println(new C());
    }
}

class A {}

class B {}

class C extends A, B {}
