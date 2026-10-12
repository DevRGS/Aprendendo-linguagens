// verifica: a aula static-e-final (atributo final precisa receber valor em todo construtor)
// espera: erro-de-compilacao
class Main {
    public static void main(String[] args) {
        System.out.println(new Config().limite);
    }
}

class Config {
    final int limite;

    Config(int limite) {
        this.limite = limite;
    }

    Config() {
    }
}
