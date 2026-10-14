// verifica: java.excecoes.q13 (estender Throwable direto também gera exceção checked)
// espera: erro-de-compilacao
// erro-contem: unreported exception ProblemaException; must be caught or declared to be thrown
class Main {
    public static void main(String[] args) {
        throw new ProblemaException();
    }
}

class ProblemaException extends Throwable {
}
