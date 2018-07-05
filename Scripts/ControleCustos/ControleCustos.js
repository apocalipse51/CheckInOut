$(document).ready(function () {

    $('#divCampos').hide();
    CarregaContratos(); 
    CarregaControle();

});

function MonstraCampos() {

    var now = new Date();
    $('#divCampos').show();
}


function SalvaConfig() {

    $(".error").slideUp(300);

    var pdata = {};
    var now = new Date();

    pdata["id"] = $('#idcontrole').val();
    pdata["licenca"] = $("#cbxLicenca").val();
    pdata["servidor"] = $("#txtServidor").val();
    pdata["based"] = $("#txtBaseDados").val();
    pdata["usuario"] = $('#txtUsuario').val();
    pdata["senha"] = $("#txtSenha").val();
    pdata["viewcontrole"] = $("#txtViewControle").val();
    pdata["data"] = $("#txtData").val();
    pdata["idoperador"] = $("#txtIdOperador").val();
    pdata["nome"] = $("#txtNomeOperador").val();
    pdata["filtradata"] = $('#cbxFiltraData').val();
    pdata["ativo"] = $("#cbxAtivo").val();


    if (Validacao(pdata)) {

        $.ajax({
            url: $("#MantemConfiguracaoURL").val(),
            type: "POST",
            data: pdata,
            cache: false,
            complete: function (data) {

                $("#divCampos").hide();
                document.getElementById('idcontrole').value = "0";
                LimparCampos();
                CarregaControle();

            }
        });

    }

}


function Validacao(pdata) {
    if (pdata["contrato"] === "") {
        $(".error").slideDown(300);
        $(".error").html("Contrato é um Campo Obrigatório");
        $(".wait").slideUp(300);
        return false;
    }
    if (pdata["servidor"] === "") {
        $(".error").slideDown(300);
        $(".error").html("Servidor é um campo obrigatório");
        $(".wait").slideUp(300);
        return false;
    }
    if (pdata["base"] === "") {
        $(".error").slideDown(300);
        $(".error").html("Base de dados é um campo obrigatório");
        $(".wait").slideUp(300);
        return false;
    }
    if (pdata["usuario"] === "") {
        $(".error").slideDown(300);
        $(".error").html("Usuário é um campo obrigatório");
        $(".wait").slideUp(300);
        return false;
    }

    if (pdata["senha"] === "") {
        $(".error").slideDown(300);
        $(".error").html("Senha é um campo obrigatório");
        $(".wait").slideUp(300);
        return false;
    }

    if (pdata["data"] === "") {
        $(".error").slideDown(300);
        $(".error").html("Data é um campo obrigatório");
        $(".wait").slideUp(300);
        return false;
    }

    if (pdata["idoperador"] === "") {
        $(".error").slideDown(300);
        $(".error").html("Id Operador é um campo obrigatório");
        $(".wait").slideUp(300);
        return false;
    }

    if (pdata["nome"] === "") {
        $(".error").slideDown(300);
        $(".error").html("Nome é um campo obrigatório");
        $(".wait").slideUp(300);
        return false;
    }

    if (pdata["ativo"] === "") {
        $(".error").slideDown(300);
        $(".error").html("Ativo é um campo obrigatório");
        $(".wait").slideUp(300);
        return false;
    }

    return true;
}

function CarregaContratos() {
    var pdata = {};

    $('#cbxLicenca').empty();
    $('#cbxLicenca').append($('<option>', {
        value: 0,
        text: "Selecione"
    }));

    $.getJSON($("#BuscaLicencasURL").val(), pdata, function (data) {
        if (data.Result.length > 0) {

            $.each(data.Result, function (index, dados) {
                $('#cbxLicenca').append($('<option>', {
                    value: dados.lic_Id,
                    text: dados.lic_Contrato  
                    
                }));

            });
        }
    });
}


