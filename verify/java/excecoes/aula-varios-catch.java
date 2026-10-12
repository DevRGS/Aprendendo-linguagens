// verifica: f05 e a aula try-catch-finally (o primeiro catch que combina é usado)
// saida:
// Texto inválido
// Conta impossível
// 3
class Main {
    static void processar(String texto, int divisor) {
        try {
            int n = Integer.parseInt(texto);
            System.out.println(n / divisor);
        } catch (NumberFormatException e) {
            System.out.println("Texto inválido");
        } catch (ArithmeticException e) {
            System.out.println("Conta impossível");
        }
    }

    public static void main(String[] args) {
        processar("12a", 1);
        processar("12", 0);
        processar("12", 4);
    }
}
