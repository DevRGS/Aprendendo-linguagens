// verifica: a aula metodos-de-string (format segue o idioma; Locale explícito; formatted no Java 15+; %d)
// saida:
// Ana tirou 8,46
// Ana tirou 8.46
// 8.46
// Ana tirou 8.46
// 3 itens
import java.util.Locale;

class Main {
    public static void main(String[] args) {
        System.out.println(String.format(Locale.forLanguageTag("pt-BR"), "%s tirou %.2f", "Ana", 8.456));
        System.out.println(String.format(Locale.US, "%s tirou %.2f", "Ana", 8.456));
        System.out.println(String.format(Locale.US, "%.2f", 8.456));
        Locale.setDefault(Locale.US);
        System.out.println("%s tirou %.2f".formatted("Ana", 8.456));
        System.out.println(String.format("%d itens", 3));
    }
}
