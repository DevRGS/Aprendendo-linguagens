// verifica: q17, f12 e a aula entrada-com-scanner (pt-BR lê 7,5; Locale.US lê 7.5)
// saida:
// 7.5
// 7.5
import java.util.Locale;
import java.util.Scanner;

class Main {
    public static void main(String[] args) {
        Scanner br = new Scanner("7,5");
        br.useLocale(Locale.forLanguageTag("pt-BR"));
        System.out.println(br.nextDouble());

        Scanner us = new Scanner("7.5");
        us.useLocale(Locale.US);
        System.out.println(us.nextDouble());
    }
}
