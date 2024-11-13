'use strict';
/**
 * @description Responsável por validar ou manipular RSA's tokens JWT
 * @author: Guilherme Michelan Rodella (Taco)
 * @date: SET de 2024
 **/
// Importar classes Java necessárias
const X509EncodedKeySpec = java.security.spec.X509EncodedKeySpec;
const KeyFactory = java.security.KeyFactory;
const RSASSAVerifier = com.nimbusds.jose.crypto.RSASSAVerifier;
const SignedJWT = com.nimbusds.jwt.SignedJWT;

const VERSION = 0; // utilizado para verificar no trace qual versão exata do interceptor está o deploy do seu interceptor
$call.tracer.trace('------------ v' + VERSION);

const _consts = {
    keyType: {
        CUSTOM: 'CUSTOM',
        ENVIRONMENT: 'ENVIRONMENT',
        ENV_AND_ISSUER: 'ENV_AND_ISSUER',
        ISSUER: 'ISSUER'
    }
};

let _publicKeyType = 'DEFAULT';
let _console = $console;
let _jwtToken;
let _validateAudience = false;
let _validateIssuer = false;
let _validateSubject = false;

try {
    /**
     * Carrega a classe JWT Validator nas variáveis de contexto da API.
     * Para ser utilizado em outros interceptors, deve ser carregado no contexto da API
     * @example
     * const jwtValidator = $call.contextVariables.get('jwtValidator');
     */
  const jwtValidator = new jwtValidatorInterface();
  $call.contextVariables.put('jwtValidator', jwtValidator);

} catch (e) {
  $call.tracer.trace(e);
  $call.tracer.trace('Error in line ' + e.stack);

  stopFlow(401, {
    status: '401',
    message: 'Token inválido, ou expirado',
  });
}

/**
 * Interface para exposição de métodos públicos da classe.
 */
function jwtValidatorInterface() {
  this.validateJwt = _validateJwt;
  this.getTokenPayload = _getTokenPayload;
  this.setPublicKeyType = _setPublicKeyType;
  this.getVarFromToken = _getVarFromToken;
  this.setValidateAudience = _setValidateAudience;
  this.setValidateIssuer = _setValidateIssuer;
  this.setValidateSubject = _setValidateSubject;
  this.consts = _consts;
  
  this.setConsole = _setConsole;
}

function _setValidateAudience(value) {
  _validateAudience = (value === true);
}
function _setValidateIssuer(value) {
    _validateIssuer = (value === true);
}
function _setValidateSubject(value) {
    _validateSubject = (value === true);
}

function _setPublicKeyType(type) {
  _publicKeyType = type;
}

/**
 * Valida as claims obrigatórias e opicionais de um token JWT de acordo com a RFC 7519
 * <https://datatracker.ietf.org/doc/html/rfc7519#section-4.1>
 * 
 * @returns {boolean} que indica se o token JWT está válido
 */
function _validateJwt() {
    $call.tracer.trace('Validando Token');
    let isValid = false;

    try {
        _jwtToken = _getJwtToken();
        _console.debug('_jwtToken', _jwtToken);

        const publicKey = _getPublicKey();

        if (!!_jwtToken && !!publicKey) {
            const signedJWT = SignedJWT.parse(_jwtToken);
            const claims = signedJWT.getJWTClaimsSet();

            const now = Date.now();
            const exp = claims.getExpirationTime();
            if (now > exp.getTime()) {
                $call.tracer.trace('Data Expirada do JWT (exp)');
                return false;
            }

            const iat = claims.getIssueTime();
            if (!iat) {
                $call.tracer.trace('JWT sem data de emissão (iat)');
                return false;
            }
            if (iat.getTime() > now) {
                $call.tracer.trace('JWT emitido no futuro (iat)');
                return false;
            }

            if (_validateSubject) {
                const sub = String(claims.getSubject() || '');
                if (sub === '') {
                    $call.tracer.trace('Subject não informado (sub)');
                    return false;
                }
            }

            const jti = String(claims.getJWTID() || '');
            if (jti === '') {
                $call.tracer.trace('JWT ID não informado (jti)');
                return false;
            }

            if (_validateAudience) {
                if (_isNotValidAudience(claims)) {
                    $call.tracer.trace('JWT audience inválido (aud)');
                    return false;
                }
            }

            if (_validateIssuer) {
                if (_isNotValidIssuer(claims)) {
                    $call.tracer.trace('JWT issuer inválido (iss)');
                    return false;
                }
            }

            const verifier = new RSASSAVerifier(publicKey);
            isValid = signedJWT.verify(verifier);
        }
    } catch (err) {
        $call.tracer.trace('<< Erro provável no formato do token JWT >>');
        $call.tracer.trace(err);
        return false;
    }

    _console.debug('Token Válido', isValid);
    $call.tracer.trace('Validação do token: ' + isValid);
    return isValid;
}

