$(function() {
    customScriptInitialize();
});

function customScriptInitialize() {

    fixParameterContentTypes();

    function fixParameterContentTypes() {
        $('select.content-type option').text = 'application/fhir+json';
    }
}
