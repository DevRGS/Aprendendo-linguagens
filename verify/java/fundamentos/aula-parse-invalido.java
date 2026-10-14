// verifica: a aula conversoes e f08 (texto inválido)
// espera: excecao NumberFormatException
class Main {
    public static void main(String[] args) {
        Integer.parseInt("abc");
    }
}