/**
 * Verifica se o emissor (iss) do token JWT é diferente do que foi registrado para aquela APP
 * 
 * Para que esta função funcione é necessário que tenha um interceptor de Oauth, ou somente o de Client ID Validation  
 * devidamente configurado no fluxo da API antes do inteceptor que irá validar o token JWT.
 * Isso é necessário a menos que a regra implementada nessa validação seja alterada 
 * 
 * @param {Set<Claim>} claims 
 * @returns {boolean} que indica se o emissor do token JWT é válido
 */
function _isNotValidIssuer(claims) {
    const iss = String(claims.getIssuer() || '');

    // nessa estratégia pega o issuer de uma variável registrada na APP (na credencial de acesso)
    const issuer = String($call.app.extraInfo.get('issuer') || ''); // essa linha que obriga a ter o interceptor de Client ID Validation, ou Oauth configurado no fluxo da API
    // outras estratégias poderiam ser extrair o issuer de uma variável de ambiente, 
    // ou mesmo de uma combinação do campo iss com uma variável de ambiente json cadastrada nas variáveis de ambiente.
    // ex.: const issuer = String($call.environmentVariables.get('issuer') || '');
    if (!issuer || !iss) {
        return true;
    }
    if (iss !== issuer) {
        $call.tracer.trace('Issuer inválido: ' + iss);
        $call.tracer.trace('O campo issuer deve estar devidamente cadastrado na {estratégia escolhida, ex.: APP, Variável de Ambiente...}');
        return true;
    }
    return false;
}

/**
 * Verifica se um a claim de audiênce é válida com o que está registrado na APP
 * 
 * Esta função também obriga que tenha um interceptor de Client ID Validation, ou Oauth devidamente configurado no fluxo da API
 * antes mesmo da execução da validação do token JWT.
 * 
 * @param {Set<Claim>} claims 
 * @returns {boolean} que indica se a claim de audiênce está válida
 */
function _isNotValidAudience(claims) {
    // pega de dentro da credencial de acesso (APP) o campo de audience para verificar se possui permissão para o que foi passada na claim
    const audience = String($call.app.extraInfo.get('audience') || '');
    if (!audience) {
        return true;
    }
    let expectedAudience = audience.split(',')
      .map(function (audit) {
        return String(audit || '').trim();
      });

    const aud = claims.getAudience();
    let audArr = [];
    // coerção de array java para array js
    for (let i = 0; i < aud.size(); i++) {
      audArr.push(String(aud.get(i)));
    }

    const hasNotAudience = !audArr
      .some(function(item) {
        return expectedAudience.indexOf(item) !== -1;
      });

    if (hasNotAudience) {
        $call.tracer.trace('Audience inválido: ' + aud);
        $call.tracer.trace('O campo audience deve estar devidamente cadastrado na APP');
    }
    return hasNotAudience;
}

/**
 * Retorna uma claim específica do token JWT
 * 
 * @param {string} varName 
 * @returns {JSON} que representa o valor daquela claim, podendo ser um tipo primitivo, ou um Array, ou objeto JSON.
 */
function _getVarFromToken(varName) {
    if(!_jwtToken) {
        _jwtToken = _getJwtToken();
    }
    const tokenPayload = _getTokenPayload(_jwtToken);
    
    _console.debug('varName', varName);
    _console.debug('tokenPayload', tokenPayload);
    return tokenPayload[varName];
}

/**
 * Retorna o token JWT sem a string Bearer do header Authorization
 * 
 * @returns {string} com o valor token JWT
 */
function _getJwtToken() {
  const authorization = String($request.getHeader('Authorization') || '');

  if (!authorization) {
    return null;
  } else {
    let token = authorization.replace('Bearer', '').trim();
    if (!token)
        return null;
    return token;
  }
}

/**
 * Retorna a sigla do emissor que deve estar devidamente registrada na APP para funcionar no campo sigla_emissor
 * Esta função também obriga que tenha um interceptor de Client ID Validation, ou Oauth devidamente configurado no fluxo da API
 * antes mesmo da execução da validação do token JWT.
 * 
 * No entanto, só é necessário caso o tipo de validação escolhida seja por ENV_AND_ISSUER
 * 
 * @returns {string} com o valor do emissor registrado na APP
 */
function _getSiglaEmissorFromAPP() {
  let siglaEmissor = '';
  if ($call.app.extraInfo) {
    const extraFields = $call.app.extraInfo;

    siglaEmissor =  String(extraFields.get('sigla_emissor') || '');
  }

  if (!siglaEmissor) {
    $call.tracer.trace('Ocorreu um erro ao validar o token. Emissor não encontrado na APP.');
  }
  return siglaEmissor;
}

