// verifica: java.excecoes.q04 e a aula try-catch-finally (o resto do try é pulado; o finally roda)
// saida:
// ACD
class Main {
    public static void main(String[] args) {
        int zero = 0;
        try {
            System.out.print("A");
            int x = 10 / zero;
            System.out.print("B");
        } catch (ArithmeticException e) {
            System.out.print("C");
        } finally {
            System.out.print("D");
        }
    }
}
