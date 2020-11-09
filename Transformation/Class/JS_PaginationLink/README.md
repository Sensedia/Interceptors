# PaginationLink
Custom interceptor do tipo <b>'classe'</b> para criar links HATEOAS de paginação para operações GET das APIs.
Esse interceptor deverá ser usado somente para o caso do backend não estar preparado para enviar no corpo da resposta os links de paginação.
## Utilização:
1 - Adicione o interceptor no flow de request ou response da operação GET.
<br>
2 - Adicione um custom interceptor no flow de response que será responsável por passar as informações vindo do backend e de request para o interceptor de paginação.
<br>
3 - A forma de chamada do interceptor é assim:
```javascript
var paginationLink = $call.contextVariables.get("paginationLink");

var obj = JSON.parse($call.response.getBody().getString('UTF-8'));

var requestedUrl = $call.request.getRequestedUrl().toString();
var links = paginationLink.createPaginationLinks(requested_url, offset, limit, total_records, order_fields);

obj.links_paginacao = links;
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

Nesse trecho do código, é chamado a operação do objeto <b>'paginationLink'</b> passando o offset, limit, total_records e order_fields.
```javascript
var links = paginationLink.createPaginationLinks(requested_url, offset, limit, total_records, order_fields);
```
<b>offset</b>: Variável que deve conter o índice do registro inicial a ser pesquisado. O valor deve vir no body do backend e caso o valor seja <b>NULL</b>, atribuir o valor <b>1</b> que significa a primeira página.

<br><b>relation</b>: Texto para definir a relação entre o recurso atual e o recurso alvo. Exemplos: 'Self', 'cartoes', 'depositar', 'aprovar'
<br><b>methods</b>: Lista contendo os HTTP Methods que poderão ser usados nos links HATEOAS.