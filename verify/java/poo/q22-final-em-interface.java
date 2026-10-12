// verifica: java.poo.q22 (final não é permitido em método de interface)
// espera: erro-de-compilacao
// erro-contem: modifier final not allowed here
class Main {
    public static void main(String[] args) {
    }
}

interface Saudacao {
    default final String saudar() {
        return "Olá";
    }
}
