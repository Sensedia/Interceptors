/**
 * Customized Javascript interceptor to handle the error of a SOAP backend that uses 
 * the 'faultstring' tag and send a standardized response.
 * 
 * @version 1.0.0
 * @author time-snake@sensedia.com
 */
try {
    var body = $call.response.getBody().getString("utf-8");

    if (body.indexOf("faultstring") !== -1) {
        $call.tracer.trace('ERRO: Status Code: 500 - Message: Erro Interno do Servidor');
        $call.stopFlow = true;
        $call.decision.setAccept(false);
        $call.response = new com.sensedia.interceptor.externaljar.dto.ApiResponse();
        $call.response.setStatus(500);
        $call.response.setHeader("Content-Type", "application/json");
        $call.response.getBody().setString('', "utf-8");
    }
} catch (error) {
    $call.trace.tracer(error);
}