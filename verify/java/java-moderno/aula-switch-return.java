// verifica: q22 e a aula switch-e-pattern-matching (return dentro de switch usado como expressão)
// espera: erro-de-compilacao
// erro-contem: attempt to return out of a switch expression
class Main {
    static String tipo(int dia) {
        return switch (dia) {
            case 1, 7 -> "fim de semana";
            default -> {
                return "dia útil";
            }
        };
    }

    public static void main(String[] args) {
        System.out.println(tipo(1));
    }
}
