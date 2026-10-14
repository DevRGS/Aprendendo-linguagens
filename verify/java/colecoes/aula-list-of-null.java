// verifica: f04 e a aula listas (List.of recusa null)
// espera: excecao NullPointerException
import java.util.List;

class Main {
    public static void main(String[] args) {
        List<String> letras = List.of("a", null);
        System.out.println(letras);
    }
}
