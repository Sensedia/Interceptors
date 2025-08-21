/**
 * AI Prompt Enricher
 * 
 * This script enriches the `prompt` value in the `_state` context variable by appending the request body content.
 * 
 * Usage:
 * 1. Call the `enrichPromptWithRequestBody` function to execute the enrichment process.
 * 2. The function retrieves the `_state` context variable and the request body.
 * 3. It appends the request body content to the existing `prompt` value in `_state`.
 * 4. The updated `_state` is stored back into the context variables.
 * 
 * Prerequisites:
 * - The `_state` context variable must already exist and contain a `prompt` property.
 * - The request body should be accessible and encoded in UTF-8.
 * 
 * Function:
 * - enrichPromptWithRequestBody():
 *   - Retrieves `_state` and the request body.
 *   - Appends the request body to `state.prompt`.
 *   - Updates the `_state` context variable.
 */
function enrichPromptWithRequestBody() {
    $console.debug("Ai Prompt Enricher", "Enriching the prompt with request body...");

    var state = $call.contextVariables.get("_state");
    

    var requestBody = $call.request.getBody().getString("utf-8");

    state.prompt += requestBody;

    $call.contextVariables.put("_state", state);
    $console.debug("AI Prompt Enrich->state.prompt", state.prompt);
}

enrichPromptWithRequestBody();