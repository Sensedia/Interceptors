/* 
* Loads the PaginationLink class to a context variable
* Adding this interceptor either the response flow so it 
* can be available to be used by the interceptors further on the flow
*/
try {
    var obj = new PaginationLink();
    $call.contextVariables.put("paginationLink", obj);
} catch(e) {
    $call.tracer.trace(e);
}

/*
* Interceptor used to add paging links on return to the caller.
* Only use it when the GET operation contains pagination.
* <p>
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
    var _quantidade_Paginas;
    
    /**
     * Returns the created pagination links.
     * <p>
     * 
     * @params {string} requested_url - Service call URL that will be used to build the link return URL
     * @params {integer} first_page_value - Value to define the index of the first page, since the backend can use 0 or 1 as an index.
     * @params {integer} offset - Variable that must contain the index of the initial record to be searched
     * @params {integer} limit - Variable that defines the total number of records to be returned on each page
     * @params {integer} total_records - Total number of records returned by the backend
     * @params {string} query_parameters - Used for query parameters to be added to paging links (Optional).
     * @return {list} Created links.
     * @throws Status Code: 400
     */
    this.createPaginationLinks = function(requested_url, first_page_value, offset, limit, total_records, query_parameters) {
        $call.tracer.trace("Operação -> createPaginationLinks");

        if (requested_url === null || requested_url == 'null') {
            
            _stopFlowWithCode(400, 'O campo requested_url deve ser passado.', 'application/json');
            
        } else if (first_page_value === null || first_page_value == 'null') {
            
            _stopFlowWithCode(400, 'O campo first_page_value deve ser passado.', 'application/json');

        } else if (first_page_value < 0 || first_page_value > 1) {
            
            _stopFlowWithCode(400, 'O campo first_page_value deve ter valor 0 ou 1.', 'application/json');
            
        } else if (total_records === null || total_records == 'null') {
            
            _stopFlowWithCode(400, 'O campo total_records deve ser passado.', 'application/json');
            
        } else if ((!offset && (!!limit && limit !== 'null')) || ((!!offset && offset !== 'null') && !limit) || (!offset && !limit)) {
            
            _stopFlowWithCode(400, 'Os campos offset e limit devem ser passados em conjunto.', 'application/json');
            
        } else {
            
            _requested_url = requested_url;
            _first_page_value = first_page_value;
            _offset = offset;
            _limit = limit;
            _total_records = total_records;
            _query_parameters = query_parameters;
            
            if (parseInt(offset) < parseInt(first_page_value)) {
                _stopFlowWithCode(400, 'O campo offset deve ser igual ou maior que o campo first_page_value.', 'application/json');
            } else {
                return _buildPaginationLinks();
            }
        } 
    };

    /**
     * Creates the pagination link.
     * <p>
     * 
     * @params {string} page - Cursor movement indicator for indicative link reference
     * @params {integer} offset - Variable that must contain the index of the record to be searched
     * @return {object} Link created.
     */
    function _buildLink(page, offset) {
        $call.tracer.trace("Operação -> _buildLink");
    
        var link = {};
        link.page = page;
    
        if (_query_parameters !== null) {
            link.href = _requested_url + "?offset=" + offset + "&limit=" + _limit + "&" + _query_parameters;
        } else {
            link.href = _requested_url + "?offset=" + offset + "&limit=" + _limit;
        }
    
        return link;
    }

    /**
     * Creates the pagination links on the first page.
     * It only returns links to the next and last pages.
     * <p>
     * 
     * @return {list} Created links.
     */
    function _buildPaginationLinksFirstPage() {
        $call.tracer.trace("Operação -> _buildPaginationLinksFirstPage");

        let links = [];
        let ofnext = 0;
        let oflast = 0;

        if (_offset < _quantidade_Paginas) {
            ofnext = _offset + 1;
        }

        if (_first_page_value == 0) {
            oflast = _quantidade_Paginas - 1;
        } else {
            oflast = _quantidade_Paginas;
        }

        let next = _buildLink('next', ofnext);
        links.push(next);

        let last = _buildLink('last', oflast);
        links.push(last);

        return links;
    }

    /**
     * Create pagination links for all pages.
     * The first, next, previous and last pages will return according to the current page
     * <p>
     * 
     * @return {list} Created links.
     */
    function _buildPaginationLinksAllPages() {
        $call.tracer.trace("Operação -> _buildPaginationLinksAllPages");

        let offirst = _first_page_value;
        var ofnext = 0;
        var ofprev = 0;
        var oflast = 0;
        var links = [];

        if (_offset < _quantidade_Paginas) {
            ofnext = _offset + 1;
        } else {
            //nesse caso o offset é maior que a quantidade de paginas ou será o mesmo valor que o last. Não retorna o objeto
            ofnext = 0;
        }

        if (_offset > 1 && ((_offset - 1) > 0)) {
            ofprev = _offset - 1;
        }

        if (_first_page_value == 0) {
            oflast = _quantidade_Paginas - 1;
        } else {
            oflast = _quantidade_Paginas;
        }

        let first = _buildLink('first', offirst);
        links.push(first);

        if ((ofnext > 0) && (ofnext < _quantidade_Paginas)) {
            let next = _buildLink('next', ofnext);
            links.push(next);
        }

        if (ofprev > 1) {
            let prev = _buildLink('prev', ofprev);
            links.push(prev);
        }

        if (_offset < _quantidade_Paginas) {
            let last = _buildLink('last', oflast);
            links.push(last);
        }
        
        return links;
    }

    /**
     * Create pagination links.
     * <p>
     * 
     * @return {list} Created links.
     */
    function _buildPaginationLinks() {
        $call.tracer.trace("Operação -> _buildPaginationLinks");
    
        var links = [];
    
        _offset = parseInt(_offset);
        _total_records = parseInt(_total_records);
        _limit = parseInt(_limit);
    
        _quantidade_Paginas = Math.floor(_total_records / _limit);
    
        if ((_total_records % _limit) > 0) {
            _quantidade_Paginas = _quantidade_Paginas + 1;
        }
    
        if (_offset == _first_page_value) {
            links = _buildPaginationLinksFirstPage();
        } else {
            links = _buildPaginationLinksAllPages();
        }
    
        return links;
    }

    /**
     * Stop the flow execution because of exception.
     * <p>
     * 
     * @params {integer} code - Error status code
     * @params {string} message - Error message
     * @params {strong} contentType - Error message content type
     */
    function _stopFlowWithCode(code, message, contentType) {
        $call.tracer.trace('ERROR - STATUS CODE: ' + code + ' - ' + message);
        $call.decision.setAccept(false);
        $call.stopFlow = true;
        $call.response = new com.sensedia.interceptor.externaljar.dto.ApiResponse();
        $call.response.setStatus(code);
        $call.response.getBody().setString(' { "mensagem" : "' + message + '" }', "utf-8");
        $call.response.setHeader("Content-Type", contentType);
    }
    
}