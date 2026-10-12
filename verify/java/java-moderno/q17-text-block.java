// verifica: java.java-moderno.q17 (a primeira linha é só "{")
// saida:
// {
// 1
class Main {
    public static void main(String[] args) {
        String json = """
            {
              "nome": "Ana"
            }
            """;
        String primeira = json.lines().findFirst().orElse("?");
        System.out.println(primeira);
        System.out.println(primeira.length());
    }
}
