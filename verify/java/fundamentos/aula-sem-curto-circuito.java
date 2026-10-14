// verifica: a aula operadores (com & o lado direito roda e estoura)
// espera: excecao NullPointerException
class Main {
    public static void main(String[] args) {
        String nome = null;
        if (nome != null & nome.length() > 3) {
            System.out.println("Nome longo");
        }
    }
}
