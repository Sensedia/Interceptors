# String Utils Interceptor. 
Este interceptor tem a finalidade prover funções para a manipulação e vadiação de strings. 
 
Ele faz isso através de uma classe que é que contém as funções de manipulação e tratamento de dados. Esta classe é carregada nas variáveis de contexto com o nome de 'string-utils'. 
 
Nele encontramos algumas funções como: </br> 
<ul> 
<li>Validar body de request</li> 
<li>Validar CPF</li> 
<li>Completar uma string com caracteres a esquerda</li> 
<li>Substituir todas as ocorrências em uma dada string</li>
<li>Substituir diversos trechos de uma dada string</li> 
</ul> 

## Antes de utilizar 
É aconselhável declarar esse interceptor na guia de Interceptors do API Manager. Essa funcionalidade é encontrada logo abaixo do item APIs no menu lateral. 
 
## Utilização: 
Para utilizar esse interceptor, basta incluí-lo no <b>inicio</b> do fluxo de requisições do seu recurso. 
 
Uma vez incluso, seu código estará carregado nas variáveis de contexto da requisição. 
 
Para acessar as funções dessa classe, basta carregar a classe de commons direto de seu custom interceptor com o comando 
 
```javascript 
var stringUtils = $call.contextVariables.get("string-utils"); 
``` 
Agora, a variável '<i>stringUtils</i>' irá conter as funções da classe StringUtils. 
 
As definições das funções bem como sua documentação estão escritas em jsDoc no código. 
 
### Exemplos uso 
#### isEmpty(str) 
Verifica se uma dada string é vazio 
```javascript 
stringUtils.isEmpty(null); 
// retorno: true 
 
stringUtils.isEmpty(undefined); 
// retorno: true 
 
stringUtils.isEmpty(""); 
// retorno: true 
 
stringUtils.isEmpty("Not empty"); 
// retorno: false 
``` 
 
#### validateCpf(cpf) 
Verifica se um dado CPF é válido
```javascript 
stringUtils.isEmpty("RandomString"); 
// retorno: null 
 
stringUtils.isEmpty("39285877816"); 
// retorno: false
 
stringUtils.isEmpty("39285877818"); 
// retorno: true 

stringUtils.isEmpty("392.858.778-18"); 
// retorno: true 
``` 

#### padWith(str, char, pad) 
Completa uma dada string com caracteres a esquerda.

Especialmente útil para completar números com zeros a esquerda.
```javascript 
stringUtils.padWith("123", "0", 5); 
// retorno: 00123
``` 

#### replaceAll(str, src, target) 
Substitui todas as ocorrências de uma string por outra string.

Como a biblioteca padrão do Javascript utiliza o método replace() do prototype String para substituir somente a primeira ocorrência dentro de uma string, essa function se fez necessária. 
```javascript 
stringUtils.replaceAll("banana", "a", "A"); 
// retorno: bAnAnA
``` 

#### replaceBatch(str, srcMap) 
Substitui, em uma dada string, todas as ocorrências em um dado mapa de substituições.

Como em javascript não temos o conceito de "map" utilizamos um objeto comum para armazenar os termos a serem substituidos. Nesse objeto, cada nome de propriedade atua como uma chave de um mapa com os termos a serem substituidos, e cada valor dessas propriedades como o valor da chave do mapa com os valores com os termos substitutos.

Essa função é especialmente útil para renomear diversas propriedades em uma string com um JSON de uma só vez.
```javascript 
stringUtils.replaceBatch("123456789", {"1": "A", "5": "B", "9": "C"}); 
// retorno: A234B678C
``` 

#### Mais informações: 
Versão: 1.0 </br> 
Autor: Gabriel Nascimento (gabriel.nascimento@sensedia) </br> 
Projeto de Origem: Sulamerica 