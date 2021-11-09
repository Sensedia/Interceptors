var error = function (msg) {
    var msg_error = {};
    msg_error.error = msg;
    return msg_error;
};

var generateBody = function (body, statusCode) {
    $call.stopFlow = true;
    $call.decision.setAccept(false);
    $call.response = new com.sensedia.interceptor.externaljar.dto.ApiResponse();
    $call.response.setStatus(statusCode);
    $call.response.getBody().setString(body, "utf-8");
    $call.response.setHeader("Content-Type", "application/json");
    $call.stopFlow = true;
};

var generateGoogleToken = function (code) {
    var google_uri = $call.environmentVariables.get("google_uri_step_2");
    var google_client_id = $call.environmentVariables.get("google_client_id");
    var google_client_secret = $call.environmentVariables.get("google_client_secret");
    var google_uri_callback = $call.environmentVariables.get("google_uri_callback");

    google_uri = google_uri.replace("${google_client_id}", google_client_id);
    google_uri = google_uri.replace("${google_client_secret}", google_client_secret);
    google_uri = google_uri.replace("${code}", code);
    google_uri = google_uri.replace("${redirect_uri}", google_uri_callback);

    return $http.post(google_uri, null);
};

var generateSensediaToken = function (googleResponse, state) {
    var sensedia_oauth_uri = $call.environmentVariables.get("sensedia_oauth_uri");
    var authorization = state.client_id + ":" + state.secret;
    authorization = $base64.encodeString(authorization);
    authorization = "Basic " + authorization;

    var headers = {};
    headers["Authorization"] = new java.lang.String(authorization);
    headers["Content-Type"] = "application/json";

    var tokenRequest = {};
    tokenRequest.grant_type = "client_credentials";
    tokenRequest.extraInfo = state.extraInfo;
    tokenRequest.extraInfo.owner = googleResponse["email"];
    tokenRequest.extraInfo.name = googleResponse["name"];
    tokenRequest.extraInfo.email = googleResponse["email"];

    return $http.post(sensedia_oauth_uri, headers, $json.stringify(tokenRequest));
};

var delimiter = ".";

try {
    var code = $call.request.getQueryParam("code");
    var state = $call.request.getQueryParam("state");
    state = $base64.decodeString(state);
    state = JSON.parse(state);
    var googleResponse = generateGoogleToken(code);
    if (googleResponse.status == 200) {
        var googleJWT = JSON.parse(googleResponse.getResponseText());
        var userInfo = googleJWT["id_token"].split(delimiter);
        var json = userInfo[1];
        $call.tracer.trace(json);
        json = $base64.decodeString(json);
        responseOauth = generateSensediaToken(JSON.parse(json), state);
        generateBody(responseOauth.getResponseText(), responseOauth.status);
    } else {
        generateBody(JSON.parse(response.getResponseText()), response.status);
    }

} catch (e) {
    $call.tracer.trace(e);
    generateBody(error(e.toString()), 400);
}