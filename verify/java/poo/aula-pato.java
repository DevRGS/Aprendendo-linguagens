// verifica: java.poo.q21 e a aula abstratas-e-interfaces (várias interfaces; interface como tipo)
// saida:
// Pato voando
// Pato nadando
// Pato voando
class Main {
    public static void main(String[] args) {
        Pato p = new Pato();
        p.voar();
        p.nadar();
        Voador v = new Pato();
        v.voar();
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

    @Override
    public void nadar() { System.out.println("Pato nadando"); }
}
