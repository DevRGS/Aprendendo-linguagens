// verifica: java.poo.q25 e a aula static-e-final (trocar a referência final não compila)
// espera: erro-de-compilacao
// erro-contem: cannot assign a value to final variable numeros
class Main {
    public static void main(String[] args) {
        final int[] numeros = {1, 2, 3};
        numeros = new int[3];
    }
}
