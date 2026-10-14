// verifica: java.poo.q12, f07 e a aula encapsulamento (getter e depósito com validação)
// saida:
// 100.0
class Main {
    public static void main(String[] args) {
        Conta c = new Conta();
        c.depositar(100);
        c.depositar(-50);
        System.out.println(c.getSaldo());
    }
}

class Conta {
    private double saldo;

    public double getSaldo() {
        return saldo;
    }

    public void depositar(double valor) {
        if (valor > 0) {
            saldo += valor;
        }
    }
}
