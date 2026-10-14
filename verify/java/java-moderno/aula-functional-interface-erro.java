// verifica: q02 e a aula lambdas (@FunctionalInterface com dois métodos abstratos)
// espera: erro-de-compilacao
// erro-contem: Unexpected @FunctionalInterface annotation
class Main {
    public static void main(String[] args) {
    }
}

@FunctionalInterface
interface Operacao {
    int aplicar(int a, int b);

    int desfazer(int a, int b);
}
