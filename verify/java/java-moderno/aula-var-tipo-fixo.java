// verifica: a aula var-e-text-blocks (o tipo inferido não muda)
// espera: erro-de-compilacao
// erro-contem: incompatible types: String cannot be converted to int
class Main {
    public static void main(String[] args) {
        var idade = 30;
        idade = "trinta";
    }
}
