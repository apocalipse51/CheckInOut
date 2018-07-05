$(document).ready(function () {
    CarregaComboFilialSelecionado("");
    CarregaComboContratante();
    CarregaLicencaPorFilial("");
    CarregaNotaFiscal();

    $("#txtValorNota").maskMoney({
        
        decimal: ",",
        thousands: "."
    });

    $("#divCampos").hide();
});

function MonstraCampos() {
    $("#idNotaFiscal").val("0");
    $("#divCampos").show();
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

function CarregaLicencaPorFilial(sel) {
    var pdata = {};
    pdata["filialId"] = $("#cbxFilial").val();
    $('#cbxLicenca').empty();;

    $('#cbxLicenca').append($('<option>', {
        value: 0,
        text: "Selecione"
    }));
    if (pdata["filialId"] !== null) {
        $.getJSON($("#BuscaLicencaPorFilialURL").val(), pdata, function (data) {
            if (data.Result.length > 0) {
                $.each(data.Result, function (index, dados) {
                    if (dados.lic_Id === sel) {
                        $('#cbxLicenca').append($('<option>', {
                            value: dados.lic_Id,
                            text: dados.lic_Id,
                            selected: true
                        }));
                    } else {
                        $('#cbxLicenca').append($('<option>', {
                            value: dados.lic_Id,
                            text: dados.lic_Id
                        }));
                    }
                });
            }
        });
    }
}

function CarregaCombosTelaNotaFiscal(filial, licenca) {
    var pdata = {};
    pdata["contratante"] = $("#cbxContratante").val();
    $('#cbxFilial').empty();;
    var filialId = "";

    $('#cbxFilial').append($('<option>', {
        value: 0,
        text: "Selecione"
    }));
    if (pdata["contratante"] !== null) {
        $.getJSON($("#BuscaFilialPorContratanteURL").val(), pdata, function (data) {
            if (data.Result.length > 0) {
                $.each(data.Result, function (index, dados) {
                    if (dados.fil_Descricao == filial) {
                        $('#cbxFilial').append($('<option>', {
                            value: dados.fil_Id,
                            text: dados.fil_Descricao,
                            selected: true
                        }));
                        filialId = dados.fil_Id;


                        var pdata = {};
                        pdata["filialId"] = filialId;
                        $('#cbxLicenca').empty();;

                        $('#cbxLicenca').append($('<option>', {
                            value: 0,
                            text: "Selecione"
                        }));
                        if (pdata["filialId"] !== null) {
                            $.getJSON($("#BuscaLicencaPorFilialURL").val(), pdata, function (data) {
                                if (data.Result.length > 0) {
                                    $.each(data.Result, function (index, dados) {
                                        if (dados.lic_Id === licenca) {
                                            $('#cbxLicenca').append($('<option>', {
                                                value: dados.lic_Id,
                                                text: dados.lic_Id,
                                                selected: true
                                            }));
                                        } else {
                                            $('#cbxLicenca').append($('<option>', {
                                                value: dados.lic_Id,
                                                text: dados.lic_Id
                                            }));
                                        }
                                    });
                                }
                            });
                        }







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

    if (pdata["numeroNota"] === "") {
        $(".error").slideDown(300);
        $(".error").html("Numero da Nota é um campo obrigatório");
        $(".wait").slideUp(300);
        return false;
    }
    if (pdata["valor"] === "") {
        $(".error").slideDown(300);
        $(".error").html("Valor da Nota é um campo obrigatório");
        $(".wait").slideUp(300);
        return false;
    }
    if (pdata["licencaId"] ==="") {
        $(".error").slideDown(300);
        $(".error").html("Selecione a Licença");
        $(".wait").slideUp(300);
        return false;
    }
    if (pdata["dataEmissao"] === "") {
        $(".error").slideDown(300);
        $(".error").html("Data de Emissão não pode ser vazia");
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

function EditarNotaFiscal(id, contratante, filial, licanca, numeroNota, dataEmissao, valorNota) {
    var valor = numberParaReal(parseFloat(valorNota));
    $("#idNotaFiscal").val(id);
    $("#cbxContratante option:contains('" + contratante + "')").prop('selected', true);
    CarregaCombosTelaNotaFiscal(filial, licanca);
    $("#txtNumeroNota").val(numeroNota);
    $("#txtDtEmissao").val(dataEmissao);
    $("#txtValorNota").val(valor);
    $("#divCampos").show();
}



function CarregaNotaFiscal() {

    $(".error").slideUp(300);
    $(".wait").slideDown(300);
    $(".wait").html("Aguarde!");

    var pdata = {};
    $("#tblDescricaoItens > tbody").empty();
    var tabela = "";
    var linhas = "";
    $.getJSON($("#BuscaNotaFiscalURL").val(), pdata, function (data) {
        if (data.Result.length > 0) {
            $.each(data.Result, function (index, dados) {
                tabela = "<tr><td style=\"width:30px;\"><a href='#' onclick=\"EditarNotaFiscal('" + dados.ntf_id + "'," +
                                                                                                         "'" + dados.con_Nome + "'," +
                                                                                                         "'" + dados.fil_Descricao + "'," +
                                                                                                         "'" + dados.lic_Id + "'," +
                                                                                                         "'" + dados.ntf_NumeroNotaFiscal + "'," +
                                                                                                         "'" + parseJsonAmericanDate(dados.ntf_DataEmissao) + "'," +
                                                                                                         "'" + dados.ntf_Valor + "')\"><img src='../images/edit.png'></a>";
                tabela = tabela + "</td><td style=\"width:20%;\">" + dados.ntf_id;
                tabela = tabela + "</td><td style=\"width:40%;\">" + dados.con_Nome;
                tabela = tabela + "</td><td style=\"width:40%;\">" + dados.fil_Descricao;
                tabela = tabela + "</td><td style=\"width:40%;\">" + dados.lic_Id;
                tabela = tabela + "</td><td style=\"width:40%;\">" + dados.ntf_NumeroNotaFiscal;
                tabela = tabela + "</td><td style=\"width:40%;\">" + parseJsonDate(dados.ntf_DataEmissao);
                tabela = tabela + "</td><td style=\"width:40%;\">" + numberParaReal(dados.ntf_Valor);
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

function SalvaNotaFiscal() {

    var pdata = {};
    pdata["id"] = $("#idNotaFiscal").val();
    pdata["numeroNota"] = $("#txtNumeroNota").val();
    pdata["valor"] = $("#txtValorNota").val().replace(".", "").replace(",",".");
    pdata["dataEmissao"] = $("#txtDtEmissao").val();
    pdata["licencaId"] = $("#cbxLicenca").val();

    if (Validacao(pdata)) {
        $.getJSON($("#MantemNotaFiscalURL").val(), pdata, function (data) {
            if (data.Result.indexOf("Erro") === -1) {
                $(".error").slideUp(300);
                $(".wait").slideDown(300);
                $(".wait").html(data.Result);
                CarregaNotaFiscal();
                $("#divCampos").hide();
            } else {
                $(".error").slideDown(300);
                $(".error").html(data.Result);
                $(".wait").slideUp(300);
            }
        });
    }
}