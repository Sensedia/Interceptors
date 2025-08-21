/**
 * AI Message Formatter
 * 
 * This script formats a message for an AI model API request, preparing the payload, setting headers, and logging debug information.
 * 
 * Usage:
 * 1. Ensure `state.model` and `state.prompt` are set by previous interceptors in the pipeline.
 *    - `state.model` should contain the AI model details, including `id` and `apiKey`.
 *    - `state.prompt` should contain the user input or query for the AI model.
 * 2. This script retrieves these values from the context variables and formats them into a payload.
 * 3. The payload is converted to JSON and set as the request body.
 * 4. The Authorization header is set using the `apiKey` from `state.model`.
 * 
 * Prerequisites:
 * - Previous interceptors must populate `state.model` and `state.prompt` in the context variables.
 * - `state.model` should be an object with the following structure:
 *   {
 *     id: "<model_id>",
 *     apiKey: "<api_key>"
 *   }
 * - `state.prompt` should be a string containing the user query.
 * 
 * Functions:
 * - formatAiMessage(model, text):
 *   - Parameters:
 *     - model: The AI model object containing `id` and `apiKey`.
 *     - text: The user input or query.
 *   - Returns: None. Sets the formatted payload and headers in the request.
 */
function formatAiMessage(model, text) {
    var payload = {
        model: model.id,
        messages: [
            { role: "system", content: "You are a helpful assistant." },
            { role: "user", content: text}
        ],
        temperature: 0.2
    };
   
   var token = "Bearer " + model.apiKey
  
    $call.request.setHeader("Authorization", token.toString());
    // Required only when proxying through an internal API with an OAuth interceptor
    //$call.request.setHeader("client_id", $call.request.getHeader("client_id")); 
    //$call.request.setHeader("access_token", $call.request.getHeader("access_token")); 
    //$call.request.setHeader("Accept", "application/json");
    //$call.request.setHeader("Content-Type", "application/json");
    var strPayload = JSON.stringify(payload);
    $call.request.getBody().setString(strPayload, "UTF-8");
    
    $console.debug("formatAiMessage->model", model);
    $console.debug("formatAiMessage->payload", strPayload);
    

}

$console.debug("Ai Message Formatter", "Formatting the mesage...")
var state = $call.contextVariables.get("_state");

$console.debug("Ai Message Formatter->state", state)
var aiMessage = formatAiMessage(state.model, state.prompt);