// verifica: a explicação de java.excecoes.q08 (no multi-catch, os tipos não podem ser parentes)
// espera: erro-de-compilacao
// erro-contem: Alternatives in a multi-catch statement cannot be related by subclassing
class Main {
    public static void main(String[] args) {
        try {
            System.out.println(Integer.parseInt("x"));
        } catch (NumberFormatException | IllegalArgumentException e) {
            System.out.println("inválido");
        }
    }
}
