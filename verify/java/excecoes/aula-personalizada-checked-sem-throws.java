// verifica: f09 e a tabela da aula excecoes-personalizadas (estendendo Exception, a exceção é checked)
// espera: erro-de-compilacao
// erro-contem: unreported exception SaldoInsuficienteException; must be caught or declared to be thrown
class Main {
    static void sacar() {
        throw new SaldoInsuficienteException("Saldo insuficiente");
    }

    public static void main(String[] args) {
        sacar();
    }
}

class SaldoInsuficienteException extends Exception {
    SaldoInsuficienteException(String mensagem) {
        super(mensagem);
    }
}
