// verifica: java.poo.q06 e a aula construtores (nome = nome sem this deixa o atributo null)
// saida:
// null
class Main {
    public static void main(String[] args) {
        System.out.println(new Pessoa("Ana").nome);
    }
}

class Pessoa {
    String nome;

    Pessoa(String nome) {
        nome = nome;
    }
}
