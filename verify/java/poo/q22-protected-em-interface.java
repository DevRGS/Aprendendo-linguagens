// verifica: java.poo.q22 (protected não é permitido em método de interface)
// espera: erro-de-compilacao
// erro-contem: modifier protected not allowed here
class Main {
    public static void main(String[] args) {
    }
}

interface Saudacao {
    protected String nome();
}
