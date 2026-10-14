// verifica: a dica da aula string-imutavel (equals chamado numa variável null)
// espera: excecao NullPointerException
class Main {
    public static void main(String[] args) {
        String resposta = null;
        System.out.println(resposta.equals("sim"));
    }
}
