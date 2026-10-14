// verifica: java.poo.q25 e a aula static-e-final (final trava a referência, não o conteúdo)
// saida:
// 10
class Main {
    public static void main(String[] args) {
        final int[] numeros = {1, 2, 3};
        numeros[0] = 10;
        System.out.println(numeros[0]);
    }
}
