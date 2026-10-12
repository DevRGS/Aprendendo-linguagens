// verifica: java.strings.q13, q12, f08 e a aula stringbuilder (a ordem montada imprime 1 2 3)
// saida:
// 1 2 3
class Main {
    public static void main(String[] args) {
        StringBuilder sb = new StringBuilder();
        for (int i = 1; i <= 3; i++) {
            sb.append(i).append(" ");
        }
        System.out.println(sb.toString().trim());
    }
}
