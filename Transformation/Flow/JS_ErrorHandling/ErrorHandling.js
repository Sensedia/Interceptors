/**
 * Flow transformation Custom Javascript Interceptor to create a standarized response
 * to return to client application according to the server response status code. 
 * For this interceptor the following status code were mapped: 400, 401, 403, 404, 500, 502 and 503
 * The standarized response can be updated but it's important to not remove the atribute "status"
 * 
 * @version 1.0.0
 * @author time-snake@sulamerica.com.br 
 */


/**
 * Send the response to client
 * <p>
 * This function send the standarized response body to the client application and stop
 * the flow.
 * <p>
 * 
 * @param {Object} json the standarized response body to be sent to the client application. 
 */
function sendResponseToClient(json) {
    $call.response.setHeader("Content-Type", "application/json");
    $call.response.setStatus(parseInt(json.status));
    $call.response.getBody().setString($json.stringify(json), "UTF-8");
    $call.stopFlow = true;
	$call.decision.setAccept(false);
    $call.tracer.trace("Erro na requisição com o status code " + json.status + 
    " e mensagem :" + json.details.message);
}

/**
 * Prepare the response body
 * <p>
 * This function creates and returns a standard object to be returned as a 
 * response body to the client application.
 * <p>
 * 
 * @param {String} result the result message summarizing the error to the client 
 * @param {Integer} statusCode the status code that represents the error 
 * @param {String} message the detailed message 
 * 
 * @returns {Object} the standard error response body
 */
function prepareResponseBody(result, statusCode, message) {
    return {
        "result": result,
        "status": String(statusCode),
        "details": {
            "message": message
        }
    };
}

/**
 * Main Flow
 * 
 * Change the API name in the string assigned to the result variable
 */
try {
    let httpStatusCode = $response.getStatus();

    let response = {};

    switch (httpStatusCode) {
        case 400:
            response = prepareResponseBody("Erro Bad Request na API {nome_api}", 
                400, 
                "O servidor não conseguiu processar a requisição devido a um erro na requisição do cliente");
            sendResponseToClient(response);
            break;
        case 401:
            response = prepareResponseBody("Erro Unauthorized na API {nome_api}", 
                401, 
                "O servidor recusou as credenciais fornecidas pelo cliente.");
            sendResponseToClient(response);
            break;
        case 403:
            response = prepareResponseBody("Erro Forbidden na API {nome_api}", 
                403, 
                "As credenciais do cliente não possuem permissão para acessar o servidor através do recurso.");
            sendResponseToClient(response);
            break;
        case 404:
            response = prepareResponseBody("Erro Not Found na API {nome_api}", 
                404, 
                "O servidor não encontrou uma representação válida do recurso solicitado ou não poderá expor o recurso existente.");
            sendResponseToClient(response);
            break;
        case 500:
            response = prepareResponseBody("Erro Internal Server Error na API {nome_api}", 
                500, 
                "Ocorreu um erro inesperado no servidor.");
            sendResponseToClient(response);
            break;
        case 502:
            response = prepareResponseBody("Erro Bad Gateway na API {nome_api}", 
                502, 
                "O servidor, enquanto atuando como gateway ou proxy, recebeu um resposta inválida de uma requisição a um outro servidor na tentativa de completar a requisição.");
            sendResponseToClient(response);
            break;
        case 503:
            response = prepareResponseBody("Erro Service Unavailable na API {nome_api}", 
                503, 
                "O servidor está temporariamente indisponível para tratar a requisição devido a uma sobrecarga temporária ou parada por manutenção programada.");
            sendResponseToClient(response);
            break;
        case 504:
            response = prepareResponseBody("Erro Gateway Timeout na API {nome_api}", 
                504, 
                "O servidor, enquanto atuando como gateway ou proxy, não recebeu um resposta atingindo um timeout de um servidor que provia uma requisição de modo a completar a requisição.");
            sendResponseToClient(response);
            break;
    }    
} catch (e) {
    $call.tracer.trace("Um erro ocorreu na linha " + e.lineNumber + " com a seguinte mensagem " + e.message);
    throw e;
}
