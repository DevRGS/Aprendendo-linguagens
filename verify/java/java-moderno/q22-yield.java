// verifica: java.java-moderno.q22 (yield devolve o valor do bloco)
// saida:
// dia útil
class Main {
    public static void main(String[] args) {
        int dia = 3;
        String tipo = switch (dia) {
            case 1, 7 -> "fim de semana";
            default -> {
                String t = "dia útil";
                yield t;
            }
        };
        System.out.println(tipo);
    }
}
