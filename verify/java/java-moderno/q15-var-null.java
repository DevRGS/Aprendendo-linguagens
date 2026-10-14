// verifica: java.java-moderno.q15, f11 e a aula var-e-text-blocks (var x = null não compila)
// espera: erro-de-compilacao
// erro-contem: variable initializer is 'null'
class Main {
    public static void main(String[] args) {
        var x = null;
    }
}
