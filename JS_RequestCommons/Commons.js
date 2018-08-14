try {
    /* 
     * loading utils class into context variables
     * by adding this interceptor at the head of the request flow,
     * it will be available for use on the subsequent interceptors.
     */
    var obj = new Utils();
    $call.contextVariables.put("utils", obj);
} catch(ex) {
    $call.tracer.trace(ex);
}

/**
 * Class de utilitários.
 * <p>
 * Utilizada para prover algumas funções que são utilizadas por diversas APIs.
 * 
 * @version 1.0
 * @author gabriel.nascimento@sensedia
 */
function Utils() {
    /**
     * Verifica se uma dada string é vazia
     * <p>
     * Essa function faz a verificação de null, undefined, string vazia e string com tamanho igual a 0
     * 
     * @params {string} str o objeto a ser verificado
     * @return {boolean} uma flag que indica se a string é vazia
     */
    this.isEmpty = function(str) {
        return (str == null || str == undefined || str == '' || str.length == 0);
    };

    /**
     * Função para lançar uma mensagem de erro em um fluxo de requisição.
     * <p>
     * Essa função para o fluxo atual de execução da requisição e retorna uma 
     * mensagem de erro logo em seguida.
     * <p>
     * A mensagem retornada tem o seguinte formato: </br>
     * {
     *  "result": "O rsultado da operação.",
     *  "status": "ERROR",
     *  "details": "O detalhamento do erro ocorrido."
     * }
     * 
     * @param {integer} status o status de erro.
     * @param {string} result o resultado da operação com uma breve descrição do erro.
     * @param {@string} message a mensagem detalhada do erro ocorrido.
     */
    this.errorMessage = function(status, result, message) {
    	$call.response = new com.sensedia.apigateway.services.ApiResponse();
    	$call.response.setStatus(status);
    	$call.response.getBody().setString(JSON.stringify({
    	    "result": result,
    	    "status": "ERROR",
    	    "details": message
    	}), "utf-8");
    	$call.response.setHeader("Content-type", "application/json");
    	$call.stopFlow = true;
    	$call.decision.setAccept(false);
    };

    /**
     * Valida o body da request baseado em um validador
     * <p>
     * Caso a request não seja válida, um erro 400 irá interromper
     * o fluxo da requisição para alertar que houve um erro de 
     * Invalid Request
     * 
     * @param validator o objeto validador
     * @returns uma flag dizendo se o body da request é válido
     */
    this.validateBody = function(validator) {
        var isValid = true;
        let obj = $call.request.getBody().getString("utf-8");
        if(this.isEmpty(obj)) {
            this.errorMessage(400, "Dados da requisição inválidos", 
                "O body da requisição é mandatório");
        } else {
            obj = JSON.parse(obj);
            let invalidParams = this.getInvalidBodyProps(obj, validator);
            isValid = invalidParams.length === 0;
            if(!isValid) {
                this.errorMessage(400, "Dados da requisição inválidos",  
                    "As seguintes propriedades são obrigatórias no body da requisição: " 
                    + invalidParams.join(", "));         
            }
        }
        return isValid;
    };

    /**
     * Valida os query params da request baseado em um validador
     * <p>
     * Caso a request não seja válida, um erro 400 irá interromper
     * o fluxo da requisição para alertar que houve um erro de 
     * Invalid Request
     * 
     * @param validator o objeto validador
     * @returns uma flag dizendo se os query params da request são válidos
     */
    this.validateQueryParams = function(validator) {
        let params = $request.getAllQueryParams();
        let invalidParams = this.getInvalidQueryParams(params, validator);
        let isValid = invalidParams.length === 0;
        if(!isValid) {
            this.errorMessage(400, "Dados da requisição inválidos",  
                "Os seguintes query parameters são obrigatórias na requisição: " 
                + invalidParams.join(", "));         
        }
        return isValid;
    };

    /**
     * Recupera todos as propriedade inválidas do body da request.
     * <p>
     * Caso o objeto alvo não possua uma propriedade do objeto validador,
     * o nome da propriedade não presente é adicionado em uma lista e ao final
     * retornado por essa function
     * 
     * @param {object} validator o objeto validador
     * @return {array} um array com os nomes das propriedades não presentes
     */
    this.getInvalidBodyProps = function(obj, validator) {
        var problems = [];
        // checking each one of the validator's properties since 
        // every one of them is required on the target object
        for(var prop in validator) {
            // checking if the current property is an object
            if(_isObject(validator[prop])) {
                if(obj[prop]) {
                    // checking the inner object recursively
                    var innerObj = this.getInvalidBodyProps(obj[prop], validator[prop]);
                    
                    // adding the name of the parent property to each one 
                    // of the missing properties on the inner object and
                    // concatenating the returned array with the current 
                    // array of missing fields
                    innerObj = innerObj.map(function(i) {return prop + '.' + i});
                    problems = problems.concat(innerObj);
                } else {
                    // in case the parent property was not found, we should 
                    // add this property to the missing's array
                    problems.push(prop);
                }
            } else {
                // in case the target object does not have the validator's
                // property, we should put the name of this property on the
                // missing's array
                if(obj && obj[prop] === undefined) {
                    problems.push(prop);
                }
            }
        }
        return problems;
    };

    /**
     * Recupera todos os query parameters inválidos da request.
     * <p>
     * Um conjunto de query params só é considerado válido se
     * todos os valores presentes no array de validação estiverem
     * presentes em seu mapa. Os valores adjacentes não são considerados.
     * 
     * @param validator {array} array com os query params obrigatórios
     * @return {array} um array com os parâmetros inválidos
     */
    this.getInvalidQueryParams = function(params, validator) {
        var self = this;
        return validator.filter(function(val) {
            return self.isEmpty(params.get(val));
        });
    };

    /**
     * Verifica se um dado objeto é um Object
     * 
     * @param obj {?} o objeto a ser verificado
     * @returns {boolean} uma flag que indica se o objeto é um Object
     */
    function _isObject(obj) {
        return Object.prototype.toString.call(obj) === '[object Object]';
    }
}
