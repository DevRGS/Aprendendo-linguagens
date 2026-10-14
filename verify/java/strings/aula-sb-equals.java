// verifica: a nota da aula stringbuilder (StringBuilder não sobrescreve equals)
// saida:
// false
// true
class Main {
    public static void main(String[] args) {
        StringBuilder sb1 = new StringBuilder("a");
        StringBuilder sb2 = new StringBuilder("a");
        System.out.println(sb1.equals(sb2));
        System.out.println(sb1.toString().equals(sb2.toString()));
    }
}
