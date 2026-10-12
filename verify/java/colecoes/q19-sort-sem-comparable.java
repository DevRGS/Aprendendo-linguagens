// verifica: java.colecoes.q19 e a aula ordenacao (Collections.sort exige Comparable)
// espera: erro-de-compilacao
// erro-contem: no suitable method found for sort
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

class Main {
    public static void main(String[] args) {
        List<Pessoa> pessoas = new ArrayList<>();
        Collections.sort(pessoas);
    }
}

class Pessoa {
    String nome;
}
