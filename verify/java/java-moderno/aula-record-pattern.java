// verifica: a aula switch-e-pattern-matching (padrões de record no switch e no instanceof)
// saida:
// na origem
// em (2, 5)
// não é um ponto
// 7
class Main {
    static String onde(Object o) {
        return switch (o) {
            case Ponto(int x, int y) when x == 0 && y == 0 -> "na origem";
            case Ponto(int x, int y) -> "em (" + x + ", " + y + ")";
            default -> "não é um ponto";
        };
    }

    public static void main(String[] args) {
        System.out.println(onde(new Ponto(0, 0)));
        System.out.println(onde(new Ponto(2, 5)));
        System.out.println(onde("x"));
        Object o = new Ponto(3, 4);
        if (o instanceof Ponto(int x, int y)) {
            System.out.println(x + y);
        }
    }
}

record Ponto(int x, int y) {}
