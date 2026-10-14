// verifica: java.excecoes.q12, q09, f07 e a aula checked-e-unchecked (IOException precisa ser tratada ou declarada)
// espera: erro-de-compilacao
// erro-contem: unreported exception IOException; must be caught or declared to be thrown
import java.nio.file.Files;
import java.nio.file.Path;

class Main {
    static String ler(Path caminho) {
        return Files.readString(caminho);
    }

    public static void main(String[] args) {
        System.out.println(ler(Path.of("dados.txt")));
    }
}
