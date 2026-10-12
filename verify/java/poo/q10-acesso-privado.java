// verifica: java.poo.q10, q09 e a aula encapsulamento (atributo private acessado de fora da classe)
// espera: erro-de-compilacao
// erro-contem: saldo has private access in Conta
class Main {
    public static void main(String[] args) {
        Conta c = new Conta();
        c.saldo = 1000;
    }
}

class Conta {
    private double saldo;
}
