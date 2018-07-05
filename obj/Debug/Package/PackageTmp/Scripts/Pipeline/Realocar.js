$(document).ready(function () {
    
    CarregaComboResponsavel();

});

function CarregaComboResponsavel() {
    var pdata = {};
    $('#cbxUsuario').empty();
    $('#cbxUsuario').append($('<option>', {
        value: 0,
        text: "Selecione"
    }));

    $.getJSON($("#BuscaResponsavelURL").val(), pdata, function (data) {
        if (data.Result.length > 0) {
            $.each(data.Result, function (index, dados) {
                $('#cbxUsuario').append($('<option>', {
                    value: dados.usr_Id,
                    text: dados.usr_Nome
                }));
            });
        }
    });
}


function PegaParamUrl() {
    var param = {};

    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {

        param[key] = value;

    });

    return param;
}

function Realocar() {

    var pdata = {};

    var id = PegaParamUrl()["id"];
    pdata["id"] = id;

    pdata["usuario"] = $("#cbxUsuario").val();

    if (pdata["id"] != "" && pdata["usuario"] != "") {

            $.getJSON($("#RecusaProjetoURL").val(), pdata, function (data) {
            $("#CamposTextoJust").hide();
            document.getElementById('status').innerHTML = data.Result;

        });

    }
}