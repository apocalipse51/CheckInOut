var pdata = {};
var myVar;
function atualizaFiltros() {
    var atual = new Date();

    if ($("#cbxProjeto").val() === "0" || $("#cbxProjeto").val() === null) {
        $(".error").slideDown(300);
        $(".error").html("Obrigatório selecionar o Projeto!");
        return;
    }
    pdata["projetoId"] = $("#cbxProjeto").val();
    if ($("#DtInicio").val() === "") {
        pdata["dtInicial"] = dateFormat('01/01/1900', 'yyyy-mm-dd 23:59');
        pdata["dtFinal"] = dateFormat('12/31/2100', 'yyyy-mm-dd 00:00');
    } else {
        if ($("#DtFim").val() === "") {
            pdata["dtInicial"] = $("#DtInicio").val() + " 00:00:00";
            pdata["dtFinal"] = '2100-12-31';
        } else {
            pdata["dtInicial"] = $("#DtInicio").val() + " 00:00:00";
            pdata["dtFinal"] = $("#DtFim").val() + " 23:59:59";
        }
    }

    if (new Date(pdata["DtFim"]) < new Date(pdata["DtIncio"])) {
        $(".error").html("Data inicio deve sem maior ou igual a Data fim");
        $(".error").slideDown(300);
        $(".wait").slideUp(300);
        pdata["dtInicial"] = dateFormat('1900-01-01', 'yyyy-mm-dd 23:59');
        pdata["dtFinal"] = dateFormat('2100/12/31', 'yyyy-mm-dd 00:00');
        return;
    }
    atualizar();

}



function atualizar() {

    $(".error").slideUp(300);
    $(".wait").slideDown(300);

    $.ajax({
        url: $("#BuscaDashBoardHorasCompactoURL").val(),
        data: pdata,
        type: 'POST',
        success: function (result) {
            DashBoardHorasCompacto(result);
        }
    });

    $.ajax({
        url: $("#BuscaDashBoardHorasCompactoTimeLineURL").val(),
        data: pdata,
        type: 'POST',
        success: function (result) {
            DashBoardHorasTimeLine(result);
        }
    });
    
    CarregaDetalhamento();

    $(".error").slideUp(300);
    $(".wait").slideUp(300);

}




function DashBoardHorasCompacto(json) {

    google.charts.setOnLoadCallback(drawMaterial);
    $("ChartHorasCompacto").innerHTML("");
    function drawMaterial() {
        var data = new google.visualization.DataTable();
        data.addColumn('string', 'Colaborador');
        data.addColumn('number', 'Tempo(m)');
        data.addColumn({ type: 'string', role: 'annotation' });


        var pjson = JSON.parse(json);
        $(pjson).each(function () {
            data.addRows([[$(this).attr("Nome"), $(this).attr("Tempo"),""]]);
        });
        //Logdados
        //lic_Qtde

        var options = {
            bars: 'vertical',
            legend: { position: "none" },
            isStacked: true
        };

        var material = new google.charts.Bar(document.getElementById('ChartHorasCompacto'));
        material.draw(data, options);
    }
}



function DashBoardHorasTimeLine(json) {

    google.charts.setOnLoadCallback(drawMaterial);
    $("CharTimeLine").innerHTML("");
    function drawMaterial() {
        var data = new google.visualization.DataTable();
        data.addColumn('string', 'Data');
        data.addColumn('number', 'Tempo(m)');
        data.addColumn({ type: 'string', role: 'annotation' });


        var pjson = JSON.parse(json);
        $(pjson).each(function () {
            data.addRows([[$(this).attr("Data"), $(this).attr("Tempo"), ""]]);
        });
        //Logdados
        //lic_Qtde

        var options = {
            bars: 'vertical',
            legend: { position: "none" }
        };

        var material = new google.charts.Line(document.getElementById('CharTimeLine'));
        material.draw(data, options);
    }
}


$(document).ready(function () {
    google.charts.load("current", { packages: ["corechart", 'bar'] });
    google.charts.load("current", { packages: ["corechart", 'line'] });
    CarregaComboClienteFinal();
});


function CarregaComboClienteFinal() {
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

function CarregaDetalhamento() {
    var tabela = "";
    var linhas = "";
    $.getJSON($("#BuscaTabelaHorasCompactoURL").val(), pdata, function (data) {
        if (data.Result.length > 0) {
            $.each(data.Result, function (index, dados) {

                var date = new Date(null);
                date.setHours(dados.Tempo); // specify value for SECONDS here
                var result = date.toISOString().substr(11, 8)

                tabela = "<tr>"
                    + "</td><td style=\"width:90%;\">" + dados.Nome
                    + "</td><td style=\"width:10%;\">" + dados.Tempo + "</td></tr>";

                linhas = linhas + tabela;
            });
            $("#tblDescricaoItens > tbody").empty();
            $("#tblDescricaoItens > tbody").append(linhas);
        } else {
            $("#tblDescricaoItens > tbody").empty();
        }
    });
}
