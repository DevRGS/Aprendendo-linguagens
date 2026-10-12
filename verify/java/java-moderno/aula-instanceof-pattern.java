// verifica: f14 e a aula switch-e-pattern-matching (instanceof antigo e com padrão)
// saida:
// 4
// 4
// JAVA
class Main {
    public static void main(String[] args) {
        Object obj = "Java";
        if (obj instanceof String) {
            String s = (String) obj;
            System.out.println(s.length());
        }
        if (obj instanceof String s) {
            System.out.println(s.length());
        }
        if (obj instanceof String s && s.length() > 3) {
            System.out.println(s.toUpperCase());
        }
    }
}
