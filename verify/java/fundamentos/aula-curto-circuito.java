// verifica: a aula operadores e q07 (com && o lado direito não roda)
// saida:
// seguro
class Main {
    public static void main(String[] args) {
        String nome = null;
        if (nome != null && nome.length() > 3) {
            System.out.println("Nome longo");
        }
        System.out.println("seguro");
    }
}