function CarregaControle() {

    $(".wait").slideDown(500);

    var pdata = {};
    $("#tblDescricaoItens > tbody").empty();
    var tabela = "";
    var linhas = "";
    $.getJSON($("#ListaControleCustoURL").val(), pdata, function (data) {
        if (data.Result.length > 0) {
            $.each(data.Result, function (index, dados) {

                var ativo = dados.ico_Ativo;


                if (ativo === true)
                {
                    strs = "</td><td><img src='../images/sinal_vd.png' title='Ativo'></a>";
                }
                else
                {
                    strs = "</td><td><img src='../images/sinal_vm.png' title='Desativado'></a>";
                }
               

                tabela = "<tr><td style=\"width:30px;\"><a href='#' onclick=\"EditarControleCusto('" + dados.ico_Id + "','" + dados.ico_LicId + "','" + dados.ico_Servidor + "','" + dados.ico_BaseDados + "','" + dados.ico_Usuario + "','" + dados.ico_Senha + "','" + dados.ico_View + "','" + dados.ico_CampoData + "', '" + dados.ico_CampoIdOperador + "','" + dados.ico_CampoNomeOperador + "','" + dados.ico_FiltraData + "','" + dados.ico_Ativo + "')\"><img src='../images/edit.png'></a>";
                tabela = tabela + "</td><td style=\"width:40%;\">" + dados.ico_LicId;
                tabela = tabela + "</td><td style=\"width:20%;\">" + dados.ico_Servidor;
                tabela = tabela + "</td><td style=\"width:20%;\">" + dados.ico_BaseDados;
                tabela = tabela + "</td><td style=\"width:20%;\">" + dados.ico_Usuario;
                tabela = tabela + "</td><td style=\"width:20%;\">" + dados.ico_Senha;
                tabela = tabela + "</td><td style=\"width:20%;\">" + dados.ico_CampoData;
                tabela = tabela + "</td><td style=\"width:20%;\">" + dados.ico_CampoIdOperador;
                tabela = tabela + "</td><td style=\"width:20%;\">" + dados.ico_CampoNomeOperador;
                tabela = tabela  + strs;
                tabela = tabela + "</td></tr>";
                linhas = linhas + tabela;

            });
            $("#tblDescricaoItens > tbody").empty();
            $("#tblDescricaoItens > tbody").append(linhas);
        } else {
            $("#tblDescricaoItens > tbody").empty();
        }
    });

    $(".wait").slideUp(500);
}   


function EditarControleCusto(id, licenca, servidor, base, usuario, senha, view,data, idoperador, nome, filtra, ativo)
{
    var ativoc = "";

    if (ativo == "true")
    {
        ativoc = "Sim";
    }
    else
    {
        ativo = "Não";
    }

    var filtrac = "";

    if (filtra == "true")
    {
        filtrac = "Sim";
    }
    else
    {
        filtrac = "Não";
    }

    document.getElementById('idcontrole').value = id;
    $("#txtServidor").val(servidor);
    $("#txtBaseDados").val(base);
    $("#txtUsuario").val(usuario);
    $("#txtSenha").val(senha);
    $("#txtViewControle").val(view);
    $("#txtData").val(data);
    $("#txtIdOperador").val(idoperador);
    $("#txtNomeOperador").val(nome);
    $("#cbxFiltraData option:contains('" + filtrac + "')").prop('selected', true);
    $('#cbxLicenca option[value=' + licenca + ']').attr('selected', 'selected');
    $("#cbxAtivo option:contains('" + ativoc + "')").prop('selected', true);
    $("#divCampos").show();

}


function LimparCampos()
{

    $('#idcontrole').val("0");
    $("#txtServidor").val("");
    $("#txtBaseDados").val("");
    $('#txtUsuario').val("");
    $("#txtSenha").val("");
    $("#txtViewControle").val("");
    $("#txtData").val("");
    $("#txtIdOperador").val("");
    $("#txtNomeOperador").val("");
    $('#cbxFiltraData').val("");
    $("#cbxAtivo").val("");

}