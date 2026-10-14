// verifica: java.excecoes.q10 e f07 (exceção unchecked não precisa de throws)
// saida:
// valor aceito
// valor negativo
class Main {
    static void validar(int valor) {
        if (valor < 0) {
            throw new IllegalArgumentException("valor negativo");
        }
        System.out.println("valor aceito");
    }

    public static void main(String[] args) {
        validar(5);
        try {
            validar(-1);
        } catch (IllegalArgumentException e) {
            System.out.println(e.getMessage());
        }
    }
}
