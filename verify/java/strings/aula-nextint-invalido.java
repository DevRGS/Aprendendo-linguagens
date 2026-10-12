// verifica: a aula entrada-com-scanner (nextInt com texto que não é número)
// espera: excecao InputMismatchException
import java.util.Scanner;

class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner("abc");
        System.out.println(sc.nextInt());
    }
}
