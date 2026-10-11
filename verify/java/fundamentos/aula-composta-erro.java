// verifica: a aula operadores (x = x + 2.5 não compila com int)
// espera: erro-de-compilacao
class Main {
    public static void main(String[] args) {
        int x = 10;
        x = x + 2.5;
    }
}
