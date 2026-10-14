// verifica: java.fundamentos.q15 e a aula arrays (valores padrão)
// saida:
// 0
// false
// null
// true
class Main {
    public static void main(String[] args) {
        int[] arr = new int[5];
        System.out.println(arr[2]);
        boolean[] b = new boolean[1];
        System.out.println(b[0]);
        String[] s = new String[1];
        System.out.println(s[0]);
        char[] c = new char[1];
        System.out.println(c[0] == '\u0000');
    }
}
