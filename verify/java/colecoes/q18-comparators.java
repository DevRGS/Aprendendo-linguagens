// verifica: java.colecoes.q18 (as quatro respostas aceitas compilam e ordenam pela idade)
// saida:
// [Ana (25), Caio (30), Bia (30)]
// [Ana (25), Caio (30), Bia (30)]
// [Ana (25), Caio (30), Bia (30)]
// [Ana (25), Caio (30), Bia (30)]
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

class Main {
    static List<Pessoa> pessoas() {
        return new ArrayList<>(List.of(new Pessoa("Caio", 30), new Pessoa("Ana", 25), new Pessoa("Bia", 30)));
    }

    public static void main(String[] args) {
        List<Pessoa> a = pessoas();
        a.sort(Comparator.comparingInt(Pessoa::getIdade));
        System.out.println(a);

        List<Pessoa> b = pessoas();
        b.sort(Comparator.comparing(Pessoa::getIdade));
        System.out.println(b);

        List<Pessoa> c = pessoas();
        c.sort(Comparator.comparingLong(Pessoa::getIdade));
        System.out.println(c);

        List<Pessoa> d = pessoas();
        d.sort(Comparator.comparingDouble(Pessoa::getIdade));
        System.out.println(d);
    }
}

class Pessoa {
    private String nome;
    private int idade;

    Pessoa(String nome, int idade) {
        this.nome = nome;
        this.idade = idade;
    }

    String getNome() { return nome; }

    int getIdade() { return idade; }

    @Override
    public String toString() { return nome + " (" + idade + ")"; }
}
