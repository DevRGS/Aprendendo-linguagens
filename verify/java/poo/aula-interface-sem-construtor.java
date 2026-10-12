// verifica: a tabela da aula abstratas-e-interfaces (interface não tem construtor)
// espera: erro-de-compilacao
class Main {
    public static void main(String[] args) {
    }
}

interface Voador {
    Voador() {
    }
}
