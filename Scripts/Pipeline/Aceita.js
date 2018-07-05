$(document).ready(function () {
    $("#CamposTextoJust").hide();
    JustificarCampos();
});

function JustificarCampos() {

    var status = document.getElementById('status').innerText;

    if (status.includes("aceito") || status.includes("já"))
    {
        $("#CamposTextoJust").hide();

    } else {

        $("#CamposTextoJust").show();
        
    }

}

function Justificar() {
    var pdata = {};

    var id = PegaParamUrl()["id"];
    pdata["id"] = id;

    pdata["just"] = $("#Justificativa").val();

    if (pdata["id"] != "" && pdata["just"] != "") {

        $.getJSON($("#RecusaProjetoURL").val(), pdata, function (data) {

            $("#CamposTextoJust").hide();
            document.getElementById('status').innerHTML = data.Result;

        });

    }
}

function PegaParamUrl() {
    var param = {};

    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {

        param[key] = value;

    });

    return param;
}