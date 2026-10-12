// verifica: f11 e a aula entrada-com-scanner (as duas soluções: nextLine extra e parseInt)
// saida:
// 25 Recife
// 25 Recife
import java.util.Scanner;

class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner("25\nRecife\n");
        int idade = sc.nextInt();
        sc.nextLine();
        String cidade = sc.nextLine();
        System.out.println(idade + " " + cidade);

        Scanner sc2 = new Scanner("25\nRecife\n");
        int idade2 = Integer.parseInt(sc2.nextLine());
        String cidade2 = sc2.nextLine();
        System.out.println(idade2 + " " + cidade2);
    }
}
