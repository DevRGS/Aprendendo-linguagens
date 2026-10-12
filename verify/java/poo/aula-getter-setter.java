// verifica: a aula encapsulamento (setter com validação e getters)
// saida:
// Idade inválida: -5
// Ana, 20
class Main {
    public static void main(String[] args) {
        Pessoa p = new Pessoa("Ana");
        p.setIdade(-5);
        p.setIdade(20);
        System.out.println(p.getNome() + ", " + p.getIdade());
    }
}

class Pessoa {
    private String nome;
    private int idade;

    public Pessoa(String nome) {
        this.nome = nome;
    }

    public String getNome() { return nome; }

    public int getIdade() { return idade; }

    public void setIdade(int idade) {
        if (idade < 0) {
            System.out.println("Idade inválida: " + idade);
            return;
        }
        this.idade = idade;
    }
}
