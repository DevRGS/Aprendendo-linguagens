// verifica: a aula condicionais (switch não aceita long)
// espera: erro-de-compilacao
class Main {
    public static void main(String[] args) {
        long codigo = 1L;
        switch (codigo) {
            case 1: System.out.println("um"); break;
        }
    }
}
