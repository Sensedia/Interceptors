/**
 * Custom Javascript Interceptor to create a standarized response
 * to return to client application according to the server response status code. 
 * For this interceptor the following status code were mapped: 400, 401, 403, 404, 500, 502 and 503
 * The standarized response can be updated but it's important to not remove the atribute "status"
 * <p/>
 * Remember to replace the API_NAME constant whenever you place this interceptor amidst your flow
 * 
 * @version 1.0.0
 * @author time-snake@sensedia.com
 */
const API_NAME = "REPLACE_HERE";
try {
    let httpStatusCode = $response.getStatus();
    switch (httpStatusCode) {
        case 400:
            _sendResponseToClient("Erro Bad Request na API " + API_NAME, httpStatusCode,
                "O servidor não conseguiu processar a requisição devido a um erro na requisição do cliente");
            break;
        case 401:
            _sendResponseToClient("Erro Unauthorized na API " + API_NAME, httpStatusCode,
                "O servidor recusou as credenciais fornecidas pelo cliente.");
            break;
        case 403:
            _sendResponseToClient("Erro Forbidden na API " + API_NAME, httpStatusCode,
                "As credenciais do cliente não possuem permissão para acessar o servidor através do recurso.");
            break;
        case 404:
            _sendResponseToClient("Erro Not Found na API " + API_NAME, httpStatusCode,
                "O servidor não encontrou uma representação válida do recurso solicitado ou não poderá expor o recurso existente.");
            break;
        case 500:
            _sendResponseToClient("Erro Internal Server Error na API " + API_NAME, httpStatusCode,
                "Ocorreu um erro inesperado no servidor.");
            break;
        case 502:
            _sendResponseToClient("Erro Bad Gateway na API " + API_NAME, httpStatusCode,
                "O servidor, enquanto atuando como gateway ou proxy, recebeu um resposta inválida de uma requisição a um outro servidor na tentativa de completar a requisição.");
            break;
        case 503:
            _sendResponseToClient("Erro Service Unavailable na API " + API_NAME, httpStatusCode,
                "O servidor está temporariamente indisponível para tratar a requisição devido a uma sobrecarga temporária ou parada por manutenção programada.");
            break;
        case 504:
            _sendResponseToClient("Erro Gateway Timeout na API " + API_NAME, httpStatusCode,
                "O servidor, enquanto atuando como gateway ou proxy, não recebeu um resposta atingindo um timeout de um servidor que provia uma requisição de modo a completar a requisição.");
            break;
    }    
} catch (e) {
    $call.tracer.trace("Um erro ocorreu na linha " + e.lineNumber + " com a seguinte mensagem " + e.message);
    throw e;
} 

/**
 * Send the response to client
 * <p/>
 * This function send the standarized response body to the client application and stop
 * the flow.
 * 
 * @param {String} result the result message summarizing the error to the client 
 * @param {Integer} statusCode the status code that represents the error 
 * @param {String} message the detailed message 
 */
function _sendResponseToClient(result, statusCode, message) {
    $call.tracer.trace("Erro na requisição com o status code " + json.status + " e mensagem :" + message);
    $call.response.getBody().setString(JSON.stringify({
        "result": result,
        "status": String(statusCode),
        "details": {
            "message": message
        }
    }), "UTF-8");
    $call.response.setHeader("Content-Type", "application/json");
    $call.response.setStatus(statusCode);
    $call.stopFlow = true;
	$call.decision.setAccept(false);
}
