# JDOM - Interceptor para encontrar elemento no XML.
Custom Interceptor utilizando JDOM para encontrar um elemento no XML e alterar o HTTP Status dependendo do valor  retornado. 
## Utilização:
Para utilizar o interceptor você precisa ter definido o nome do elemento que deseja buscar. A principal linha do interceptor é:
```javascript
var elements = $jdom.findElements($jdom.parse(body), "//*[local-name()='nomeDoElemento']");
```
Essa consulta irá retorna todos os elementos com o nome nomeDoElemento. Após isso, você terá liberdade para manipular o elemento do JDOM da forma que você necessitar. 

#### Exemplo de Entrada
```xml
<?xml version="1.0" encoding="UTF-8"?>
<soap-env:Envelope xmlns:soap-env="http://schemas.xmlsoap.org/soap/envelope/">
   <soap-env:Header />
   <soap-env:Body>
      <n0:encontrarElementoResponse xmlns:n0="urn:sap-com:document:sap:soap:functions:mc-style">
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
      </n0:encontrarElementoResponse>
   </soap-env:Body>
</soap-env:Envelope>
```

 
#### Mais informações:

- **Java Doc Sensedia**: https://help.v3.apisuite.sensedia.com/javadoc/javadoc-interceptorjava/index.html
- **Element JDOM**: http://www.jdom.org/docs/apidocs/org/jdom2/Element.html
