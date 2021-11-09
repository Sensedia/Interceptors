![N|Solid](https://www.google.com.br/images/branding/googleg/1x/googleg_standard_color_128dp.png)
# Google OpenID

### Criar API do Google OpenID
1. Realizar o download do arquivo de importação de api `GoogleOpenIApi.json`
2. Após realizar o donwload ir no menu `Settings > Export/Import`
3. Clicar no botão `IMPORT`
4. Selecionar a opção `API`
5. Clicar no botão `SELECT FILE` e escolher o arquivo `GoogleOpenIdApi.json`
6. Clicar no botão `NEXT`
7. Selecionar a opção `Google Open ID API v1`
8. Clicar no botão `IMPORT`

Após esse procedimento entrar na API e configurar os "Environments".

### Environment

Depois da API configurada, temos que configurar as variáveis do Environment. 

1. Acessar a página de `Environments`
2. Editar o Environment desejado
3. Clicar no botão `ADD MAP` e adicionar o map `Google Variables`.
4. Adicionar as variáveis abaixo.

### Google Variables

| Key | Value | Description |
| ------ | ------ | ------ |
| **google_client_id** | `<client_id>`| Client ID obtido da Conta do Google|
| **google_client_secret** | `<client_secret>` | Client Secret obtido da Conta do Google|
| **google_uri_callback** | `<url do gateway>/google/oauth/openid/callback `| URI de callback |
| **google_uri_step_1** | `https://accounts.google.com/o/oauth2/v2/auth?scope=openid email profile&redirect_uri=${redirect_uri}&response_type=code&state=${state}&client_id=${google_client_id}` | Google URI Step 01 |
| **google_uri_step_2** | ` https://www.googleapis.com/oauth2/v4/token?code=${code}&client_secret=${google_client_secret}&grant_type=authorization_code&redirect_uri=${redirect_uri}&client_id=${google_client_id} `|Google URI Step 02|
| **sensedia_oauth_uri** | `<url do gateway>/oauth/access-token`  | Endereço do API Authorization|

> **Obs.:** `<url do gateway>`, pode por exemplo ser `http://localhost:8080` caso este seja o valor do seu **Host / Inbound Address**

### Criar credenciais do Google

Acessar [Credentials – Google API Console](https://console.developers.google.com/apis/credentials) e criar uma credencial do tipo **OAuth Client ID** (`create credentials > OAuth client ID`), isso lhe dará um `client_id` e um `client_secret` que será usado no Enviroment.

> **Obs.:** Em `"Authorized redirect URIs"` adicionar a URL de _callback_ informada na variável `google_uri_callback`.

Atualize as variáveis `google_client_id` e `google_client_secret` do Environment com os respectivos valores obtidos.  

### Associar App à API

Associar o **App** que vai requisitar o token a um **Plan** e a API `Google Open ID API v1`.

**Atenção**! No mesmo **App** é necessário incluir a API que será protegida e usará o `access_token` gerado, a API deve ter o interceptor de `OAuth` e o `Grant Type` como `Client Credentials`.

### REST API
---

Para utilizar a API do Google OpenID realizamos o seguinte _request_.

```
curl -XPOST http://<url do gateway>/google/oauth/openid/redirect \
    -H 'client_id: <SENSEDIA_CLIENT_ID>' \
    -H 'Content-type: application/json' \
    -d '{"extraInfo": {"key01": "value01", "key02": "value02"}}'
```
> **Obs.:** O extraInfo informado no corpo na requisição é extraído enviado como _state_ para o Google.

_Response_ esperado:

```
{
    "redirect_uri": "https://accounts.google.com/o/oauth2/v2/auth?scope=openid%20email%20profile&redirect_uri=http://localhost:8080/google/oauth/openid/callback&response_type=code&state=eyJjbGllbnRfaWQiOiI2ZTAxNDc1YS01ZTU3LTNiMTYtYmI3Yi0zY2RhOTc5MjA2MjUiLCJzZWNyZXQiOiJhZGJmMTI4OC0yZTE1LTMwZjYtYThkNy1kZWY3NGUxN2I0NDMiLCJleHRyYUluZm8iOnsidmFsdWUiOiIzMjQyMyIsInZhbHVlMiI6Ijg3NHloZ3QzIn19&client_id=google_client_id"
}
```

Ao acessar o `redirect_uri` do _Response_ anterior é realizado o redirecionamento, onde após o processo de autenticação é gerado o Access Token.