// verifica: f12 e a aula abstratas-e-interfaces (atributo de interface é constante)
// espera: erro-de-compilacao
// erro-contem: cannot assign a value to static final variable PREFIXO
class Main {
    public static void main(String[] args) {
        Saudacao.PREFIXO = "Oi, ";
    }
}

interface Saudacao {
    String PREFIXO = "Olá, ";
}
