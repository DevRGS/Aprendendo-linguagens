// verifica: java.fundamentos.q04 e a aula conversoes (cast trunca; Math.round arredonda)
// saida:
// 9
// 10
class Main {
    public static void main(String[] args) {
        double x = 9.99;
        int n = (int) x;
        System.out.println(n);
        System.out.println(Math.round(9.99));
    }
}
