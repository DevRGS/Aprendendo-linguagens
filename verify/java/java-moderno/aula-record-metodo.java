// verifica: a aula records (método, método static e interface num record)
// saida:
// 6.0
// 16.0
class Main {
    public static void main(String[] args) {
        System.out.println(new Retangulo(2, 3).area());
        ComArea q = Retangulo.quadrado(4);
        System.out.println(q.area());
    }
}

interface ComArea {
    double area();
}

record Retangulo(double largura, double altura) implements ComArea {
    static Retangulo quadrado(double lado) {
        return new Retangulo(lado, lado);
    }

    @Override
    public double area() {
        return largura * altura;
    }
}
