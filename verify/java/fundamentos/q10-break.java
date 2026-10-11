// verifica: java.fundamentos.q10 (com break, a saída é B!)
// saida:
// B!
class Main {
    public static void main(String[] args) {
        int x = 2;
        switch (x) {
            case 1: System.out.print("A"); break;
            case 2: System.out.print("B"); break;
            case 3: System.out.print("C"); break;
        }
        System.out.println("!");
    }
}
