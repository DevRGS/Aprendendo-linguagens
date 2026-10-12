// verifica: q05, f04 e a tabela "Recortar e transformar" da aula metodos-de-string
// saida:
// Pro
// gramar
// OI
// oi
// [Oi]
// [Oi]
// bonono
// ababab
class Main {
    public static void main(String[] args) {
        System.out.println("Programar".substring(0, 3));
        System.out.println("Programar".substring(3));
        System.out.println("Oi".toUpperCase());
        System.out.println("Oi".toLowerCase());
        System.out.println("[" + "  Oi  ".trim() + "]");
        System.out.println("[" + "  Oi  ".strip() + "]");
        System.out.println("banana".replace("a", "o"));
        System.out.println("ab".repeat(3));
    }
}
