// verifica: java.strings.q02, f02 e a aula string-imutavel (== compara referências; equals, conteúdo)
// saida:
// false
// true
class Main {
    public static void main(String[] args) {
        String a = "java";
        String b = new String("java");
        System.out.println(a == b);
        System.out.println(a.equals(b));
    }
}
