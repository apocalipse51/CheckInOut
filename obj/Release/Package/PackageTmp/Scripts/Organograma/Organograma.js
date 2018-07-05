$(document).ready(function () {

    $('#divDetalheUser').hide();
    CarregaComboResponsavelf();

    $(".wait").slideDown(500);
    InicialOrg();

});

function InicialOrg()
{
    $(".wait").slideDown(500);
    if ($("#cbxUsuarioEstruturaf").val() != 0) {
        google.charts.load("visualization", "1", { packages: ["orgchart"] });
        google.charts.setOnLoadCallback(drawChart($("#cbxUsuarioEstruturaf").val(), "inicio"));

    } else {

        google.charts.load("visualization", "1", { packages: ["orgchart"] });
        google.charts.setOnLoadCallback(drawChart($("#idUsuario").val(), "inicio"));

    }
}

function FechaDetalhe() {

    $('#divDetalheUser').hide();
}

function Filtrar() {

    $(".wait").slideDown(500);
    google.charts.load("visualization", "1", { packages: ["orgchart"] });
    google.charts.setOnLoadCallback(drawChart($("#cbxUsuarioEstruturaf").val(), "inicio"));
}

function Expandir()
{
    $(".wait").slideDown(500);
    if($("#cbxUsuarioEstruturaf").val() != 0)
    {
        google.charts.load("visualization", "1", { packages: ["orgchart"] });
        google.charts.setOnLoadCallback(drawChart($("#cbxUsuarioEstruturaf").val(), "completo"));

    } else
    {

        google.charts.load("visualization", "1", { packages: ["orgchart"] });
        google.charts.setOnLoadCallback(drawChart($("#idUsuario").val(), "completo"));

    }
}


function Reduzir()
{
    $(".wait").slideDown(500);
    if ($("#cbxUsuarioEstruturaf").val() != 0) {
        google.charts.load("visualization", "1", { packages: ["orgchart"] });
        google.charts.setOnLoadCallback(drawChart($("#cbxUsuarioEstruturaf").val(), "inicio"));

    } else {

        google.charts.load("visualization", "1", { packages: ["orgchart"] });
        google.charts.setOnLoadCallback(drawChart($("#idUsuario").val(), "inicio"));

    }

}


