/* 
* Loads the AppExtraInfo calls to a context variable
* Adding this interceptor either the request or response flow so it 
* can be available to be used by the interceptors further on the flow
*/
try {
    var obj = new AppExtraInfo();
    $call.contextVariables.put("appExtraInfoObject", obj);
} catch (e) {
    $call.tracer.trace(e);
}

/**
 * Class responsible for handling the Apps' extraInfo object.
 * <p>
 * It should be used on public and private APIs.
 * 
 * @version 1.0.0
 * @author time-snake@sensedia.com
 */
function AppExtraInfo() {
    /**
     * Create or update an extrainfo in the APP.
     * 
     * @param {string} field - extrainfo name.
     * @param {string} value - extrainfo value.
     * @return {boolean} a flag which tells wether the changes were made or not
     * @throws Status Code: >= 300
     */
    this.save = function (field, value) {
        const app_url = $call.environmentVariables.get("urlManagerApps").concat('/').concat($call.app.code);
        const headers = {
            'Sensedia-Auth': $call.environmentVariables.get("sensedia-auth")
        };

        // getting the app data
        var response_manager = $http.get(app_url, headers);
        if (response_manager.status >= 300) {
            $call.tracer.trace("ERROR: Status code: " + response_manager.status + 
                " - Message: Error while trying to call App API");

            return false;
        } else {
            // handling the app body
            var body_app = JSON.parse(response_manager.responseText);
            _removeCreationDateField(body_app);
            body_app.extraInfo[field] = value;

            // updating the app
            $http.put(app_url, headers, body_app);

            return true;
        }
    };

    /**
     * Retrieves the value of an extrainfo in the APP.
     * 
     * @param {string} field extrainfo's name.
     * @return {string} extrainfo's value.
     */
    this.get = function (field) {
        return $call.app.getExtraInfo().get(field);
    };

    /**
     * Removes the creationDate fields from the app and the APIs within it.
     * 
     * @param {object} body_app the body with APP data.
     */
    function _removeCreationDateField(body_app) {
        delete body_app.creationDate;
        if (body_app.apis) {
            body_app.apis.forEach(function(api) {
                delete api.creationDate;
            });
        }
    }
}

