// verifica: f09 e a tabela da aula stringbuilder (append, insert, reverse, deleteCharAt, length e encadeamento)
// saida:
// Java!
// Oi, Java!
// !avaJ ,iO
// avaJ ,iO
// 8
// avaJ ,iOab
class Main {
    public static void main(String[] args) {
        StringBuilder sb = new StringBuilder("Java");
        sb.append("!");
        System.out.println(sb);
        sb.insert(0, "Oi, ");
        System.out.println(sb);
        sb.reverse();
        System.out.println(sb);
        sb.deleteCharAt(0);
        System.out.println(sb);
        System.out.println(sb.length());
        String s = sb.append("a").append("b").toString();
        System.out.println(s);
    }
}
