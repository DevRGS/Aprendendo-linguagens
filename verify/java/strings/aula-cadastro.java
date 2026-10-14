// verifica: f10 e a aula entrada-com-scanner (nextLine e nextInt; os rótulos aparecem sem o que foi "digitado")
// saida:
// Nome: Idade: Ana Silva tem 30 anos.
import java.util.Scanner;

class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner("Ana Silva\n30\n");

        System.out.print("Nome: ");
        String nome = sc.nextLine();

        System.out.print("Idade: ");
        int idade = sc.nextInt();

        System.out.println(nome + " tem " + idade + " anos.");
    }
}
