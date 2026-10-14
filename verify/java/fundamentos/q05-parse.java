// verifica: java.fundamentos.q05 (as quatro respostas aceitas compilam e dão 42) e a aula conversoes
// saida:
// 42
// 42
// 42
// 42
// 7.5
// 42
// 42
class Main {
    public static void main(String[] args) {
        int a = Integer.parseInt("42");
        int b = Integer.valueOf("42");
        int c = Integer.decode("42");
        int d = Integer.parseUnsignedInt("42");
        System.out.println(a);
        System.out.println(b);
        System.out.println(c);
        System.out.println(d);
        System.out.println(Double.parseDouble("7.5"));
        System.out.println(String.valueOf(42));
        System.out.println("" + 42);
    }
}
