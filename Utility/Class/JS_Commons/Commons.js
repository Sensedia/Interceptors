/**
* loading Commons class into context variables
* by adding this interceptor at the head of the request flow,
* it will be available for use on the subsequent interceptors.
*/
try {
    var obj = new Commons();
    $call.contextVariables.put("commons", obj);
} catch(ex) {
    $call.tracer.trace(ex);
}

/**
 * Commons Utility Class.
 * <p>
 * This class provides commons utilities function that can be used by any APIs.
 * This interceptor can be changed or updated according to specific API's requirements.
 * 
 * @version 1.0
 * @author time-snake@sensedia.com
 */
function Commons() {
    /**
     * Checks if a given string is empty
     * <p>
     * This function verifies if a given string is null, undefined, empty or its length is equals to 0.
     * 
     * @params {string} str the object to be checked
     * @return {boolean} flag indicating if the string is empty.
     */
    this.isEmpty = function(str) {
        return (str == null || str == undefined || str == '' || str.length == 0);
    };

    /**
     * This function throwns an error message at a request flow.
     * <p>
     * This function stops the actual execution flow of an request and returns 
     * an error message to the client.
     * <p>
     * The return message has the following format: </br>
     * {
     *  "result": "The request operation result.",
     *  "status": "ERROR",
     *  "details": "A detailed message describing the error."
     * }
     * 
     * @param {integer} status the response status code.
     * @param {string} result the request operation result with a summary of the description.
     * @param {string} message the detailed message describing the error.
     */
    this.errorMessage = function(status, result, message) {
    	$call.response = new com.sensedia.interceptor.externaljar.dto.ApiResponse();
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
     * Validates the request body according to a validator object.
     * <p>
     * If the request body is invalid, the request flow will be stopped 
     * and an Bad Request error with status code 400 will be thrown 
     * as response to client.
     * 
     * @param {object} validator the validator object
     * @return {boolean} flag indicating if the request body is valid
     * 
     * @throws Status Code: 400
     */
    this.validateBody = function(validator) {
        var isValid = true;
        let obj = $call.request.getBody().getString("utf-8");
        if(this.isEmpty(obj)) {
            this.errorMessage(400, "Dados da requisição inválidos", 
                "O body da requisição é mandatório");
        } else {
            obj = JSON.parse(obj);
            let invalidParams = this._getInvalidBodyProps(obj, validator);
            isValid = invalidParams.length === 0;
            if(!isValid) {
                this.errorMessage(400, "Dados da requisição inválidos",  
                    "As seguintes propriedades são obrigatórias no body da requisição: " + 
                    invalidParams.join(", "));         
            }
        }
        return isValid;
    };

    /**
     * Validates the request query params according to a validator array
     * <p>
     * If the query params are invalid according to a validator array, 
     * the request will be invalid and a Bad Request error with status code 400 
     * will stop the request flow and a response message will be sent to the client.
     * 
     * @param {array} validator the validator array
     * @return {boolean} flag indicating if the query params are valid
     * 
     * @throws Status Code: 400
     */
    this.validateQueryParams = function(validator) {
        let params = $request.getAllQueryParams();
        let invalidParams = this._getInvalidQueryParams(params, validator);
        let isValid = invalidParams.length === 0;
        if(!isValid) {
            this.errorMessage(400, "Dados da requisição inválidos",  
                "Os seguintes query parameters são obrigatórias na requisição: " + 
                invalidParams.join(", "));         
        }
        return isValid;
    };

    /**
     * Validates the request headers according to a validator array
     * <p>
     * If the request headers are invalid according to a validator array, 
     * the request will be invalid and a Bad Request error with status code 400 
     * will stop the request flow and a response message will be sent to the client.
     * 
     * @param {array} validator the validator array
     * @return {boolean} flag indicating if the request headers are valid
     * 
     * @throws Status Code: 400
     */
    this.validateHeaders = function(validator) {
        let headers = $call.request.getAllHeaders();
        let invalidHeaders = this._getInvalidHeaders(headers, validator);
        let isValid = invalidHeaders.length === 0;
        if(!isValid) {
            this.errorMessage(400, "Dados da requisição inválidos",  
                "Os seguintes headers são obrigatórias na requisição: " + 
                invalidHeaders.join(", "));         
        }
        return isValid;
    };

    /**
     * Returns all the invalid properties in the request body.
     * <p>
     * If the request object does not contain all the properties defined in 
     * the validator object, this function returns a list containing 
     * the missing properties as string.
     * 
     * @param {object} validator the validator object
     * @return {array} an array of strings containing the list of names 
     * of the missing properties
     */
    this._getInvalidBodyProps = function(obj, validator) {
        var problems = [];
        // checking each one of the validator's properties since 
        // every one of them is required on the target object
        for(var prop in validator) {
            // checking if the current property is an object
            if(_isObject(validator[prop])) {
                if(obj[prop]) {
                    // checking the inner object recursively
                    var innerObj = this._getInvalidBodyProps(obj[prop], validator[prop]);
                    
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
     * Returns all request invalid query parameters
     * <p>
     * If the request query parameters map does not contain all the properties defined in 
     * the validator array with all required query parameters, this function returns a 
     * list containing the missing properties as string.
     * 
     * @param {object} params a map containing all the request query parameters
     * @param {array} validator array containing all the required query parameters
     * @return {array} an array of strings containing the list of names 
     * of the missing properties
     */
    this._getInvalidQueryParams = function(params, validator) {
        var self = this;
        return validator.filter(function(val) {
            return self.isEmpty(params.get(val));
        });
    };

    /**
     * Returns all request invalid headers
     * <p>
     * 
     * If the request headers map does not contain all the properties defined in 
     * the validator array with all required headers, this function returns a 
     * list containing the missing properties as string.
     * 
     * @param {object} headers a map containing all the request headers
     * @param {array} validator array containing all the required headers
     * @return {array} an array of strings containing the list of names 
     * of the missing properties
     */
    this._getInvalidHeaders = function(headers, validator) {
        var self = this;
        return validator.filter(function(val) {
            return self.isEmpty(headers.get(val.toLowerCase()));
        });
    };

    /**
     * Replaces a set of values in de destination URI
     * <p>
     * This function replaces a set of values in the destination URI according to a map 
     * containing the values in the original values in the destination URI and the new values. 
     * 
     * @param {object} replaceMap object containing the values to be replaced. 
     *      Each properties of this object represents the map key to be replaced and the property 
     *      value is the value to be replaced.
     */
    this.replaceInDestination = function(replaceMap) {
        var uri = $call.destinationUri.toString();
        for(var key in replaceMap) {
            uri = uri.replace(key, replaceMap[key]);
        }
        $call.setDestinationUri(new java.net.URI(uri));
    };

    /**
     * Concats a string value to the destination URI
     * <p>
     * This function appends to the current URI destination a string.
     * 
     * @param {string} value the value to be concantenated to the destinarion URI.
     */
    this.concatInDestination = function(value) {
        var uri = $call.destinationUri.toString() + value;
        $call.setDestinationUri(new java.net.URI(uri));
    };

    /**
     * Returns if an object is an instance of Object class
     * <p>
     * This function checks if an object is an instance of the Object class
     * 
     * @param {?} obj the object to be verified
     * @returns {boolean} flag indicating if the object is an instance of the Object class.
     */
    function _isObject(obj) {
        return Object.prototype.toString.call(obj) === '[object Object]';
    }
}
