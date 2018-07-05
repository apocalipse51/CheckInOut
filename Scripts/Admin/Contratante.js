$(document).ready(function () {
    CarregaContratante();
    $("#divCampos").hide();
    $("#txtTelefone").mask("(99) 9999-9999");
    $("#txtCNPJ").mask("99.999.999/0001-**");
});

function MonstraCampos() {
    $("#idContratante").val(0);
    $("#divCampos").show();
}


function Validacao(pdata) {

    if (pdata["nome"] === "") {
        $(".error").slideDown(300);
        $(".error").html("Nome é um Campo Obrigatório");
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

function EditarContratante(id, nome, cnpj, responsavel, telefone, email, sigla) {
    $("#idContratante").val(id);
    $("#txtNome").val(nome);
    $("#txtCNPJ").val(cnpj);
    $("#txtResponsavel").val(responsavel);
    $("#txtTelefone").val(telefone);
    $("#txtEmail").val(email);
    $("#txtSigla").val(sigla);
    $("#divCampos").show();
}



function CarregaContratante() {
    $(".error").slideUp(300);
    $(".wait").slideDown(300);
    $(".wait").html("Aguarde!");

    var pdata = {};
    $("#tblDescricaoItens > tbody").empty();
    var tabela = "";
    var linhas = "";
    $.getJSON($("#BuscaContratanteURL").val(), pdata, function (data) {
        if (data.Result.length > 0) {
            $.each(data.Result, function (index, dados) {
                tabela = "<tr></td><td style=\"width:30px;\"><a href='#' onclick=\"EditarContratante('" + dados.con_Id + "'," +
                                                                                                         "'" + dados.con_Nome + "'," +
                                                                                                         "'" + dados.con_CNPJ + "'," +
                                                                                                         "'" + dados.con_Responsavel + "'," +
                                                                                                         "'" + dados.con_Telefone + "'," +
                                                                                                         "'" + dados.con_Email + "',"+
                                                                                                         "'" + dados.con_Sigla + "')\"><img src='../images/edit.png'></a>";
                tabela = tabela + "</td><td style=\"width:35%;\">" + dados.con_Nome;
                tabela = tabela + "</td><td style=\"width:15%;\">" + dados.con_CNPJ;
                tabela = tabela + "</td><td style=\"width:20%;\">" + dados.con_Responsavel;
                tabela = tabela + "</td><td style=\"width:10%;\">" + dados.con_Telefone;
                tabela = tabela + "</td><td style=\"width:20%;\">" + dados.con_Email;
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

function SalvaContratante() {
    var pdata = {};
    pdata["id"] = $("#idContratante").val();
    pdata["nome"] = $("#txtNome").val();
    pdata["cnpj"] = $("#txtCNPJ").val();
    pdata["responsavel"] = $("#txtResponsavel").val();
    pdata["telefone"] = $("#txtTelefone").val();
    pdata["email"] = $("#txtEmail").val();
    pdata["sigla"] = $("#txtSigla").val();

    if (Validacao(pdata)) {
        $.getJSON($("#MatemContratanteURL").val(), pdata, function (data) {
            if (data.Result.indexOf("Erro") === -1) {
                $(".error").slideUp(300);
                $(".wait").slideDown(300);
                $(".wait").html(data.Result);
                CarregaContratante();
                $("#divCampos").hide();
            } else {
                $(".error").slideDown(300);
                $(".error").html(data.Result);
                $(".wait").slideUp(300);
            }
        });
    }
}