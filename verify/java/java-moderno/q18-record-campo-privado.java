// verifica: java.java-moderno.q18 e a aula records (o atributo do record é privado)
// espera: erro-de-compilacao
// erro-contem: x has private access in Ponto
class Main {
    public static void main(String[] args) {
        Ponto p = new Ponto(3, 4);
        p.x = 10;
    }
}

record Ponto(int x, int y) {}
