// verifica: q02, f02 e a aula lambdas (interface própria; um método default não conta)
// saida:
// 12
// 25
class Main {
    public static void main(String[] args) {
        Operacao multiplicar = (a, b) -> a * b;
        System.out.println(multiplicar.aplicar(3, 4));
        System.out.println(multiplicar.dobro(5));
    }
}

@FunctionalInterface
interface Operacao {
    int aplicar(int a, int b);

    default int dobro(int a) {
        return aplicar(a, a);
    }
}
