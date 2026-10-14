// verifica: java.java-moderno.q18 e f13 (o record não gera getX)
// espera: erro-de-compilacao
// erro-contem: cannot find symbol
class Main {
    public static void main(String[] args) {
        Ponto p = new Ponto(3, 4);
        System.out.println(p.getX());
    }
}

record Ponto(int x, int y) {}
