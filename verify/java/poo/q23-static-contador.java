// verifica: java.poo.q23, f13 e a aula static-e-final (atributo static compartilhado)
// saida:
// 3
// 2
class Main {
    public static void main(String[] args) {
        Contador a = new Contador();
        Contador b = new Contador();
        Contador c = new Contador();
        System.out.println(Contador.total);
        System.out.println(b.id);
    }
}

class Contador {
    static int total = 0;
    int id;

    Contador() {
        total++;
        id = total;
    }
}
