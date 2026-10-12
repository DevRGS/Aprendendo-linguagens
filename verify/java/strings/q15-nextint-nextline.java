// verifica: java.strings.q15, f11 e a aula entrada-com-scanner (nextLine depois de nextInt vem vazio)
// saida:
// 25
// []
import java.util.Scanner;

class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner("25\nRecife\n");
        int idade = sc.nextInt();
        String cidade = sc.nextLine();
        System.out.println(idade);
        System.out.println("[" + cidade + "]");
    }
}
