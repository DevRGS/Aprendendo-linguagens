// verifica: a tabela da aula encapsulamento e a aula heranca-e-polimorfismo (subclasse não enxerga o que é private)
// espera: erro-de-compilacao
// erro-contem: nome has private access in Animal
class Main {
    public static void main(String[] args) {
        System.out.println(new Cachorro().descrever());
    }
}

class Animal {
    private String nome = "Rex";
}

class Cachorro extends Animal {
    String descrever() {
        return nome;
    }
}
