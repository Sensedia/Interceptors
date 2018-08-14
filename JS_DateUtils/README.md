# String Utils Interceptor. 
Este interceptor tem a finalidade prover funções para a manipulação e vadiação de {Date}. 
 
Ele faz isso através de uma classe que é que contém as funções de manipulação e tratamento de dados. Esta classe é carregada nas variáveis de contexto com o nome de 'date-utils'. 
 
Nele encontramos algumas funções como: </br> 
<ul> 
<li>Formatar uma Date</li> 
<li>Criar um novo objeto de Date</li> 
<li>Adicionar/Subtrair dias, meses, ano, horas, minutos e segundos de um Date</li> 
</ul> 

## Antes de utilizar 
É aconselhável declarar esse interceptor na guia de Interceptors do API Manager. Essa funcionalidade é encontrada logo abaixo do item APIs no menu lateral. 
 
## Utilização: 
Para utilizar esse interceptor, basta incluí-lo no <b>inicio</b> do fluxo de requisições do seu recurso. 
 
Uma vez incluso, seu código estará carregado nas variáveis de contexto da requisição. 
 
Para acessar as funções dessa classe, basta carregar a classe de utils direto de seu custom interceptor com o comando 
 
```javascript 
var dateUtils = $call.contextVariables.get("date-utils"); 
``` 
Agora, a variável '<i>dateUtils</i>' irá conter as funções da classe DateUtils. 
 
As definições das funções bem como sua documentação estão escritas em jsDoc no código. 
 
### Exemplos uso 
#### format(pattern, date) 
Formata uma data a partir de um template.

O formato de data segue o mesmo principio de regras e convenção de nomes da class DateTimeFormatter do Java. </br>
Contudo, somente alguns dos parametros de formato são aceitos. 
Segue a lista dos parâmetros disponíveis: </br>
<ul>
    <li>dd - para dias do mês</li>
    <li>EEE - para dias da semana</li>
    <li>MM- para número do mês (começando com 1)</li>
    <li>MMM - para o nome do mês</li>
    <li>yy - para os dois últimos dígitos do ano </li>
    <li>yyyy - para o ano</li>
    <li>HH - para as horas (24h)</li>
    <li>hh - para as horas (12h)</li>
    <li>mm - para os minutos</li>
    <li>ss - para os segundos</li>
    <li>SSS - para os milisegundos</li>
    <li>aa - para AM/PM</li>
    <li>Z - para Timezone</li>
</ul>

```javascript 
dateUtils.format("EEE, dd de MMMM de yyyy hh:mm:ss aa"); 
// retorno: Sexta-feira, 03 de Agosto de 2018 10:40:30 PM (utilizando o dia atual)

dateUtils.format("EEE, dd de MMMM de yyyy HH:mm:ss.SSS", new Date()); 
// retorno: Sexta-feira, 03 de Agosto de 2018 22:40:30.743 (utilizando a data passada como parâmetro)
``` 
 
#### create(ano, mes, dia, hora, minuto, segundo) 
Cria um objeto Date com as definições de Datetime passadas como argumento.

Os valores de tempo (hora, minuto e segundo) não são mandatórias e são definidas como 0 caso não sejam passadas como argumento.

Diferente do construtor do objeto Date, essa function utilia parâmetros na base 1 e ano inicial 0 ao invés de 1900.

```javascript 
dateUtils.create(2018, 3, 3); 
// retorno: Sat Mar 03 2018 00:00:00 GMT-0300 (Brasilia Standard Time)
 
dateUtils.create(2018, 3, 3, 15, 23, 45); 
// retorno: Sat Mar 03 2018 15:23:45 GMT-0300 (Brasilia Standard Time)
``` 

#### addDays(date, days) 
Adiciona uma quantidade de dias a uma dada data.

Utilzar número de dias negativos subtrai dias da data.
```javascript 
dateUtils.addDays(new Date, 1); 
// retorno: {Date} 03/08/2018 10:20:30

dateUtils.addDays(new Date, -1); 
// retorno: {Date} 01/08/2018 10:20:30
``` 

#### addMonths(date, months) 
Adiciona uma quantidade de meses a uma dada data.

Utilzar número de dias negativos subtrai meses da data.
```javascript 
dateUtils.addMonths(new Date, 1); 
// retorno: {Date} 02/09/2018 10:20:30

dateUtils.addMonths(new Date, -1); 
// retorno: {Date} 02/07/2018 10:20:30
``` 

#### addYears(date, years) 
Adiciona uma quantidade de anos a uma dada data.

Utilzar número de dias negativos subtrai anos da data.
```javascript 
dateUtils.addYears(new Date, 1); 
// retorno: {Date} 02/08/2019 10:20:30

dateUtils.addYears(new Date, -1); 
// retorno: {Date} 02/08/2017 10:20:30
``` 

#### addHours(date, days) 
Adiciona uma quantidade de horas a uma dada data.

Utilzar número de dias negativos subtrai horas da data.
```javascript 
dateUtils.addHours(new Date, 2); 
// retorno: {Date} 02/08/2018 12:20:30

dateUtils.addHours(new Date, -2); 
// retorno: {Date} 02/08/2018 08:20:30
``` 

#### addMinutes(date, days) 
Adiciona uma quantidade de minutos a uma dada data.

Utilzar número de dias negativos subtrai minutos da data.
```javascript 
dateUtils.addMinutes(new Date, 5); 
// retorno: {Date} 02/08/2018 10:25:30

dateUtils.addMinutes(new Date, -5); 
// retorno: {Date} 02/08/2018 10:15:30
``` 

#### addSeconds(date, days) 
Adiciona uma quantidade de segundos a uma dada data.

Utilzar número de dias negativos subtrai segundos da data.
```javascript 
dateUtils.addSeconds(new Date, 10); 
// retorno: {Date} 02/08/2019 10:20:40

dateUtils.addSeconds(new Date, -10); 
// retorno: {Date} 02/08/2017 10:20:20
``` 


#### Mais informações: 
Versão: 1.0 </br> 
Autor: Gabriel Nascimento (gabriel.nascimento@sensedia) </br> 
Projeto de Origem: Sulamerica 