// verifica: java.excecoes.q13 e q01 (classe que não estende Throwable não pode ser lançada)
// espera: erro-de-compilacao
// erro-contem: incompatible types: Problema cannot be converted to Throwable
class Main {
    public static void main(String[] args) {
        throw new Problema();
    }
}

class Problema {
}
