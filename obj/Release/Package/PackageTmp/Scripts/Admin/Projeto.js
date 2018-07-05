$(document).ready(function () {
    CarregaProjeto();
    CarregaComboProduto();
    $("#divCampos").hide();
    $("#txtTelefone").mask("(99) 9999-9999");
    $("#txtCNPJ").mask("99.999.999/0001-**");
    CarregaComboResponsavel();
});

function MonstraCampos() {
    $("#idProjeto").val(0);
    $("#divCampos").show();
    $("#txtCodigo").prop('disabled', false);
}

function CarregaComboProduto() {
    var pdata = {};
    $('#cbxProduto').append($('<option>', {
        value: 0,
        text: "Selecione"
    }));
    $.getJSON($("#BuscaProdutoURL").val(), pdata, function (data) {
        if (data.Result.length > 0) {
            $.each(data.Result, function (index, dados) {
                $('#cbxProduto').append($('<option>', {
                    value: dados.prd_Id,
                    text: dados.prd_Descricao
                }));
            });
        }
    });
}


function Validacao(pdata) {
    if (pdata["produtoId"] === "0") {
        $(".error").slideDown(300);
        $(".error").html("Selecione o Produto");
        $(".wait").slideUp(300);
        return false;
    }
    if (pdata["descricao"] === "") {
        $(".error").slideDown(300);
        $(".error").html("Descrição é um Campo Obrigatório");
        $(".wait").slideUp(300);
        return false;
    }
    if (pdata["idControle"] === "") {
        $(".error").slideDown(300);
        $(".error").html("Id Controle é um campo obrigatório");
        $(".wait").slideUp(300);
        return false;
    }
    if (pdata["idusrResponsavel"] === "") {
        $(".error").slideDown(300);
        $(".error").html("Obrigatório selecionar um responsável para o projeto");
        $(".wait").slideUp(300);
        return false;
    }

    return true;
}



function EditarProjeto(id, produto, descricao, idControle, responsavel) {
    $("#idProjeto").val(id);
    $("#cbxProduto option:contains('" + produto + "')").prop('selected', true);
    $("#txtDescricao").val(descricao);
    $("#txtCodigo").val(idControle);
    $("#cbxProdutoResponsavel option:contains('" + responsavel + "')").prop('selected', true);
    $("#txtCodigo").prop('disabled', true);
    $("#divCampos").show();
}


function CalculaProjetoId() {
    if (!$("#txtCodigo").prop('disabled')) {
        var pdata = {};
        pdata["produtoId"] = $("#cbxProduto").val();
        $.getJSON($("#CalculaIdProjetoURL").val(), pdata, function (data) {
            if (data.Result.length > 0) {
                $("#txtCodigo").val(data.Result);
            }
        });
    }
}


function CarregaProjeto() {

    $(".error").slideUp(300);
    $(".wait").slideDown(300);
    $(".wait").html("Aguarde!");

    var pdata = {};
    $("#tblDescricaoItens > tbody").empty();
    var tabela = "";
    var linhas = "";
    $.getJSON($("#BuscaProjetoURL").val(), pdata, function (data) {
        if (data.Result.length > 0) {
            $.each(data.Result, function (index, dados) {
                tabela = "<tr></td><td style=\"width:30px;\"><a href='#' onclick=\"EditarProjeto('" + dados.prj_Id + "'," +
                                                                                                         "'" + dados.prd_Descricao + "'," +
                                                                                                         "'" + dados.prj_Descricao + "'," +
                                                                                                         "'" + dados.prj_IdControle + "'," +
                                                                                                         "'" + dados.usr_Nome + "')\"><img src='../images/edit.png'></a>";
                tabela = tabela + "</td><td style=\"width:10%;\">" + dados.prj_Id;
                tabela = tabela + "</td><td style=\"width:25%;\">" + dados.prd_Descricao;
                tabela = tabela + "</td><td style=\"width:20%;\">" + dados.prj_Descricao;
                tabela = tabela + "</td><td style=\"width:20%;\">" + dados.prj_IdControle;
                tabela = tabela + "</td><td style=\"width:35%;\">" + dados.usr_Nome;
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


function SalvaProjeto() {
    var pdata = {};
    pdata["id"] = $("#idProjeto").val();
    pdata["produtoId"] = $("#cbxProduto").val();
    pdata["descricao"] = $("#txtDescricao").val();
    pdata["idControle"] = $("#txtCodigo").val();
    pdata["idusrResponsavel"] = $("#cbxProdutoResponsavel").val();

    if (Validacao(pdata)) {
        $.getJSON($("#MatemProjetoURL").val(), pdata, function (data) {
            if (data.Result.indexOf("Erro") === -1) {
                $(".error").slideUp(300);
                $(".wait").slideDown(300);
                $(".wait").html(data.Result);
                CarregaProjeto();
                $("#divCampos").hide();
            } else {
                $(".error").slideDown(300);
                $(".error").html(data.Result);
                $(".wait").slideUp(300);
            }
        });
    }
}

function CarregaComboResponsavel() {
    var pdata = {};
    $('#cbxProdutoResponsavel').append($('<option>', {
        value: 0,
        text: "Selecione"
    }));

    $.getJSON($("#BuscaResponsavelURL").val(), pdata, function (data) {
        if (data.Result.length > 0) {
            $.each(data.Result, function (index, dados) {
                $('#cbxProdutoResponsavel').append($('<option>', {
                    value: dados.usr_Id,
                    text: dados.usr_Nome
                }));
            });
        }
    });
}