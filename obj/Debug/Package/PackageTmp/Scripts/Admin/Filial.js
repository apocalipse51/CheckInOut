$(document).ready(function () {
    CarregaFilial();
    CarregaContratante();
    $("#divCampos").hide();
    $("#txtTelefone").mask("(99) 9999-9999");
    $("#txtCNPJ").mask("99.999.999/0001-**");
});

function MonstraCampos() {
    $("#idFilial").val(0);
    $("#divCampos").show();
}

function CarregaContratante() {
    var pdata = {};
    $('#cbxContratante').append($('<option>', {
        value: 0,
        text: "Selecione"
    }));
    $.getJSON($("#BuscaContratanteURL").val(), pdata, function (data) {
        if (data.Result.length > 0) {
            $.each(data.Result, function (index, dados) {
                $('#cbxContratante').append($('<option>', {
                    value: dados.con_Id,
                    text: dados.con_Nome
                }));
            });
        }
    });
}


function Validacao(pdata) {
    if (pdata["idContratante"] === "0") {
        $(".error").slideDown(300);
        $(".error").html("Selecione o contratante");
        $(".wait").slideUp(300);
        return false;
    }
    if (pdata["descricao"] === "") {
        $(".error").slideDown(300);
        $(".error").html("Descrição é um Campo Obrigatório");
        $(".wait").slideUp(300);
        return false;
    }
    if (pdata["cnpj"] === "") {
        $(".error").slideDown(300);
        $(".error").html("CNPJ é um campo Obrigatório");
        $(".wait").slideUp(300);
        return false;
    }
    if (pdata["responsavel"] === "") {
        $(".error").slideDown(300);
        $(".error").html("Responsável é um campo Obrigatório");
        $(".wait").slideUp(300);
        return false;
    }
    if (pdata["telefone"] === "") {
        $(".error").slideDown(300);
        $(".error").html("Telefone é um campo Obrigatório");
        $(".wait").slideUp(300);
        return false;
    }
    if (pdata["email"] === "") {
        $(".error").slideDown(300);
        $(".error").html("E-Mail é um campo Obrigatório");
        $(".wait").slideUp(300);
        return false;
    } else {
        if (ValidaEmail(pdata["email"]) === false) {
            $(".error").slideDown(300);
            $(".error").html("Formato E-Mail inválido!");
            $(".wait").slideUp(300);
            return false;
        }
    }
    return true;
}

function EditarFilial(id, contratante, descricao, cnpj, responsavel, telefone, email) {
    $("#idFilial").val(id);
    $("#cbxContratante option:contains('" + contratante + "')").prop('selected', true);
    $("#txtDescricao").val(descricao);
    $("#txtCNPJ").val(cnpj);
    $("#txtResponsavel").val(responsavel);
    $("#txtTelefone").val(telefone);
    $("#txtEmail").val(email);
    $("#divCampos").show();
}



function CarregaFilial() {
    $(".error").slideUp(300);
    $(".wait").slideDown(300);
    $(".wait").html("Aguarde!");

    var pdata = {};
    $("#tblDescricaoItens > tbody").empty();
    var tabela = "";
    var linhas = "";
    $.getJSON($("#BuscaFilialURL").val(), pdata, function (data) {
        if (data.Result.length > 0) {
            $.each(data.Result, function (index, dados) {
                tabela = "<tr></td><td style=\"width:30px;\"><a href='#' onclick=\"EditarFilial('" + dados.fil_Id + "'," +
                                                                                                         "'" + dados.con_Nome + "'," +
                                                                                                         "'" + dados.fil_Descricao + "'," +
                                                                                                         "'" + dados.fil_CNPJ + "'," +
                                                                                                         "'" + dados.fil_Responsavel + "'," +
                                                                                                         "'" + dados.fil_Telefone + "'," +
                                                                                                         "'" + dados.fil_Email + "')\"><img src='../images/edit.png'></a>";
                tabela = tabela + "</td><td style=\"width:20%;\">" + dados.con_Nome;
                tabela = tabela + "</td><td style=\"width:20%;\">" + dados.fil_Descricao;
                tabela = tabela + "</td><td style=\"width:15%;\">" + dados.fil_CNPJ;
                tabela = tabela + "</td><td style=\"width:20%;\">" + dados.fil_Responsavel;
                tabela = tabela + "</td><td style=\"width:10%;\">" + dados.fil_Telefone;
                tabela = tabela + "</td><td style=\"width:20%;\">" + dados.fil_Email;
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

function SalvaFilial() {
    var pdata = {};
    pdata["id"] = $("#idFilial").val();
    pdata["descricao"] = $("#txtDescricao").val();
    pdata["cnpj"] = $("#txtCNPJ").val();
    pdata["responsavel"] = $("#txtResponsavel").val();
    pdata["telefone"] = $("#txtTelefone").val();
    pdata["email"] = $("#txtEmail").val();
    pdata["idContratante"] = $("#cbxContratante").val();

    if (Validacao(pdata)) {
        $.getJSON($("#MatemFilialURL").val(), pdata, function (data) {
            if (data.Result.indexOf("Erro") === -1) {
                $(".error").slideUp(300);
                $(".wait").slideDown(300);
                $(".wait").html(data.Result);
                CarregaFilial();
                $("#divCampos").hide();
            } else {
                $(".error").slideDown(300);
                $(".error").html(data.Result);
                $(".wait").slideUp(300);
            }
        });
    }
}