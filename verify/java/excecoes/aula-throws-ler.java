// verifica: f08 e a aula checked-e-unchecked (throws declara e quem chama trata; com um arquivo que não existe)
// saida:
// Não consegui ler: arquivo-que-nao-existe.txt
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

class Main {
    static String ler(Path caminho) throws IOException {
        return Files.readString(caminho);
    }

    public static void main(String[] args) {
        try {
            System.out.println(ler(Path.of("arquivo-que-nao-existe.txt")));
        } catch (IOException e) {
            System.out.println("Não consegui ler: " + e.getMessage());
        }
    }
}
