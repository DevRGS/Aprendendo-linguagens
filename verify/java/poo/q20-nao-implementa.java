// verifica: java.poo.q20 (classe concreta que não implementa um método da interface)
// espera: erro-de-compilacao
// erro-contem: Pato is not abstract and does not override abstract method nadar() in Nadador
class Main {
    public static void main(String[] args) {
        new Pato().voar();
    }
}

interface Voador {
    void voar();
}

interface Nadador {
    void nadar();
}

class Pato implements Voador, Nadador {
    @Override
    public void voar() { System.out.println("Pato voando"); }
}
