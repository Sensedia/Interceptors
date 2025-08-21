/**
 * AI Model Setter
 * 
 * This script sets the AI model details (`id` and `apiKey`) in the `_state` context variable.
 * 
 * Usage:
 * 1. Call the `setAIModel` function with the desired `id` and `apiKey` as parameters.
 * 2. The function updates the `_state` context variable with the provided model details.
 * 3. This updated `_state` can be used by subsequent interceptors in the pipeline.
 * 
 * Parameters:
 * - id: The unique identifier for the AI model.
 * - apiKey: The API key for authenticating requests to the AI model.
 * 
 * Example:
 * setAIModel("gpt-4o", "exampleApiKey");
 * 
 * Prerequisites:
 * - The `_state` context variable must be accessible or will be initialized if not present.
 */
function setAIModel(id, apiKey) {
    $console.debug("Ai model setter", "Setting the model...");

    var state = $call.contextVariables.get("_state");
    if(!state){
        $call.contextVariables = new java.util.HashMap();
        state = {};
    }

    var model = 
        {
          "id": id,
          "apiKey": apiKey
        };

    state.model = model;

    $call.contextVariables.put("_state", state);
    $console.debug("Ai model setter->model set", model);
}


// Example call
setAIModel("<model name>", "<api key>");
