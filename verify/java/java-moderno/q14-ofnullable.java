// verifica: java.java-moderno.q14 e f10 (ofNullable aceita null e devolve vazio)
// saida:
// true
// Optional[Zé]
import java.util.Optional;

class Main {
    public static void main(String[] args) {
        String talvezNulo = null;
        Optional<String> apelido = Optional.ofNullable(talvezNulo);
        System.out.println(apelido.isEmpty());
        System.out.println(Optional.ofNullable("Zé"));
    }
}
