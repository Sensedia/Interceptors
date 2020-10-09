# JDOM - Interceptor para encontrar o Operation Name de uma requisição. 
Custom Interceptor utilizando JDOM para exibir o nome da operação de uma requisição SOAP. 
## Utilização:
Para utilizar o interceptor você não precisa saber previamente o nome das operações que irão trafegar (é legal saber, mas temos caso que isso não ocorre) A principal parte do interceptor é:
```javascript
var elements = $jdom.findElements($jdom.parse(body), "//*[local-name()='Body']");
var operation = elements.get(0).getChildren().get(0);
var name = operation.getName();
```
Essa consulta irá retorna o elemento Body, que tem como filho a operação que está sendo trafegada no SOAP, com isso, pegamos os filhos da operação e podemos assim recuperar o nome. 

#### Exemplo de Entrada
```xml
<?xml version="1.0" encoding="UTF-8"?>
<soap-env:Envelope xmlns:soap-env="http://schemas.xmlsoap.org/soap/envelope/">
   <soap-env:Header />
   <soap-env:Body>
      <n0:encontrarElemento xmlns:n0="urn:sap-com:document:sap:soap:functions:mc-style">
         <elementos>
            <item>
               <codigo>C27012</codigo>
               <codigoLoja>L1980</codigoLoja>
               <data>2017-07-23</data>
               <grupo>1</grupo>
               <statusGrupo>1</statusGrupo>
               <situacao>E</situacao>
               <mensagemRetorno>Grupo não encontrado</mensagemRetorno>
               <horario>13:54:00</horario>
             </item>
         </elementos>
      </n0:encontrarElemento>
   </soap-env:Body>
</soap-env:Envelope>
```

 
#### Mais informações:

- **Java Doc Sensedia**: https://help.v3.apisuite.sensedia.com/javadoc/javadoc-interceptorjava/index.html
- **Element JDOM**: http://www.jdom.org/docs/apidocs/org/jdom2/Element.html
