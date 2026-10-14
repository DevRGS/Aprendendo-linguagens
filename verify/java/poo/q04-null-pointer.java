// verifica: java.poo.q04 e a aula classes-e-objetos (método chamado por uma referência null)
// espera: excecao NullPointerException
class Main {
    public static void main(String[] args) {
        Pessoa p = null;
        p.apresentar();
    }
}

class Pessoa {
    void apresentar() {
        System.out.println("Oi");
    }
}
