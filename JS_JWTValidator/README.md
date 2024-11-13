# JWT Validate Interceptor
Este Interceptor tem a finalidade de efetuar validações de Tokens JWT do tipo RSA _"on the fly"_, ou seja, no próprio Gateway da Sensedia, sem a necessidade de ter que gastar mais latência indo ao backend para efetuar validações extras.

Este interceptor possui um único método que irá validar o token JWT, mas também é uma classe utilitália para manipulação do JWT

Nela você encontra métodos para: </br>
<ul>
<li>Validar o token JWT</li>
<li>Extrair o payload do JWT em formato JSON</li>
<li>Extrair um único campo de dentro do payload do JWT</li>
</ul>

## Antes de utilizar 
É aconselhável declarar esse interceptor na lista de Interceptors do API Platform.

## Utilização
Para utilizar esse interceptor basta incluir ele no fluxo de <strong>request</strong> antes do interceptor que irá aplicar a validação propriamente dita

Uma vez que esteja inserido esse inteceptor basta buscá-lo do contexto num próximo interceptor da seguinte forma:

```javascript
const jwtValidator = $call.contextVariables.get('jwtValidator');
```

E pronto. Agora a constante jwtValidator irá conter o método de validação do jwt `validateJwt(void)`

Que para funcionar basta escolher por qual tipo de chave pública será validado:
<ul>
<li>CUSTOM</li>
<li>ENVIRONMENT</li>
<li>ISSUER</li>
<li>ENV_AND_ISSUER</li>
</ul>

Que estão acessíveis também pela constante `consts` dentro da classe JwtValidator no objeto JSON a seguir:
```javascript
consts = {
    keyType: {
        CUSTOM: "CUSTOM",
        ENVIRONMENT: "ENVIRONMENT",
        ISSUER: "ISSUER",
        ENV_AND_ISSUER: "ENV_AND_ISSUER"
    }
}
```

Para escolher o tipo basta utilizar um dos métodos disponibilizados o `setPublicKeyType([@param string])`.
E para passar a string como parâmetro pode ser utilizada essas constantes através do acesso direto da classe `jwtValidator.consts.keyType.[...]`
Por default não é utilizado nenhum tipo de chave pública para validar o token, logo será necessário utilizar esse método para selecionar o tipo escolhido e implementar essa parte.

Adiante iremos explicar cada método e no *setPublicKeyType* falaremos mais sobre como fazer essa implementação.

Abaixo temos um exemplo completo de como seria a implementação do interceptor que irá utilizar o interceptor *JWT Validator*, lembrando que estamos pegando a public key pelo tipo mais simples, pelo tipo ENVIRONMENT:
```javascript

const jwtValidator = $call.contextVariables.get('jwtValidator');
// utilizado para debugar algum elemento dentro da classe JwtValidator utilizando _console.debug no lugar de $console.debug
jwtValidator.setConsole($console);

try {
    (function() {
        jwtValidator.setPublicKeyType(jwtValidator.consts.keyType.ENVIRONMENT);
        jwtValidator.setValidateAudience(true);
        const jwtValid = jwtValidator.validateJwt();

        // O trecho abaixo serve apenas para devolver a chamada para o client que chamou
        // informando se o JWT está valido ou não, independente de dar 200, ou 401.
        stopFlow((jwtValid) ? 200 : 401, JSON.stringify({
            message: 'ok',
            jwtValid: jwtValid
        }));
    })();
} catch (e) {
    $call.tracer.trace(e);
    throw e;
}

function stopFlow(code, body) {
    $call.decision.setAccept(false);
    $call.stopFlow = true;
    $call.response = new com.sensedia.interceptor.externaljar.dto.ApiResponse();
    $call.response.setStatus(code);
    if (body) {
        $call.response.setHeader('Content-Type', 'application/json');
    }
    $call.response.getBody().setString(String(body || ''), "utf-8");
}
```

#### validateJwt()
Valida a estrutura do token JWT e assinatura RSA de acordo com as _claims_ que se quer validar.
Por default a maioria das _claims_ não são obrigatórias, por isso existem _flags_ para configurar se queremos ou não validar aquela _claim_ ou não.

```javascript
jwtValidar.validateJwt()
// retorna true ou false caso o token esteja expirado, ou que não atenda a alguma _claim_
```

#### getTokenPayload(jwt)
Este método serve para capturarmos o payload completo do token JWT, decodificar ele e retorná-lo em formato JSON, caso precise de alguma _claim_ para alguma implementação no Gateway.

```javascript
jwtValidator.getTokenPayload(tokenJwt)
```

#### getVarFromToken(claim)
Este método é um utilitário como o anterior só que ao invés de devolver o valor de todas as _claims_ do payload em formato JSON, aqui devolvemos o valor de uma única _claim_ do payload 

