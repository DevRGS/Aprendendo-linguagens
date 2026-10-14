// verifica: f11 e a aula abstratas-e-interfaces (classe abstrata com atributo, construtor e método abstrato)
// saida:
// Retângulo com área 12.0
class Main {
    public static void main(String[] args) {
        Forma f = new Retangulo(3, 4);
        System.out.println(f.descrever());
    }
}

abstract class Forma {
    private String nome;

    Forma(String nome) {
        this.nome = nome;
    }

    abstract double area();

    String descrever() {
        return nome + " com área " + area();
    }
}

class Retangulo extends Forma {
    private double largura;
    private double altura;

    Retangulo(double largura, double altura) {
        super("Retângulo");
        this.largura = largura;
        this.altura = altura;
    }

    @Override
    double area() {
        return largura * altura;
    }
}
