// verifica: f11 e a aula var-e-text-blocks (var não vale para parâmetros de método)
// espera: erro-de-compilacao
class Main {
    static void mostrar(var x) {
        System.out.println(x);
    }

    public static void main(String[] args) {
        mostrar(1);
    }
}
