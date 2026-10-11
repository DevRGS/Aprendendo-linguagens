// verifica: a aula condicionais e f10 (switch com seta produz valor)
// saida:
// Domingo
class Main {
    public static void main(String[] args) {
        int dia = 1;
        String nome = switch (dia) {
            case 1 -> "Domingo";
            case 7 -> "Sábado";
            default -> "Dia útil";
        };
        System.out.println(nome);
    }
}
