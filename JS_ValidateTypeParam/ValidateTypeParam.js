/**
 * Função para validar os tipos básicos do JavaScript
 * @version 1.0
 * @author allan.barbosa@sensedia
 */
function validateType (type, data) {
    try {
        switch (type) {
            case 'number':
                var number = parseInt(data);
                return (typeof(number) == "number" && !isNaN(number)) ? true : false;
            
            case 'date':
                var dtSplit = data.split('-');
                var date = new Date(dtSplit[0], dtSplit[1] - 1, dtSplit[2]);
                return (date instanceof Date && date != 'Invalid Date') ? true : false;
            
            case 'boolean':
                return (data == 'true' || data == 'false') ? true : false;
            
            default:
                return false;
        }
    } catch (e) {
        $call.tracer.trace('# ERROR: ' + e);
        return false;
    }
}

// Obtem os parâmetros que serão validados
var paramX = $request.getQueryParam("paramX");
var paramY = $request.getQueryParam("paramY");

var valid = validateType('date', paramX);
// Quando validar 2 ou mais parâmetros, deve-se comparar o resultado da função "validateType" com a variável "valid"
valid = valid && validateType('number', paramY);

// Se houver algum parâmetro inválido aborta o request e retorna 400
if(!valid) {
    $call.stopFlow = true;
    $call.decision.setAccept(false);
    $call.response = new com.sensedia.apigateway.services.ApiResponse();
    $call.response.setStatus(400);
}