/**
 * Retorna a chave pública para validação do token JWT
 *
 * Para que esta função funcione é necessário que seja configurado um dos tipos de chave pública pelo método setPublicKeyType
 * 
 * Aqui existem 3 formas pré-configuradas de se validar o token JWT,
 * mas também tem um tipo CUSTOM, onde você pode implementar sua própria lógica de recuperar a chave pública
 * 
 * @returns {java.security.PublicKey}
 */
function _getPublicKey() {
  $call.tracer.trace('pegando a chave via: [' + _publicKeyType + ']');

  switch (_publicKeyType) {
    case _consts.keyType.ENVIRONMENT:
      // TODO: alterar publicKeyENVIRONMENT pela sua variavel de ambiente publica para validação do token
      const key = String($call.environmentVariables.get('publicKeyENVIRONMENT') || '');
      return _parseKeyFromEnvironmentToPublicKey(key);
      // o formato da chave pública é algo do tipo abaixo:
      // return (
      //   '-----BEGIN PUBLIC KEY-----\n' +
      //   key +
      //   '\n-----END PUBLIC KEY-----'
      // );
    case _consts.keyType.CUSTOM:
        // put here your code
      break;
    case _consts.keyType.ENV_AND_ISSUER:
      const siglaEmissor = _getSiglaEmissorFromAPP();
      return _parseKeyFromEnvironmentToPublicKey(
        String($call.environmentVariables.get('publicKey' + siglaEmissor.toUpperCase()))
      );
    case _consts.keyType.ISSUER:
      let issuer = _getKeyFromIssuer();
      const envKey = String($call.environmentVariables.get(issuer) || '');
      return _parseKeyFromEnvironmentToPublicKey(envKey);
    default:
      break;
  }

  $call.tracer.trace('Ocorreu um erro ao validar o token Keyclok. Chave-pública não encontrada para o emissor.');
  return null;
}

/**
 * Transforma e devolve a chave pública de string para o formato PublicKey
 * 
 * @param {string} key 
 * @returns {java.security.PublicKey} com o valor da chave pública convertida para o formato PublicKey
 */
function _parseKeyFromEnvironmentToPublicKey(key) {
  if (!key) {
    $call.tracer.trace('Ocorreu um erro ao validar o token Keycloak. chave [' + key + '] não encontrada.');
    return null;
  }
  const decodedKey = $base64.decode(key);
  const spec = new X509EncodedKeySpec(decodedKey);
  const keyFactory = KeyFactory.getInstance('RSA');
  return keyFactory.generatePublic(spec);
}

/**
 * Retorna o payload do token JWT em JSON
 * 
 * @param {string} token JWT sem o Bearer 
 * @returns {JSON} com a parte do payload do token JWT já decodada.
 */
function _getTokenPayload(token) {
  return JSON.parse($base64.decodeString(token.split('.')[1]));
}

/**
 * Retorna o nome da variável de ambiente que contém a chave pública para validação do token JWT
 * 
 * Aqui é necessário que a variável de ambiente acessosKeys esteja devidamente registrada nas variáveis de ambiente e com a estrutura
 * [{"patter": "[valor final do realm emissor]", "key": "[valor da variável de ambiente que está registrada a chave pública]"}]
 *
 * @returns {string} com o valor do nome da chave pública
 */
function _getKeyFromIssuer() {
  const auth = String($request.getHeader('Authorization') || '').replace('Bearer ', '');
  _console.debug('auth', auth);

  const payloadJwt = _getTokenPayload(auth);
  const iss = String(payloadJwt.iss || '');
  
  let key = 'publicKeyTACO';
  const issArray = iss.trim().split('/realms');

  const accessKeys = JSON.parse($call.environmentVariables.get('acessosKeys'));
  if (issArray.length > 0) {
    const issuer = issArray[1];
    $call.tracer.trace('emissor: ' + issuer);

    for (let i=0; i<accessKeys.length; i++) {
      if(issuer == accessKeys[i].pattern.trim()) {
        return accessKeys[i].key;
      }
    }
  }

  $call.tracer.trace('Chave do emissor e/ou (iss): ['+ iss + '] não encontrado(s)!');
  return key;
}

/**
 * Utilitário para debugar o código dessa classe no API Trace da Sensedia.
 * 
 * Para funcionar é necessário que o toggle feature de Debug esteja ligado no interceptor que irá carregar e executar essa classe.
 * 
 * @param {$console} console 
 */
function _setConsole(console) {
    _console = console;
}

/**
 * Função utilitária para parar o fluxo da API e devolver uma resposta para o cliente.
 * 
 * @param {integer} code 
 * @param {string} body 
 */
function stopFlow(code, body) {
  $call.decision.setAccept(false);
  $call.stopFlow = true;
  $call.response = new com.sensedia.interceptor.externaljar.dto.ApiResponse();
  $call.response.setStatus(code);
  if (body) {
      $call.response.setHeader('Content-Type', 'application/json');
  }
  $call.response.getBody().setString(String(body || ''), 'utf-8');
}
