// verifica: q01, f01 e a aula classes-e-objetos (new, atributos e idade com valor padrão)
// saida:
// Oi, eu sou Ana e tenho 30 anos.
// Oi, eu sou Caio e tenho 0 anos.
class Main {
    public static void main(String[] args) {
        Pessoa ana = new Pessoa();
        ana.nome = "Ana";
        ana.idade = 30;
        ana.apresentar();

        Pessoa caio = new Pessoa();
        caio.nome = "Caio";
        caio.apresentar();
    }
}

class Pessoa {
    String nome;
    int idade;

    void apresentar() {
        System.out.println("Oi, eu sou " + nome + " e tenho " + idade + " anos.");
    }
}
