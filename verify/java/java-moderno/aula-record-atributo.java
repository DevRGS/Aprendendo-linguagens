// verifica: a nota da aula records (record não declara atributo de instância extra)
// espera: erro-de-compilacao
// erro-contem: field declaration must be static
class Main {
    public static void main(String[] args) {
    }
}

record Ponto(int x, int y) {
    int z;
}
