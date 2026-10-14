// verifica: a aula entrada-com-scanner (hasNextInt confere antes de ler)
// saida:
// Isso não é um número.
// Número: 42
import java.util.Scanner;

class Main {
    static void ler(Scanner sc) {
        if (sc.hasNextInt()) {
            int n = sc.nextInt();
            System.out.println("Número: " + n);
        } else {
            System.out.println("Isso não é um número.");
        }
    }

    public static void main(String[] args) {
        ler(new Scanner("abc"));
        ler(new Scanner("42"));
    }
}
