# LinkHateoas
Custom interceptor do tipo <b>'classe'</b> para criar links de HATEOAS para operações GET das APIs.
Esse interceptor deverá ser usado somente para o caso do backend não estar preparado para enviar no corpo da resposta os links de HATEOAS.
## Utilização:
1 - Adicione o interceptor no flow de request ou response da operação GET.
<br>
2 - Adicione um custom interceptor que será responsável por passar o corpo vindo do backend para o interceptor de HATEOAS.
<br>
3 - A forma de chamada do interceptor é assim:
```javascript
var linkHateoasObject = $call.contextVariables.get("linkHateoas");

var obj = JSON.parse($call.response.getBody().getString('UTF-8'));

var requestedUrl = $call.request.getRequestedUrl().toString();
var link1 = linkHateoasObject.createLinks((requestedUrl + "/resource1", "relation1", ["POST","PUT"]);
var link2 = linkHateoasObject.createLinks(requestedUrl + "/resource2", "relation2", ["GET"]);

link1.push(link2[0]);
obj.links = link1;
```
### Explicação detalhada
```javascript
var linkHateoasObject = $call.contextVariables.get("linkHateoas");
```
Nesse trecho do código, é recuperada a instância do objeto <b>'linkHateoas'</b> que está na variável de contexto.

```javascript
var requestedUrl = $call.request.getRequestedUrl().toString();
```
Nesse trecho do código, é recuperada a URL de request que servirá como URL base da URL do link HATEOAS.
<br><b>OBS</b>: Caso a URL do link HATEOAS tenha que apontar para outra API, não deverá usar essa linha de código.

```javascript
var link1 = linkHateoasObject.createLinks((requestedUrl + "/resource1", "relation1", ["POST","PUT"]);
```
Nesse trecho do código, é chamado a operação do objeto <b>'linkHateoas'</b> passando o hRef, relation e methods.
<br><b>hRef</b>: URL de request concatenada com o recurso alvo.
<br><b>relation</b>: Texto para definir a relação entre o recurso atual e o recurso alvo. Exemplos: 'Self', 'cartoes', 'depositar', 'aprovar'
<br><b>methods</b>: Lista contendo os HTTP Methods que poderão ser usados nos links HATEOAS.