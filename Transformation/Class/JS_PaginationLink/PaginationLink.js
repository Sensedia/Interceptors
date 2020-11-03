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
* Some context variables need to be set for this interceptor to work. Below the list of variables.
* <p>
* order: 
*      Example: $call.addContextVariables('order', 'sort=' + sort);
*               $call.addContextVariables('order', 'desc=' + desc);
*
*               sort and desc are the list of fields to be ordered
*
* @version 1.0.0
* @author time-snake@sensedia.com
*/
function PaginationLink() {

    /**
     * Returns the created pagination links.
     * <p>
     * 
     * @params {string} requested_url - Service call URL that will be used to build the link return URL
     * @params {integer} offset - Variable that must contain the index of the initial record to be searched
     * @params {integer} limit - Variable that defines the number of records to be searched at a time
     * @params {integer} total_records - Total number of records returned by the backend
     * @params {string} order_fields - Field ordering parameter ascending or descending. This field will only be incremented in the link URL (Optional).
     * @return {list} Created links.
     */
    this.createPaginationLinks = function(requested_url, offset, limit, total_records, order_fields) {
        $call.tracer.trace("Operação -> createPaginationLinks");

        if ((offset !== null || offset !== 'null') && (limit !== null || limit !== 'null')) {
            
            return _buildPaginationLinks(requested_url, offset, limit, total_records, order_fields);
    
        } else if ((!offset && (!!limit && limit !== 'null')) || ((!!offset && offset !== 'null') && !limit)) {
            _stopFlowWithCode(400, 'Os campos offset e limit devem ser passados em conjunto.', 'application/json');
        }
    };

    /**
     * Creates the pagination link.
     * <p>
     * 
     * @params {string} page - Cursor movement indicator for indicative link reference
     * @params {string} requested_url - Service call URL that will be used to build the link return URL
     * @params {integer} offset - Variable that must contain the index of the initial record to be searched
     * @params {integer} limit - Variable that defines the number of records to be searched at a time
     * @params {string} order_fields - Field ordering parameter ascending or descending. This field will only be incremented in the link URL (Optional).
     * @return {object} Link created.
     */
    function _buildLink(page, requested_url, offset, limit, order_fields) {
        $call.tracer.trace("Operação -> _buildLink");
    
        var link = {};
        link.page = page;
    
        if (order_fields !== null) {
            link.href = requested_url + "?offset=" + offset + "&limit=" + limit + "&" + order_fields;
        } else {
            link.href = requested_url + "?offset=" + offset + "&limit=" + limit;
        }
    
        return link;
    }

    /**
     * Creates the pagination links on the first page.
     * It only returns links to the next and last pages.
     * <p>
     * 
     * @params {string} requested_url - Service call URL that will be used to build the link return URL
     * @params {integer} offset - Variable that must contain the index of the initial record to be searched
     * @params {integer} limit - Variable that defines the number of records to be searched at a time
     * @params {integer} quantidade_Paginas - Total pages that can be paged
     * @params {string} order_fields - Field ordering parameter ascending or descending. This field will only be incremented in the link URL (Optional).
     * @return {list} Created links.
     */
    function _buildPaginationLinksFirstPage(requested_url, offset, limit, quantidade_Paginas, order_fields) {
        $call.tracer.trace("Operação -> _buildPaginationLinksFirstPage");

        let links = [];
        let ofnext = 0;
        let oflast = 0;

        if (offset < quantidade_Paginas) {
            ofnext = offset + 1;
        }

        oflast = quantidade_Paginas;

        let next = _buildLink('next', requested_url, ofnext, limit, order_fields);
        links.push(next);

        let last = _buildLink('last', requested_url, oflast, limit, order_fields);
        links.push(last);

        return links;
    }

    /**
     * Create pagination links for all pages.
     * The first, next, previous and last pages will return according to the current page
     * <p>
     * 
     * @params {string} requested_url - Service call URL that will be used to build the link return URL
     * @params {integer} offset - Variable that must contain the index of the initial record to be searched
     * @params {integer} limit - Variable that defines the number of records to be searched at a time
     * @params {integer} quantidade_Paginas - Total pages that can be paged
     * @params {string} order_fields - Field ordering parameter ascending or descending. This field will only be incremented in the link URL (Optional).
     * @return {list} Created links.
     */
    function _buildPaginationLinksAllPages(requested_url, offset, limit, quantidade_Paginas, order_fields) {
        $call.tracer.trace("Operação -> _buildPaginationLinksAllPages");

        let offirst = 1;
        var ofnext = 0;
        var ofprev = 0;
        var oflast = 0;
        var links = [];

        if (offset < quantidade_Paginas) {
            ofnext = offset + 1;
        } else {
            // in this case the offset parameter is greater than the number of pages or it will be the same value as the last. Do not return the object
            ofnext = 0;
        }

        if (offset > 1 && ((offset - 1) > 0)) {
            ofprev = offset - 1;
        }

        oflast = quantidade_Paginas;

        let first = _buildLink('first', requested_url, offirst, limit, order_fields);
        links.push(first);

        if ((ofnext > 0) && (ofnext < quantidade_Paginas)) {
            let next = _buildLink('next', requested_url, ofnext, limit, order_fields);
            links.push(next);
        }

        if (ofprev > 1) {
            let prev = _buildLink('prev', requested_url, ofprev, limit, order_fields);
            links.push(prev);
        }

        if (offset < quantidade_Paginas) {
            let last = _buildLink('last', requested_url, oflast, limit, order_fields);
            links.push(last);
        }

        return links;
    }

    /**
     * Create pagination links.
     * <p>
     * 
     * @params {string} requested_url - Service call URL that will be used to build the link return URL
     * @params {integer} offset - Variable that must contain the index of the initial record to be searched
     * @params {integer} limit - Variable that defines the number of records to be searched at a time
     * @params {integer} total_records - Total number of records returned by the backend
     * @params {string} order_fields - Field ordering parameter ascending or descending. This field will only be incremented in the link URL (Optional).
     * @return {list} Created links.
     */
    function _buildPaginationLinks(requested_url, offset, limit, total_records, order_fields) {
        $call.tracer.trace("Operação -> _buildPaginationLinks");
    
        const FIRST_PAGE = 1;

        var links = [];
    
        offset = parseInt(offset);
        total_records = parseInt(total_records);
        limit = parseInt(limit);
    
        var quantidade_Paginas = Math.floor(total_records / limit);
    
        if ((total_records % limit) > 0) {
            quantidade_Paginas = quantidade_Paginas + 1;
        }
    
        if (offset == FIRST_PAGE) {
            links = _buildPaginationLinksFirstPage(requested_url, offset, limit, quantidade_Paginas, order_fields);
        } else {
            links = _buildPaginationLinksAllPages(requested_url, offset, limit, quantidade_Paginas, order_fields);
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