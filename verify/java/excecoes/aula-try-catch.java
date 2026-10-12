// verifica: a aula try-catch-finally (o catch trata e o programa continua)
// saida:
// Não é um número: For input string: "12a"
// O programa continua.
class Main {
    public static void main(String[] args) {
        String texto = "12a";
        try {
            int numero = Integer.parseInt(texto);
            System.out.println("Número: " + numero);
        } catch (NumberFormatException e) {
            System.out.println("Não é um número: " + e.getMessage());
        }
        System.out.println("O programa continua.");
    }
}
