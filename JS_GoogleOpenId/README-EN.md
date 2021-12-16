![N|Solid](https://www.google.com.br/images/branding/googleg/1x/googleg_standard_color_128dp.png)
# Google OpenID

[README-PT.md](README.md)

### Create API Google OpenID
1. Download the API import file `GoogleOpenIApi.json`.
2. After downloading, go to the `Settings > Export/Import` menu.
3. Click on `IMPORT`.
4. Select the `API` option.
5. Click on `SELECT FILE` and choose the file `GoogleOpenIdApi.json`.
6. Click on the `NEXT` button.
7. Select the `Google Open ID API v1` option.
8. Click on `IMPORT`.

After this procedure, go to the API and configure Environments.

### Environment

Once the API is set up, it is necessary to configure the Environment variables.

1. Access the `Environments` page.
2. Edit the chosen Environment.
3. Click on `ADD MAP` and add the `Google Variables` map.
4. Add the variables below.

### Google Variables

| Key | Value | Description |
| ------ | ------ | ------ |
| **google_client_id** | `<client_id>`| Client ID obtained from the Google Account|
| **google_client_secret** | `<client_secret>` | Client Secret obtained from the Google Account|
| **google_uri_callback** | `<url do gateway>/google/oauth/openid/callback `| Callback URI |
| **google_uri_step_1** | `https://accounts.google.com/o/oauth2/v2/auth?scope=openid email profile&redirect_uri=${redirect_uri}&response_type=code&state=${state}&client_id=${google_client_id}` | Google URI Step 01 |
| **google_uri_step_2** | ` https://www.googleapis.com/oauth2/v4/token?code=${code}&client_secret=${google_client_secret}&grant_type=authorization_code&redirect_uri=${redirect_uri}&client_id=${google_client_id} `|Google URI Step 02|
| **sensedia_oauth_uri** | `<url do gateway>/oauth/access-token`  | API Authorization address|

> :information_source: **Obs.:** `<url do gateway>`, it could be `http://localhost:8080` in case this is the value of your **Host / Inbound Address**

### Create Google credentials

Access [Credentials – Google API Console](https://console.developers.google.com/apis/credentials) and create a **OAuth Client ID** credential (`create credentials > OAuth client ID`), this will provide you a `client_id` and a `client_secret` that will be used in Environment.

> :information_source: **Obs.:** In `"Authorized redirect URIs"`, add callback URL shown in the `google_uri_callback` variable.

Update the variables `google_client_id` and `google_client_secret` from the Environment with respective obtained values.

### Associate App to the API

Associate the **App** that will request a token from a **Plan** and the API `Google Open ID API v1`.

| :warning: **ATTENTION!** In the same **App**, it is necessary to include the API that will be protected and that will use the generated `access_token`. The API must have the `OAuth` interceptor and the `Grant Type` as `Client Credentials`. |
| --- |

### Using the API

To use the API Google OpenID is necessary to do the following request.

```
curl -XPOST http://<url do gateway>/google/oauth/openid/redirect \
    -H 'client_id: <SENSEDIA_CLIENT_ID>' \
    -H 'Content-type: application/json' \
    -d '{"extraInfo": {"key01": "value01", "key02": "value02"}}'
```
> :information_source: **Obs.:** The extraInfo informed in the requisition's body is extracted and sent as a state to Google.

Expected response:

```
{
    "redirect_uri": "https://accounts.google.com/o/oauth2/v2/auth?scope=openid%20email%20profile&redirect_uri=http://localhost:8080/google/oauth/openid/callback&response_type=code&state=eyJjbGllbnRfaWQiOiI2ZTAxNDc1YS01ZTU3LTNiMTYtYmI3Yi0zY2RhOTc5MjA2MjUiLCJzZWNyZXQiOiJhZGJmMTI4OC0yZTE1LTMwZjYtYThkNy1kZWY3NGUxN2I0NDMiLCJleHRyYUluZm8iOnsidmFsdWUiOiIzMjQyMyIsInZhbHVlMiI6Ijg3NHloZ3QzIn19&client_id=google_client_id"
}
```

When you access the `redirect_uri` from the response shown above, you will be redirected to the authentication process where the access token is generated.