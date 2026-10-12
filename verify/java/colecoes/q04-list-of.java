// verifica: java.colecoes.q04 (as duas respostas aceitas compilam e criam a lista)
// saida:
// [azul, verde, roxo]
// [azul, verde, roxo]
import java.util.List;

class Main {
    public static void main(String[] args) {
        List<String> cores = List.of("azul", "verde", "roxo");
        List<String> outras = java.util.List.of("azul", "verde", "roxo");
        System.out.println(cores);
        System.out.println(outras);
    }
}
