try {
    /* 
     * loading utils class into context variables
     * by adding this interceptor at the head of the request flow,
     * it will be available for use on the subsequent interceptors.
     */
    var obj = new Utils();
    $call.contextVariables.put("string-utils", obj);
} catch(ex) {
    $call.tracer.trace(ex);
}

/**
 * Class de utilitários para manipular e realizar operações em cima de Strings
 * 
 * @version 1.0
 * @author gabriel.nascimento@sensedia
 */
function Utils() {
    const FIRST_VERIFIER_DIGIT = 9;
    const SECOND_VERIFIER_DIGIT = 10;
    const CPF_PATTERN = /^[0-9]{3}\.?[0-9]{3}\.?[0-9]{3}\-?[0-9]{2}$/;
    const FIRST_VERIFIER_ARRAY = [10,9,8,7,6,5,4,3,2];
    const SECOND_VERIFIER_ARRAY = [11,10,9,8,7,6,5,4,3,2];
    
    /**
     * Verifica se uma dada string é vazia
     * <p>
     * Essa function faz a verificação de null, undefined, string vazia e string com tamanho igual a 0
     * 
     * @params {string} str o objeto a ser verificado
     * @return {boolean} uma flag que indica se a string é vazia
     */
    this.isEmpty = function(str) {
        return (str == null || str == undefined || str == '' || str.length == 0);
    };

    /**
     * Valida um dado número de CPF
     * <p>
     * Essa função aceita tanto CPFs em string como em integer.
     * <p>
     * No caso de strings, essa função aceita CPFs tanto com
     * como sem acentuação e pontuação. Por exemplo: </br>
     * <ul>
     * <li>000.000.000-00</li>
     * <li>00000000000</li>
     * </ul>
     * 
     * @param {string|integer} cpf o número de CPF a ser validado
     * @param {boolean} flag que indica se o número de CPF é válido. Caso
     *      a flag seja nula, o padrão do CPF é inválido
     */
    this.validateCpf = function(cpf) {
        // fixing CPF
        cpf = String(cpf).replace(/\./g, '').replace(/-/g, '');

        // validating CPF format and digits
        return cpf.match(CPF_PATTERN) && 
                cpf[FIRST_VERIFIER_DIGIT] == _getDigit(cpf, FIRST_VERIFIER_ARRAY) && 
                cpf[SECOND_VERIFIER_DIGIT] == _getDigit(cpf, SECOND_VERIFIER_ARRAY);
    };
    
    /**
     * Completa uma dada string com caracteres a sua esquerda.
     * <p>
     * Por exemplo, se um valor '123' é recebido e o caractere '0' é utilizado,
     * com um pad de 5, a saída será '00123'.
     * <p>
     * Caso o valor str seja maior que o valor do pad, essa função
     * retornará o valor sem alteração.
     * 
     * @param {string} str o valor a ser completado
     * @param {char} char o caractere a ser adicionado para completar o padding
     * @param {integer} pad o tamanho máxima da string após a operação de padding
     *      ser realizada.
     */
    this.padWith = function(str, char, pad) {
        if(str.length >= pad)
            return str;
        return (Array(pad).join(char) + str).slice(-pad);
    };

    /**
     * Substitui todas as ocorrencias de uma determinada string por uma outra
     * string.
     * 
     * @param {string} str string a ser manipulada
     * @param {string} src a ocorrência a ser substituida
     * @param {string} target a string substituta
     * @return {string} a string após a substituição
     */
    this.replaceAll = function(str, src, target) {
        var matcher = new RegExp(src, "g");
        return str.replace(matcher, target);
    };

    /**
     * Transforma uma dada string utilizando um mapa de chave/valores para 
     * substituir os valores na string.
     * <p>
     * O mapa utilizado nessa função na verdade é um {object} onde o nome das 
     * propriedades é utilizado como chave e o valor atrelado a essa proprieda 
     * como o valor.
     * <p>
     * Por exemplo, a string "abcde" utilizando o mapa: {a: 1, d: 4} irão gerar a
     * saída: "1bc4e"
     * 
     * @param {string} str a string base que terá os valores substituidos
     * @param {object} srcMap o mapa de valores a serem substituidos
     * @return {string} uma string com os valores substituidos
     */
    this.replaceBatch = function(str, srcMap) {
        var self = this;
        return Object.keys(srcMap)
            .reduce(function(prev, cur) {
                return self.replaceAll(prev, cur, srcMap[cur]);
            }, str);
    };

    /**
     * Recupera o digito de verificação do CPF baseado no array de verificação.
     * <p>
     * O digito é calculado multiplicando cada caractere do CPF por seu equivalente em
     * índice no array de verificação, somando todos os números obtidos, multiplicando
     * o resultado por 10 e obtendo o resto de sua divisão por 11.
     * 
     * @param {string} cpf o CPF a ter o digito obtido
     * @param {array} digits o array de digitos de verificacao
     */
    function _getDigit(cpf, digits) {
        return digits.reduce(function(a, b, i) {
            return a + (b * cpf[i] * 10);
        }, 0) % 11;
    }
}
