// verifica: java.poo.q02, f02 e a aula classes-e-objetos (cópia de referência; == compara referências)
// saida:
// Bia
// true
// false
class Main {
    public static void main(String[] args) {
        Pessoa a = new Pessoa();
        a.nome = "Ana";
        Pessoa b = a;
        b.nome = "Bia";
        System.out.println(a.nome);
        System.out.println(a == b);

        Pessoa x = new Pessoa();
        x.nome = "Ana";
        Pessoa y = new Pessoa();
        y.nome = "Ana";
        System.out.println(x == y);
    }
}

class Pessoa {
    String nome;
}
