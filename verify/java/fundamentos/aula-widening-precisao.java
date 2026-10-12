// verifica: a aula conversoes e f07 (widening para float/double pode perder precisão)
// saida:
// 1.6777216E7
// 9007199254740992
class Main {
    public static void main(String[] args) {
        float f = 16777217;
        System.out.println(f);
        long grande = 9007199254740993L;
        double d = grande;
        System.out.println((long) d);
    }
}
