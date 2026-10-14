// verifica: f11 e a aula var-e-text-blocks (var sem valor inicial não compila)
// espera: erro-de-compilacao
// erro-contem: cannot use 'var' on variable without initializer
class Main {
    public static void main(String[] args) {
        var x;
        x = 1;
    }
}
