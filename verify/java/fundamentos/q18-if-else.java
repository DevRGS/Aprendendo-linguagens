// verifica: java.fundamentos.q18 e a aula condicionais
// saida:
// A
// B
// C
class Main {
    static void classificar(int nota) {
        if (nota >= 90) {
            System.out.println("A");
        } else if (nota >= 70) {
            System.out.println("B");
        } else {
            System.out.println("C");
        }
    }

    public static void main(String[] args) {
        classificar(95);
        classificar(85);
        classificar(50);
    }
}
