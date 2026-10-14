// verifica: a aula static-e-final (constante static final acessada pelo nome da classe)
// saida:
// 3
// Central
class Main {
    public static void main(String[] args) {
        System.out.println(Config.MAX_TENTATIVAS);
        System.out.println(Config.NOME_DO_APP);
    }
}

class Config {
    static final int MAX_TENTATIVAS = 3;
    static final String NOME_DO_APP = "Central";
}
