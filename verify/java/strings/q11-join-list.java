// verifica: java.strings.q11 (String.join com uma lista)
// saida:
// Ana, Bia, Caio
import java.util.List;

class Main {
    public static void main(String[] args) {
        String texto = String.join(", ", List.of("Ana", "Bia", "Caio"));
        System.out.println(texto);
    }
}
