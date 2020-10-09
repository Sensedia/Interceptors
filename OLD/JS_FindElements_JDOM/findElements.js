try {
    // Recupera o body de response. 
    var body = $response.getBody().getString('utf-8');
    // Procurando por elementos no Document utilizando xpath. situacao
    var elements = $jdom.findElements($jdom.parse(body), "//*[local-name()='situacao']");
    // verificando se encontrou o objeto
    if (!elements.isEmpty()) {
        // Se encontrou, vamos pegar o valor do elements na posição 0. 
        var acao = elements.get(0).getValue();
        // O LocaleCompare é melhor para tratar de comparação de strings. 
        if (acao.localeCompare('E')==0) {
            $call.response.setStatus(400);
        } else {
            $call.response.setStatus(200);
        }
    }




} catch (e) {

    $call.tracer.trace(e);
    throw e;

}