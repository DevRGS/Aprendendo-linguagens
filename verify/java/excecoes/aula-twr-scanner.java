// verifica: a aula try-with-resources (Scanner de arquivo no try-with-resources; com um arquivo que não existe)
// saida:
// Erro ao ler: arquivo-que-nao-existe.txt
import java.io.IOException;
import java.nio.file.Path;
import java.util.Scanner;

class Main {
    public static void main(String[] args) {
        try (Scanner sc = new Scanner(Path.of("arquivo-que-nao-existe.txt"))) {
            System.out.println(sc.nextLine());
        } catch (IOException e) {
            System.out.println("Erro ao ler: " + e.getMessage());
        }
    }
}
