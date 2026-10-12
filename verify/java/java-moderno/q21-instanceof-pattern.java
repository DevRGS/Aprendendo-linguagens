// verifica: java.java-moderno.q21 (a variável do padrão vale depois do &&)
// saida:
// JAVA
class Main {
    public static void main(String[] args) {
        Object obj = "Java";
        if (obj instanceof String s && s.length() > 3) {
            System.out.println(s.toUpperCase());
        }
    }
}
