// verifica: java.excecoes.q03 (divisão inteira por zero)
// espera: excecao ArithmeticException
// erro-contem: / by zero
class Main {
    public static void main(String[] args) {
        int zero = 0;
        System.out.println(10 / zero);
    }
}
