// verifica: java.poo.q11, f06 e a tabela da aula encapsulamento (protected e sem modificador valem no mesmo pacote)
// saida:
// Rex
// 3
class Main {
    public static void main(String[] args) {
        Animal a = new Animal();
        a.nome = "Rex";
        a.idade = 3;
        System.out.println(a.nome);
        System.out.println(a.idade);
    }
}

class Animal {
    protected String nome;
    int idade;
}
