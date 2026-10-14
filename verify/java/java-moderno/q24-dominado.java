// verifica: java.java-moderno.q24 e a aula switch-e-pattern-matching (case genérico antes do específico)
// espera: erro-de-compilacao
// erro-contem: this case label is dominated by a preceding case label
class Main {
    static String descrever(Object o) {
        return switch (o) {
            case CharSequence cs -> "texto";
            case String s -> "string";
            default -> "outro";
        };
    }

    public static void main(String[] args) {
        System.out.println(descrever("oi"));
    }
}
