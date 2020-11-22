/* 
* Loads the PaginationLink class to a context variable.
* <p/>
* Add this interceptor at the begining of the response flow so it can be 
* used by any other interceptors further on
*/
try {
    var obj = new PaginationLink();
    $call.contextVariables.put("paginationLink", obj);
} catch(e) {
    $call.tracer.trace(e);
}

/*
* This interceptor is used to add pagination links on the HTTP response.
* <p/>
* You should only use it whenever the GET operation contains pagination.
* 
* @version 1.0.0
* @author time-snake@sensedia.com
*/
function PaginationLink() {
    var _requested_url;
    var _first_page_value;
    var _offset;
    var _limit;
    var _total_records;
    var _query_parameters;
    var _pages_quantity;
    
    /**
     * Returns the created pagination links.
     * 
     * @params {string} requested_url Called URL
     * @params {integer} first_page_value Index of the first page
     * @params {integer} offset Index of the initial record
     * @params {integer} limit Total number of records of each page
     * @params {integer} total_records Number of records returned by the backend
     * @params {string} query_parameters Query parameters to be added to paging links (Optional).
     * @return {array} Created links.
     */
    this.createPaginationLinks = function(requested_url, first_page_value, offset, limit, total_records, query_parameters) {
        $call.tracer.trace("Operação -> createPaginationLinks");
        if (_isPaginationParametersValid(requested_url, first_page_value, offset, limit, total_records)) {
            // loading the variables internally
            _requested_url = requested_url;
            _first_page_value = first_page_value;
            _offset = parseInt(offset);
            _limit = parseInt(limit);
            _total_records = parseInt(total_records);
            _query_parameters = query_parameters;
            _pages_quantity = Math.floor(_total_records / _limit);

            return _buildPaginationLinks();
        } 
    };

    /**
     * Checking if the pagination parameters are valid
     * <p/>
     * Internally, this function will stop the request's execution flow in case one or more
     *      parameters are invalid
     * 
     * @params {string} requested_url Called URL
     * @params {integer} first_page_value Index of the first page
     * @params {integer} offset Index of the initial record
     * @params {integer} limit Total number of records of each page
     * @params {integer} total_records Number of records returned by the backend
     * @return {boolean} a flag which indicates wether the parameters are valid or not
     */
    function _isPaginationParametersValid(requested_url, first_page_value, offset, limit, total_records) {
        $call.tracer.trace("Operação -> _isPaginationParametersValid");
        var isValid = true;
        if (requested_url === null || requested_url == 'null') {
            _stopFlowWithCode(400, 'O campo requested_url deve ser passado.', 'application/json');
            isValid = false;
        } else if (first_page_value === null || first_page_value == 'null') {
            _stopFlowWithCode(400, 'O campo first_page_value deve ser passado.', 'application/json');
            isValid = false;
        } else if (first_page_value < 0 || first_page_value > 1) {
            _stopFlowWithCode(400, 'O campo first_page_value deve ter valor 0 ou 1.', 'application/json');
            isValid = false;
        } else if (total_records === null || total_records == 'null') {
            _stopFlowWithCode(400, 'O campo total_records deve ser passado.', 'application/json');
            isValid = false;
        } else if ((!offset && (!!limit && limit !== 'null')) || ((!!offset && offset !== 'null') && !limit) || (!offset && !limit)) {
            _stopFlowWithCode(400, 'Os campos offset e limit devem ser passados em conjunto.', 'application/json');
            isValid = false;
        } else if (parseInt(offset) < parseInt(first_page_value)) {
            _stopFlowWithCode(400, 'O campo offset deve ser igual ou maior que o campo first_page_value.', 'application/json');
        }
        return isValid;
    }

    /**
     * Create pagination links.
     * 
     * @return {array} Created links.
     */
    function _buildPaginationLinks() {
        $call.tracer.trace("Operação -> _buildPaginationLinks");
    
        var links = [];
    
        if ((_total_records % _limit) > 0) {
            _pages_quantity = _pages_quantity + 1;
        }
    
        if (_offset == _first_page_value) {
            links = _buildPaginationLinksFirstPage();
        } else {
            links = _buildPaginationLinksAllPages();
        }
    
        return links;
    }

    /**
     * Creates the pagination links on the first page.
     * <p/>
     * It only returns the 'next' and 'last' pages links.
     * 
     * @return {array} An array with pagination links.
     */
    function _buildPaginationLinksFirstPage() {
        $call.tracer.trace("Operação -> _buildPaginationLinksFirstPage");

        let ofnext = (_offset < _pages_quantity) ? _offset + 1 : 0;
        let oflast = (_first_page_value == 0) ? _pages_quantity - 1 : _pages_quantity;

        return [_buildLink('next', ofnext), 
                _buildLink('last', oflast)];
    }

    /**
     * Create pagination links for all pages but the first one.
     * <p/>
     * The 'first', 'next', 'previous' and 'last' pages will be returned according to the current page
     * 
     * @return {array} An array with pagination links.
     */
    function _buildPaginationLinksAllPages() {
        $call.tracer.trace("Operação -> _buildPaginationLinksAllPages");

        let offirst = _first_page_value;
        var ofnext = (_offset < _pages_quantity) ? _offset + 1 : 0;
        var ofprev = (_offset > _first_page_value) ? _offset - 1 : 0;
        var oflast = (_first_page_value == 0) ? _pages_quantity - 1 : _pages_quantity;
        var links = [];

        links.push(_buildLink('first', offirst));
        if ((ofnext > 0) && (ofnext < _pages_quantity)) {
            links.push(_buildLink('next', ofnext));
        }
        if ((_offset > _first_page_value)) {
            links.push(_buildLink('prev', ofprev));
        }
        if (_offset < oflast) {
            links.push(_buildLink('last', oflast));
        }
        
        return links;
    }

    /**
     * Creates the pagination link.
     * 
     * @params {string} page Cursor movement indicator for indicative link reference
     * @params {integer} offset Variable that must contain the index of the record to be searched
     * @return {object} Created link.
     */
    function _buildLink(page, offset) {
        $call.tracer.trace("Operação -> _buildLink");

        var href = _requested_url + "?offset=" + offset + "&limit=" + _limit;

        if (_query_parameters !== null) {
            href = href + "&" + _query_parameters;
        }

        return {
            "page": page,
            "href": href
        };
    }

    /**
     * Stop the flow execution
     * 
     * @params {integer} code Error status code
     * @params {string} message Error message
     */
    function _stopFlowWithCode(code, message) {
        $call.tracer.trace('ERROR - STATUS CODE: ' + code + ' - ' + message);
        $call.decision.setAccept(false);
        $call.stopFlow = true;
        $call.response = new com.sensedia.interceptor.externaljar.dto.ApiResponse();
        $call.response.setStatus(code);
        $call.response.getBody().setString(JSON.stringify({
            "mensagem" : String(message)
        }), "utf-8");
        $call.response.setHeader("Content-Type", 'application/json');
    }
}