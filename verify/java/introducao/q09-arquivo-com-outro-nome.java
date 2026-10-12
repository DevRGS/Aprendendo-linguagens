// verifica: java.introducao.q09 e f08 (classe pública num arquivo de outro nome)
// modo: javac
// espera: erro-de-compilacao
// erro-contem: class Ola is public, should be declared in a file named Ola.java
public class Ola {
    public static void main(String[] args) {
        System.out.println("Olá!");
    }
}
