/**
 * AI Response Extractor
 * 
 * This script processes the AI response and extracts the relevant message content.
 * 
 * Usage:
 * 1. Call the `extractAIResponse` function to process the AI response.
 * 2. The function checks the HTTP status of the response.
 * 3. If the status is successful (2xx), it parses the response body and extracts the AI message.
 * 4. If a valid message is found, it creates a new response with the extracted content.
 * 5. Logs debug information for both successful and error cases.
 * 
 * Prerequisites:
 * - The AI response must be available in `$call.response`.
 * - The response body should be in JSON format and contain a `choices` array with a `message` object.
 * 
 * Function:
 * - extractAIResponse():
 *   - Processes the AI response and creates a new response with the extracted message.
 */

function extractAIResponse() {
    var aiStatus = $call.response.getStatus().intValue();

    $console.debug("AI Response->HTTP Status", aiStatus);
   

    if (aiStatus >= 200 && aiStatus < 300) {
        var jsonResponse = JSON.parse( $call.response.getBody().getString("UTF-8"));
        $console.debug("AI response->Body", jsonResponse);

        if (jsonResponse && jsonResponse.choices && jsonResponse.choices.length > 0) {
            var message = jsonResponse.choices[0].message.content;
            $console.debug("AI Response->AI Response", message);
            createResponse(message);
        } else {
            $console.debug("AI Response->AI Unexpected Response", jsonResponse);
        }
    } else {
        $console.debug("AI Response-> Error Status", aiStatus);
        $console.debug("AI Response-> Error Body", jsonResponse);
        
    }
}

function createResponse(message){
    // Cria um objeto ApiResponse para essa chamada
    $call.response = new com.sensedia.interceptor.externaljar.dto.ApiResponse();
    $call.response.addHeader('Content-Type', 'application/json');
    

    // Injeta o body modificado na ApiResponse
    $call.response.getBody().setString(JSON.stringify(message), "UTF-8");
    
    // Define o status de retorno como 200
    $call.response.setStatus(200);
}

extractAIResponse();

