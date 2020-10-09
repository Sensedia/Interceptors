try {
    // Recupera o body da requisição. 
    var body = $request.getBody().getString('utf-8');
    // Procurando por elementos no Document utilizando xpath. Body
    var elements = $jdom.findElements($jdom.parse(body), "//*[local-name()='Body']");
    // verificando se encontrou o objeto
    if (!elements.isEmpty()) {
        // Se encontrou, vamos pegar o valor do elements na posição 0. e verificar se possui filhos. 
        if(elements.get(0).getChildren().isEmpty()){
            // Assim recuperamos nó que é o da operação. 
            var operation = elements.get(0).getChildren().get(0);
            // com a função getName() recuperamos o nome da operação sem o namespace.
            $call.tracer.trace("Operation Name: "+ operation.getName());
        }
    }




} catch (e) {

    $call.tracer.trace(e);
    throw e;

}