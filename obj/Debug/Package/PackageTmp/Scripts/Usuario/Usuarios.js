$(document).ready(function () {
    $("#txtTel").mask("(99) 99999-9999");
    CarregaUsuarios();
    CarregaComboUsuarioFuncao();
    CarregaComboResponsavel();
    $("#divCampos").hide();
    hideBtnCancel();
});

function MonstraCampos() {
    $("#divCampos").show();
    if(document.querySelector('.btn-cancel')) {
      document.querySelector('.btn-cancel').style.display = 'block';
    }
}

function HideFields() {
  $("#divCampos").hide();
}

window.addEventListener('load', function () {
    document.querySelector('input[type="file"]').addEventListener('change', function () {
        if (this.files && this.files[0]) {
            var img = document.getElementById('userimgc');
            img.src = URL.createObjectURL(this.files[0]);
            var FR = new FileReader();
            FR.addEventListener("load", function (e) {
                document.getElementById('Base64img').value = e.target.result;
            });
            FR.readAsDataURL(this.files[0]);
        }
    });
});

function ListaTelas() {
  let perfil = localStorage.getItem('perfil');
  let optGroup = '';
  if(perfil === 'ADM') {
    optGroup = `
      <option value="1" selected>Gestor</option>
      <option value="2">Padrão</option>
      <option value="3">ADM</option>
    `;
  } else if(perfil === 'gestor') {
    optGroup = `
      <option value="1" selected>Gestor</option>
      <option value="2">Padrão</option>
    `;
  } else {
    optGroup = `
      <option value="2" selected>Padrão</option>
    `;
  }
  let slct = document.querySelector('#selectAcessos');
  slct.innerHTML = optGroup;
}

function ListaTelasUsuario(idUsuario) {
    var pdata = {};
    pdata["usuarioId"] = idUsuario;
    var textMenu = [];
    var index = 1;
    $.getJSON($("#BuscaTelaURL").val(), pdata, function (data) {
        if (data.Result.length > 0) {
            $.each(data.Result, function (index, dados) {
                textMenu[index] = dados.tel_Id;
                index = index + 1;
            });
        }
        $("#selectAcessos").multipleSelect("setSelects", textMenu);
    });
}

function Validacao(pdata) {
    if (pdata["nome"] === "") {
        $(".error").slideDown(300);
        $(".error").html("Nome é um Campo Obrigatório");
        $(".wait").slideUp(300);
        logErro("Nome é um Campo Obrigatório");
        return false;
    }
    if (pdata["login"] === "") {
        $(".error").slideDown(300);
        $(".error").html("Login é um campo obrigatório");
        $(".wait").slideUp(300);
        logErro("Login é um campo obrigatório");
        return false;
    }
    if (pdata["email"] === "") {
        $(".error").slideDown(300);
        $(".error").html("E-mail é um campo obrigatório");
        $(".wait").slideUp(300);
        logErro("E-mail é um campo obrigatório");
        return false;
    }
    if (pdata["acessos"].length === 0) {
        $(".error").slideDown(300);
        $(".error").html("Defina no minimo um acesso para o usuário");
        $(".wait").slideUp(300);
        logErro("Defina no minimo um acesso para o usuário");
        return false;
    }
    if (pdata["funcao"] === "") {
        $(".error").slideDown(300);
        $(".error").html("Função é um campo obrigatório");
        $(".wait").slideUp(300);
        logErro("Função é um campo obrigatório");
        return false;
    }

    if (pdata["Tel"] === "") {
        $(".error").slideDown(300);
        $(".error").html("Telefone é um campo obrigatório");
        $(".wait").slideUp(300);
        logErro("Telefone é um campo obrigatório");
        return false;
    }

    return true;
}

function logErro(err) {
  console.log(err);
}

function hideBtnCancel() {
  if(document.querySelector('.btn-cancel')){
    document.querySelector('.btn-cancel').style.display = 'none';
  }
}

function hideContainer() {
  $('#divCampos').hide();
  hideBtnCancel();
}

function EditarUsuario(id, login, nome, email, Tel, fnc, str, Aprov, strs, foto ) {
    $("#cbxUsuarioFuncao option:contains('" + fnc + "')").prop('selected', true);
    $("#cbxUsuarioEstrutura option:contains('" + str + "')").prop('selected', true);
    $("#cbxUsuarioAprova option:contains('" + Aprov + "')").prop('selected', true);
    $("#cbxUsuarioVisualizaEstruturas option:contains('" + Aprov + "')").prop('selected', true);
    //ListaTelasUsuario(id);
    $("#txtNome").val(nome);
    $("#txtLogin").val(login);
    $("#txtEmail").val(email);
    $("#txtTel").val(Tel);
    $("#divCampos").show();
    if(document.querySelector('.btn-cancel')) {
      document.querySelector('.btn-cancel').style.display = 'block';
    }
    var img = document.getElementById('userimgc');
    img.src = foto;
}

