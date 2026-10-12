// verifica: java.java-moderno.q23, f15 e a aula switch-e-pattern-matching (sealed dispensa o default)
// saida:
// 4.0
// 3.141592653589793
// círculo
// quadrado
class Main {
    static double area(Forma f) {
        return switch (f) {
            case Circulo c -> Math.PI * c.raio() * c.raio();
            case Quadrado q -> q.lado() * q.lado();
        };
    }

    static String nome(Forma f) {
        return switch (f) {
            case Circulo c -> "círculo";
            case Quadrado q -> "quadrado";
        };
    }

    public static void main(String[] args) {
        System.out.println(area(new Quadrado(2)));
        System.out.println(area(new Circulo(1)));
        System.out.println(nome(new Circulo(1)));
        System.out.println(nome(new Quadrado(2)));
    }
}

sealed interface Forma permits Circulo, Quadrado {}

record Circulo(double raio) implements Forma {}

record Quadrado(double lado) implements Forma {}
