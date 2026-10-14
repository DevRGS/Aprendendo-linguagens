// verifica: a nota da aula metodos-de-string (trim não remove o em space; strip remove)
// saida:
// 4
// 2
class Main {
    public static void main(String[] args) {
        String texto = " Oi ";
        System.out.println(texto.trim().length());
        System.out.println(texto.strip().length());
    }
}
