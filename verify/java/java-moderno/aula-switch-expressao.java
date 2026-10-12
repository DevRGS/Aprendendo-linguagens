// verifica: f16 e a aula switch-e-pattern-matching (vários valores num case, yield e default que lança)
// saida:
// dia útil
// fim de semana
// dia inválido: 9
class Main {
    static String tipo(int dia) {
        return switch (dia) {
            case 1, 7 -> "fim de semana";
            case 2, 3, 4, 5, 6 -> {
                String t = "dia útil";
                yield t;
            }
            default -> throw new IllegalArgumentException("dia inválido: " + dia);
        };
    }

    public static void main(String[] args) {
        System.out.println(tipo(3));
        System.out.println(tipo(7));
        try {
            tipo(9);
        } catch (IllegalArgumentException e) {
            System.out.println(e.getMessage());
        }
    }
}
