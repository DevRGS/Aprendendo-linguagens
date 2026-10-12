// verifica: java.strings.q18 e a tabela da aula entrada-com-scanner (nextLine lê a linha; next, uma palavra)
// saida:
// Maria Silva
// Maria
import java.util.Scanner;

class Main {
    public static void main(String[] args) {
        System.out.println(new Scanner("Maria Silva\n").nextLine());
        System.out.println(new Scanner("Maria Silva\n").next());
    }
}
