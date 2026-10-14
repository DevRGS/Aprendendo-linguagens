// verifica: a aula arrays e q14 (índice 5 num array de tamanho 5)
// espera: excecao ArrayIndexOutOfBoundsException
class Main {
    public static void main(String[] args) {
        int[] numeros = new int[5];
        System.out.println(numeros[5]);
    }
}
