// verifica: java.poo.q22, f12 e a aula abstratas-e-interfaces (default, static, private e constante numa interface)
// saida:
// Olá, ANA
// Olá, mundo
class Main {
    public static void main(String[] args) {
        System.out.println(new Visitante().saudar());
        System.out.println(Saudacao.saudacaoPadrao());
    }
}

interface Saudacao {
    String PREFIXO = "Olá, ";

    String nome();

    default String saudar() {
        return PREFIXO + formatar(nome());
    }

    static String saudacaoPadrao() {
        return PREFIXO + "mundo";
    }

    private String formatar(String s) {
        return s.toUpperCase();
    }
}

class Visitante implements Saudacao {
    @Override
    public String nome() {
        return "Ana";
    }
}
