# Cadastro e hash de senha com salt

Autenticação começa com um contrato de credenciais. O projeto aceita um nome simples de 3–30 caracteres e senha de 12–128 caracteres. Senhas não são normalizadas com trim nem convertidas para minúsculas: espaços e caixa podem fazer parte do segredo. O nome de usuário é normalizado para minúsculas.

**Não armazene a senha original.** Use uma derivação própria para senha, com custo e salt aleatório. O salt pode ser guardado com o hash; ele evita que senhas iguais produzam o mesmo resultado em contas distintas. Uma função rápida como SHA256 puro não substitui uma derivação de senha humana.

O projeto usa scrypt assíncrono do Node, sem adicionar uma biblioteca nativa de compilação ao laboratório. A configuração N32768/r8/p3 é uma das alternativas publicadas pela OWASP, com maxmem de 64 MiB e saída de 64 bytes. Argon2id é outra escolha recomendada pela OWASP quando disponível; cada algoritmo precisa de parâmetros e atualização planejados.

O custo protege contra tentativas em massa, mas também consome recursos do seu servidor. Há limite de autenticação e de derivações simultâneas. Async permite ao processo continuar atendendo enquanto o trabalho é realizado; não torna a operação sem custo.

No cadastro, a API valida, deriva e insere o registro. UNIQUE protege o nome inclusive se duas requisições competirem; a API transforma o conflito em 409. A resposta pública só inclui id e usuário, nunca hash, salt ou senha. Não registre credenciais em logs para ajudar a depurar.

## Material e preparação

[Baixe o projeto API de estudos](content/javascript/projetos/api-estudos.zip) e extraia a pasta. Os caminhos desta etapa partem de `api-estudos/`, onde fica package.json. O README do pacote contém instalação, comandos Windows/Bash e todo o contrato HTTP. A API roda no seu computador; o site da trilha apenas mostra o material.

## Código em contexto

Núcleo de src/security.mjs. randomBytes vem de node:crypto, scryptAsync é promisify(scrypt), e o chamador valida a senha. O arquivo completo limita a concorrência e converte o hash para hex.

```javascript
const sal = randomBytes(16).toString('hex');
const hash = await scryptAsync(password, sal, 64, {
  N: 32768, r: 8, p: 3, maxmem: 64 * 1024 * 1024,
});
```

## Prática guiada

Crie duas contas com a mesma senha de laboratório e leia a estrutura de passwordRecord, sem imprimir credenciais na API. Explique o papel do salt.

<details>
<summary>Conferir resultado e solução</summary>

Cada cadastro gera um salt aleatório, portanto o registro derivado não precisa coincidir. O salt não precisa ser um segredo separado; a senha original continua desconhecida pelo banco.

</details>

## Fontes

- [OWASP — armazenamento de senhas](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html)
- [Node — crypto](https://nodejs.org/api/crypto.html)
- [Express — práticas de segurança](https://expressjs.com/en/advanced/best-practice-security/)
