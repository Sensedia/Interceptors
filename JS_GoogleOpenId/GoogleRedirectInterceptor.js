var generateBody = function (body, statusCode) {
    $call.stopFlow = true;
    $call.decision.setAccept(false);
    $call.response = new com.sensedia.interceptor.externaljar.dto.ApiResponse();
    $call.response.setStatus(statusCode);
    $call.response.getBody().setString($json.stringify(body), "utf-8");
    $call.response.setHeader("Content-Type", "application/json");
    $call.stopFlow = true;
};

var error = function (msg) {
    var msg_error = {};
    msg_error.error = msg;
    return msg_error;
};

var isEmpty = function (value) {
    return (value == undefined || value == null || value == '' || value.length < 1);
};

var generateState = function (app, extraInfo) {
    var state = {}
    state.client_id = app.code;
    state.secret = app.secret;
    state.extraInfo = extraInfo;
    return $base64.encodeString($json.stringify(state));
};

try {
    var bodyRequest = $call.request.getBody().getString('UTF-8');
    var extraInfo = {};
    if (!isEmpty(bodyRequest.trim())) {
        var request = JSON.parse(bodyRequest);
        extraInfo = request.extraInfo;
    }

    var google_client_id = $call.environmentVariables.get("google_client_id");
    var google_uri = $call.environmentVariables.get("google_uri_step_1");
    var google_uri_callback = $call.environmentVariables.get("google_uri_callback");
    var state = generateState($call.app, extraInfo);
    
    google_uri = google_uri.replace("${google_client_id}", google_client_id);
    google_uri = google_uri.replace("${redirect_uri}", google_uri_callback);
    google_uri = google_uri.replace("${state}", state);

    var body = {};
    body.redirect_uri = google_uri;
    generateBody(body, 202);
} catch (e) {
    $call.tracer.trace(e);
    generateBody(error(e.toString()), 400);
}