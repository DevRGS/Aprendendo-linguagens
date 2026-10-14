// verifica: q22, f11 e a aula ordenacao (Comparable define a ordem natural)
// saida:
// [caneta, caderno, mochila]
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

class Main {
    public static void main(String[] args) {
        List<Produto> produtos = new ArrayList<>(List.of(
            new Produto("caderno", 20.0), new Produto("caneta", 3.5), new Produto("mochila", 120.0)));
        Collections.sort(produtos);
        System.out.println(produtos);
    }
}

class Produto implements Comparable<Produto> {
    private String nome;
    private double preco;

    Produto(String nome, double preco) {
        this.nome = nome;
        this.preco = preco;
    }

    @Override
    public int compareTo(Produto outro) {
        return Double.compare(this.preco, outro.preco);
    }

    @Override
    public String toString() { return nome; }
}
