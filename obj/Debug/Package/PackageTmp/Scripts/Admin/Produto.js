$(document).ready(function () {
    CarregaProduto();
    CarregaComboClienteFinal();
    $("#divCampos").hide();
});

function MonstraCampos() {
    $("#idProduto").val(0);
    $("#divCampos").show();
}

function CarregaComboClienteFinal() {
    var pdata = {};
    $('#cbxClienteFinal').append($('<option>', {
        value: 0,
        text: "Selecione"
    }));
    $.getJSON($("#BuscaClienteFinalURL").val(), pdata, function (data) {
        if (data.Result.length > 0) {
            $.each(data.Result, function (index, dados) {
                $('#cbxClienteFinal').append($('<option>', {
                    value: dados.clf_id,
                    text: dados.clf_Descricao
                }));
            });
        }
    });
}


function Validacao(pdata) {
    if (pdata["clienteFinalId"] === "0") {
        $(".error").slideDown(300);
        $(".error").html("Selecione o Cliente Final");
        $(".wait").slideUp(300);
        return false;
    }
    if (pdata["descricao"] === "") {
        $(".error").slideDown(300);
        $(".error").html("Descrição é um Campo Obrigatório");
        $(".wait").slideUp(300);
        return false;
    }
    return true;
}

function EditarProduto(id, idClienteFinal, descricao, sigla) {
    $("#idProduto").val(id);
    $("#cbxClienteFinal option:contains('" + idClienteFinal + "')").prop('selected', true);
    $("#txtDescricao").val(descricao);
    $("#txtSigla").val(sigla);
    $("#divCampos").show();
}



function CarregaProduto() {
    $(".error").slideUp(300);
    $(".wait").slideDown(300);
    $(".wait").html("Aguarde!");

    var pdata = {};
    $("#tblDescricaoItens > tbody").empty();
    var tabela = "";
    var linhas = "";
    $.getJSON($("#BuscaProdutoURL").val(), pdata, function (data) {
        if (data.Result.length > 0) {
            $.each(data.Result, function (index, dados) {
                tabela = "<tr></td><td style=\"width:30px;\"><a href='#' onclick=\"EditarProduto('" + dados.prd_Id + "'," +
                                                                                                         "'" + dados.clf_Descricao + "'," +
                                                                                                         "'" + dados.prd_Descricao + "',"+
                                                                                                         "'" + dados.prd_Sigla + "')\"><img src='../images/edit.png'></a>";
                tabela = tabela + "</td><td style=\"width:20%;\">" + dados.prd_Id;
                tabela = tabela + "</td><td style=\"width:40%;\">" + dados.clf_Descricao;
                tabela = tabela + "</td><td style=\"width:40%;\">" + dados.prd_Descricao;
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

function SalvaProduto() {

    var pdata = {};
    pdata["id"] = $("#idProduto").val();
    pdata["descricao"] = $("#txtDescricao").val();
    pdata["clienteFinalId"] = $("#cbxClienteFinal").val();
    pdata["sigla"] = $("#txtSigla").val();

    if (Validacao(pdata)) {
        $.getJSON($("#MantemProdutoURL").val(), pdata, function (data) {
            if (data.Result.indexOf("Erro") === -1) {
                $(".error").slideUp(300);
                $(".wait").slideDown(300);
                $(".wait").html(data.Result);
                CarregaProduto();
                $("#divCampos").hide();
            } else {
                $(".error").slideDown(300);
                $(".error").html(data.Result);
                $(".wait").slideUp(300);
            }
        });
    }
}