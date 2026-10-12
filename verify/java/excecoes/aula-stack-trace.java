// verifica: f01, f03 e a aula o-que-sao (exceção não tratada mostra o nome e a mensagem)
// espera: excecao ArithmeticException
// erro-contem: / by zero
class Main {
    public static void main(String[] args) {
        System.out.println(dividir(10, 0));
    }

    static int dividir(int a, int b) {
        return a / b;
    }
}
