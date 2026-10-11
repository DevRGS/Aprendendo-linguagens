// verifica: java.fundamentos.q19 e a aula conversoes
// saida:
// -126
// -126
class Main {
    public static void main(String[] args) {
        System.out.println((byte) 130);
        int valor = 130;
        byte pequeno = (byte) valor;
        System.out.println(pequeno);
    }
}
