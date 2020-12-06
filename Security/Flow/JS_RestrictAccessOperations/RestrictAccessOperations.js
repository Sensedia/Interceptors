/**
* Interceptor to restrict the access of an APP according to a
* list of allowed operations. If the requested method and URL
* can not be found in the allowed operation list, the request
* flow will be stopped and it will return a response to client
* with status code 403 - Forbidden
*
* @version 1.0.0
* @author time-snake@sensedia.com
*/
var ALLOWED_OPERATIONS = ["POST /oauth/access-token"];
try {
  // getting the HTTP Method and the requested URL
  // we should sanitize the URL by removing all the doubled slashes
  let method = $request.getMethod();
  let url = String($request.getRequestedUrl()).replace(/\/+/g, "/");

  // checking if question mark exists in url
  // if it does it will remove everything after it
  url = removeQueryParams(url);

  // stopping the execution flow with an Unauthorized error in
  // case the user has no permission to access this operation
  if (!verify(method + " " + url)) {
    stopFlow(403, "Você não tem permissão para esta operação.");
  }
} catch (exception) {
  $call.tracer.trace("Exception " + exception.message + " in line " + exception.stack);
  throw exception;
}

/**
 * Remove the query params from the url if exists
 * <p>
 * This function basically removes anything that comes with/after theh interrogation mark '?'.
 * <p>
 * It returns the same URL in case it does not contains any query params
 * 
 * @param {String} url - the url to remove to be cleansed
 * @return {String} a URL without the query parameters
 */
function removeQueryParams(url) {
  return url.split("?")[0];
}

/**
 * Verify if the user has permission to access the operation according
 * to the list of allowed operations
 *
 * @param {String} calledOperation the called operation with the "HttpMethod CalledURL"
 * @returns {Boolean} a flag which indicates wether the user has the permission or not
 */
function verify(calledOperation) {
  return ALLOWED_OPERATIONS.some(function (operation) {
    // replacing pathParameter placeholders by a wildcard regular expression
    // adding an wildcard right before the operation to ignore the gateway's url
    // and API's base path in the end, we are adding an $ terminator to ignore
    // further comparisons
    return new RegExp(operation.replace(/\{(.*?)}/g, "([^\\/]+)").replace(" ", " (.*?)") + "$")
      .test(calledOperation);
  });
}

/**
 * Stops the request flow with a status code and a message
 *
 * @param {int} statusCode - the response status code
 * @param {String} message - the response message
 */
function stopFlow(status_code, message) {
  $call.response = new com.sensedia.interceptor.externaljar.dto.ApiResponse();
  $call.response.setStatus(status_code);
  $call.response.getBody().setString(JSON.stringify({
    mensagem: message,
  }),"utf-8");
  $call.response.setHeader("Content-type", "application/json");
  $call.stopFlow = true;
  $call.decision.setAccept(false);
}
