// verifica: a aula conjuntos (sem equals e hashCode, objetos iguais contam como diferentes)
// saida:
// 2
// 1
import java.util.HashSet;
import java.util.Set;

class Main {
    public static void main(String[] args) {
        Set<Pessoa> pessoas = new HashSet<>();
        pessoas.add(new Pessoa("Ana"));
        pessoas.add(new Pessoa("Ana"));
        System.out.println(pessoas.size());

        Set<String> nomes = new HashSet<>();
        nomes.add(new String("Ana"));
        nomes.add(new String("Ana"));
        System.out.println(nomes.size());
    }
}

class Pessoa {
    String nome;

    Pessoa(String nome) {
        this.nome = nome;
    }
}
