$(document).ready(function () {
    CarregaComboProduto();
    CarregaComboFilial();
    CarregaComboContratante();
    CarregaLicencas();
    $("#divCampos").hide();
    $('#divDataVencimento').hide();
});

function MonstraCampos() {
    $("#idLicenca").val("00000000-0000-0000-0000-000000000000");
    $("#divCampos").show();
}

function FechaDataVencimento() {
    $('#divDataVencimento').hide();
}

function CarregaComboContratante() {
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

function CarregaComboFilial() {
    var pdata = {};
    pdata["contratante"] = $("#cbxContratante").val();
    $('#cbxFilial').empty();;

    $('#cbxFilial').append($('<option>', {
        value: 0,
        text: "Selecione"
    }));
    if (pdata["contratante"] !== null) {
        $.getJSON($("#BuscaFilialPorContratanteURL").val(), pdata, function (data) {
            if (data.Result.length > 0) {
                $.each(data.Result, function (index, dados) {
                    $('#cbxFilial').append($('<option>', {
                        value: dados.fil_Id,
                        text: dados.fil_Descricao
                    }));
                });
            }
        });
    }
}

function CarregaComboFilialSelecionado(sel) {
    var pdata = {};
    pdata["contratante"] = $("#cbxContratante").val();
    $('#cbxFilial').empty();;

    $('#cbxFilial').append($('<option>', {
        value: 0,
        text: "Selecione"
    }));
    if (pdata["contratante"] !== null) {
        $.getJSON($("#BuscaFilialPorContratanteURL").val(), pdata, function (data) {
            if (data.Result.length > 0) {
                $.each(data.Result, function (index, dados) {
                    if (dados.fil_Descricao == sel) {
                        $('#cbxFilial').append($('<option>', {
                            value: dados.fil_Id,
                            text: dados.fil_Descricao,
                            selected: true
                        }));
                    } else {
                        $('#cbxFilial').append($('<option>', {
                            value: dados.fil_Id,
                            text: dados.fil_Descricao
                        }));
                    }
                });
            }
        });
    }
}

function Validacao(pdata) {
    if (pdata["idProduto"] === "0") {
        $(".error").slideDown(300);
        $(".error").html("Selecione o Produto");
        $(".wait").slideUp(300);
        return false;
    }
    if (pdata["idFilial"] === "") {
        $(".error").slideDown(300);
        $(".error").html("Selecione a Filial");
        $(".wait").slideUp(300);
        return false;
    }
    if (pdata["qtde"] < 0) {
        $(".error").slideDown(300);
        $(".error").html("Quantidade não pode ser número negativo");
        $(".wait").slideUp(300);
        return false;
    }
    if (pdata["dataContratacao"] === "") {
        $(".error").slideDown(300);
        $(".error").html("Data Contratação não pode ser vazia");
        $(".wait").slideUp(300);
        return false;
    }
    if (pdata["contrato"] === "") {
        $(".error").slideDown(300);
        $(".error").html("Contrato não pode ser branco");
        $(".wait").slideUp(300);
        return false;
    }

    return true;
}

function EditarLicenca(id, filial, produto, contrato, qtde, data, contratante) {
    $("#idLicenca").val(id);
    $("#cbxContratante option:contains('" + contratante + "')").prop('selected', true);
    CarregaComboFilialSelecionado(filial);
    $("#cbxProduto option:contains('" + produto + "')").prop('selected', true);
    $("#txtContrato").val(contrato);
    $("#txtQtde").val(qtde);
    $("#txtDtContratacao").val(data);
    $("#divCampos").show();
}

function AlteraValidade(idLicenca) {
    $('#divDataVencimento').show();
    $("#txtDataValidade").val("");
    $('#idLicencaValidade').val(idLicenca);
}

function EnviaMudancaValidade() {
    var pdata = {};
    pdata["id"] = $("#idLicencaValidade").val();
    pdata["validadeLicenca"] = $("#txtDataValidade").val();
    $.getJSON($("#AlteraVencimentoURL").val(), pdata, function (data) {
        if (data.Result.indexOf("Erro") === -1) {
            $(".error").slideUp(300);
            $(".wait").slideDown(300);
            $(".wait").html(data.Result);
            CarregaLicencas();
            $('#divDataVencimento').hide();
        } else {
            $(".error").slideDown(300);
            $(".error").html(data.Result);
            $(".wait").slideUp(300);
        }
    });
}

function CarregaLicencas() {

    $(".error").slideUp(300);
    $(".wait").slideDown(300);
    $(".wait").html("Aguarde!");

    var pdata = {};
    $("#tblDescricaoItens > tbody").empty();
    var tabela = "";
    var linhas = "";
    var hoje = Date.now();
    $.getJSON($("#BuscaLicencasURL").val(), pdata, function (data) {
        if (data.Result.length > 0) {
            $.each(data.Result, function (index, dados) {
                tabela = "<tr><td style=\"width:30px;\"><a href='#' onclick=\"EditarLicenca('" + dados.lic_Id + "'," +
                                                                                                         "'" + dados.fil_Descricao + "'," +
                                                                                                         "'" + dados.prd_Descricao + "'," +
                                                                                                         "'" + dados.lic_Contrato + "'," +
                                                                                                         "'" + dados.lic_Qtde + "'," +
                                                                                                         "'" + parseJsonAmericanDate(dados.lic_DataContratacao) + "'," +
                                                                                                         "'" + dados.con_Nome + "')\"><img src='../images/edit.png'></a>";

                tabela = tabela + "</td><td style=\"width:30px;\"><a href='#' onclick=\"AlteraValidade('" + dados.lic_Id + "')\">";

                if (dados.lic_ValidadeLicenca > hoje) {
                    tabela = tabela + "<img src='../images/check.png'></a>";
                } else {
                    tabela = tabela + "<img src='../images/erro.png'></a>";
                }


                tabela = tabela + "</td><td style=\"width:20%;\">" + dados.lic_Id;
                tabela = tabela + "</td><td style=\"width:40%;\">" + dados.con_Nome;
                tabela = tabela + "</td><td style=\"width:40%;\">" + dados.fil_Descricao;
                tabela = tabela + "</td><td style=\"width:40%;\">" + dados.prd_Descricao;
                tabela = tabela + "</td><td style=\"width:40%;\">" + dados.lic_Contrato;
                tabela = tabela + "</td><td style=\"width:40%;\">" + dados.lic_Qtde;
                tabela = tabela + "</td><td style=\"width:40%;\">" + parseJsonDate(dados.lic_DataContratacao);
                tabela = tabela + "</td><td style=\"width:40%;\">" + parseJsonDate(dados.lic_ValidadeLicenca);
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

function SalvaLicenca() {

    var pdata = {};
    pdata["id"] = $("#idLicenca").val();
    pdata["idProduto"] = $("#cbxProduto").val();
    pdata["idFilial"] = $("#cbxFilial").val();
    pdata["qtde"] = $("#txtQtde").val();
    pdata["dataContratacao"] = $("#txtDtContratacao").val();
    pdata["contrato"] = $("#txtContrato").val();
    pdata["validadeLicenca"] = $("#txtDtContratacao").val();

    if (Validacao(pdata)) {
        $.getJSON($("#MantemLicencasURL").val(), pdata, function (data) {
            if (data.Result.indexOf("Erro") === -1) {
                $(".error").slideUp(300);
                $(".wait").slideDown(300);
                $(".wait").html(data.Result);
                CarregaLicencas();
                $("#divCampos").hide();
            } else {
                $(".error").slideDown(300);
                $(".error").html(data.Result);
                $(".wait").slideUp(300);
            }
        });
    }
}