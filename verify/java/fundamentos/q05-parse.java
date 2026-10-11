// verifica: java.fundamentos.q05 (parseInt e valueOf funcionam) e a aula conversoes
// saida:
// 42
// 42
// 7.5
// 42
// 42
class Main {
    public static void main(String[] args) {
        int a = Integer.parseInt("42");
        int b = Integer.valueOf("42");
        System.out.println(a);
        System.out.println(b);
        System.out.println(Double.parseDouble("7.5"));
        System.out.println(String.valueOf(42));
        System.out.println("" + 42);
    }
}
