// verifica: java.poo.q24 e a aula static-e-final (método static não usa atributo de instância)
// espera: erro-de-compilacao
// erro-contem: non-static variable id cannot be referenced from a static context
class Main {
    public static void main(String[] args) {
        Contador.mostrar();
    }
}

class Contador {
    static int total = 0;
    int id;

    static void mostrar() {
        System.out.println(id);
    }
}
