// verifica: java.poo.q03, f03 e a aula classes-e-objetos (valores padrão de atributos; char começa no caractere nulo)
// saida:
// 0
// 0.0
// false
// 0
// null
class Main {
    public static void main(String[] args) {
        Exemplo e = new Exemplo();
        System.out.println(e.inteiro);
        System.out.println(e.decimal);
        System.out.println(e.logico);
        System.out.println((int) e.letra);
        System.out.println(e.texto);
    }
}

class Exemplo {
    int inteiro;
    double decimal;
    boolean logico;
    char letra;
    String texto;
}
