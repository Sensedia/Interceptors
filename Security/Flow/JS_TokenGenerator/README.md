# TokenGenerator

Custom interceptor do tipo <b>'fluxo'</b> para gerar um objeto de response contendo um token gerado
baseado em um algoritmo que pode ser definido pelo dev no fluxo da sua operação.

## Algortimos utitlizados para geração de token

- Hash MD5 com encoding hexadecimal
- Hash MD5 com encoding em base 64
- Hash MD5 com encoding arbritário
- Hash MD5 com chave HMAC e encoding hexadecimal
- Hash MD5 com chave HMAC e encoding em base 64
- Hash MD5 com chave HMAC e encoding em arbitrário

## Utilização:

1 - Adicione o interceptor no flow de request.
<br>
2 - Altere a função `createToken` informando o a função que será utilizada para geração do token

```javascript
var createToken = function (code, date, hour, privateKey) {
  var preToken =
    code + "|" + date + "|" + hour + "|" + privateKey + "|" + privateKey;

  // If you want to generate the token with another algorithm, change the return function
  // according to the functions defined on lines 12 to 20
  // i.e. return hex_md5(preToken)
  return b64_md5(preToken);
};
```

<br>
3 - Informar a chave privada:

```javascript
var privateKey = "/** INFORM YOUR PRIVATE KEY HERE **/";
```

<br>
4 - Informar o parâmetro que será tokenizado

```javascript
var code = "/** INFORM YOUR CODE HERE **/";
```

<br>

```javascript
var linkHateoasObject = $call.contextVariables.get("linkHateoas");

var obj = JSON.parse($call.response.getBody().getString('UTF-8'));

var requestedUrl = $call.request.getRequestedUrl().toString();
var link1 = linkHateoasObject.createLinks((requestedUrl + "/resource1", "relation1", ["POST","PUT"]);
var link2 = linkHateoasObject.createLinks(requestedUrl + "/resource2", "relation2", ["GET"]);

link1.push(link2[0]);
obj.links = link1;
```
