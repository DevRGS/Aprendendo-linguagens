// verifica: f11 e a aula abstratas-e-interfaces (subclasse concreta sem implementar o método abstrato)
// espera: erro-de-compilacao
// erro-contem: Circulo is not abstract and does not override abstract method area() in Forma
class Main {
    public static void main(String[] args) {
        System.out.println(new Circulo());
    }
}

abstract class Forma {
    abstract double area();
}

class Circulo extends Forma {
}