function ResetSenhaOutroUser(id) {
    var pdata = {};
    pdata["idUsuario"] = id;
    pdata["novaSenha"] = Math.floor((Math.random() * 1000) + 1);;
    $.getJSON($("#ResetarSenhaUsuarioURL").val(), pdata, function (data) {
        if (data.Result) {
            $(".error").slideUp(300);
            $(".wait").slideDown(300);
            $(".wait").html("Senha resetada com sucesso para " + pdata["novaSenha"]);
        } else {
            $(".error").slideDown(300);
            $(".error").html("Falha ao tentar resetar a senha!");
            $(".wait").slideUp(300);
        }
    });
}

function CarregaUsuarios() {

    $(".wait").slideDown(500);

    var pdata = {};
    pdata["idUsuario"] = $("#idUsuario").val();
    $("#tblDescricaoItens > tbody").empty();
    var tabela = "";
    var linhas = "";
    $.getJSON($("#ListaUsuariosURL").val(), pdata, function (data) {
        if (data.Result.length > 0) {
          $.each(data.Result, function (index, dados) {
            var str = dados.estr_apr;
            var pipe = dados.usr_PermissaoPipe;
            if (pipe === 0)
            {
                pipe = "Não";
            }
            else
            {
                pipe = "Sim";
            }
            var strs = dados.usr_VerEstruturas;
            if (str === 0)
            {
                str = "Não";
            }
            else if (str === 1)
            {
                str = "Sim";
            }
            else
            {
                str = "nda";
            }

            if (strs === 0)
            {
                strs = "Não";
            }
            else if (strs === 1)
            {
                strs = "Sim";
            }
            else
            {
                strs = "nda";
            }
            if (data.Result.length == 1)
            {
                strs = "";
            }
            tabela = `<tr><td style="width:30px;"><a onclick="EditarUsuario('${(dados.usr_Id !== null) ? dados.usr_Id : " "}','${(dados.usr_Login !== null) ? dados.usr_Login : " "}','${(dados.usr_Nome !== null) ? dados.usr_Nome : " "}','${(dados.usr_Email !== null) ? dados.usr_Email : " "}','${(dados.usr_Tel !== null) ? dados.usr_Tel : " " }','${(dados.fnc_Nome !== null) ? dados.fnc_Nome : " "}','${(dados.estr_Nome !== null) ? dados.estr_Nome : " "}','${str}','${strs}','${dados.usr_imagePerfil}')"><img src='../images/edit.png'></a>`;
            tabela = tabela + "</td><td style=\"width:30px;\"><a href='#' onclick=\"ResetSenhaOutroUser('" + dados.usr_Id + "')\"><img src='../images/resetPass.png'></a>";
            tabela = `${tabela}</td><td style="width:15%;">${(dados.usr_Login !== null) ? dados.usr_Login : " "}`;
            tabela = `${tabela}</td><td style="width:20%;">${(dados.usr_Nome !== null) ? dados.usr_Nome : " "}`;
            tabela = `${tabela}</td><td style="width:50%;">"${(dados.fnc_Nome !== null) ? dados.fnc_Nome : " "}`;
            tabela = `${tabela}</td><td style="width:50%;">"${(dados.estr_Nome !== null) ? dados.estr_Nome : " "}`;
            tabela = `${tabela}</td><td style="width:10%;">${str}`;
            tabela = `${tabela}</td><td style="width:60%;">${(dados.usr_Email !== null) ? dados.usr_Email : " "}`;
            tabela = `${tabela}</td><td style="width:50%;">${(dados.usr_Tel !== null) ? dados.usr_Tel : "Não informado"}`;
            tabela = `${tabela}</td><td style="width:20%;">${(dados.fnc_Sigla !== null) ? dados.fnc_Sigla : " "}`;
            tabela = `${tabela}</td><td style="width:20%;">${strs}`;
            tabela = `${tabela}</td><td style="width:20%;">${pipe}`;
            tabela = `${tabela}</td></tr>"`;
            linhas = linhas + tabela;
          });
          $("#tblDescricaoItens > tbody").empty();
          localStorage.removeItem('linhas');
          localStorage.setItem('linhas', linhas);
          //$("#tblDescricaoItens > tbody").append(linhas);
          OrganizeTable('table-internal', 0, 'controllers');
        } else {
          $("#tblDescricaoItens > tbody").empty();
        }
    });

    $(".wait").slideUp(500);
}

