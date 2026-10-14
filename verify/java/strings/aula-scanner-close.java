// verifica: a nota da aula entrada-com-scanner (fechar o Scanner fecha o System.in)
// saida:
// Stream closed
import java.io.IOException;
import java.util.Scanner;

class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        sc.close();
        try {
            System.in.read();
        } catch (IOException e) {
            System.out.println(e.getMessage());
        }
    }
}
