// verifica: java.excecoes.q01 e o destaque da aula excecoes-personalizadas (String não pode ser lançada)
// espera: erro-de-compilacao
// erro-contem: incompatible types: String cannot be converted to Throwable
class Main {
    public static void main(String[] args) {
        throw "erro";
    }
}
