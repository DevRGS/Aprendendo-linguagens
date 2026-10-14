// verifica: java.excecoes.q18 (as quatro respostas aceitas funcionam no try-with-resources)
// saida:
// fechou 1
// fechou 2
// fechou 3
// fechou 4
import java.io.Closeable;

class Main {
    public static void main(String[] args) {
        try (Conexao1 c = new Conexao1()) {
        }
        try (Conexao2 c = new Conexao2()) {
        }
        try (Conexao3 c = new Conexao3()) {
        }
        try (Conexao4 c = new Conexao4()) {
        }
    }
}

class Conexao1 implements AutoCloseable {
    public void close() { System.out.println("fechou 1"); }
}

class Conexao2 implements Closeable {
    public void close() { System.out.println("fechou 2"); }
}

class Conexao3 implements java.lang.AutoCloseable {
    public void close() { System.out.println("fechou 3"); }
}

class Conexao4 implements java.io.Closeable {
    public void close() { System.out.println("fechou 4"); }
}
