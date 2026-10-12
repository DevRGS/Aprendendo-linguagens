// verifica: q11, f08 e a aula checked-e-unchecked (throw interrompe o método)
// espera: excecao IllegalArgumentException
// erro-contem: Valor de saque inválido: -1.0
class Main {
    static void sacar(double valor) {
        if (valor <= 0) {
            throw new IllegalArgumentException("Valor de saque inválido: " + valor);
        }
        System.out.println("Sacando " + valor);
    }

    public static void main(String[] args) {
        sacar(50);
        sacar(-1);
    }
}
