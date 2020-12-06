/**
* Loads the LinkHateoas class to a context variable
* Adding this interceptor either the request or response flow so it 
* can be available to be used by the interceptors further on the flow
*/
try {
    var obj = new LinkHateoas();
    $call.contextVariables.put("linkHateoas", obj);
} catch(e) {
    $call.tracer.trace(e);
}

/**
 * Class responsible for creating HATEOAS links for operations with GET method
 * of our APIs
 * <p>
 * It should be used on public APIs. It never should be used on internal APIs.
 * 
 * @version 1.0.0
 * @author time-snake@sensedia.com
 */
function LinkHateoas() {
    /**
     * Create a list with all links based on the available methods of an HREF
     * 
     * @params {string} href - the URL
     * @params {string} relation - the relationship between source and destiny resources
     * @params {list} methods - an array with the allowed HTTP methods for this given href
     * @return {list} an array with the created links
     */
    this.createLinks = function(href, relation, methods) {
        if(methods) {
            return methods.map(function(method) {
                return {
                    href: href,
                    rel: relation,
                    method: method
                };
            });
        }
        return [];
    };

    /**
     * Formats a given href so it points to another API
     * <p>
     * Must be used in case a GET operação points to an operation of another API
     * 
     * @params {string} domain_url - The domain URL of the API e.g.: vr.com.br
     * @params {string} href - the URL
     * @params {string} api_address - the API address as configured on the base path field on Sensedia's API Gateway
     * @params {string} version - the API version as configured on the base path field on Sensedia's API Gateway
     * @return {string} the formated href
     */
    this.formatHref = function(domain_url, href, api_address, version) {
        let protocol = href.split(domain_url)[0];
        return protocol.concat(domain_url).concat('/').concat(api_address).concat('/').concat(version);
    };
}