// verifica: a aula switch-e-pattern-matching (switch sem case null recebendo null)
// espera: excecao NullPointerException
class Main {
    public static void main(String[] args) {
        Object o = null;
        String r = switch (o) {
            case String s -> "texto";
            default -> "outro";
        };
        System.out.println(r);
    }
}
