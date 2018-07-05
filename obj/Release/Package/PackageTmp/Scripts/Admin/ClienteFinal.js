$(document).ready(function () {
    CarregaClienteFinal();
    $("#divCampos").hide();
});

function MonstraCampos() {
    $("#idClienteFinal").val(0);
    $("#divCampos").show();
}


function Validacao(pdata) {

    if (pdata["descricao"] === "") {
        $(".error").slideDown(300);
        $(".error").html("Descrição é um Campo Obrigatório");
        $(".wait").slideUp(300);
        return false;
    }
    return true;
}

function EditarClienteFinal(id, descricao, sigla) {
    $("#idClienteFinal").val(id);
    $("#txtDescricao").val(descricao);
    $("#txtSigla").val(sigla);
    $("#divCampos").show();
}



function CarregaClienteFinal() {
    $(".error").slideUp(300);
    $(".wait").slideDown(300);
    $(".wait").html("Aguarde!");

    var pdata = {};
    $("#tblDescricaoItens > tbody").empty();
    var tabela = "";
    var linhas = "";
    $.getJSON($("#BuscaClienteFinalURL").val(), pdata, function (data) {
        if (data.Result.length > 0) {
            $.each(data.Result, function (index, dados) {
                tabela = "<tr></td><td style=\"width:30px;\"><a href='#' onclick=\"EditarClienteFinal('" + dados.clf_id + "'," +
                                                                                                              "'" + dados.clf_Descricao + "',"+
                                                                                                              "'" + dados.clf_Sigla + "')\"><img src='../images/edit.png'></a>";
                tabela = tabela + "</td><td style=\"width:20%;\">" + dados.clf_id;
                tabela = tabela + "</td><td style=\"width:80%;\">" + dados.clf_Descricao;
                tabela = tabela + "</td></tr>";
                linhas = linhas + tabela;
            });
            $("#tblDescricaoItens > tbody").empty();
            $("#tblDescricaoItens > tbody").append(linhas);
        } else {
            $("#tblDescricaoItens > tbody").empty();
        }
        $(".error").slideUp(300);
        $(".wait").slideUp(300);
    });


}

function SalvaClienteFinal() {

    
    var pdata = {};
    pdata["id"] = $("#idClienteFinal").val();
    pdata["descricao"] = $("#txtDescricao").val();
    pdata["sigla"] = $("#txtSigla").val();

    if (Validacao(pdata)) {
        $.getJSON($("#MantemClienteFinalURL").val(), pdata, function (data) {
            if (data.Result.indexOf("Erro") === -1) {
                $(".error").slideUp(300);
                $(".wait").slideDown(300);
                $(".wait").html(data.Result);
                CarregaClienteFinal();
                $("#divCampos").hide();
            } else {
                $(".error").slideDown(300);
                $(".error").html(data.Result);
                $(".wait").slideUp(300);
            }
        });
    }
}