function drawChart(usuario, nos)
{
 

                    var pdata = {};

                    pdata["usuarioId"] = usuario;
                    pdata["nos"] = nos;
                    
                    $.getJSON($("#FiltrarEstruturaUsuarioURL").val(), pdata, function (datad)
                    {
                        if(datad.Result.length > 0)
                        {

                            var data = new google.visualization.DataTable();                           
                            var valor = "";

                            data.addColumn('string', 'Nome');
                            data.addColumn('string', 'Estrutura');
                            data.addColumn('string', 'Funcao')
                            data.addRows(datad.Result.length);

                        for (var i = 0; i < datad.Result.length; i++)
                        {
                            
                            data.setCell(i, 0, datad.Result[i].Nome, '<b class="nome_e">' + datad.Result[i].Nome + '</b><div style="color:#609; font-style:italic; font-size:10px">' + datad.Result[i].SiglaFunc + '</div><p style="font-size:10px;">HC(' + datad.Result[i].HC + ')</p>');
                             data.setCell(i, 1, datad.Result[i].NomeEstr);
                             data.setCell(i, 2, datad.Result[i].NomeFunc);

                        }

                        var chart = new google.visualization.OrgChart(document.getElementById('chart_div'));
                      
                        function selectionHandler() {

                            var selecao = chart.getSelection()[0];
                            if (selecao) {
                                valor = data.getValue(selecao.row, 0);

                                var pdata = {};
                                pdata["nome"] = valor;

                                
                                $.getJSON($("#ListaUsuarioURL").val(), pdata, function (data) {
                                    if (data.Result.length > 0) {
                                        $.each(data.Result, function (index, dados) {

                                            var now = new Date();

                                            $("#MesAno").mask("99/9999");
                                            $("#MesAno").val((now.getMonth() + 1) + "/" + now.getFullYear());

                                            document.getElementById('ModalLabelDetalhe').innerHTML = dados.usr_Nome;
                                            document.getElementById('str_estrutura').innerHTML = dados.estr_Nome;
                                            document.getElementById('str_email').innerHTML = dados.usr_Email;
                                            document.getElementById('str_tel').innerHTML = dados.usr_Tel;
                                            var img = document.getElementById('imagem_perfil');

                                            if (dados.usr_imagePerfil != null)
                                            {                                             
                                                img.src = dados.usr_imagePerfil;

                                            }
                                            else
                                            {
                                                img.src = "../Images/userimg.png";
                                            }

                                        });
                                    }
                                });
                          
                                var tabela = "";
                                var linhas = "";
                                $.each(datad.Result, function (index, dados)
                                {

                                    if (dados.Nome === valor)
                                    {

                                        var str = dados.AprovaEstr;
                                        var atual = dados.TargetAtual;
                                        var esperado = dados.Esperado;
                                        var sinal = "";

                                        var margem = esperado * 0.1;

                                        if (atual >= (esperado - margem) && atual < (esperado + margem)) {
                                                
                                            sinal = "<tr><td>STATUS - Horas de projetos:<img src='../images/sinal_vd.png' title='Esperado " + esperado + "h'></a>";

                                        }
                                        else if (atual < esperado && atual < (esperado - margem)) {

                                            sinal = "<tr><td>STATUS - Horas de projetos:<img src='../images/sinal_vm.png' title='Esperado " + esperado + "h'></a>";

                                        }
                                        else {
                                            sinal = "<tr><td>STATUS - Horas de projetos:<img src='../images/sinal_am.png' title='Esperado " + esperado + "h'></a>";
                                        }

                                        tabela = tabela + sinal;
                                        tabela = tabela + "</td></tr>";
                                        linhas = linhas + tabela;

                                        $("#tblStatus > tbody").empty();
                                        $("#tblStatus > tbody").append(linhas);

                                        RetornaDetalhes(dados.usr_Id);
                                        valor = null;

                                    }

                               });                                
                                    
                                $('#chart_div').on('click', 'b.nome_e', function () {


                                    
                                    $('#ModalDetalhe').modal('show');

                                });

                            }
                        }

                        google.visualization.events.addListener(chart, 'select', selectionHandler);


                        var options =
                        {
                            'size': $("#TamanhoOrg").val(),
                            'allowHtml': 'true',
                            'allowCollapse':'true'
                        }


                        var runOnce = google.visualization.events.addListener(chart, 'ready', function () {

                            var previous;
                            $('#chart_div').on('click', 'div.plus', function () {
                                
                                var selection = chart.getSelection();
                                var row;

                                if (selection.length == 0) {
                                    row = previous;   
                                }
                                else {
                                    row = selection[0].row;
                                    previous = row;
                                }

                                var collapsed = chart.getCollapsedNodes();
                                var collapse = (collapsed.indexOf(row) == -1);

                                chart.collapse(row, collapse);
                                chart.setSelection();

                                collapsed = chart.getCollapsedNodes();

                                var runOnce2 = google.visualization.events.addListener(chart, 'ready', function () {
                                    google.visualization.events.removeListener(runOnce2);
                                    for (var i = 0; i < collapsed.length; i++) {
                                        chart.collapse(collapsed[i],true);
                                    }
                                });

                                chart.draw(data, options);

                            });

                            google.visualization.events.removeListener(runOnce);

                            for (var i = 0; i < data.getNumberOfRows() ; i++) {

                                    chart.collapse(i, true);
                            }

                            for (var i = 0; i < 1; i++) {

                                chart.collapse(i, false);
                            }

                        });

                        chart.draw(data, options);

                    }

                    });

                    setTimeout(function(){   $(".wait").slideUp(500)},5000);

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


function RetornaDetalhes(id) {

    var pdata = {};
    pdata["idUsuario"] = id;

    $("#tblDetalhesUsuario > tbody").empty();

    var tabela = "";
    var linhas = "";
    $.getJSON($("#RetornaDetalhesURL").val(), pdata, function (data) {
        if (data.Result.length > 0) {
            $.each(data.Result, function (index, dados) {

                tabela = tabela + "<tr><td style=\"width:25%;\">" + dados.Cliente;
                tabela = tabela + "</td><td style=\"width:25%;\">" + dados.Produto;
                tabela = tabela + "</td><td style=\"width:25%;\">" + dados.Projeto;
                tabela = tabela + "</td><td style=\"width:25%;\">" + dados.TempoMes;
                tabela = tabela + "</td></tr>";
                linhas = linhas + tabela;

            });
            $("#tblDetalhesUsuario > tbody").empty();
            $("#tblDetalhesUsuario > tbody").append(linhas);
        } else {
            $("#tblDetalhesUsuario > tbody").empty();
        }
    });
}