// verifica: q03, f01 e a aula string-imutavel (o método devolve uma String nova)
// saida:
// java
// JAVA
class Main {
    public static void main(String[] args) {
        String s = "java";
        s.toUpperCase();
        System.out.println(s);
        s = s.toUpperCase();
        System.out.println(s);
    }
}
