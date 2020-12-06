# AppExtraInfo
Custom interceptor do tipo <b>'classe'</b> para manipular os ExtrasInfos das APPs.

## Utilização:
1 - Adicione o interceptor no flow de request ou response do _Resources_ _"All"_ - _Operations_ _"All"_ ou da operação que deseja fazer a manipulação.
<br>
2 - Adicione um custom interceptor no flow que será responsável acessar as funções do objeto.
<br>
3 -  Crie uma instância da classe, recuperando a classe do contexto da chamada:
```javascript
var appExtraInfoObject = $call.contextVariables.get("appExtraInfoObject");
```

### Cria ou atualiza um ExtraInfo

A criação ou atualização de um ExtraInfo na APP é feita como indica o exemplo abaixo:
```javascript
var field = 'teste';
var value = 'isso é um teste';

appExtraInfoObject.save(field, value);
```

### Recupera um ExtraInfo

A recuperação de um ExtraInfo na APP é feita como indica o exemplo abaixo:
```javascript
var field = 'teste';

appExtraInfoObject.get(field);
```