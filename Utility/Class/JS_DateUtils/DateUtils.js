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
 * Utility classas a helper to methods and procedures relates to {Date}.
 * <p>
 * This class was developed as a helper of Date objects. This class contains 
 * methods to manipulate the date creation, date and time manipulation and 
 * date formatting for presentation. The default language of this method is pt-BR.
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
    const TWENTY_FOUR_HOURS_UTC_PATTERN = "HHH";
    const TWELVE_HOURS_PATTERN = "hh";
    const TWELVE_HOURS_UTC_PATTERN = "hhh";
    const MINUTES_PATTERN = "mm";
    const SECONDS_PATTERN = "ss";
    const MILLISECONDS_PATTERN = "SSS";
    const AM_PM_PATTERN = "aa";
    const TIMEZONE_PATTERN = "Z";

    /**
     * Formats the date according to a predefined pattern.
     * <p>
     * The date format follow the principles and rules and conventions 
     * according to the Java class DateTimeFormatter 
     * </br>
     * However, only a few format parameters are allowed.
     * Here follows the list of allowed parameters: </br>
     * <ul>
     * <li>dd - days of the month</li>
     * <li>EEE - days of the week</li>
     * <li>MM- month number (starting at 1)</li>
     * <li>MMM - month name</li>
     * <li>yy - last two digits of the year</li>
     * <li>yyyy - year</li>
     * <li>HH - hours (24h)</li>
     * <li>hh - hours (12h)</li>
     * <li>mm - minutes</li>
     * <li>ss - seconds</li>
     * <li>SSS - miliseconds</li>
     * <li>aa - AM/PM</li>
     * <li>Z - Timezone</li>
     * </ul>
     * <p>
     * In example, the following pattern 'EE, dd/MMM/yy HH:mm:ss.SSSaa Z' will generate 
     * the following result:</br>
     * Sábado, 15/Set/18 22:40:35.654PM -0300
     * <p>
     * The date parameter is optional and if not informed, it's used the actual date for formatting.
     * <p>
     * If the time format is UTC (HHH or hhh), the date will be formated according the UTC Pattern.
     * In exemple, the date 2019-03-02 23:42:22-0300 formatted according to the pattern 'dd-MM-yyyy HHH-mm'
     * will result in '2019-03-03 02:42:22'
     * 
     * @param {string} pattern the pattern that will be used to format the date.
     * @param {Date} date the date to be formatted. Optional.
     * @return {string} The string containing the formatted date.
     */
    this.format = function(pattern, date) {
        // in case the date was not provided,
        // we should use the current date
        date = date || new Date();

        var isUTC = pattern.indexOf(TWELVE_HOURS_UTC_PATTERN) > 0 ||
                    pattern.indexOf(TWENTY_FOUR_HOURS_UTC_PATTERN) > 0;
        
        var rawHour, weekDay, day, month, monthName, fullMonthName, year, 
        hours, twelveHours, minutes, seconds, milliseconds, amPm, timezone;

        if(isUTC) {
            rawHour = date.getUTCHours();
            weekDay = WEEK_DAY[date.getUTCDay()];
            day = _padWithZero(date.getUTCDate());
            month = _padWithZero(date.getUTCMonth() + 1);
            monthName = MONTH_NAME[date.getUTCMonth()];
            fullMonthName = FULL_MONTH_NAME[date.getUTCMonth()];
            year = String(date.getUTCFullYear());
            hours = _padWithZero(rawHour);
            twelveHours = _padWithZero(rawHour > 12 ? (rawHour % 12) : rawHour);
            minutes = _padWithZero(date.getUTCMinutes());
            seconds = _padWithZero(date.getUTCSeconds());
            milliseconds = _padWithZero(date.getMilliseconds(), 3);
            amPm = date.getUTCHours() > 11 ? "PM" : "AM";
            timezone = _parseGmtTimezone(date.getTimezoneOffset());
        } else {
            rawHour = date.getHours();
            weekDay = WEEK_DAY[date.getDay()];
            day = _padWithZero(date.getDate());
            month = _padWithZero(date.getMonth() + 1);
            monthName = MONTH_NAME[date.getMonth()];
            fullMonthName = FULL_MONTH_NAME[date.getMonth()];
            year = String(date.getFullYear());
            hours = _padWithZero(rawHour);
            twelveHours = _padWithZero(rawHour > 12 ? (rawHour % 12) : rawHour);
            minutes = _padWithZero(date.getMinutes());
            seconds = _padWithZero(date.getSeconds());
            milliseconds = _padWithZero(date.getMilliseconds(), 3);
            amPm = date.getHours() > 11 ? "PM" : "AM";
            timezone = _parseGmtTimezone(date.getTimezoneOffset());
        }
        return pattern.replace(DAY_PATTERN, day)
            .replace(WEEK_DAY_PATTERN, weekDay)
            .replace(FULL_MONTH_PATTERN, fullMonthName)
            .replace(MONTH_NAME_PATTERN, monthName)
            .replace(MONTH_PATTERN, month)
            .replace(YEAR_PATTERN, year)
            .replace(YEAR_2D_PATTERN, year.substring(2,4))
            .replace(TWENTY_FOUR_HOURS_UTC_PATTERN, hours)
            .replace(TWELVE_HOURS_UTC_PATTERN, twelveHours)
            .replace(TWENTY_FOUR_HOURS_PATTERN, hours)
            .replace(TWELVE_HOURS_PATTERN, twelveHours)
            .replace(MINUTES_PATTERN, minutes)
            .replace(SECONDS_PATTERN, seconds)
            .replace(MILLISECONDS_PATTERN, milliseconds)
            .replace(AM_PM_PATTERN, amPm)
            .replace(TIMEZONE_PATTERN, timezone);
    };

    /**
     * Creates a Date object with datetime values.
     * <p>
     * The time parameters are optional we and assume 0 by default.
     * <p>
     * This function is used to help the creation of a {Date} object, using the
     * most common basic values of datetime, in example, the month that would be
     * originally base 0, is treated as base 1
     * 
     * @param {integer} year the year's value, starting at zero (0). I.e. 2018.
     * @param {integer} month the monyh's value, starting at one (1). I.e. 3 = Março.
     * @param {integer} day the day of the month value, starting at one (1).
     * @param {integer} minutes the value of the minutes of the day
     * @param {integer} seconds the value of the seconds of the day
     * @return {Date} the formatted date with datetime values
     */
    this.create = function(year, month, day, hours, minutes, seconds) {
        return new Date(year, month - MONTH_OFFSET, day,
            hours || 0, minutes || 0, seconds || 0);
    };

    /**
     * Adds a number of the days to a given date.
     * <p>
     * If value of the number of days is negative, its possible to 
     * substract the number of days.
     * 
     * @param {Date} date the date to be manipulated
     * @return {Date} the result date of the addition or subtraction of the number of days
     */
    this.addDays = function(date, days) {
        date.setDate(date.getDate() + days);
        return date;
    };

    /**
     * Adds a number of the months to a given date.
     * <p>
     * If value of the number of months is negative, its possible to 
     * substract the number of months.
     * 
     * @param {Date} date the date to be manipulated
     * @return {Date} the result date of the addition or subtraction of the number of months
     */
    this.addMonths = function(date, months) {
        date.setMonth(date.getMonth() + months);
        return date;
    };

    /**
     * Adds a number of the years to a given date.
     * <p>
     * If value of the number of years is negative, its possible to 
     * substract the number of years.
     * 
     * @param {Date} date the date to be manipulated
     * @return {Date} the result date of the addition or subtraction of the number of years
     */
    this.addYears = function(date, years) {
        date.setYear(date.getYear() + BASE_YEAR + years);
        return date;
    };

    /**
     * Adds a number of the hours to a given date.
     * <p>
     * If value of the number of hours is negative, its possible to 
     * substract the number of hours.
     * 
     * @param {Date} date the date to be manipulated
     * @return {Date} the result date of the addition or subtraction of the number of hours
     */
    this.addHours = function(date, hours) {
        date.setHours(date.getHours() + hours);
        return date;
    };

    /**
     * Adds a number of the minutes to a given date.
     * <p>
     * If value of the number of minutes is negative, its possible to 
     * substract the number of minutes.
     * 
     * @param {Date} date the date to be manipulated
     * @return {Date} the result date of the addition or subtraction of the number of minutes
     */
    this.addMinutes = function(date, minutes) {
        date.setMinutes(date.getMinutes() + minutes);
        return date;
    };

    /**
    * Adds a number of the seconds to a given date.
     * <p>
     * If value of the number of seconds is negative, its possible to 
     * substract the number of seconds.
     * 
     * @param {Date} date the date to be manipulated
     * @return {Date} the result date of the addition or subtraction of the number of seconds
     */
    this.addSeconds = function(date, seconds) {
        date.setSeconds(date.getSeconds() + seconds);
        return date;
    };

    /**
     * Returns the GMT timezone according to the Timezone offset value
     * <p>
     * I.e. the offset value 180 (Brasilia) will return '-0300'
     * 
     * @param {integer} timezoneOffset the offset value to timezone.
     * @returns the formatted timezone according to the base offset
     */
    function _parseGmtTimezone(timezoneOffset) {
        return (timezoneOffset < 0 ? "+" : "-") + _padWithZero(timezoneOffset / OFFSET_SIZE) + "00";
    }

    /**
     * Adds to a given number leading zeros
     * <p>
     * I.e. if a given value '123' is passed with the padding value of 5, the
     * result value will be '00123'. If the value of {str} is greater than the padding
     * value, this function will return the current {str} value
     * <p>
     * The padding value is optional. If this number is not provided, its assumed the value 2
     * 
     * @param {string} str the value to complete with leading zeros
     * @param {integer} pad the maximum number of digits that the number must have after adding
     *  the leading zeros. This value is optional
     */
    function _padWithZero(str, pad) {
        pad = pad || 2;
        if(str.length >= pad)
            return str;
        return (Array(pad).join("0") + str).slice(-pad);
    }
}
