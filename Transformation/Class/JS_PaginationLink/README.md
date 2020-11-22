# PaginationLink
Custom interceptor do tipo <b>'classe'</b> para criar links HATEOAS de paginação para operações GET das APIs.
<br/>Este interceptor deverá ser usado somente para o caso do backend <b>não estar preparado</b> para enviar no corpo da resposta os links de paginação.

## Utilização:
1 - Adicione o interceptor no flow de response da operação GET.
<br>
2 - Adicione um CustomJS interceptor no flow de response que será responsável por passar as informações vindas do backend de acordo com o exemplo a seguir:

```javascript
try {
    var paginationLink = $call.contextVariables.get("paginationLink");

    var reponseObj = JSON.parse($call.response.getBody().getString('UTF-8'));
    var requestedUrl = $call.request.getRequestedUrl().toString();
    var links = paginationLink.createPaginationLinks(requestedUrl, first_page_value, offset, limit, total_records, query_parameters);

    reponseObj.links_paginacao = links;
    $call.response.getBody().setString(JSON.stringify(reponseObj), "UTF-8");
} catch (e) {
    $call.tracer.trace("Um erro ocorreu");
    throw e;
}
```

### Explicação detalhada
Nesse trecho do código, é recuperada a instância do objeto <b>'paginationLink'</b> que está na variável de contexto.
```javascript
var paginationLink = $call.contextVariables.get("paginationLink");
```

Nesse trecho do código, é recuperada a URL de request que servirá como URL base da URL do link HATEOAS de paginação.
```javascript
var requestedUrl = $call.request.getRequestedUrl().toString();
```

Nesse trecho do código, é chamado a operação do objeto <b>'paginationLink'</b> passando o offset, limit, total_records e query_parameters.
```javascript
var links = paginationLink.createPaginationLinks(requestedUrl, first_page_value, offset, limit, total_records, query_parameters);
```

<b>first_page_value</b>: Variável que deve conter o índice da primeira página. Deverá ser <b>0</b> ou <b>1</b>.
<b>offset</b>: Variável que deve conter o índice do registro inicial a ser pesquisado. O valor deve vir no body do backend e caso o valor seja <b>NULL</b>, atribuir o valor <b>0</b> ou <b>1</b> para setar a primeira página.
<br><b>limit</b>: Variável que define o número total de registros a serem retornados em cada página.
<br><b>total_records</b>: Número total de registros retornados pelo back-end.
<br><b>query_parameters</b>: Usado para os parâmetros de consulta serem adicionados aos links de paginação. Não deve ser passado o caracter <b>?</b>. <b>opcional</b>.