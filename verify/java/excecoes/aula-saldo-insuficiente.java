// verifica: q15, f09 e a aula excecoes-personalizadas (exceção checked própria, com mensagem)
// saida:
// Saldo insuficiente: faltam 50.0
class Main {
    public static void main(String[] args) {
        Conta conta = new Conta(100);
        try {
            conta.sacar(150);
        } catch (SaldoInsuficienteException e) {
            System.out.println(e.getMessage());
        }
    }
}

class SaldoInsuficienteException extends Exception {
    SaldoInsuficienteException(String mensagem) {
        super(mensagem);
    }
}

class Conta {
    private double saldo;

    Conta(double saldo) {
        this.saldo = saldo;
    }

    void sacar(double valor) throws SaldoInsuficienteException {
        if (valor > saldo) {
            throw new SaldoInsuficienteException("Saldo insuficiente: faltam " + (valor - saldo));
        }
        saldo -= valor;
    }
}
