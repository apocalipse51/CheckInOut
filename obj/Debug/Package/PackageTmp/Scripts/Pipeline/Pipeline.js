    $(document).ready(function () {

        CarregaPipeline("0","-1");
        $('#divCampos').hide();
        $("#txtTotal").mask("9.999.999,99");
        CarregaComboClienteFinal();
        CarregaComboProduto();

    

    });


    function Filtra()
    {
        CarregaPipeline("0", $("#cbxStatusFiltro").val());
    }

    function Ocultar()
    {
        var btntxt = document.getElementById('Ocultar').value;

         if (btntxt === "Ocultar")
         {
             CarregaPipeline("1","-1");
             document.getElementById('Ocultar').value = "Mostrar";
         }
         else
         {
             CarregaPipeline("0","-1");
             document.getElementById('Ocultar').value = "Ocultar";
         }

    
    }

    function MonstraCampos()
    {
        $('#divCampos').show();
    }



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


    function CarregaComboProduto() {
        var pdata = {};

        $('#cbxProduto').empty();
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

    function CalculaLicenca()
    {
        var total = "";
        var valor = $('#txtValorlicenca').val();
        var quatidade = $('#txtQtlicencas').val();

        total = valor * quatidade;

        total = total.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");

        document.getElementById('lblTotal').innerHTML = total;

    }


    function TrataValor()
    {
        var valor = $('#txtValorlicenca').val();
        total = valor * 1;
        total = total.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
        total = total.replace(",", "");
        $('#txtValorlicenca').val(total);

    }


    function AddCliente()
    {
        document.getElementById('ModalMuda').className = "modal-dialog modal-sm";
        $('#AddObservacao').hide();
        $('#AddProduto').hide();
        $('#AddCliente').show();
        $('#ModalAdd').modal('show');

    }

    function AddProduto()
    {
        document.getElementById('ModalMuda').className = "modal-dialog modal-sm";
        $('#AddObservacao').hide();
        $('#AddProduto').show();
        $('#AddCliente').hide();
        $('#ModalAdd').modal('show');

    }

    function RegistrarObservacao()
    {
        document.getElementById('ModalMuda').className = "modal-dialog dialog";
        $('#AddProduto').hide();
        $('#AddCliente').hide();
        $('#AddObservacao').show();   
        $('#ModalAdd').modal('show');

        $('#txtObTemp').val(document.getElementById('txtObs').value);

    }

    function SalvarCliente()
    {
        var pdata = {};

        pdata["nome"] = $('#txtCliente').val();
        pdata["sigla"] = $('#txtSigla').val();


        $.getJSON($("#AddClienteURL").val(), pdata, function (data) {
            if (data.Result.length > 0) {
           
                CarregaComboClienteFinal();
                $('#ModalAdd').modal('hide');
            }
        });
    

    }


    function SalvarProduto() {

        var pdata = {};

        pdata["id"] = "0";
        pdata["clienteFinalId"] = $('#cbxClienteFinal').val();
        pdata["descricao"] = $('#txtProduto').val();
        pdata["sigla"] = $('#txtSiglaProj').val();


        $.getJSON($("#MantemProdutoURL").val(), pdata, function (data) {
            if (data.Result.length > 0) {

                $('#ModalAdd').modal('hide');
                CarregaComboProduto();
            }
        });


    }


    function RegistrarObs()
    {
        document.getElementById('txtObs').value = $('#txtObTemp').val();
  

        var id =  document.getElementById('idcontrole').value;

        if(id > 0)
        {
            pdata = {};

            pdata["id"] = id;
            pdata["obs"] = $('#txtObTemp').val();

            $.getJSON($("#MantemPilelineObsURL").val(), pdata, function (data) {
                if (data.Result.length > 0) {
               

                }
            });

        }

        $('#ModalAdd').modal('hide');

       
        

    }


    function Salvar()
    {
        var pdata = {};

        pdata["id"] = document.getElementById('idcontrole').value;
        pdata["origem"] = $('#txtOrigem').val();
        pdata["idcliente"] = $('#cbxClienteFinal').val();
        pdata["contatonome"] = $('#txtContatoNome').val();
        pdata["contatoemail"] = $('#txtContatoEmail').val();
        pdata["contatotelefones"] = $('#txtContatoTelefones').val();
        pdata["nomeprojeto"] = $('#txtProjeto').val();
        pdata["idstatus"] = $('#cbxStatus').val();
        pdata["idtipo"] = $('#cbxTipo').val();
        pdata["idproduto"] = $('#cbxProduto').val();
        pdata["previsaocontrato"] = $('#txtPrevisaoContrato').val();
        pdata["valorlicenca"] = $('#txtValorlicenca').val();
        pdata["qtlicenca"] = $('#txtQtlicencas').val();
        pdata["contrato"] = $('#txtPrevisaoContrato').val();
        pdata["prazocontrato"] = $('#txtPrazo').val();
        pdata["obs"] = document.getElementById('txtObs').value;
    

            if (Validacao(pdata)) {

            $.getJSON($("#MantemPilelineURL").val(), pdata, function (data) {
                if (data.Result.length > 0) {

                    location.reload();
                

                }
            });
        }

    }


    function Validacao(pdata) {

        if (pdata["login"] === "") {
            $(".error").slideDown(300);
            $(".error").html("Origem é um campo obrigatório");
            $(".wait").slideUp(300);
            return false;
        }
        if (pdata["idcliente"] === "") {
            $(".error").slideDown(300);
            $(".error").html("Cliente é um campo obrigatório");
            $(".wait").slideUp(300);
            return false;
        }
        if (pdata["contatonome"].length === 0) {
            $(".error").slideDown(300);
            $(".error").html("Nome do contato é um campo obrigatório");
            $(".wait").slideUp(300);
            return false;
        }
        if (pdata["contatoemail"] === "") {
            $(".error").slideDown(300);
            $(".error").html("E-mail é um campo obrigatório");
            $(".wait").slideUp(300);
            return false;
        }

        if (pdata["contatotelefones"] === "") {
            $(".error").slideDown(300);
            $(".error").html("Telefone é um campo obrigatório");
            $(".wait").slideUp(300);
            return false;
        }

        if (pdata["nomeprojeto"] === "") {
            $(".error").slideDown(300);
            $(".error").html("Projeto é um campo obrigatório");
            $(".wait").slideUp(300);
            return false;
        }

        if (pdata["idstatus"] === "") {
            $(".error").slideDown(300);
            $(".error").html("Status é um campo obrigatório");
            $(".wait").slideUp(300);
            return false;
        }

        if (pdata["idtipo"] === "") {
            $(".error").slideDown(300);
            $(".error").html("Tipo é um campo obrigatório");
            $(".wait").slideUp(300);
            return false;
        }

        if (pdata["idproduto"] === "") {
            $(".error").slideDown(300);
            $(".error").html("Produto é um campo obrigatório");
            $(".wait").slideUp(300);
            return false;
        }

        if (pdata["previsaocontrato"] === "") {
            $(".error").slideDown(300);
            $(".error").html("Previsão é um campo obrigatório");
            $(".wait").slideUp(300);
            return false;
        }

        if (pdata["valorlicenca"] === "") {
            $(".error").slideDown(300);
            $(".error").html("Valor da licença é um campo obrigatório");
            $(".wait").slideUp(300);
            return false;
        }

        if (pdata["qtlicenca"] === "") {
            $(".error").slideDown(300);
            $(".error").html("Quantidade da licença é um campo obrigatório");
            $(".wait").slideUp(300);
            return false;
        }

        if (pdata["contrato"] === "") {
            $(".error").slideDown(300);
            $(".error").html("Contrato é um campo obrigatório");
            $(".wait").slideUp(300);
            return false;
        }

        if (pdata["prazocontrato"] === "") {
            $(".error").slideDown(300);
            $(".error").html("Prazo é um campo obrigatório");
            $(".wait").slideUp(300);
            return false;
        }

        if (pdata["obs"] === "") {
            $(".error").slideDown(300);
            $(".error").html("Observação é um campo obrigatório");
            $(".wait").slideUp(300);
            return false;
        }


        return true;
    }


    function LimparCampos()
    {

        $('#txtOrigem').val("");
        $('#cbxClienteFinal').val("");
        $('#txtProjeto').val("");
        $('#cbxStatus').val("");
        $('#cbxTipo').val("");
        $('#cbxProduto').val("");
        $('#txtValorlicenca').val("");
        $('#txtQtlicencas').val("");
        document.getElementById('lblTotal').innerHTML = "";
        $('#txtPrazo').val("");
        document.getElementById('txtObs').value = "";
        $('#txtObTemp').empty();

    }



    function CarregaPipeline(oculta,status) {

        $("#tbPipeline > tbody").empty();

        var linhas = "";
        var tabela = "";

        $(".wait").slideDown(300);

        var pdata = {};

        pdata["oculta"] = oculta;
        pdata["status"] = status;

        $.getJSON($("#ListaPipelineURL").val(),pdata, function (data) {

            if (data.Result.length > 0) {

            var colunas = 0;

            for (var i = 0; i < Object.keys(data.Result[0]).length; i++) {

                colunas++;
            }

            $("thead > tr").empty();

            if (colunas === 15)
            {
                $('#plus').show();
                $('#importar').show();
                $('#exportar').show();
               
                $("thead > tr").append('<th>Editar</th>');
                $("thead > tr").append('<th>Id</th>');
                $("thead > tr").append('<th>Origem</th>');
                $("thead > tr").append('<th>Cliente</th>');
                $("thead > tr").append('<th>Projeto</th>');
                $("thead > tr").append('<th>Status</th>');
                $("thead > tr").append('<th>Tipo</th>');
                $("thead > tr").append('<th>Produto</th>');
                $("thead > tr").append('<th>Previsão contrato</th>');
                $("thead > tr").append('<th>Licença</th>');
                $("thead > tr").append('<th>Qt.</th>');
                $("thead > tr").append('<th>Total</th>');
                $("thead > tr").append('<th>Anexos</th>');
            }
            else {

                $('#plus').hide();
                $('#importar').hide();
                $('#exportar').hide();

                $("thead > tr").append('<th>Id</th>');
                $("thead > tr").append('<th>Origem</th>');
                $("thead > tr").append('<th>Cliente</th>');
                $("thead > tr").append('<th>Projeto</th>');
                $("thead > tr").append('<th>Status</th>');
                $("thead > tr").append('<th>Tipo</th>');
                $("thead > tr").append('<th>Produto</th>');
                $("thead > tr").append('<th>Previsão contrato</th>');
                $("thead > tr").append('<th>Anexos</th>');



            }

            $("thead > tr").append('<th>Observação</th>');


            if (data.Result.length > 0) {

                $.each(data.Result, function (index, dados) {


                    if (colunas === 15) {

                        var valorLIcenca = dados.pip_ValorLicenca;

                        valorLIcenca = valorLIcenca.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");

                        var TotalLicenca = dados.pip_TotalLicenca;

                        TotalLicenca = TotalLicenca.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");

                    }

                    if (colunas === 15)
                    {
                        tabela = "<tr><td style=\"width:30px;\"><a href='#' onclick=\"Editar('" + dados.pip_Id + "','" + dados.pip_Origem + "','" + dados.clf_Descricao + "','" + dados.pippj_Desc + "','" + dados.pip_Status + "','" + dados.pip_Tipo + "','" + dados.prd_Descricao + "','" + dados.pip_ValorLicenca + "','" + dados.pip_QtLicenca + "','" + dados.pip_TotalLicenca + "','" + dados.pip_QtLicenca + "','" + dados.pip_prazo + "', '" + dados.pip_Obs + "', '" + dados.pipCl_ContatoNome + "', '" + dados.pipCl_ContatoEmail + "','" + dados.pipCl_ContatoTelefones + "','" + parseJsonDate(dados.pip_PrevContrato) + "')\"><img src='../images/edit.png'></a>";
                    }
                    else
                    {
                        tabela = "<tr>";
                    }

                    tabela = tabela + "</td><td>" + dados.pip_Id;
                    tabela = tabela + "</td><td>" + dados.pip_Origem;
                    tabela = tabela + "</td><td title=\"" + dados.pipCl_ContatoNome + " | " + dados.pipCl_ContatoEmail + " | " + dados.pipCl_ContatoTelefones + "\">" + dados.clf_Descricao;
                    tabela = tabela + "</td><td>" + dados.pippj_Desc;
            

                    tabela = tabela + "</td><td><select id=\"cbxStatusS" + dados.pip_Id + "\" name=\"cbxStatusS" + dados.pip_Id + "\" onchange=\"EditarStatus('" + dados.pip_Id + "');\" style=\"width:100%;\">" +
                                       "<option value=\"0\">Prospecção</option>" +
                                       "<option value=\"1\">Aguardando</option>" +
                                       "<option value=\"2\">Cancelado</option>" +
                                       "<option value=\"3\">Proposta</option>" +
                                       "<option value=\"4\">Contrato</option>" +
                                       "<option value=\"5\">Concluído</option>" +
                                       "<option value=\"6\">Concluído e aprovado</option>" +
                                       "</select>";
                    tabela = tabela + "</td><td><select id=\"cbxTipoS" + dados.pip_Id + "\" name=\"cbxTipoS" + dados.pip_Id + "\" onchange=\"EditarTipo('" + dados.pip_Id + "')\" style=\"width:100%;\">" +
                                        "<option value=\"0\">PoC</option>" +
                                        "<option value=\"1\">Try and buy</option>" +
                                        "<option value=\"2\">Venda</option>" +
                                        "</select>";
                    tabela = tabela + "</td><td>" + dados.prd_Descricao;
                    tabela = tabela + "</td><td>" + parseJsonDate(dados.pip_PrevContrato);          

                    if (colunas === 15) {

                        tabela = tabela + "</td><td> R$<b> " + valorLIcenca + '</b>';
                        tabela = tabela + "</td><td>" + dados.pip_QtLicenca;
                        tabela = tabela + "</td><td> R$<b style=\"color:green;\"> " + TotalLicenca + '</b>';                    
                    }

                    tabela = tabela + "</td><td style=\"width:30px;\"><a href='#' onclick=\"Anexor('" + dados.pip_Id + "')\"><img src='../images/attach.png'></a>";

                    tabela = tabela + "</td><td><input type=\"button\" value=\"OBSERVAÇÃO\" title=\'" + dados.pip_Obs + "\' class=\"input form-control btn btn-info btn-sm active\" style=\"font-size:13px;height:25px;\" onclick=\"EditarObs('" + dados.pip_Id + "')\" />";

                    if (colunas === 15)
                    {

                        tabela = tabela + "</td><td><input type=\"button\" id=\"Aprova" + dados.pip_Id + "\" name=\"Aprova" + dados.pip_Id + "\" value=\"Aprovar\" class=\"input form-control btn btn-success btn-sm active\" style=\"font-size:13px;height:25px;\" onclick=\"Aprovar('" + dados.pip_Id + "', '" + dados.pippj_Desc + "', '" + dados.pip_Tipo + "','" + dados.prd_Descricao + "','" + parseJsonDate(dados.pip_PrevContrato) + "','" + TotalLicenca + "','" + dados.clf_Descricao + "')\" />";

                    }
                        
                    tabela = tabela + "</td></tr>";
                    linhas = linhas + tabela;


                });

                $("#tbPipeline > tbody").empty();
                $("#tbPipeline > tbody").append(linhas);
  
           
                $.each(data.Result, function (index, dados) {

                    $('#cbxStatusS' + dados.pip_Id + ' option[value=' + dados.pip_Status + ']').attr('selected', 'selected');
                   

                    $('#cbxTipoS' + dados.pip_Id + ' option[value=' + dados.pip_Tipo + ']').attr('selected', 'selected');


                    if ($('#cbxStatusS' + dados.pip_Id).val() != 5)
                    {

                        $('#Aprova' + dados.pip_Id).hide();

                    }

                });
            }
            else
            {
                $("#tbPipeline > tbody").empty();
            }

        }
    
        });



        $(".wait").slideUp(300);

    }

    function EditarObs(id)
    {

        document.getElementById('idcontrole').value = id;

        var pdata = {};

        pdata["id"] = id;

        $.getJSON($("#ListaPipelineEditarURL").val(), pdata, function (data) {
            if (data.Result.length > 0) {
            
                $('#txtObTemp').val(data.Result[0]);

            }
        });


        RegistrarObservacao();

    }


    function EditarStatus(id) {

        $(".wait").slideDown(300);
   
        var pdata = {};

        var cbx = "#cbxStatusS" + id;
        var btn = "#Aprova" + id;

        var id_ = id;

        pdata["id"] = id;
        pdata["status"] =  $(cbx).val();
    

        $.getJSON($("#ListaPipelineEditarStatusURL").val(), pdata, function (data) {
            if (data.Result.length > 0) {

                if (pdata["status"] === "5") {

                    $(btn).show();
                }
                else {
                    
                    $(btn).hide();;
                }

            }
        });

        $(".wait").slideUp(300);

    }


    function EditarTipo(id) {


        $(".wait").slideDown(300);

        var pdata = {};

        var cbx = "#cbxTipoS" + id;


        pdata["id"] = id;
        pdata["tipo"] = $(cbx).val();


        $.getJSON($("#ListaPipelineEditarTipoURL").val(), pdata, function (data) {
            if (data.Result.length > 0) {

 
            }
        });

        $(".wait").slideUp(300);
        

    }


    function Aprovar(id, projeto, tipo, produto, data, total, cliente)
    {

        CarregaComboResponsavel();

        $('#txtIdProjA').val(id);
        $('#txtNomePrA').val(projeto);
        $('#TipoA option[value=' + tipo + ']').attr('selected', 'selected');
        $('#txtProdutoA').val(produto);
        $('#txtClienteA').val(cliente);

        var datad = data.substring(0, 2);
        var datam = data.substring(3, 5);
        var dataa = data.substring(6, 10);

        data = dataa + "-" + datam + "-" + datad;

        document.getElementById('txtDataContratoA').value = data;

        $('#ModalAprova').modal('show');

    }


    function CarregaComboResponsavel() {
        var pdata = {};
        $('#cbxUsuario').empty();
        $('#cbxUsuario').append($('<option>', {
            value: 0,
            text: "Selecione"
        }));

        $.getJSON($("#BuscaUsuarioURL").val(), pdata, function (data) {
            if (data.Result.length > 0) {
                $.each(data.Result, function (index, dados) {
                    $('#cbxUsuario').append($('<option>', {
                        value: dados.usr_Id,
                        text: dados.usr_Nome
                    }));
                });
            }
        });
    }



    function Editar(id, orig, cl_desc, proj_desc, status, tipo, prd_desc, valor, qt, total, prazomes, prazo,  obs, nome, email, tel, data)
    {
        document.getElementById('idcontrole').value = id;
        $('#txtOrigem').val(orig);
        $("#cbxClienteFinal option:contains('" + cl_desc + "')").prop('selected', true);
        $('#txtProjeto').val(proj_desc);
        $('#cbxStatus option[value=' + status + ']').attr('selected', 'selected');
        $('#cbxTipo option[value=' + tipo + ']').attr('selected', 'selected');
        $("#cbxProduto option:contains('" + prd_desc + "')").prop('selected', true);
        $('#txtValorlicenca').val(valor);
        $('#txtQtlicencas').val(qt);
        CalculaLicenca();
        $('#txtPrazo').val(prazomes);
        $('#txtContatoNome').val(nome);
        $('#txtContatoEmail').val(email);
        $('#txtContatoTelefones').val(tel);
        $('#txtPrevisaoContrato').val(prazo);   
        document.getElementById('txtObs').value = obs;

        var datad = data.substring(0, 2);
        var datam = data.substring(3, 5);
        var dataa = data.substring(6, 10);

        data = dataa + "-" + datam + "-" + datad;
   
        document.getElementById('txtPrevisaoContrato').value = data;

        $('#divCampos').show();
        
    }

    function IniciarProjeto()
    {
        $(".error").slideUp(300);
        $(".wait").slideDown(300);


        var pdata = {};

        pdata["id"] = $('#txtIdProjA').val();
        pdata["responsavel"] = $('#cbxUsuario').val();
        pdata["qtpas"] = $('#txtQtpas').val();
        pdata["objprojeto"] = $('#txtObTempA').val();
        
        ValidacaoEnviar(pdata)
        {
            $.getJSON($("#IniciaProjetoPilelineURL").val(), pdata, function (data) {
                if (data.Result.length > 0) {

                    alert("Projeto enviado com sucesso para responsável ! Aguarde confirmação de aceitação do projeto ou mensagem para realocação do projeto.");

                    location.reload();

                }
            });

        }
    }


    function Anexor(id)
    {
        document.getElementById('id').value = id;  
        $('#ModalAnexo').modal('show');
    }


    function ListarArquivos()
    {
        var id = document.getElementById('id').value;
        window.open("/Pipeline/Arquivos?projeto=" + id, "myWindow", 'width=400,height=400');
    
    }


    function Importar()
    {
        $('#ModalImportar').modal('show');
    }


    function ValidacaoEnviar(pdata) {

        if (pdata["responsavel"] === "0") {
            $(".error").slideDown(300);
            $(".error").html("Responsável é um campo obrigatório");
            $(".wait").slideUp(300);
            return false;
        }
        if (pdata["qtpas"] === "") {
            $(".error").slideDown(300);
            $(".error").html("Quantidade PA(s) é um campo obrigatório");
            $(".wait").slideUp(300);
            return false;
        }
        if (pdata["objprojeto"] === "") {
            $(".error").slideDown(300);
            $(".error").html("Observação é um campo obrigatório");
            $(".wait").slideUp(300);
            return false;
        }

        return true;
    }