/*
Old version used for move the document to the first page

$(document).ready(function () {
    var now = new Date();
    CarregaHorasProjetoAtalho();
    VerificaNumeroJust();
    CarregaComboClienteFinal();
    $('#NovaAtividade').hide();
    $('#divCamposJustificar').hide();
    window.location = "#cbxJustificativa";
    IniciarAlmoco('lista');
});

*/

$(document).ready(function () {
    var now = new Date();
    CarregaHorasProjetoAtalho();
    VerificaNumeroJust();
    CarregaComboClienteFinal();
    $('#NovaAtividade').hide();
    $('#divCamposJustificar').hide();    
    IniciarAlmoco('lista');
});

function EditarAtalho(){
    $(".error").slideUp(300);
    if ($('#Atalho1').prop('checked') || $('#Atalho2').prop('checked') || $('#Atalho3').prop('checked') || $('#Atalho4').prop('checked') || $('#Atalho5').prop('checked') || $('#Atalho6').prop('checked'))
    {
        CarregaComboClienteFinalAtalho();
        $('#ModalAtalho').modal('show');
    }
    else
    {
        $(".error").slideDown(300);
        $(".error").html("Selecione um botão de atalho !");
    }
}

function VerificaNumeroJust() {
    var pdata = {};
    $.getJSON($("#VerificaJustUsuarioURL").val(), pdata, function (data) {
        var NumJustificados = data.Result;
        if(NumJustificados <= 12)
        {
            $('#Justificar').show();
            document.getElementById('Justificar').title = " Justificativa de ausência - Você já justificou ausência " + NumJustificados + " X de 12";

        }
        else
        {
            document.getElementById('Justificar').title = " Justificativa de ausência - Você já justificou ausência " + NumJustificados + " X de 12";
            $('#Justificar').hide();
        }
    });
}

function MostrarJustificarHora() {

    var now = new Date();

    $("#txtJustificativaDataInicio").val(now.getFullYear() + "-" + (now.getMonth() + 1) + "-" + now.getDate() + "T09:00:00.000");
    $("#txtJustificativaDataFim").val(now.getFullYear() + "-" + (now.getMonth() + 1) + "-" + now.getDate() + "T18:00:00.000");

    var botaoJust = document.getElementById('Justificar').getAttribute("class");

    var status = document.getElementById('status').innerText;

    if (status.includes("Nenhuma"))
    {

        if (botaoJust.includes("btn-primary"))
        {

            document.getElementById('Iniciar').value = "Justificar";
            document.getElementById('Justificar').className = "btn btn-default active";
            CarregaComboJustificativa();
            $('html, body').animate({ scrollTop: 600 }, 1000);
            $('#divCamposJustificar').show();
            $('#cbxClienteFinal').empty();
            Filtrar('justificativas');

        }
        else if (botaoJust.includes("btn-default"))
        {
            location.reload();

        }

    }

}

function MonstraCampos() {
    $("#idHorasProjeto").val(0);
    $("#divCampos").show();
    $("#cbxClienteFinal option:contains('Selecione')").prop('selected', true);
    $("#cbxProduto").empty();
    $("#cbxProjeto").empty();
    $("#cbxFase").empty();
    $("#cbxSubFase").empty();
    $('#txtDescricao').val("");

}

function OcultarCamposJust(oculta){
    if (oculta) {

        $("#lblCliente").hide();
        $("#cbxClienteFinal").hide();
        $("#lblProduto").hide();
        $("#cbxProduto").hide();
        $("#lblProjeto").hide();
        $("#cbxProjeto").hide();
        $("#lblFaseProjeto").hide();
        $("#cbxFase").hide();
        $("#lblAtividade").hide();
        $("#cbxSubFase").hide();

    } else {

        $("#lblCliente").show();
        $("#cbxClienteFinal").show();
        $("#lblProduto").show();
        $("#cbxProduto").show();
        $("#lblProjeto").show();
        $("#cbxProjeto").show();
        $("#lblFaseProjeto").show();
        $("#cbxFase").show();
        $("#lblAtividade").show();
        $("#cbxSubFase").show();


    }
}

