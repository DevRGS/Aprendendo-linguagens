// verifica: a explicação de java.strings.q01 (String não tem método compare)
// espera: erro-de-compilacao
// erro-contem: cannot find symbol
class Main {
    public static void main(String[] args) {
        String a = "java";
        String b = "java";
        System.out.println(a.compare(b));
    }
}
