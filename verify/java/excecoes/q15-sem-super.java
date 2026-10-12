// verifica: java.excecoes.q15 (com super(mensagem), getMessage devolve a mensagem; sem ele, devolve null)
// saida:
// Saldo insuficiente
// null
class Main {
    public static void main(String[] args) {
        System.out.println(new ComSuper("Saldo insuficiente").getMessage());
        System.out.println(new SemSuper("Saldo insuficiente").getMessage());
    }
}

class ComSuper extends Exception {
    ComSuper(String mensagem) {
        super(mensagem);
    }
}

class SemSuper extends Exception {
    SemSuper(String mensagem) {
    }
}