function CarregaComboClienteFinal() {

    var botaoJust = document.getElementById('Justificar').getAttribute("class");

    if (botaoJust.includes("btn-default")) {


        if ($("#cbxJustificativa").val() === "1" || $("#cbxJustificativa").val() === "2" || $("#cbxJustificativa").val() === null)
        {

            var pdata = {};
            $('#cbxClienteFinal').empty();
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

                OcultarCamposJust(false);

            });
        } else
        {
            OcultarCamposJust(true);
        }
    }
    else
    {
        var pdata = {};
        $('#cbxClienteFinal').empty();
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

        OcultarCamposJust(false);

    }

}

function CarregaComboClienteFinalAtalho(){
        var pdata = {};
        $('#cbxClienteFinalAtalho').empty();
        $('#cbxClienteFinalAtalho').append($('<option>', {
            value: 0,
            text: "Selecione"
        }));
        $.getJSON($("#BuscaClienteFinalURL").val(), pdata, function (data) {
            if (data.Result.length > 0) {
                $.each(data.Result, function (index, dados) {
                    $('#cbxClienteFinalAtalho').append($('<option>', {
                        value: dados.clf_id,
                        text: dados.clf_Descricao
                    }));
                });
            }
        });
}

function Validacao(pdata) {

    if (pdata["projetoId"] === "0") {
        $(".error").slideDown(300);
        $(".error").html("Selecione o Projeto");
        $(".wait").slideUp(300);
        return false;
    }

    if (pdata["subFaseProjetoId"] === "") {
        $(".error").slideDown(300);
        $(".error").html("Selecione a Atividade");
        $(".wait").slideUp(300);
        return false;
    }


    return true;
}

function ValidacaoJust(pdata) {

    if (pdata["justificativa"] === "0" || pdata["justificativa"] === null) {
        $(".error").slideDown(300);
        $(".error").html("Selecione uma justificativa");
        $(".wait").slideUp(300);
        return false;
    }

    if (pdata["justificativa"] === "1" || pdata["justificativa"] === "2") {

        var dataInicio = pdata["dataInicio"];
        var datai = dataInicio.substring(0, 10);

        var dataFim = pdata["dataFim"];
        var dataf = dataFim.substring(0, 10);


        if (!datai.includes(dataf)) {

            $(".error").slideDown(300);
            $(".error").html("Data inválida");
            $(".wait").slideUp(300);

            return false;
        }

    }
    return true;


}

