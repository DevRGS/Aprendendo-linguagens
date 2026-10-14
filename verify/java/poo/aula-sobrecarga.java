// verifica: f09 e a aula heranca-e-polimorfismo (sobrecarga escolhida pelos argumentos)
// saida:
// 3
// 3.5
// 6
class Main {
    public static void main(String[] args) {
        Calculadora calc = new Calculadora();
        System.out.println(calc.somar(1, 2));
        System.out.println(calc.somar(1.5, 2));
        System.out.println(calc.somar(1, 2, 3));
    }
}

class Calculadora {
    int somar(int a, int b) { return a + b; }
    double somar(double a, double b) { return a + b; }
    int somar(int a, int b, int c) { return a + b + c; }
}
