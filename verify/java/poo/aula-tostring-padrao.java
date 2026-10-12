// verifica: a aula classes-e-objetos (o toString padrão começa com o nome da classe e @)
// saida:
// true
class Main {
    public static void main(String[] args) {
        Pessoa ana = new Pessoa();
        System.out.println(String.valueOf(ana).startsWith("Pessoa@"));
    }
}

class Pessoa {
    String nome;
}
