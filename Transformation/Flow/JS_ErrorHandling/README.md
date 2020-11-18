# ErrorHandling

Custom interceptor de **'transformação'** do tipo **'fluxo'** responsável por gerar um response padrão para a aplicação client, dependendo do status code da resposta do servidor de aplicação. Esse interceptor é um interceptor de response que trata as os seguintes status codes, inclusos na **IEFT-RFC**:

- 400 - Bad Request
- 401 - Unauthorized
- 403 - Forbidden
- 404 - Not Found
- 500 - Internal Server Error
- 502 - Bad Gateway
- 503 - Service Unavailable
- 504 - Gateway Timeout

## Utilização:

1 - Adicione o interceptor no flow de **response** no _Resources_ _"All"_ - _Operations_ _"All"_ ou diretamente na operação que se deseja tratar.
<br>

2 - Altere o nome da API, identificada no script como **'{nome_api}'**, no atributo de _result_ do objeto do response, que é passado como primeiro parâmetro na função **prepareResponseBody**:

```javascript
response = prepareResponseBody(
  "Erro Bad Request na API {nome_api}",
  400,
  "O servidor não conseguiu processar a requisição devido a um erro na requisição do cliente"
);
sendResponseToClient(response);
```

<br>

3 - Caso deseje alterar o padrão do response body, alterar o retorno da função prepareResponseBody. <b>ATENÇÃO</b> não altere o atributo <i>"status"</i> do objeto de response, pois ele é usado na função sendResponseToClient.

```javascript
function prepareResponseBody(result, statusCode, message) {
    return {
        "result": result,
        "status": String(statusCode),
        "details": {
            "message": message
        }
    };

```

<br>

4 - Salve as alterações no interceptor

<br>

5 - Salve as alterções no fluxo

<br>

6 - Salve as alterações na API
