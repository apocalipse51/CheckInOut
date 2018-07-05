var pdata = {};
var myVar;
function atualizaFiltros() {
    var atual = new Date();

    if ($("#DtInicio").val() === "") {
        pdata["dtFinal"] = dateFormat(atual, 'yyyy-mm-dd 23:59');
        pdata["dtInicial"] = dateFormat(atual, 'yyyy-mm-dd 00:00');
    } else {
        if ($("#DtFim").val() === "") {
            pdata["dtFinal"] = '01/01/1900';
            pdata["dtInicial"] = '01/01/1900';
            $(".error").slideDown(300);
            $(".error").html("Obrigatória entrada de Data Inicio e Final do Processo");
            return;
        } else {
            pdata["dtInicial"] = $("#DtInicio").val() + " 00:00:00";
            pdata["dtFinal"] = $("#DtFim").val() + " 23:59:59";
        }
    }

    if (new Date(pdata["DtFim"]) < new Date(pdata["DtIncio"])) {
        $(".error").html("Data inicio deve sem maior ou igual a Data fim");
        $(".error").slideDown(300);
        $(".wait").slideUp(300);
        pdata["DtFim"] = '01/01/1900';
        pdata["DtIncio"] = '01/01/1900';
        return;
    }
    atualizar();
    
}

$(document).ready(function () {
    google.charts.load("current", { packages: ["corechart", 'bar'] });
    atualizaFiltros();
});

function AtualizarAutomaticamente() {
    var check = $("#Atualizar").is(":checked");
    if (check) {
        atualizaSemSlide();
        setTimeout("AtualizarAutomaticamente()", 15000);
    }
}

function CarregaDetalhamento() {
    var tabela = "";
    var linhas = "";
    $.getJSON($("#TabelaRealTime").val(), pdata, function (data) {
        if (data.Result.length > 0) {
            $.each(data.Result, function(index, dados) {
                tabela = "<tr>"
                    + "</td><td>" + dados.con_Nome
                    + "</td><td>" + dados.fil_Descricao
                    + "</td><td>" + dados.lic_Id
                    + "</td><td>" + dados.prd_Descricao
                    + "</td><td align='right'>" + dados.lic_Qtde
                    + "</td><td align='right'>" + dados.Logdados + "</td></tr>";

                linhas = linhas + tabela;
            });
            $("#tblDescricaoItens > tbody").empty();
            $("#tblDescricaoItens > tbody").append(linhas);
        } else {
            $("#tblDescricaoItens > tbody").empty();
        }
    });
}

function atualizaSemSlide() {
    $.ajax({
        url: $("#DashBoardRealTime").val(),
        data: pdata,
        type: 'POST',
        success: function (result) {
            DashBoardLicencas(result);
        }
    });
    CarregaDetalhamento();
}

function atualizar() {

    $(".error").slideUp(300);
    $(".wait").slideDown(300);

    $.ajax({
        url: $("#DashBoardRealTime").val(),
        data: pdata,
        type: 'POST',
        success: function (result) {
            DashBoardLicencas(result);
        }
    });

    CarregaDetalhamento();

    $(".error").slideUp(300);
    $(".wait").slideUp(300);
    
}

function DashBoardLicencas(json) {

    google.charts.setOnLoadCallback(drawMaterial);
    
    function drawMaterial() {
        var data = new google.visualization.DataTable();
        data.addColumn('string', 'Contratante');
        data.addColumn('number', 'Licenças');
        data.addColumn('number', 'Utilizado');
        data.addColumn({ type: 'string', role: 'annotation' });
        

        var pjson = JSON.parse(json);
        $(pjson).each(function () {
            data.addRows([[$(this).attr("con_Nome") + "\n" + $(this).attr("fil_Descricao") + "\n" + $(this).attr("prd_Descricao"), $(this).attr("lic_Qtde"), $(this).attr("Logdados"), ""]]);
        });
        //Logdados
        //lic_Qtde

        var options = {
            bars: 'horizontal',
            legend: { position: "none" },
            colors: ['#1b9e77', '#d95f02'],
            isStacked: true
        };

        var material = new google.charts.Bar(document.getElementById('ChartLicencas'));
        material.draw(data, options);
    }
}
