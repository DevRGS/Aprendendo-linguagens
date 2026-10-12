// verifica: a aula excecoes-personalizadas (a causa aparece no stack trace)
// espera: excecao ConfigInvalidaException
// erro-contem: Caused by: java.lang.NumberFormatException
class Main {
    public static void main(String[] args) {
        try {
            Integer.parseInt("abc");
        } catch (NumberFormatException e) {
            throw new ConfigInvalidaException("Porta inválida na configuração", e);
        }
    }
}

class ConfigInvalidaException extends RuntimeException {
    ConfigInvalidaException(String mensagem, Throwable causa) {
        super(mensagem, causa);
    }
}
