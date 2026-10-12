// verifica: java.excecoes.q13 e f10 (estendendo RuntimeException, não precisa de throws)
// saida:
// Estoque esgotado
class Main {
    static void retirar(int quantidade) {
        throw new EstoqueEsgotadoException("Estoque esgotado");
    }

    public static void main(String[] args) {
        try {
            retirar(1);
        } catch (EstoqueEsgotadoException e) {
            System.out.println(e.getMessage());
        }
    }
}

class EstoqueEsgotadoException extends RuntimeException {
    EstoqueEsgotadoException(String mensagem) {
        super(mensagem);
    }
}
