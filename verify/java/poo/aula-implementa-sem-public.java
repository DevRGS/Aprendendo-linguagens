// verifica: a aula abstratas-e-interfaces (método de interface implementado sem public)
// espera: erro-de-compilacao
// erro-contem: attempting to assign weaker access privileges; was public
class Main {
    public static void main(String[] args) {
        new Pato().voar();
    }
}

interface Voador {
    void voar();
}

class Pato implements Voador {
    void voar() { System.out.println("Pato voando"); }
}
