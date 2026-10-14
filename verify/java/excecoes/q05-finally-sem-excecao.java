// verifica: java.excecoes.q05 e f04 (o finally roda mesmo sem exceção)
// saida:
// AD
class Main {
    public static void main(String[] args) {
        try {
            System.out.print("A");
        } catch (RuntimeException e) {
            System.out.print("C");
        } finally {
            System.out.print("D");
        }
    }
}
