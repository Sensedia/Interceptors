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

2 - Altere, logo no início do script, o valor da constante **'API_NAME'** pelo nome da API que está sendo tratada:
```javascript
const API_NAME = "REPLACE_HERE";
```

3 - Caso deseje alterar o padrão do response body, modifique a seguinte linha da função _sendResponseToClient.
```javascript
$call.response.getBody().setString(JSON.stringify({
    "result": result,
    "status": String(statusCode),
    "details": {
        "message": message
    }
}), "UTF-8");
```

4 - Salve as alterações no interceptor

5 - Salve as alterções no fluxo

6 - Salve as alterações na API
