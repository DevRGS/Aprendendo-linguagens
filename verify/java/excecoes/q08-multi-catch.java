// verifica: java.excecoes.q08, f06 e a aula try-catch-finally (multi-catch)
// saida:
// Entrada inválida: / by zero
// Entrada inválida: For input string: "x"
class Main {
    static void calcular(String texto, int divisor) {
        try {
            System.out.println(Integer.parseInt(texto) / divisor);
        } catch (NumberFormatException | ArithmeticException e) {
            System.out.println("Entrada inválida: " + e.getMessage());
        }
    }

    public static void main(String[] args) {
        calcular("10", 0);
        calcular("x", 2);
    }
}
