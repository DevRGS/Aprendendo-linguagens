// verifica: a aula switch-e-pattern-matching (forma nova no permits sem case não compila)
// espera: erro-de-compilacao
// erro-contem: the switch expression does not cover all possible input values
class Main {
    static String nome(Forma f) {
        return switch (f) {
            case Circulo c -> "círculo";
            case Quadrado q -> "quadrado";
        };
    }

    public static void main(String[] args) {
        System.out.println(nome(new Circulo(1)));
    }
}

sealed interface Forma permits Circulo, Quadrado, Triangulo {}

record Circulo(double raio) implements Forma {}

record Quadrado(double lado) implements Forma {}

record Triangulo(double base, double altura) implements Forma {}
