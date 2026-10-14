// verifica: a nota da aula records (record não estende classe)
// espera: erro-de-compilacao
class Main {
    public static void main(String[] args) {
    }
}

class Base {
}

record Ponto(int x, int y) extends Base {}
