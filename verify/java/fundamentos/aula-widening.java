// verifica: a aula conversoes (widening automático)
// saida:
// 42
// 42.0
// 65
class Main {
    public static void main(String[] args) {
        int inteiro = 42;
        long grande = inteiro;
        double decimal = inteiro;
        char letra = 'A';
        int codigo = letra;
        System.out.println(grande);
        System.out.println(decimal);
        System.out.println(codigo);
    }
}
