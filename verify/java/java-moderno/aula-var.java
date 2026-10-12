// verifica: f11 e a aula var-e-text-blocks (tipos inferidos e var no for)
// saida:
// 3
// 31
// ArrayList [9.5]
// {a=[1]}
// volta 0
// volta 1
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

class Main {
    public static void main(String[] args) {
        var nome = "Ana";
        var idade = 30;
        var notas = new ArrayList<Double>();
        var mapa = new HashMap<String, List<Integer>>();
        notas.add(9.5);
        mapa.put("a", List.of(1));
        System.out.println(nome.length());
        System.out.println(idade + 1);
        System.out.println(notas.getClass().getSimpleName() + " " + notas);
        System.out.println(mapa);
        for (var i = 0; i < 2; i++) {
            System.out.println("volta " + i);
        }
    }
}
