// verifica: java.excecoes.q07, f04 e a aula try-catch-finally (o finally roda antes de o método devolver)
// saida:
// F1
class Main {
    static int teste() {
        try {
            return 1;
        } finally {
            System.out.print("F");
        }
    }

    public static void main(String[] args) {
        System.out.print(teste());
    }
}