```javascript
jwtValidator.getVarFromToken(claim); // onde a claim pode ser iss, iat, ext, ou qualquer outra.
// se a claim não existir ou o token não for passado no header Authorization será retornado undefined.
```

#### setPublicKeyType
Este método serve para identificar de onde iremos pegar a chave pública para fazer a validação futura no método `validateJwt`

Lembrando que a chave pública é aquele arquivo publicKey.pem que foi gerado para ser utilizado na criação do seu token JWT, algo do tipo:
```javascript
-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEApGIm8rhbacwZOm+n1B40j4ePsrykRFUv0HmyneFvssgOOkpg1/labiStc1LYcmjlu8UyEGCw1zCd6LYsHsObRLe....
-----END PUBLIC KEY-----
```
Só que no Gateway você vai subir a sua chave sem as partes do _BEGIN_ e _END_ public keys `-----BEGIN PUBLIC KEY-----` 

##### ENVIRONMENT

Voltando à explicação desse método, a forma mais simples aqui é fazer a validação por uma variável de ambiente: *ENVIRONMENT*.
Lembrando de trocar o trecho aonde ele é tratado pela variável de fato que estiver registrada no seu API Platform

```javascript
case _consts.keyType.ENVIRONMENT:
// TODO: alterar publicKeyENVIRONMENT pela sua variavel de ambiente publica para validação do token
const key = String($call.environmentVariables.get('publicKeyENVIRONMENT') || '');
return parseKeyFromEnvironmentToPublicKey(key);
```

E para validar o JWT com esse tipo de validação precisamos adicionar a seguinte execução no segundo interceptor, aquele que irá chamar a validação
```javascript
jwtValidator.setPublicKeyType(jwtValidator.consts.keyType.ENVIRONMENT); // isso antes da linha que chama o validaJwt()
```

##### ISSUER

O mecanismo de pegar a chave pública pelo tipo *ISSUER* é particularmente interessante pela forma que foi implementada, com este tipo você pode combinar a _claim_ emissor (iss) do seu token com alguma variável de ambiente, pois o que temos na variável de ambiente é um array de chaves, que eu digo ser interessante por conseguir validar vários emissores com um único interceptor e várias chaves diferentes.

A estrutura que guardamos na variáveis de ambiente *acessosKeys* é a seguinte:
```javascript
[
    {
        "pattern": "/taco",
        "key": "publicKeyTACO"
    }
]
```
Aqui o _pattern_ fazemos uma lógica onde deve ter o final idêntico ao da _claim_ *iss* para pegar a _key_, que por sua vez é a variável de ambiente aonde está guardada a chave pública. 

Uma particularidade é que pelo tipo _ISSUER_ se ele não encontrar nenhum padrão devolvemos sempre a chave _default_ *publicKeyTACO*, como está no método privado `_getKeyFromIssuer`, não esqueça de alterá-lo com a sua chave default publica.

##### ENV_AND_ISSUER

Aqui ele combina o que chamos de emissor e variável de ambiente, porque ele irá pegar a variável de ambiente de acordo com a sigla do emissor que estiver registrado na APP, na credencial de acesso vinculada ao client_id e secret que existe dentro da Sensedia.

Para que funcione esse tipo a sua API precisa ter o interceptor de *Oauth*, ou o *Client ID Validation* devidamente configurado no fluxo da API e antes do interceptor de validação propriamente dito.


#### setValidateAudience
Este método serve para configurar se queremos validar a _claim_ de audience (aud) ou não.
```javascript
jwtValidator.setValidateAudiente(true);
```

#### setValidateIssuer
Este método serve para configurar se queremos validar a _claim_ de issuer (iss) ou não.
```javascript
jwtValidator.setValidateAudiente(true);
```

#### setValidateSubject
Este método serve para configurar se queremos validar a _claim_ de subject (sub) ou não.
```javascript
jwtValidator.setValidateAudiente(true);
```

#### setConsole($console)
Este método serve só para passar como referência o $console para conseguirmos debugar um interceptor que já foi adicionado no contexto da API anteriormente.

### Outras Considerações
Veja que de acordo com a RFC ainda falta implementar a não obrigatoriedade dos campos de data de criação (iat) e expiração (ext), identificador do JWT (jti) e a _claim_ de _"not before"_ (nbf), esta utilizada para verificar se o token não está sendo gerado para ser utilizado futuramente e sim no exato momento em que está sendo gerado.
De fato, não está todo implementado, mas para isso basta implementar métodos simples como `setValidateAudience` e ajustar às necessidades do seu projeto, sendo que o principal motivo de existir esse interceptor ainda é o fato de demonstrar como utilizar classes Java dentro de um _Custom JavaScript Interceptor_ e fazer validações de tokens JWT utilizando a biblioteca _JOSE_ do Java. 

#### Mais informações: 
Versão: 1.0 </br> 
Autor: Guilherme Michelan [Taco] (taco@sensedia.com) </br> 
