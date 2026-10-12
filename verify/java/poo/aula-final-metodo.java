// verifica: f14 e a aula static-e-final (método final não é sobrescrito)
// espera: erro-de-compilacao
// erro-contem: overridden method is final
class Main {
    public static void main(String[] args) {
        System.out.println(new Filha().nome());
    }
}

class Mae {
    final String nome() {
        return "Mãe";
    }
}

class Filha extends Mae {
    String nome() {
        return "Filha";
    }
}
