# Request Commons Interceptor.
Este interceptor tem a finalidade de agregar as funções mais utilizadas por outros interceptors no fluxo de request.

Ele faz isso através de uma classe que é que contém as funções de manipulação e tratamento de dados. Esta classe é carregada nas variáveis de contexto com o nome de 'commons'.

Nele encontramos algumas funções como: </br>
<ul>
<li>Validar body de request</li>
<li>Validar query parameters de request</li>
<li>Checar se um dado objeto é vazio</li>
<li>Retornar uma mensagem de erro</li>
</ul>

Esse interceptor foi criado pensado em suprir as necessidades das APIs da Sulamerica. Ele pode ser alterado conforme a necessidade dos outros projetos.

## Antes de utilizar
É aconselhável declarar esse interceptor na guia de Interceptors do API Manager. Essa funcionalidade é encontrada logo abaixo do item APIs no menu lateral.

## Utilização:
Para utilizar esse interceptor, basta incluí-lo no <b>inicio</b> do fluxo de requisições do seu recurso.

Uma vez incluso, seu código estará carregado nas variáveis de contexto da requisição.

Para acessar as funções dessa classe, basta carregar a classe de commons direto de seu custom interceptor com o comando

```javascript
var commons = $call.contextVariables.get("commons");
```
Agora, a variável '<i>commons</i>' irá conter as funções da classe Commons.

As definições das funções bem como sua documentação estão escritas em jsDoc no código.

### Exemplos uso
#### isEmpty(str)
Verifica se uma dada string é vazio
```javascript
commons.isEmpty(null);
// retorno: true

commons.isEmpty(undefined);
// retorno: true

commons.isEmpty("");
// retorno: true

commons.isEmpty("Not empty");
// retorno: false
```

#### erroMessage(status, result, message)
Interrompoe o fluxo da requisição atual e retorna uma mensagem de erro
```javascript
commons.isEmpty(400, "Request inválida", "A propriedade 'x' é mandatória");
// retorno: gera um response com codigo 400
```

#### validateBody(validator)
Valida o body da requisição e verifica se algum dos parâmetros mandatórios não está presente. Caso não esteja, interrompe o fluxo da request e retorna um erro 400 ao cliente com os parâmetros divergentes.

Essa function valida também objetos dentro de objetos.
```javascript
commons.validateBody({"foo": true, "bar": true});

// para uma request com o seguinte body '{"foo": "str"}', será 
// retornado um erro 400 com dizendo que a propriedade 'bar' é mandatória
```

#### validateQueryParams(validator)
Valida os query parameters da requisição com base em um array de parâmetros mandatórios. Caso algum dos query params não esteja presente, interrompe o fluxo da request e retorna um erro 400 ao cliente com os parâmetros divergentes.
```javascript
commons.validateQueryParams(["foo", "bar"]);
// para uma request com o seguinte query param '?foo=str', será 
// retornado um erro 400 com dizendo que a parâmetro 'bar' é mandatório
```

#### getInvalidBodyProps(obj, validator)
Valida o body da requisição e verifica se algum dos parâmetros mandatórios não está presente. Caso não esteja, retorna uma lista com todos as propriedades divergentes.

Essa function valida também objetos dentro de objetos.
```javascript
commons.getInvalidBodyProps({"foo": str}, {"foo": true, "bar": true});
// retorno: ["bar"]
```

#### validateQueryParams(params, validator)
Valida os query parameters da requisição com base em um array de parâmetros mandatórios. Caso algum retorna uma lista com os parâmetros divergentes.
```javascript
var params = $call.request.getAllQueryParams();
commons.validateQueryParams(params, ["foo", "bar"]);
// retorno: ["bar"]
```

#### Mais informações:
Versão: 1.0 </br>
Autor: Gabriel Nascimento (gabriel.nascimento@sensedia) </br>
Projeto de Origem: Sulamerica 