// verifica: f12 e a aula var-e-text-blocks (recuo removido, aspas sem escape, quebra de linha no fim)
// saida:
// {
//   "nome": "Ana",
//   "idade": 30
// }
// true true
class Main {
    public static void main(String[] args) {
        String json = """
            {
              "nome": "Ana",
              "idade": 30
            }
            """;
        System.out.print(json);
        System.out.println(json.startsWith("{") + " " + json.endsWith("\n"));
    }
}
