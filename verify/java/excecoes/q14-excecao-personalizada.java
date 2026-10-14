// verifica: java.excecoes.q14 (a classe montada compila e repassa a mensagem)
// saida:
// Saldo insuficiente
class Main {
    public static void main(String[] args) {
        try {
            throw new SaldoInsuficienteException("Saldo insuficiente");
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
