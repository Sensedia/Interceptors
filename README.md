# Sensedia API Plataform - Interceptors Libraries

## Objetivo
Repositório corporativo de Interceptors genéricos (Javascript e Java) criados dentro do Sensedia API Manager para que todas as equipes, sejam elas da Sensedia ou dos clientes, possam reusá-los sem a necessidade de recriá-los, seja com outros nomes ou com outros códigos-fontes.
<br>
Tornar a existência dos Interceptors conhecida corporativamente.
<br>
Facilitar a descoberta e o acesso aos Interceptors.
<br>
Ter uma melhor gestão no versionamento dos Interceptors.
<br>
Adotar padrões e boas práticas de implementação para melhorar a qualidade do código.

## Estrutura
O nosso repositório possui a seguinte estrutura:

- Master Repo
       |- Categoria
              |- Tipo (Flow ou Class)
                        |- Interceptor
                                |- JS_Interceptor
                                |- JV_Interceptor
                                |- Readme
       |- Readme

  - A raíz do repositório irá conter todas as categorias de interceptors e um documento ReadMe;
  - Cada categoria irá conter os tipos de interceptors. As categoria podem ser: security, transformation, utility, etc.
  - Os tipos de interceptors irá conter todos os interceptors e podem ser Flow(Fluxo) ou Class(Classe).
  - Cada interceptor deve estar separado por uma pasta.
  - Interceptor pode ser Java ou JavaScript;
  - Cada interceptor deve ter o seu Readme;
  - Pasta de interceptor JavaScript deve ter o prefixo JS_ e pasta de interceptor Java deve ter o prefixo JV_.

## Contribua conosco!
Você tem um interceptor que gostaria de compartilhar com o time Sensedia e com os nossos clientes incríveis? Fique fique à vontade.