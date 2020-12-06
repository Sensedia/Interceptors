# SoapErrorFault
Custom interceptor de **'transformação'** do tipo **'fluxo'** responsável por para tratar o erro de um backend SOAP que utiliza a tag 'faultstring' e enviar uma resposta padronizada.

## Utilização:
1 - Adicione o interceptor no flow de **response** no _Resources_ _"All"_ - _Operations_ _"All"_ ou diretamente na operação que se deseja tratar.

2 - Salve as alterções no fluxo

3 - Salve as alterações na API
