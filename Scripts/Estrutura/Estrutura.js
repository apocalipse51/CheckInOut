$(document).ready(function () {

    CarregaComboUsuarioFuncao();
    CarregaComboResponsavel();
    CarregaComboResponsavelf();
    $("#divCampos").hide();
    FiltrarEstrutura($("#idUsuario").val(), 0);

});

function Filtrar()
{
    FiltrarEstrutura($("#idUsuario").val(), $('#cbxUsuarioEstruturaf').val());
}

function EditarEstrutura(Nome, NomeFunc, SiglaFunc, NomeEstr, Aprova)
{
    $('#cbxUsuarioEstruturaf').hide();
    $("#divCampos").show();
    $("#txtNome").val(Nome);
    $("#cbxUsuarioFuncao option:contains('" + NomeFunc + "')").prop('selected', true);
    $("#cbxUsuarioEstrutura option:contains('" + NomeEstr + "')").prop('selected', true);
    $("#cbxUsuarioAprova option:contains('" + Aprova + "')").prop('selected', true);

}

function CarregaComboUsuarioFuncao() {
    var pdata = {};
    $('#cbxUsuarioFuncao').empty();
    $('#cbxUsuarioFuncao').append($('<option>', {
        value: 0,
        text: "Selecione"
    }));

    $.getJSON($("#BuscaFuncaoUsuarioURL").val(), pdata, function (data) {
        if (data.Result.length > 0) {
            $.each(data.Result, function (index, dados) {
                $('#cbxUsuarioFuncao').append($('<option>', {
                    value: dados.fnc_id,
                    text: dados.fnc_Nome
                }));
            });
        }
    });
}

function CarregaComboResponsavel() {
    var pdata = {};
    $('#cbxUsuarioEstrutura').empty();
    $('#cbxUsuarioEstrutura').append($('<option>', {
        value: 0,
        text: "Selecione"
    }));

    $.getJSON($("#BuscaResponsavelURL").val(), pdata, function (data) {
        if (data.Result.length > 0) {
            $.each(data.Result, function (index, dados) {
                $('#cbxUsuarioEstrutura').append($('<option>', {
                    value: dados.usr_Id,
                    text: dados.usr_Nome
                }));
            });
        }
    });
}

function AlterarEstrutura()
{


    var pdata = {};

    pdata["Nome"] = $("#txtNome").val();
    pdata["fnc_id"] = $("#cbxUsuarioFuncao").val();
    pdata["estr_id"] = $("#cbxUsuarioEstrutura").val();
    pdata["Aprova"] = $("#cbxUsuarioAprova").val();

    $.getJSON($("#AlterarEstruturaURL").val(), pdata, function (data) {
        if (data.Result.length > 0) {
         
            $("#txtNome").val("");
            $("#cbxUsuarioFuncao option:contains('Selecionar')").prop('selected', true);
            $("#cbxUsuarioEstrutura option:contains('Selecionar')").prop('selected', true);
            $("#cbxUsuarioAprova option:contains('Selecionar')").prop('selected', true);
            $("#divCampos").hide();

            FiltrarEstrutura($("#idUsuario").val(), 0);
            $('#cbxUsuarioEstruturaf').show();
        }
    });


}


function FiltrarEstrutura(usuario,usuarioFiltra) {

    $(".wait").slideDown(500);

    var pdata = {};
    pdata["usuarioId"] = usuario;
    pdata["estruturaId"] = usuarioFiltra;
    var tabela = "";
    var linhas = "";

    $.getJSON($("#FiltrarEstruturaUsuarioURL").val(), pdata, function (data) {
        if (data.Result.length > 0) {
            $.each(data.Result, function (index, dados) {

                var str = dados.AprovaEstr;
                var atual = dados.TargetAtual;
                var esperado = dados.Esperado;
                var sinal = "";

                if (str === 0) {

                    str = "Não";
                }
                else {
                    str = "Sim";
                }

                var margem = esperado * 0.1;

                if (atual >= (esperado - margem) && atual < (esperado + margem)) {
                    sinal = "</td><td><img src='../images/sinal_vd.png' title='Esperado " + esperado + "h'></a>";

                }
                else if (atual < esperado && atual < (esperado - margem)) {

                    sinal = "</td><td><img src='../images/sinal_vm.png' title='Esperado " + esperado + "h'></a>";

                } else {

                    sinal = "</td><td><img src='../images/sinal_am.png' title='Esperado " + esperado + "h'></a>";

                }


                tabela = "<tr><td style=\"width:10px;\"><a href='#' onclick=\"EditarEstrutura('" + dados.Nome + "','" + dados.NomeFunc + "','" + dados.SiglaFunc + "', '" + dados.NomeEstr + "' ,'" + str + "')\"><img src='../images/edit.png'></a>";
                tabela = tabela + "</td><td style=\"width:30%;\">" + dados.Nome;
                tabela = tabela + "</td><td style=\"width:30%;\">" + dados.NomeFunc;
                tabela = tabela + "</td><td style=\"width:20%;\">" + dados.SiglaFunc;
                tabela = tabela + "</td><td style=\"width:30%;\">" + dados.NomeEstr;
                tabela = tabela + "</td><td style=\"width:20%;\">" + str;
                tabela = tabela + "</td><td style=\"width:20%;color:red;\"><b>" + dados.TargetTotal + "</b>";
                tabela = tabela + "</td><td style=\"width:20%;color:green;\"><b>" + atual + "</b>";
                tabela = tabela + sinal;
                tabela = tabela + "</td></tr>";
                linhas = linhas + tabela;

            });

            $("#tblEstrutura > tbody").empty();
            $("#tblEstrutura > tbody").append(linhas);
        } else {
            $("#tblEstrutura > tbody").empty();
        }
    });

    $(".wait").slideUp(500);

}


function CarregaComboResponsavelf() {
    var pdata = {};
    $('#cbxUsuarioEstruturaf').empty();
    $('#cbxUsuarioEstruturaf').append($('<option>', {
        value: 0,
        text: "Selecione"
    }));

    $.getJSON($("#BuscaResponsavelURL").val(), pdata, function (data) {
        if (data.Result.length > 0) {
            $.each(data.Result, function (index, dados) {
                $('#cbxUsuarioEstruturaf').append($('<option>', {
                    value: dados.usr_Id,
                    text: dados.usr_Nome
                }));
            });
        }
    });
}