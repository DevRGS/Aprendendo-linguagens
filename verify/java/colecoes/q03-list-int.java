// verifica: java.colecoes.q03, f02 e a aula listas (genérico não aceita primitivo)
// espera: erro-de-compilacao
// erro-contem: unexpected type
import java.util.ArrayList;
import java.util.List;

class Main {
    public static void main(String[] args) {
        List<int> notas = new ArrayList<>();
    }
}
