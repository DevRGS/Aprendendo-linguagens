// verifica: a aula arrays (matriz e impressão direta do array)
// saida:
// 3
// true
class Main {
    public static void main(String[] args) {
        int[][] matriz = {
            {1, 2},
            {3, 4}
        };
        System.out.println(matriz[1][0]);
        int[] valores = {1, 2, 3};
        System.out.println(String.valueOf(valores).startsWith("[I@"));
    }
}
