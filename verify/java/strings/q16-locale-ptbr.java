// verifica: java.strings.q16, f12 e a aula entrada-com-scanner (em pt-BR, 7.5 não é um double válido)
// espera: excecao InputMismatchException
import java.util.Locale;
import java.util.Scanner;

class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner("7.5");
        sc.useLocale(Locale.forLanguageTag("pt-BR"));
        System.out.println(sc.nextDouble());
    }
}
