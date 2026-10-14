// verifica: q19, f13 e a aula records (acesso, toString, equals, hashCode e "mudar" criando outro)
// saida:
// 3
// Ponto[x=3, y=4]
// true
// true
// Ponto[x=10, y=4]
class Main {
    public static void main(String[] args) {
        Ponto p = new Ponto(3, 4);
        System.out.println(p.x());
        System.out.println(p);
        System.out.println(p.equals(new Ponto(3, 4)));
        System.out.println(p.hashCode() == new Ponto(3, 4).hashCode());
        System.out.println(new Ponto(10, p.y()));
    }
}

record Ponto(int x, int y) {}
