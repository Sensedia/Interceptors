/**
 * AI Prompt Setter
 * 
 * This script is used to set the `prompt` value in the `_state` context variable.
 * 
 * Usage:
 * 1. Define the `prompt` variable with the desired user input or query.
 * 2. The script updates the `_state` context variable with the new `prompt` value.
 * 3. This updated `_state` can be used by subsequent interceptors in the pipeline.
 * 
 * Prerequisites:
 * - The `_state` context variable must already exist and be accessible.
 * - Ensure that the `prompt` variable is set to a meaningful value before running this script.
 * 
 * Example:
 * - Set `prompt` to a specific query or instruction for the AI model.
 */

function setAIPrompt() {
    $console.debug("Ai prompt setter->", "Setting the prompt...");
    var state = $call.contextVariables.get("_state");

    var prompt = "<describe you prompt>";

    state.prompt = prompt;

    $call.contextVariables.put("_state", state);
    $console.debug("Ai prompt setter->Prompt set", prompt);
}

setAIPrompt();