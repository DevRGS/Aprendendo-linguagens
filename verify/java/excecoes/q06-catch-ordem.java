// verifica: java.excecoes.q06, f05 e a aula try-catch-finally (catch genérico antes do específico)
// espera: erro-de-compilacao
// erro-contem: exception ArithmeticException has already been caught
class Main {
    public static void main(String[] args) {
        int zero = 0;
        try {
            System.out.println(10 / zero);
        } catch (Exception e) {
            System.out.println("geral");
        } catch (ArithmeticException e) {
            System.out.println("divisão");
        }
    }
}
