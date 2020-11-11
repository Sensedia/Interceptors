// {"feriados":["01-01-2021","25-12-2020","02-11-2020","15-11-2020"]}
var feriados = String( $call.environmentVariables.get('api_feriados') );
var jsonferiados = JSON.parse(feriados);

// coleta datahora do sistema 
const horas = new Date();
datahj = String( horas.toISOString().substr(0,10));
horahj = String( horas.toISOString().substr(11,8));

diautil = horas.getUTCDay();

function mensagemErro(strStatus, strResult, strMensagem, statusCode) {
    try{
        var jsonError = {};
        jsonError.result = String(strResult);
        jsonError.status = String(strStatus);
        jsonError.details = String(strMensagem);
        //$call.response = new com.sensedia.apigateway.services.ApiResponse();
        $call.response = new com.sensedia.interceptor.externaljar.dto.ApiResponse();
        $call.response.setStatus( statusCode );
        $call.response.getBody().setString(JSON.stringify(jsonError), "utf-8");
        $call.response.setHeader("Content-type", "application/json");
        $call.stopFlow = true;
        $call.decision.setAccept(false);
    } catch (ex) {
        $call.tracer.trace("Exception message => " + ex.message + " <= in line => " + ex.stack);
        $console.debug(">sensedia => Exception", ex);
        throw ex;
    }
}

function dropCall(msg){
    // se for para dropar a requisicao
    $call.stopFlow = true;
    $call.decision.setAccept(false);
    $call.response = new com.sensedia.interceptor.externaljar.dto.ApiResponse();
    $call.response.setStatus(400);
    $call.response.getBody().setString(
      '{"message": "Este recurso não pode ser executado neste momento devido a restrição de uso da Focus.\n'+msg+'"}', "utf-8"
    );
}

function ehFeriado(datastr){
    ret = false;
    for ( var key in jsonferiados ) {
        var value = jsonferiados[key];
		if (value == datastr ){
		   ret = true;
		}
    }
    return ret;
}


try {
    // se dias forem da semana 
    if (horas.getUTCDay() !== 0 && horas.getUTCDay() !== 6){
     // se no dia util da semana for feriado
       if (ehFeriado(datahj)){
        dropCall("Feriado");   
       }
    } else {
        // drop pq eh fim de semana (sabado ou domingo)
        dropCall("fim de semana");
    }

}catch (exception) {
    $call.tracer.trace("Exception message => " + exception.message + " <= in line => " + exception.stack);
    mensagemErro("ERROR", "on requests", "Exception ERROR", 400);
    throw exception;
}