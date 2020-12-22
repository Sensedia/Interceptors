# DateUtils

Custom interceptor de **utilitários** do tipo **'classe'** com funções utilitárias e procedimentos para manipular datas definidas através da classe _**Date**_. Esse interceptor pode ser utilizada em qualquer API, onde seja necessária a manipulação de datas.

## Utilização:

1 - Adicione o interceptor no flow de request ou response de qualquer operação. Esse interceptor pode ser inclusive adicionado ao flow do **Resource** _(All)_ e **Operations** _(All)_
<br>
2 - Adicione um custom interceptor no flow de response ou request que será responsável pela validação ou manipulações do request ou response.
<br>
3 - Crie uma instância da classe DateUtils, recuperando a classe do contexto da chamada:

```javascript
var dateUtils = $call.contextVariables.get("date-utils");
```

### Criar um objeto Date com valores de data e hora

Esse método permite criar um objeto da classe Date a partir dos parâmetros de data e hora. Os valores de hora, minuto e segundo são opcionais e quando não informados é assumido o valor 0 para esses parâmetros.

```javascript
// Criar um objeto da classe Date incluindo data e hora
var dateWithTime = dateUtils.create(2018, 9, 19, 22, 40, 0);

// Criar um objeto da classe Date sem data e hora
var dateWithoutTime = dateUtils.create(2018, 9, 19);
```

### Formatar uma data de acordo com um padrão

Esse método permite formatar uma data de acordo com um padrão conforme a classe Java _**DateTimeFormatter**_. Caso não seja informada nenhuma data, o método assume a data atual.
<br>

```javascript
// Formatação de uma data pré-definida
var pattern = "EE, dd/MMM/yy HH:mm:ss.SSSaa Z";
var date = dateUtils.create(2018, 9, 19); // O índice do mês é zero.
var formattedDate1 = dateUtils.format(pattern, date); // formattedDate1 = Sábado, 15/Set/18 22:40:35.654PM -0300

// Formatação da data atual
var formattedDate2 = dateUtils.format(pattern); // formattedPattern2 = Terça, 23/Dez/2020 12:00:00.000PM -0300
```

### Adicionar dias para uma determinada data

Esse método permite adicionar a uma determinada data uma quantidade de dias. Caso o número de dias informado seja negativo, esse método realiza a subtração dos dias de uma data.

```javascript
var date = dateUtils.create(2018, 9, 19);

var addedDaysToDate = dateUtils.addDays(date, 5); // nova data = 24/09/2018

var substractedDaysFromDate = dateUtils.addDays(date, -5); // nova data = 14/09/2018
```

### Adicionar meses para uma determinada data

Esse método permite adicionar a uma determinada data uma quantidade de meses. Caso o número de meses informado seja negativo, esse método realiza a subtração dos meses de uma data.

```javascript
var date = dateUtils.create(2018, 9, 19);

var addedMonthsToDate = dateUtils.addMonths(date, 1); // nova data = 24/10/2018

var substractedMonthsFromDate = dateUtils.addMonths(date, -1); // nova data = 24/08/2018
```

### Adicionar anos para uma determinada data

Esse método permite adicionar a uma determinada data uma quantidade de anos. Caso o número de anos informado seja negativo, esse método realiza a subtração dos anos de uma data.

```javascript
var date = dateUtils.create(2018, 9, 19);

var addedYearsToDate = dateUtils.addYears(date, 1); // nova data = 24/10/2019

var substractedYearsFromDate = dateUtils.addYears(date, -1); // nova data = 24/08/2017
```

### Adicionar horas para uma determinada data

Esse método permite adicionar a uma determinada data uma quantidade de horas. Caso o número de horas informado seja negativo, esse método realiza a subtração dos horas de uma data.

```javascript
var date = dateUtils.create(2018, 9, 19, 22, 40, 0);

var addedHoursToDate = dateUtils.addHours(date, 1); // nova data = 24/10/2018 23:40:00

var substractedHoursFromDate = dateUtils.addHours(date, -1); // nova data = 24/10/2018 21:40:00
```

### Adicionar minutos para uma determinada data

Esse método permite adicionar a uma determinada data uma quantidade de minutos. Caso o número de minutos informado seja negativo, esse método realiza a subtração dos minutos de uma data.

```javascript
var date = dateUtils.create(2018, 9, 19, 22, 40, 0);

var addedMinutesToDate = dateUtils.addMinutes(date, 10); // nova data = 24/10/2018 23:50:00

var substractedMinutesFromDate = dateUtils.addMinutes(date, -10); // nova data = 24/10/2018 21:30:00
```

### Adicionar segundos para uma determinada data

Esse método permite adicionar a uma determinada data uma quantidade de segundos. Caso o número de segundos informado seja negativo, esse método realiza a subtração dos segundos de uma data.

```javascript
var date = dateUtils.create(2018, 9, 19, 22, 40, 0);

var addedSecondsToDate = dateUtils.addSeconds(date, 10); // nova data = 24/10/2018 23:40:10

var substractedSecondsFromDate = dateUtils.addSeconds(date, -10); // nova data = 24/10/2018 21:39:50
```
