# Permissao Acesso Dias Interceptor. 
Este interceptor tem a finalidade de permitir a chamada de uma API quando esta estiver num dia util (que não seja fim de semana ou feriado)
 
Para o correto funcionamento temso alguns requisitos: </br> 
<ul> 
<li>Um array cadastrado de feriados - declarado da seguinte forma no environment {"feriados":["01-01-2021","25-12-2020","02-11-2020","15-11-2020"]}</li>  
</ul> 

## Antes de utilizar 
É aconselhável criar um novo interceptor na guia de Interceptors do API Manager.  
 
## Utilização: 
Para utilizar esse interceptor, basta incluí-lo no pipeline do fluxo de requisições do seu recurso. 
 
Uma vez incluso, seu código será avaliado a cada requisição e a regra de drop de chamada em caso de (sabado, domingo ou um dos feriados parametrizados) interrompendo a requisição a partir deste interceptor. 
 
### Exemplo de uso 

Passo 1
### Carregar no Environment um array dos feriados a serem considerados.
```javascript 
{"feriados":["01-01-2021","25-12-2020","02-11-2020","15-11-2020"]}
```

Passo 2
### inserção do interceptor no flow do recurso que pretende restringir a execução

### Retorno da função em caso de drop
```json
{"message": "Este recurso não pode ser executado neste momento devido a restrição de uso da Focus.\n'+msg+'"}
onde msg pode ser:
<ul>
<li>feriado</li>
<li>fim de semana</li>
</ul>
```
#### Mais informações: 
Versão: 1.0 </br> 
Autor: Heverton Fornazari (heverton.fornazari@sensedia.com) </br> 
Projeto de Origem: Focus Financeira