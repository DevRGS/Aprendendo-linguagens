// verifica: java.poo.q26 e f14 (classe final não é estendida)
// espera: erro-de-compilacao
// erro-contem: cannot inherit from final Moeda
class Main {
    public static void main(String[] args) {
        System.out.println(new Real());
    }
}

final class Moeda {
}

class Real extends Moeda {
}
