// verifica: o aviso da aula string-imutavel (literais iguais são reaproveitados; textos montados são novos)
// saida:
// true
// false
// true
class Main {
    public static void main(String[] args) {
        String a = "java";
        String b = "java";
        System.out.println(a == b);
        String parte = "ja";
        String c = parte + "va";
        System.out.println(a == c);
        System.out.println(a.equals(c));
    }
}
