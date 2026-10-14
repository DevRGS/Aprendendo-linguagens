// verifica: f14 e a aula static-e-final (variável final não recebe outro valor)
// espera: erro-de-compilacao
// erro-contem: cannot assign a value to final variable taxa
class Main {
    public static void main(String[] args) {
        final double taxa = 0.1;
        taxa = 0.2;
    }
}
