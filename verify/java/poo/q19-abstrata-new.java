// verifica: java.poo.q19 e a aula abstratas-e-interfaces (classe abstrata não é instanciada)
// espera: erro-de-compilacao
// erro-contem: Forma is abstract; cannot be instantiated
class Main {
    public static void main(String[] args) {
        Forma g = new Forma("?");
    }
}

abstract class Forma {
    private String nome;

    Forma(String nome) {
        this.nome = nome;
    }

    abstract double area();
}
