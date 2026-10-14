// verifica: a aula switch-e-pattern-matching (switch de int usado como expressão precisa de default)
// espera: erro-de-compilacao
// erro-contem: the switch expression does not cover all possible input values
class Main {
    static String tipo(int dia) {
        return switch (dia) {
            case 1, 7 -> "fim de semana";
            case 2, 3, 4, 5, 6 -> "dia útil";
        };
    }

    public static void main(String[] args) {
        System.out.println(tipo(1));
    }
}
