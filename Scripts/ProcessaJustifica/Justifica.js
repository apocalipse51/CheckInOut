$(document).ready(function () {
    $("#CamposTextoJust").hide();
    JustificarCampos();
});

function JustificarCampos() {

    var status = document.getElementById('status').innerText;

    if (status.includes("aprovada") || status.includes("inválida"))
    {
        $("#CamposTextoJust").hide();

    } else {

        if (!status.includes("já")) {

            $("#CamposTextoJust").show();
        }
    }

}

function TextoJustificar() {
    var pdata = {};

    var id = PegaParamUrl()["id"];
    pdata["id"] = id;
    
    var justid = PegaParamUrl()["justid"];
    pdata["justid"] = justid;

    pdata["Justexto"] = $("#JustificativaTexto").val();

    if (pdata["id"] != "" && pdata["justid"] != "") {

        $.getJSON($("#JustificativaTextoHpoURL").val(), pdata, function (data) {

            $("#CamposTextoJust").hide();
            document.getElementById('status').innerHTML = "Observação registrada com sucesso !";

        });

    }
}

function PegaParamUrl()
{
    var param = {};

    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {

        param[key] = value;

    });

    return param;
}