// verifica: q21, f12 e a aula ordenacao (comparing, comparingInt().reversed(), thenComparing e estabilidade)
// saida:
// [Ana (25), Bia (30), Caio (30)]
// [Bia (30), Caio (30), Ana (25)]
// [Ana (25), Bia (30), Caio (30)]
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

class Main {
    public static void main(String[] args) {
        List<Pessoa> pessoas = new ArrayList<>(List.of(
            new Pessoa("Caio", 30), new Pessoa("Ana", 25), new Pessoa("Bia", 30)));

        pessoas.sort(Comparator.comparing(Pessoa::getNome));
        System.out.println(pessoas);

        pessoas.sort(Comparator.comparingInt(Pessoa::getIdade).reversed());
        System.out.println(pessoas);

        pessoas.sort(Comparator.comparingInt(Pessoa::getIdade).thenComparing(Pessoa::getNome));
        System.out.println(pessoas);
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
