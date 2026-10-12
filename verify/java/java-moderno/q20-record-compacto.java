// verifica: java.java-moderno.q20 e a aula records (o construtor compacto valida)
// espera: excecao IllegalArgumentException
// erro-contem: idade negativa: -1
class Main {
    public static void main(String[] args) {
        System.out.println(new Idade(30));
        new Idade(-1);
    }
}

record Idade(int valor) {
    Idade {
        if (valor < 0) {
            throw new IllegalArgumentException("idade negativa: " + valor);
        }
    }
}
