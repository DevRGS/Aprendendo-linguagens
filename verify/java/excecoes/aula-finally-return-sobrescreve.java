// verifica: o aviso da aula try-catch-finally (return no finally substitui o do try e some com a exceção)
// saida:
// 2
// 3
class Main {
    static int substitui() {
        try {
            return 1;
        } finally {
            return 2;
        }
    }

    static int engole() {
        try {
            throw new RuntimeException("sumiu");
        } finally {
            return 3;
        }
    }

    public static void main(String[] args) {
        System.out.println(substitui());
        System.out.println(engole());
    }
}
