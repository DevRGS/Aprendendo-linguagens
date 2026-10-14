// verifica: a aula condicionais (Java 21: switch com padrão de tipo aceita objetos como Long)
// saida:
// long 42
class Main {
    public static void main(String[] args) {
        Object valor = 42L;
        String tipo = switch (valor) {
            case Long l -> "long " + l;
            default -> "outro";
        };
        System.out.println(tipo);
    }
}
