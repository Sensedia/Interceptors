# Sensedia API Plataform - Interceptors Libraries

## Objetivos
* Repositório corporativo de Interceptors genéricos (Javascript e Java) criados dentro do Sensedia API Manager para que todas as equipes (Sensedia, ou, clientes) possam reusá-los sem a necessidade de recriá-los com outros nomes, ou, códigos-fontes;

* Tornar a existência dos Interceptors conhecida corporativamente;

* Facilitar a descoberta e o acesso aos Interceptors;

* Ter uma melhor gestão no versionamento dos Interceptors;

* Adotar padrões e boas práticas de implementação para melhorar a qualidade do código;

## Estrutura
O nosso repositório possui a seguinte estrutura:

  * Master Repo
    * Categoria
      * Tipo (Flow, ou, Class)
        * Interceptor
          * JS_Interceptor
          * JV_Interceptor
          * Readme
    * Readme

  * A **raíz do repositório irá conter**:
    * as `Categorias` contendo os *tipos* de `Interceptors`
    * um documento `ReadMe`

  * As `Categorias` podem ser:
    * `security`
    * `transformation`
    * `utility`
    * etc

  * Cada `Interceptor`:
    * pertence a um dos tipos:
      * `Flow (Fluxo)`
      * `Class (Classe)`
    * quando desenvolvindo em:
        * `Java`
          * A pasta `Interceptor Java` deve ter o prefixo **JV_**
        * `JavaScript`
          * A pasta `Interceptor JavaScript` deve ter o prefixo **JS_**
    * possui seu próprio documento `ReadMe`

## Contribua conosco!
Você tem um Interceptor que gostaria de compartilhar com o time Sensedia e com os nossos clientes incríveis?

Fique à vontade.
