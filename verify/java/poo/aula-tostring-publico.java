// verifica: a aula heranca-e-polimorfismo (toString sobrescrito sem public diminui o acesso)
// espera: erro-de-compilacao
// erro-contem: attempting to assign weaker access privileges; was public
class Main {
    public static void main(String[] args) {
        System.out.println(new Gato());
    }
}

class Gato {
    @Override
    String toString() {
        return "Gato";
    }
}
