# RestrictAccessOperations

Custom interceptor do tipo <b>'fluxo'</b> responsável validar se um APP possui permissão para acessar uma operação específica, baseado em uma lista de operações pré-definidas. Esse interceptor deve ser adicionado na configuração de um plano de acesso para um determinado APP para consumir uma determinada API.

## Utilização:

1 - Adicione o interceptor no flow do plano de acesso.
<br>

2 - Altere os valores do array "ALLOWED_OPERATIONS" incluindo o excluindo da lista as operações que o APP irá consumir

```javascript
var ALLOWED_OPERATIONS = ["POST /oauth/access-token"];
```

<br>

3 - Salve as aterações.

<br>

4 - Finalize as alterações no fluxo do plano de acesso
