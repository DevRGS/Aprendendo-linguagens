// verifica: a aula stringbuilder (o laço com += monta o texto, com espaço no fim)
// saida:
// [1 2 3 ]
class Main {
    public static void main(String[] args) {
        String texto = "";
        for (int i = 1; i <= 3; i++) {
            texto += i + " ";
        }
        System.out.println("[" + texto + "]");
    }
}
