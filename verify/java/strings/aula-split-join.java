// verifica: f07 e a aula metodos-de-string (split e String.join com array e com lista)
// saida:
// 3
// Bia
// Ana, Bia, Caio
// Ana, Bia
import java.util.List;

class Main {
    public static void main(String[] args) {
        String[] partes = "Ana;Bia;Caio".split(";");
        System.out.println(partes.length);
        System.out.println(partes[1]);
        String junto = String.join(", ", partes);
        System.out.println(junto);
        System.out.println(String.join(", ", List.of("Ana", "Bia")));
    }
}