function SalvaUsuario() {
    $(".error").slideUp(300);
    var pdata = {};
    pdata["nome"] = $("#txtNome").val();
    pdata["login"] = $("#txtLogin").val();
    pdata["funcao"] = $("#cbxUsuarioFuncao").val();
    pdata["estrutura"] = $('#cbxUsuarioEstrutura').val();
    pdata["acessos"] = $("#selectAcessos").val();
    pdata["email"] = $("#txtEmail").val();
    pdata["tel"] = $("#txtTel").val();
    pdata["Aprova"] = $("#cbxUsuarioAprova").val();
    pdata["visualizaEstr"] = $("#cbxUsuarioVisualizaEstruturas").val();
    pdata["ImagemPerfil"] = $("#Base64img").val();
    pdata["pipe"] = $("#cbxUsuarioVisualizapipeline").val();
    pdata["perfil"] = "";
    //1: gestor, 2: padrão, 3: ADM
    if(pdata["acessos"] == 1) {
      pdata["acessos"] = [5,6,9,10,11,12,13,14,15,16].toString();
      pdata.perfil = 'gestor';
    } else if(pdata["acessos"] == 2) {
      pdata["acessos"] = [10,11,13,14,15].toString();
      pdata.perfil = 'padrao';
    } else {
      pdata["acessos"] = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,19,20].toString();
      pdata.perfil = 'adm';
    }
    if (Validacao(pdata)) {
        $.ajax({
            url: $("#MantemUsuarioURL").val(),
            type: "POST",
            data: pdata,
            cache: false,
            complete: function (data) {
                console.log(data);
                CarregaUsuarios();
                $("#divCampos").hide();
                LimparCampos();
            }
        });
    }
}

function CarregaComboUsuarioFuncao() {
    var pdata = {};
    $('#cbxUsuarioFuncao').empty();
    $('#cbxUsuarioFuncao').append($('<option>', {
        value: 0,
        text: "Selecione"
    }));

    $.getJSON($("#BuscaFuncaoUsuarioURL").val(), pdata, function (data) {
        if (data.Result.length > 0) {
            $.each(data.Result, function (index, dados) {
                $('#cbxUsuarioFuncao').append($('<option>', {
                    value: dados.fnc_id,
                    text: dados.fnc_Nome
                }));
            });
        }
    });
}

function CarregaComboResponsavel() {
    var pdata = {};
    $('#cbxUsuarioEstrutura').empty();
    $('#cbxUsuarioEstrutura').append($('<option>', {
        value: 0,
        text: "Selecione"
    }));

    $.getJSON($("#BuscaResponsavelURL").val(), pdata, function (data) {
        if (data.Result.length > 0) {
            $.each(data.Result, function (index, dados) {
                $('#cbxUsuarioEstrutura').append($('<option>', {
                    value: dados.usr_Id,
                    text: dados.usr_Nome
                }));
            });
        }
    });
}

function LimparCampos()
{
    $("#txtEmail").val("");
    $("#txtTel").val("");
    $("#txtNome").val("");
    $("#txtLogin").val("");
    $("#selectAcessos").empty();
    $("#cbxUsuarioFuncao option:contains('Selecione')").prop('selected', true);
    $("#cbxUsuarioEstrutura option:contains('Selecione')").prop('selected', true);
    $("#cbxUsuarioAprova option:contains('Sim')").prop('selected', true);

}

function OrganizeTable(tb, index = 0, controllers) {
  if(document.querySelector(`.${tb}`)){
    let table = document.querySelector(`.${tb}`);
    let tableContent = table.querySelector('tbody');
    tableContent.innerHTML = localStorage.getItem('linhas');
    //Define the pagination 4 the table
    let qtdPgs = Math.ceil(tableContent.rows.length / 10);
    let pages = [];
    let trs = [];
    for(let i = 0; i < tableContent.rows.length; ++i) {
      trs.push(`<tr>${tableContent.rows[i].innerHTML}</tr>`);
    }
    for(let i = 0; i < qtdPgs; ++i) {
      if(trs.length > 9) {
        pages.push([trs.splice(0, 10)]);
      } else {
        pages.push([trs.splice(0, (trs.length))]);
      }
    }
    let content = (index > 0) ? pages[index-1].toString() : pages[index].toString();
    content = content.replace(/>,/g, " ");
    tableContent.innerHTML = content;
    //Define the navigation options
    let con = document.querySelector(`.${controllers}`);
    con.innerHTML = "";
    for(let i = 0; i < qtdPgs; ++i){
        con.innerHTML += `<button onclick="OrganizeTable(this.parentNode.parentNode.classList[0], this.innerHTML, 'controllers')" class="btn btn-primary">${i+1}</button>`;
    }
  }
}
