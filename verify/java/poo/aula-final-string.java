// verifica: java.poo.q26 e a aula static-e-final (String é final)
// espera: erro-de-compilacao
// erro-contem: cannot inherit from final String
class Main {
    public static void main(String[] args) {
    }
}

class MinhaString extends String {
}
