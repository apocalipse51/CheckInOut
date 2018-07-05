$(document).ready(function () {

    TopProjetos(15);
    

});



function TopProjetos(linha) {

    $(".wait").slideDown(500);
    var pdata = {};
    var tabela = "";
    var linhas = "";

    pdata["linhas"] = linha;

    $.getJSON($("#TopProjetosURL").val(), pdata, function (data) {
        if (data.Result.length > 0) {
            $.each(data.Result, function (index, dados) {

                tabela = "<tr onclick=\"Detalhes('" + dados.ID + "', '" + dados.EPS + "', '" + dados.Cliente + "','" + dados.Produto + "','" + dados.Projeto + "','" + dados.TempoTotal + "','" + dados.TempoMes + "','" + dados.TempoDia + "')\"><td style=\"width:15%;\">" + dados.Cliente;
                tabela = tabela + "</td><td style=\"width:20%;\">" + dados.Produto;
                tabela = tabela + "</td><td style=\"width:20%;\">" + dados.Projeto;
                tabela = tabela + "</td><td style=\"width:10%;\">" + dados.HC;
                tabela = tabela + "</td><td style=\"width:20%;\">" + dados.TempoTotal;
                tabela = tabela + "</td><td style=\"width:20%;\">" + dados.TempoMes;
                tabela = tabela + "</td></tr>";
                linhas = linhas + tabela;
            });
            $("#tblTopProjetos > tbody").empty();
            $("#tblTopProjetos > tbody").append(linhas);
        } else {
            $("#tblTopProjetos > tbody").empty();
        }
    });

    $(".wait").slideUp(500);
}

function DetalheComboUsuario()
{
    var mes = $('#MesAno').val();
    var mes = mes.substring(0, 2);

    var ano = $('#MesAno').val();
    var ano = ano.substring(3, 8);

    RetornaDetalhes(mes, ano, $('#cbxUsuarioEstruturaf').val(), $('#ProjetoDetalhado').val());

}

function Detalhes(id, eps, cliente, produto, projeto, tempototal, tempomes, tempodia)
{
    var now = new Date();

    $("#MesAno").mask("99/9999");
    $("#MesAno").val((now.getMonth() + 1) + "/" + now.getFullYear());

    var mes = $('#MesAno').val();
    var mes = mes.substring(0, 2);

    var ano = $('#MesAno').val();
    var ano = ano.substring(3, 8);
    
    RetornaDetalhes(mes, ano, 0, id);
    document.getElementById('ProjetoDetalhado').value = id;
    var pdata = {};

    pdata["mes"] = mes;
    pdata["ano"] = ano;
    pdata["idusuario"] = 0;
    pdata["idprojeto"] = id;

    $('#cbxUsuarioEstruturaf').empty();
    $.getJSON($("#RetornaDetalhesFiltroURL").val(), pdata, function (data) {

        $('#cbxUsuarioEstruturaf').append($('<option>', {
            value: 0,
            text: "Todos"
        }));

        $.each(data.Result, function (index, dados) {
            $('#cbxUsuarioEstruturaf').append($('<option>', {
                value: dados.ID,
                text: dados.Nome
            }));

        });
    });

    $('#ModalDetalhe').modal('show');

}

function RetornaDetalhes(mes, ano, idusuario, idprojeto) {

    var pdata = {};

    pdata["mes"] = mes;
    pdata["ano"] = ano;
    pdata["idusuario"] = idusuario;
    pdata["idprojeto"] = idprojeto;

    $("#tblDetalhes > tbody").empty();

    var tabela = "";
    var linhas = "";
    $.getJSON($("#RetornaDetalhesFiltroURL").val(), pdata, function (data) {
        if (data.Result.length > 0) {
            $.each(data.Result, function (index, dados) {

                tabela = "<tr><td style=\"width:25%;\">" + dados.Nome;
                tabela = tabela + "</td><td style=\"width:25%;\">" + dados.Produto;
                tabela = tabela + "</td><td style=\"width:10%;\">" + dados.Projeto;
                tabela = tabela + "</td><td style=\"width:10%;\">" + dados.TempoMes;
                tabela = tabela + "</td></tr>";
                linhas = linhas + tabela;

            });


            $("#tblDetalhes > tbody").empty();
            $("#tblDetalhes > tbody").append(linhas);

        } else {

            $("#tblDetalhes > tbody").empty();
        }
    });
}