# Commons

Custom interceptor de **utilitários** do tipo **'classe'** com funções utilitárias que podem ser usadas em quaisquer API.

## Utilização:

1 - Adicione o interceptor no flow de request ou response de qualquer operação. Esse interceptor pode ser inclusive adicionado ao flow do **Resource** _(All)_ e **Operations** _(All)_
<br>
2 - Adicione um custom interceptor no flow de response ou request que será responsável pela validação ou manipulações do request ou response.
<br>
3 - Crie uma instância da classe Commons, recuperando a classe do contexto da chamada:

```javascript
var commons = $call.contextVariables.get("commons");
```

### Validar se uma string é vazia

A validação se uma string é vazia é feita como indica o exemplo abaixo:
<br>

```javascript
var str = "Essa string não é vazia";

var isStrEmpty = commons.isEmpty(str); // isStrEmpty = false
```

### Interromper o fluxo e retornar uma mensagem de erro

Para interromper o fluxo da requisição e retornar uma mensagem de erro para o client deve-se executar a seguinte instrução:
<br>

```javascript
commons.errorMessage(
  400,
  "Bad Request",
  "O servidor não conseguiu ou não irá conseguir processar a requisição devido ao um erro na requisição do client"
);
```

### Validar o corpo de uma requisição

A validação do corpo de uma requisição é feita conforme o exemplo abaixo:
<br>

```javascript
var bodyValidator = {
  nome: true,
  email: true,
  endereco: true,
};

var isBodyValid = commons.validateBody(bodyValidator);
```

### Validar query parameters obrigatórios

Para verificar se a requisição possui os query parameters obrigatórios, siga o exemplo abaixo:
<br>

```javascript
var queryParamValidator = ["local", "data_nascimento"];

var isQueryParamValid = commons.validateQueryParams(queryParamValidator);
```

### Validar headers obrigatórios

A validação de headers obrigatórios é feita como o exemplo abaixo:
<br>

```javascript
var headersValidator = ["authorization", "accept"];

var isHeadersValid = commons.validateHeaders(headersValidator);
```

### Substituir parâmetros na URI de destino da Operação

Para substituir valores na URI de destino da operação, é necessário criar um objeto contendo o _"de-para"_ dos parametros a serem substituidos, como mostra o exemplo abaixo:
<br>

```javascript
var destinationUriParams = {
  "id-usuario": "e036b8bb-a0c5-4ae7-b8c3-ac840f5da7f1"
  "codigo-produto": "prod-001"
};

commons.replaceInDestination(destinationUriParams);
```

### Concatenar conteúdo na URI de destino na Operação

É possível acrescentar conteúdo na URI de destino da operação, como segue:
<br>

```javascript
var content = "pedidos/ped-1001/produtos";

commons.concatInDestination(content);
```
