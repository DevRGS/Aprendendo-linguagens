// verifica: a aula lacos e f12 (continue pula, break para)
// saida:
// 02
class Main {
    public static void main(String[] args) {
        for (int i = 0; i < 5; i++) {
            if (i == 1) continue;
            if (i == 3) break;
            System.out.print(i);
        }
        System.out.println();
    }
}
