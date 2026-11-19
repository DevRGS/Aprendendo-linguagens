"""Recrie os projetos TypeScript e PostgreSQL a partir da API SQLite distribuída."""
from pathlib import Path
from zipfile import ZIP_DEFLATED, ZipFile, ZipInfo

raiz = Path(__file__).resolve().parents[1]
base = raiz / 'content/javascript/projetos/api-estudos.zip'
arquivos_raiz = {'package.json', 'package-lock.json', 'tsconfig.json', '.env.example', 'migrar.mjs'}
sufixos = {'.ts', '.mjs', '.sql'}

with ZipFile(base) as original:
    inicial = {
        nome.removeprefix('api-estudos/'): original.read(nome)
        for nome in original.namelist()
        if nome.startswith('api-estudos/') and not nome.endswith('/')
    }

for trilha in ('typescript', 'postgresql'):
    fonte = raiz / 'verify' / trilha
    # As etapas avulsas de SQLite pertencem à versão inicial da API.
    solucao = {k: v for k, v in inicial.items() if k != 'README.md' and not k.startswith('etapas/')}
    for arquivo in (fonte / 'solucao').rglob('*'):
        relativo = arquivo.relative_to(fonte / 'solucao')
        if arquivo.is_symlink() or not arquivo.is_file():
            continue
        incluir = relativo.as_posix() in arquivos_raiz or (
            len(relativo.parts) == 2 and relativo.parts[0] in {'src', 'test', 'tipos', 'sql'}
            and arquivo.suffix in sufixos
        )
        if incluir:
            solucao[relativo.as_posix()] = arquivo.read_bytes()
    itens = {'README.md': (fonte / 'README-kit.md').read_bytes()}
    for pasta, arquivos in [('inicial', inicial), ('solucao', solucao)]:
        itens.update({f'{pasta}/{nome}': dados for nome, dados in arquivos.items()})
    destino = raiz / 'content' / trilha / 'projetos/projeto.zip'
    with ZipFile(destino, 'w') as pacote:
        for nome, dados in sorted(itens.items()):
            info = ZipInfo(nome, (2000, 1, 1, 0, 0, 0))
            pacote.writestr(info, dados, ZIP_DEFLATED)
    print(f'{destino.relative_to(raiz)}: {len(itens)} arquivos.')
