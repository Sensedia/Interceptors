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

- Master Repo<br>&nbsp;&nbsp;&nbsp;&nbsp;
       |- Categoria<br>
              |- Tipo (Flow ou Class)<br>
                        |- Interceptor<br>
                                |- JS_Interceptor<br>
                                |- JV_Interceptor<br>
                                |- Readme<br>
       |- Readme

  - A raíz do repositório irá conter todas as categorias de interceptors e um documento ReadMe;
  - Cada categoria irá conter os tipos de interceptors. As categoria podem ser: <b>security</b>, <b>transformation</b>, <b>utility</b>, etc.
  - Os tipos de interceptors irá conter todos os interceptors e podem ser <b>Flow(Fluxo)</b> ou <b>Class(Classe)</b>.
  - Cada interceptor deve estar separado por uma pasta.
  - Interceptor pode ser <b>Java</b> ou <b>JavaScript</b>;
  - Cada interceptor deve ter o seu Readme;
  - Pasta de interceptor JavaScript deve ter o prefixo <b>JS_</b> e pasta de interceptor Java deve ter o prefixo <b>JV_</b>.

## Contribua conosco!
Você tem um interceptor que gostaria de compartilhar com o time Sensedia e com os nossos clientes incríveis? Fique fique à vontade.