# Validate Type Interceptor
Custom Interceptor utilizando para validade tipos primários que podem der de header, path ou query 

## Utilização:
Para utilizar o interceptor você precisa obter o valor do parâmetro que deseja e chamar a função de validação, a principal linha do interceptor é:

```javascript
var valid = validateType('date', paramX);
```

A função retornará um booleano, case seja true o request continua normalmente, caso seja false o request é abortado e é retornado HTTP 400.
