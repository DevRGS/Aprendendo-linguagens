// verifica: a aula listas (copiar List.of para um ArrayList permite alterar)
// saida:
// [azul, verde, roxo]
import java.util.ArrayList;
import java.util.List;

class Main {
    public static void main(String[] args) {
        List<String> cores = new ArrayList<>(List.of("azul", "verde"));
        cores.add("roxo");
        System.out.println(cores);
    }
}
