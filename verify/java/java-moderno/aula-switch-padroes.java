// verifica: q25 e a aula switch-e-pattern-matching (case por tipo, when e case null)
// saida:
// inteiro positivo: 5
// inteiro: -2
// texto com 2 letras
// outra coisa
// nulo
class Main {
    static String descrever(Object o) {
        return switch (o) {
            case null -> "nulo";
            case Integer i when i > 0 -> "inteiro positivo: " + i;
            case Integer i -> "inteiro: " + i;
            case String s -> "texto com " + s.length() + " letras";
            default -> "outra coisa";
        };
    }

    public static void main(String[] args) {
        System.out.println(descrever(5));
        System.out.println(descrever(-2));
        System.out.println(descrever("oi"));
        System.out.println(descrever(3.5));
        System.out.println(descrever(null));
    }
}