function CarregaComboProdutosCliente() {


    var pdata = {};
    $('#cbxProduto').empty();
    pdata["clienteFinalId"] = $('#cbxClienteFinal').val();
    $('#cbxProduto').append($('<option>', {
        value: 0,
        text: "Selecione"
    }));
    $.getJSON($("#BuscaProdutoClienteURL").val(), pdata, function (data) {
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

function CarregaComboProdutosClienteAtalho() {


    var pdata = {};
    $('#cbxProdutoAtalho').empty();
    pdata["clienteFinalId"] = $('#cbxClienteFinalAtalho').val();
    $('#cbxProdutoAtalho').append($('<option>', {
        value: 0,
        text: "Selecione"
    }));
    $.getJSON($("#BuscaProdutoClienteURL").val(), pdata, function (data) {
        if (data.Result.length > 0) {
            $.each(data.Result, function (index, dados) {
                $('#cbxProdutoAtalho').append($('<option>', {
                    value: dados.prd_Id,
                    text: dados.prd_Descricao
                }));
            });
        }
    });
}

function CarregaComboFaseProjeto() {
    var pdata = {};
    $('#cbxFase').empty();
    $('#cbxFase').append($('<option>', {
        value: 0,
        text: "Selecione"
    }));
    $.getJSON($("#BuscaFaseProjetoURL").val(), pdata, function (data) {
        if (data.Result.length > 0) {
            $.each(data.Result, function (index, dados) {
                $('#cbxFase').append($('<option>', {
                    value: dados.fpo_Id,
                    text: dados.fpo_Descricao
                }));
            });
        }
    });
}

function CarregaComboFaseProjetoAtalho() {
    var pdata = {};
    $('#cbxFaseAtalho').empty();
    $('#cbxFaseAtalho').append($('<option>', {
        value: 0,
        text: "Selecione"
    }));
    $.getJSON($("#BuscaFaseProjetoURL").val(), pdata, function (data) {
        if (data.Result.length > 0) {
            $.each(data.Result, function (index, dados) {
                $('#cbxFaseAtalho').append($('<option>', {
                    value: dados.fpo_Id,
                    text: dados.fpo_Descricao
                }));
            });
        }
    });
}

function CarregaComboSubFase() {
    var pdata = {};
    pdata["faseId"] = $('#cbxFase').val();
    $('#cbxSubFase').empty();
    $('#cbxSubFase').append($('<option>', {
        value: 0,
        text: "Selecione"
    }));
    $.getJSON($("#BuscaSubFaseProjetoURL").val(), pdata, function (data) {
        if (data.Result.length > 0) {
            $.each(data.Result, function (index, dados) {
                $('#cbxSubFase').append($('<option>', {
                    value: dados.sfp_Id,
                    text: dados.sfp_Descricao
                }));
            });
        }
    });
}

function CarregaComboSubFaseAtalho() {
    var pdata = {};
    pdata["faseId"] = $('#cbxFaseAtalho').val();
    $('#cbxSubFaseAtalho').empty();
    $('#cbxSubFaseAtalho').append($('<option>', {
        value: 0,
        text: "Selecione"
    }));
    $.getJSON($("#BuscaSubFaseProjetoURL").val(), pdata, function (data) {
        if (data.Result.length > 0) {
            $.each(data.Result, function (index, dados) {
                $('#cbxSubFaseAtalho').append($('<option>', {
                    value: dados.sfp_Id,
                    text: dados.sfp_Descricao
                }));
            });
        }
    });
}

function CarregaComboProjetoProduto() {
    var pdata = {};
    pdata["produtoId"] = $('#cbxProduto').val();
    $('#cbxProjeto').empty();
    $('#cbxProjeto').append($('<option>', {
        value: 0,
        text: "Selecione"
    }));
    $.getJSON($("#BuscaProjetoProdutoURL").val(), pdata, function (data) {
        if (data.Result.length > 0) {
            $.each(data.Result, function (index, dados) {
                $('#cbxProjeto').append($('<option>', {
                    value: dados.prj_Id,
                    text: dados.prj_Descricao
                }));
            });
        }
    });
}

function CarregaComboProjetoProdutoAtalho() {
    var pdata = {};
    pdata["produtoId"] = $('#cbxProdutoAtalho').val();
    $('#cbxProjetoAtalho').empty();
    $('#cbxProjetoAtalho').append($('<option>', {
        value: 0,
        text: "Selecione"
    }));
    $.getJSON($("#BuscaProjetoProdutoURL").val(), pdata, function (data) {
        if (data.Result.length > 0) {
            $.each(data.Result, function (index, dados) {
                $('#cbxProjetoAtalho').append($('<option>', {
                    value: dados.prj_Id,
                    text: dados.prj_Descricao
                }));
            });
        }
    });
}

function finalizaHora(id) {

    $(".error").slideUp(300);
    $(".wait").slideDown(300);
    $(".wait").html("Aguarde!");

    var now = new Date;
    var pdata = {};

    if (id === 0) {

        pdata["id"] = id;
        pdata["operacao"] = "finaliza";
    }
    else
    {
        pdata["id"] = id;
        pdata["operacao"] = null;

    }

    $.getJSON($("#FechaHorarioUrl").val(), pdata, function (data) {
        if (data.Result.indexOf("Erro") === -1) {

            document.getElementById('status').innerHTML = "Nenhuma atividade em progresso";
            CarregaHorasProjeto();

        }
    });


    $(".error").slideUp(300);
    $(".wait").slideUp(300);

    location.reload();


}

function CarregaHorasProjeto() {


    var pdata = {};
    $("#tblDescricaoItens > tbody").empty();
    var tabela = "";
    var linhas = "";
    var esconder = false;
    $.getJSON($("#BuscaHorasProjetoURL").val(), pdata, function (data) {
        if (data.Result.length > 0) {
            $.each(data.Result, function (index, dados) {
                tabela = "<tr><td style=\"width:14%;\">" + dados.clf_Descricao;
                tabela = tabela + "</td><td style=\"width:14%;\">" + dados.prd_Descricao;
                tabela = tabela + "</td><td style=\"width:14%;\">" + dados.prj_Descricao;
                tabela = tabela + "</td><td style=\"width:14%;\">" + dados.fpo_Descricao;
                tabela = tabela + "</td><td style=\"width:14%;\">" + dados.sfp_Descricao;
                tabela = tabela + "</td><td style=\"width:14%;\">" + parseJsonDateTime(dados.hpo_DataHoraInicio);
                if (dados.hpo_DataHoraInicio === dados.hpo_DataHoraFim) {
                    tabela = tabela + "</td><td style=\"width:14%;\"><a href='#' onclick=\"finalizaHora('" + dados.hpo_Id + "')\"><img src='../images/check.png'></a>";
                    esconder = true;
                } else {
                    tabela = tabela + "</td><td style=\"width:14%;\">" + parseJsonDateTime(dados.hpo_DataHoraFim);
                }
                tabela = tabela + "</td></tr>";
                linhas = linhas + tabela;
            });
            $("#tblDescricaoItens > tbody").empty();
            $("#tblDescricaoItens > tbody").append(linhas);
            if (esconder) {
                $("#divCampos").hide();
            } else {
                MonstraCampos();
            }
        } else {
            $("#tblDescricaoItens > tbody").empty();
        }
    });

   ConfigBotaoAlmoco();

}

function IniciarHoras(){
    //let searchMessage = '<p style="text-align: center; color: white; font-weight: bolder; background-color: #448AFF; padding: .8em 2em; border-radius: 3px; border: 2px solid rgba(0,0,0,.1);">Salvando Justificativa!</p>';
    let searchMessage = '<div class="spinner"></div>';
    document.querySelector('.messageJustificativa').innerHTML = searchMessage;
    var now = new Date;
    var pdata = {};
    pdata["justificativa"] = $("#cbxJustificativa").val();
    console.log(document.querySelector("#cbxJustificativa"));
    if (pdata["justificativa"] === null)
    {
      document.querySelector('.messageJustificativa').innerHTML = "";
      var pdata = {};
      pdata["id"] = $("#idHorasProjeto").val();
      pdata["projetoId"] = $("#cbxProjeto").val();
      pdata["subFaseProjetoId"] = $("#cbxSubFase").val();
      pdata["dataInicio"] = now.getFullYear() + "-" + (now.getMonth() + 1) + "-" + now.getDate() + " 00:00:00.000";
      pdata["dataFim"] = now.getFullYear() + "-" + (now.getMonth() + 1) + "-" + now.getDate() + " 00:00:00.000";
      pdata["obs"] = $("#txtDescricao").val();
      if (Validacao(pdata)) {
          $.getJSON($("#MantemHorasProjetoUrl").val(), pdata, function (data) {
              if (data.Result.indexOf("Erro") === -1) {
                  location.reload();
              } else {
                  $(".error").slideDown(300);
                  $(".error").html(data.Result);
                  $(".wait").slideUp(300);
                  console.log(data.Result);
              }
          });
          $(".error").slideUp(300);
          $(".wait").slideUp(300);
      }
    } else {
        if ($("#cbxJustificativa").val() === "1" || $("#cbxJustificativa").val() === "2") {
            pdata["justificativa"] = $("#cbxJustificativa").val();
            pdata["id"] = $("#idHorasProjeto").val();
            pdata["projetoId"] = $("#cbxProjeto").val();
            pdata["subFaseProjetoId"] = $("#cbxSubFase").val();
            pdata["dataInicio"] = $("#txtJustificativaDataInicio").val();
            pdata["dataFim"] = $("#txtJustificativaDataFim").val();
            pdata["obs"] = $("#txtDescricao").val();
        } else {
            pdata["justificativa"] = $("#cbxJustificativa").val();
            pdata["id"] = "0";
            pdata["projetoId"] = "0";
            pdata["subFaseProjetoId"] = "0";
            pdata["dataInicio"] = $("#txtJustificativaDataInicio").val();
            pdata["dataFim"] = $("#txtJustificativaDataFim").val();
            pdata["obs"] = $("#txtDescricao").val();
        }
        if (ValidacaoJust(pdata)) {
            $.getJSON($("#JustificaPontoUrl").val(), pdata, function (data) {
                document.querySelector('.messageJustificativa').innerHTML = "";
                if (data.Result.indexOf("Erro") === -1) {
                    $(".error").slideUp(300);
                    $(".wait").html(data.Result);
                    $(".wait").slideDown(300);
                    $(".wait").slideUp(4000);
                    $("#divCamposJustificar").hide();
                    $("#divCampos").show();
                    $("#idHorasProjeto").val(0);
                    $("#cbxClienteFinal option:contains('Selecione')").prop('selected', true);
                    $('#txtDescricao').val("");
                    document.getElementById('Iniciar').value = "Iniciar";
                    CarregaComboClienteFinal();
                    document.getElementById('Justificar').className = "btn btn-primary active";
                    OcultarCamposJust(false);
                    VerificaNumeroJust();
                } else {
                    $(".error").slideDown(300);
                    $(".error").html(data.Result);
                    $(".wait").slideUp(300);
                }
            });
        }
    }
    IniciarAlmoco('lista');
}

function IniciarAlmoco(operacao) {
    $(".error").slideUp(500);
    $(".wait").slideDown(500);
    $(".wait").html("Aguarde!");
    var now = new Date;
    var pdata = {};
    pdata["operacao"] = operacao;
    $.getJSON($("#AlmocoHoraProjetoUrl").val(), pdata, function (data) {
      if (operacao != "finaliza")
      {
          var status = data.Result;
      }
      else
      {
          $('#NovaAtividade').hide();
          status = "Nenhuma atividade em progresso";
      }
      document.getElementById('status').innerHTML = status;
      CarregaHorasProjeto();
    });
    $(".error").slideUp(500);
    $(".wait").slideUp(500);
    ConfigBotaoAlmoco();
}

function ConfigBotaoAlmoco(){

    var botaoJust = document.getElementById('Justificar').getAttribute("class");
    var status = document.getElementById('status').innerText;

    if (botaoJust.includes("btn-primary"))
    {

        if (status.includes("Almoço") || status.includes("Nenhuma")) {

            document.getElementById('AlmocoRetorno').className = "btn btn-danger active";
            document.getElementById('AlmocoRetorno').value = "Retomar";
            $('#NovaAtividade').hide();


        }
        else
        {

            document.getElementById('AlmocoRetorno').className = "btn btn-default active";
            document.getElementById('AlmocoRetorno').value = "Almoço";
            $('#NovaAtividade').show();

        }

    }

    VerificaNumeroJust();

}

function Sair(){
    $(".wait").slideDown(3000);
    IniciarAlmoco('finaliza');
    $(".wait").html("Realizando check-out...");
    setTimeout(function Redirect() { document.location.assign($("#LogoutUsuarioURL").val()) },3000);
}

function Filtrar(tipo) {

    var botaoJust = document.getElementById('Justificar').getAttribute("class");


        if (botaoJust.includes("btn-primary"))
        {

            tipo = "normal";

        }
        else if (botaoJust.includes("btn-default"))
        {

            tipo = "justificativas";

        }


    var pdata = {};

    var tabela = "";
    var linhas = "";
    var esconder = false;

    var now = new Date;
    var pdata = {};

    if (tipo === "justificativas") {

        pdata["DataInicio"] = $("#DataInicio").val() +" 09:00:00.000";
        pdata["DataFim"] = $("#DataFim").val() + " 18:00:00.000";
        pdata["just"] = tipo;


        $.getJSON($("#FiltrarHoraProjetoJustUrl").val(), pdata, function (data) {

            if (data.Result.length > 0) {


                $("#tblDescricaoItens > tbody").empty();

                $.each(data.Result, function (index, dados) {


                    tabela = "<tr><td style=\"width:14%;\">" + dados.Cliente;
                    tabela = tabela + "</td><td style=\"width:14%;\">" + dados.Produto;
                    tabela = tabela + "</td><td style=\"width:14%;\">" + dados.Projeto;
                    tabela = tabela + "</td><td style=\"width:14%;\">" + dados.Fase;
                    tabela = tabela + "</td><td style=\"width:14%;\">" + dados.Atividade;
                    tabela = tabela + "</td><td style=\"width:14%;\">" + parseJsonDateTime(dados.DataInicio);
                    tabela = tabela + "</td><td style=\"width:14%;\">" + parseJsonDateTime(dados.DataFim);
                    tabela = tabela + "</td><td style=\"width:20%;\">" + dados.Aprovacao;
                    tabela = tabela + "</td><td style=\"width:30%;\">" + dados.Motivo;
                    tabela = tabela + "</td></tr>";
                    linhas = linhas + tabela;
                });
                $("#tblDescricaoItens > tbody").empty();
                $("#tblDescricaoItens > tbody").append(linhas);
                if (esconder) {
                    $("#divCampos").hide();
                } else {
                    MonstraCampos();
                }
            } else {
                $("#tblDescricaoItens > tbody").empty();
            }

        });

    }

    else if (tipo === "normal") {

        pdata["DataInicio"] = $("#DataInicio").val() + " 09:00:00.000";
        pdata["DataFim"] = $("#DataFim").val() + " 18:00:00.000";

        $.getJSON($("#FiltrarHoraProjetoUrl").val(), pdata, function (data) {

            if (data.Result.length > 0) {

                $("#tblDescricaoItens > tbody").empty();

                $.each(data.Result, function (index, dados) {
                    tabela = "<tr><td style=\"width:14%;\">" + dados.clf_Descricao;
                    tabela = tabela + "</td><td style=\"width:14%;\">" + dados.prd_Descricao;
                    tabela = tabela + "</td><td style=\"width:14%;\">" + dados.prj_Descricao;
                    tabela = tabela + "</td><td style=\"width:14%;\">" + dados.fpo_Descricao;
                    tabela = tabela + "</td><td style=\"width:14%;\">" + dados.sfp_Descricao;
                    tabela = tabela + "</td><td style=\"width:14%;\">" + parseJsonDateTime(dados.hpo_DataHoraInicio);
                    if (dados.hpo_DataHoraInicio === dados.hpo_DataHoraFim) {
                        tabela = tabela + "</td><td style=\"width:14%;\"><a href='#' onclick=\"finalizaHora('" + dados.hpo_Id + "')\"><img src='../images/check.png'></a>";
                        esconder = true;
                    } else {
                        tabela = tabela + "</td><td style=\"width:14%;\">" + parseJsonDateTime(dados.hpo_DataHoraFim);
                    }
                    tabela = tabela + "</td></tr>";
                    linhas = linhas + tabela;
                });
                $("#tblDescricaoItens > tbody").empty();
                $("#tblDescricaoItens > tbody").append(linhas);
                if (esconder) {
                    $("#divCampos").hide();
                } else {
                    MonstraCampos();
                }
            } else {
                $("#tblDescricaoItens > tbody").empty();
                CarregaHorasProjeto();
            }

        });
    }

}

function CarregaComboJustificativa() {
    var pdata = {};
    $('#cbxJustificativa').empty();
    $('#cbxJustificativa').append($('<option>', {
        value: 0,
        text: "Selecione"
    }));

    $.getJSON($("#BuscaTipoJustificativaURL").val(), pdata, function (data) {
        if (data.Result.length > 0) {
            $.each(data.Result, function (index, dados) {
                $('#cbxJustificativa').append($('<option>', {
                    value: dados.jtf_Id,
                    text: dados.jtf_Nome
                }));
            });
        }
    });
}

function CarregaComboJustificativaAtalho() {
    var pdata = {};
    $('#cbxJustificativaAtalho').empty();
    $('#cbxJustificativaAtalho').append($('<option>', {
        value: 0,
        text: "Selecione"
    }));

    $.getJSON($("#BuscaTipoJustificativaURL").val(), pdata, function (data) {
        if (data.Result.length > 0) {
            $.each(data.Result, function (index, dados) {
                $('#cbxJustificativaAtalho').append($('<option>', {
                    value: dados.jtf_Id,
                    text: dados.jtf_Nome
                }));
            });
        }
    });
}

function CarregaComboJustClienteFinal() {
    var pdata = {};
    $('#cbxJustClienteFinal').empty();
    $('#cbxJustClienteFinal').append($('<option>', {
        value: 0,
        text: "Selecione"
    }));
    $.getJSON($("#BuscaClienteFinalURL").val(), pdata, function (data) {
        if (data.Result.length > 0) {
            $.each(data.Result, function (index, dados) {
                $('#cbxJustClienteFinal').append($('<option>', {
                    value: dados.clf_id,
                    text: dados.clf_Descricao
                }));
            });
        }
    });
}

function SalvarAtalho() {

    var now = new Date;
    var pdata = {};


            pdata["id"] = $("#idHorasProjeto").val();
            pdata["projetoId"] = $("#cbxProjetoAtalho").val();
            pdata["subFaseProjetoId"] = $("#cbxSubFaseAtalho").val();
            pdata["obs"] = $("#txtDescricaoAtalho").val();

            if ($('#Atalho1').prop('checked'))
            {
                pdata["atalho"] = "Atalho1";

            } else if ($('#Atalho2').prop('checked')) {

                pdata["atalho"] = "Atalho2";

            } else if ($('#Atalho3').prop('checked')) {

                pdata["atalho"] = "Atalho3";

            } else if ($('#Atalho4').prop('checked')) {

                pdata["atalho"] = "Atalho4";
            }
            else if ($('#Atalho5').prop('checked')) {

                pdata["atalho"] = "Atalho5";
            }
            else if ($('#Atalho6').prop('checked')) {

                pdata["atalho"] = "Atalho6";
            }

            $.getJSON($("#MantemHorasProjetoAtalhoUrl").val(), pdata, function (data) {
                if (data.Result.indexOf("Erro") === -1) {
                    CarregaHorasProjetoAtalho();
                    $('#ModalAtalho').modal('hide');
                }
            });

}

function CarregaHorasProjetoAtalho() {

    var pdata = {};
    $("#tblDescricaoItens > tbody").empty();
    var tabela = "";
    var linhas = "";
    var esconder = false;
    $.getJSON($("#BuscaHorasProjetoAtalhoURL").val(), pdata, function (data) {
        if (data.Result.length > 0) {

            for (var i = 0; i < data.Result.length; i++)
            {
                var Atalho = data.Result[i].hpoa_Atalho;
                var lbl = 'lbl' + Atalho.trim();

                document.getElementById(lbl).innerHTML = data.Result[i].prj_Descricao + ' > ' + data.Result[i].sfp_Descricao;

            }
        }
    });

}

function IniciaAtalho() {
    var now = new Date;
    var pdata = {};


    if ($('#Atalho1').prop('checked')) {
        pdata["atalho"] = "Atalho1";

    } else if ($('#Atalho2').prop('checked')) {

        pdata["atalho"] = "Atalho2";

    } else if ($('#Atalho3').prop('checked')) {

        pdata["atalho"] = "Atalho3";

    } else if ($('#Atalho4').prop('checked')) {

        pdata["atalho"] = "Atalho4";
    }
    else if ($('#Atalho5').prop('checked')) {

        pdata["atalho"] = "Atalho5";
    }
    else if ($('#Atalho6').prop('checked')) {

        pdata["atalho"] = "Atalho6";
    }

    $.getJSON($("#IniciaHorasProjetosUsuarioAtalhoUrl").val(), pdata, function (data) {
        if (data.Result.indexOf("Erro") === -1) {
            location.reload();
        }
    });


}

function IniciaAtalhoProjeto() {
    $(".error").slideUp(300);
    if ($('#Atalho1').prop('checked') || $('#Atalho2').prop('checked') || $('#Atalho3').prop('checked') || $('#Atalho4').prop('checked') || $('#Atalho5').prop('checked') || $('#Atalho6').prop('checked')) {
        IniciaAtalho()
    }
    else {
        $(".error").slideDown(300);
        $(".error").html("Selecione um botão de atalho !");
    }
}
