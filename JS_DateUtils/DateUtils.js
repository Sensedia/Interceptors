try {
    /* 
     * loading utils class into context variables
     * by adding this interceptor at the head of the request flow,
     * it will be available for use on the subsequent interceptors.
     */
    var obj = new DateUtils();
    $call.contextVariables.put("date-utils", obj);
} catch(ex) {
    $call.tracer.trace(ex);
}

/**
 * Class de utilitários para tratar operações relacionadas com {Date}.
 * <p>
 * Essa classe foi criada para facilitar a manipulação desse tipo de objeto
 * tratando desde a sua criaçao, manipulação de data e tempo e formatação
 * para uma melhor apresentação.
 * 
 * @version 1.0
 * @author gabriel.nascimento@sensedia
 */
function DateUtils() {
    const OFFSET_SIZE = 60;
    const BASE_YEAR = 1900;
    const MONTH_OFFSET = 1;
    const MONTH_NAME = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 
            'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    const FULL_MONTH_NAME = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 
            'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    const WEEK_DAY = ['Domingo', 'Segunda-Feira', 'Terça-Feira', 
            'Quarta-Feira', 'Quinta-Feira','Sexta-Feira', 'Sábado'];
    const DAY_PATTERN = "dd";
    const WEEK_DAY_PATTERN = "EEE";
    const FULL_MONTH_PATTERN = "MMMM";
    const MONTH_NAME_PATTERN = "MMM";
    const MONTH_PATTERN = "MM";
    const YEAR_PATTERN = "yyyy";
    const YEAR_2D_PATTERN = "yy";
    const TWENTY_FOUR_HOURS_PATTERN = "HH";
    const TWELVE_HOURS_PATTERN = "hh";
    const MINUTES_PATTERN = "mm";
    const SECONDS_PATTERN = "ss";
    const MILLISECONDS_PATTERN = "SSS";
    const AM_PM_PATTERN = "aa";
    const TIMEZONE_PATTERN = "Z";

    /**
     * Formata uma data em um dado padrão.
     * <p>
     * O formato de data segue o mesmo principio de regras e convenção de 
     * nomes da class DateTimeFormatter
     * do Java. </br>
     * Contudo, somente alguns dos parametros de formato são aceitos. 
     * Segue a lista dos parâmetros disponíveis: </br>
     * <ul>
     * <li>dd - para dias do mês</li>
     * <li>EEE - para dias da semana</li>
     * <li>MM- para número do mês (começando com 1)</li>
     * <li>MMM - para o nome do mês</li>
     * <li>yy - para os dois últimos dígitos do ano </li>
     * <li>yyyy - para o ano</li>
     * <li>HH - para as horas (24h)</li>
     * <li>hh - para as horas (12h)</li>
     * <li>mm - para os minutos</li>
     * <li>ss - para os segundos</li>
     * <li>SSS - para os milisegundos</li>
     * <li>aa - para AM/PM</li>
     * <li>Z - para Timezone</li>
     * </ul>
     * <p>
     * Por exemplo, o pattern 'EE, dd/MMM/yy HH:mm:ss.SSSaa Z' irá gerar uma saída como: </br>
     * Sábado, 15/Set/18 22:40:35.654PM -0300
     * <p>
     * O parametro date é opcional e caso não infomado é utilizada a data atual para a formatação.
     * 
     * @param {string} pattern o pattern ao qual a data deve ser formatada.
     * @param {Date} date a data a ser formatada. Opcional
     * @return {string} uma string com a data formatada
     */
    this.format = function(pattern, date) {
        // in case the date was not provided,
        // we should use the current date
        date = date || new Date();
       
        var rawHour = date.getHours();
        var weekDay = WEEK_DAY[date.getDay()];
        var day = _padWithZero(date.getDate());
        var month = _padWithZero(date.getMonth() + 1);
        var monthName = MONTH_NAME[date.getMonth()];
        var fullMonthName = FULL_MONTH_NAME[date.getMonth()];
        var year = String(BASE_YEAR + date.getYear());
        var hours = _padWithZero(rawHour);
        var twelveHours = _padWithZero(rawHour > 12 ? (rawHour % 12) : rawHour);
        var minutes = _padWithZero(date.getMinutes());
        var seconds = _padWithZero(date.getSeconds());
        var milliseconds = _padWithZero(date.getMilliseconds(), 3);
        var amPm = date.getHours() > 11 ? "PM" : "AM";
        var timezone = _parseGmtTimezone(date.getTimezoneOffset());

        return pattern.replace(DAY_PATTERN, day)
            .replace(WEEK_DAY_PATTERN, weekDay)
            .replace(FULL_MONTH_PATTERN, fullMonthName)
            .replace(MONTH_NAME_PATTERN, monthName)
            .replace(MONTH_PATTERN, month)
            .replace(YEAR_PATTERN, year)
            .replace(YEAR_2D_PATTERN, year.substring(2,4))
            .replace(TWENTY_FOUR_HOURS_PATTERN, hours)
            .replace(TWELVE_HOURS_PATTERN, twelveHours)
            .replace(MINUTES_PATTERN, minutes)
            .replace(SECONDS_PATTERN, seconds)
            .replace(MILLISECONDS_PATTERN, milliseconds)
            .replace(AM_PM_PATTERN, amPm)
            .replace(TIMEZONE_PATTERN, timezone);
    };

    /**
     * Cria um objeto Date com os valores de datetime.
     * <p>
     * Os parametrôes de time são opcionais e assumidos como 0 por default.
     * <p>
     * Essa função tem como objetivo facilitar a criação de um objeto {Date}
     * utilizando as bases mais comums de valores de datetime, por exemplo, 
     * o mês que originalmente seria base 0, aqui é tratado como base 1.
     * 
     * @param {integer} year o valor do ano com base 0. Ex.: 2018.
     * @param {integer} month o valor do mês com base 1. Ex.: 3 = Março.
     * @param {integer} day o valor do dia do mês com base 1.
     * @param {integer} hours as horas do dia
     * @param {integer} minutes os minutos do dia
     * @param {integer} seconds os segundos do dia
     * @return {Date} um data formada com os valores de datetime
     */
    this.create = function(year, month, day, hours, minutes, seconds) {
        return new Date(year, month - MONTH_OFFSET, day,
            hours || 0, minutes || 0, seconds || 0);
    };

    /**
     * Adiciona uma quantidade de dias a uma dada data.
     * <p>
     * É possível subtrair dias se o valor for negativo.
     * 
     * @param {Date} date a data a ser manipulada
     * @return {Date} a data depois da adição dos dias
     */
    this.addDays = function(date, days) {
        date.setDate(date.getDate() + days);
        return date;
    };

    /**
     * Adiciona uma quantidade de meses a uma dada data.
     * <p>
     * É possível subtrair meses se o valor for negativo.
     * 
     * @param {Date} date a data a ser manipulada
     * @return {Date} a data depois da adição dos meses
     */
    this.addMonths = function(date, months) {
        date.setMonth(date.getMonth() + months);
        return date;
    };

    /**
     * Adiciona uma quantidade de anos a uma dada data.
     * <p>
     * É possível subtrair anos se o valor for negativo.
     * 
     * @param {Date} date a data a ser manipulada
     * @return {Date} a data depois da adição dos anos
     */
    this.addYears = function(date, years) {
        date.setYear(date.getYear() + BASE_YEAR + years);
        return date;
    };

    /**
     * Adiciona uma quantidade de horas a uma dada data.
     * <p>
     * É possível subtrair horas se o valor for negativo.
     * 
     * @param {Date} date a data a ser manipulada
     * @return {Date} a data depois da adição dos horas
     */
    this.addHours = function(date, hours) {
        date.setHours(date.getHours() + hours);
        return date;
    };

    /**
     * Adiciona uma quantidade de minutos a uma dada data.
     * <p>
     * É possível subtrair minutos se o valor for negativo.
     * 
     * @param {Date} date a data a ser manipulada
     * @return {Date} a data depois da adição dos minutos
     */
    this.addMinutes = function(date, minutes) {
        date.setMinutes(date.getMinutes() + minutes);
        return date;
    };

    /**
     * Adiciona uma quantidade de segundos a uma dada data.
     * <p>
     * É possível subtrair segundos se o valor for negativo.
     * 
     * @param {Date} date a data a ser manipulada
     * @return {Date} a data depois da adição dos segundos
     */
    this.addSeconds = function(date, seconds) {
        date.setSeconds(date.getSeconds() + seconds);
        return date;
    };

    /**
     * Recupera o timezone GMT baseado no offset do Timezone.
     * <p>
     * Por exemplo, um offset 180 (Brasília) irá retornar '-0300'
     * 
     * @param {integer} o offset to timezone.
     * @returns o timezone formatado com base no offset
     */
    function _parseGmtTimezone(timezoneOffset) {
        return (timezoneOffset < 0 ? "+" : "-") + _padWithZero(timezoneOffset / OFFSET_SIZE) + "00";
    }

    /**
     * Completa um número com zeros a direita
     * <p>
     * Por exemplo, se um valor '123' é recebido com um pad de 5, a saída será
     * '00123'. Caso o valor str seja maior que o valor do pad, essa function
     * retornará o valor sem alteração.
     * <p>
     * O valor de pad é opcional e, caso não seja fornecido, é assumido como 2.
     * 
     * @param {string} str o valor a ser completado
     * @param {integer} pad a quantidade máxima que valor deve conter após ser
     *      completado com zeros. Opcional
     */
    function _padWithZero(str, pad) {
        pad = pad || 2;
        if(str.length >= pad)
            return str;
        return (Array(pad).join("0") + str).slice(-pad);
    }
}
