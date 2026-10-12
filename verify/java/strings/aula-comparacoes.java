// verifica: q04, f03 e a aula string-imutavel (equalsIgnoreCase e compareTo)
// saida:
// true
// true
// 0
class Main {
    public static void main(String[] args) {
        System.out.println("Java".equalsIgnoreCase("JAVA"));
        System.out.println("abc".compareTo("abd") < 0);
        System.out.println("abc".compareTo("abc"));
    }
}
