// verifica: java.colecoes.q09 e a aula conjuntos (maiúsculas antes das minúsculas)
// saida:
// [Bia, Caio, ana]
import java.util.List;
import java.util.TreeSet;

class Main {
    public static void main(String[] args) {
        System.out.println(new TreeSet<>(List.of("ana", "Bia", "Caio")));
    }
}
