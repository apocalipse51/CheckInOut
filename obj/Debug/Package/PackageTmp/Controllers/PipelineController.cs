using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using IndigoSoft.Reports.Fixa.DataBase.DataAccess;
using IndigoSoft.Reports.Fixa.DataBase.DataModel;
using System.IO;
using System.Text;
using System.Web.UI.WebControls;
using System.Data;
using OfficeOpenXml;
using System.Windows.Forms;

namespace IndigoSoft.Reports.Fixa.Controllers
{
    public class PipelineController : Controller
    {
        //
        // GET: /Pipeline/

        private DataInterface dataInterface = new DataInterface();

        public ActionResult Pipeline()
        {
            return View();
        }

        public JsonResult MantemPileline(int id, string origem, int idcliente, string contatonome, string contatoemail, string contatotelefones, string nomeprojeto, int idstatus, int idtipo, int idproduto, DateTime previsaocontrato, double valorlicenca, int qtlicenca, int prazocontrato, string obs)
        {
            var retorno = "";

            var obj = new Indigo_Pipeline
            {
                pip_Id = id,
                pipCl_Id = idcliente,
                pipCl_ContatoNome = contatonome,
                pipCl_ContatoEmail = contatoemail,
                pipCl_ContatoTelefones = contatotelefones,
                pippj_Desc = nomeprojeto,
                pip_Status = idstatus,
                pip_Tipo = idtipo,
                pipprd_Id = idproduto,
                pip_PrevContrato = previsaocontrato,
                pip_ValorLicenca = Convert.ToDecimal(valorlicenca),
                pip_QtLicenca = qtlicenca,
                pip_TotalLicenca = Convert.ToDecimal(valorlicenca) * qtlicenca,
                pip_prazo = prazocontrato,
                pip_Obs = obs,
                pip_Prospec = DateTime.Now,
                pip_Origem = origem,
                pip_userPipecria = Convert.ToInt32(Session["IDUSUARIO"])


            };

            retorno = this.dataInterface.MantemPipeline(obj, null, "salva");


            return base.Json(new { Result = retorno }, 0);
        }


        public JsonResult ListaPipeline(int oculta, int status)
        {
            int id = Convert.ToInt32(Session["IDUSUARIO"].ToString());
            List<Indigo_Pipeline> listPipe = new List<Indigo_Pipeline>();

            if(status != -1)
            {
                listPipe = this.dataInterface.BuscaPipeline().Where(x => x.pip_Status == status).ToList();
            }
            else
            {
                listPipe =  this.dataInterface.BuscaPipeline().ToList();
            }

            Indigo_Usuario user = this.dataInterface.BuscaUsuario().FirstOrDefault(x => x.usr_Id == id);
            object retorno_o = null;


            if (user.usr_PermissaoPipe == 1 && oculta == 0)
            {

                retorno_o = listPipe.Select(x => new { x.pip_Id, x.pip_Origem, x.Indigo_ClienteFinal.clf_Descricao, x.pipCl_ContatoNome, x.pipCl_ContatoEmail, x.pipCl_ContatoTelefones, x.pippj_Desc, x.pip_Status, x.pip_Tipo, x.Indigo_Produto.prd_Descricao, x.pip_PrevContrato, x.pip_Obs, x.pip_ValorLicenca, x.pip_QtLicenca, x.pip_TotalLicenca });
            }
            else if (user.usr_PermissaoPipe == 0 || oculta == 1)
            {
                retorno_o = listPipe.Select(x => new { x.pip_Id, x.pip_Origem, x.Indigo_ClienteFinal.clf_Descricao, x.pipCl_ContatoNome, x.pipCl_ContatoEmail, x.pipCl_ContatoTelefones, x.pippj_Desc, x.pip_Status, x.pip_Tipo, x.Indigo_Produto.prd_Descricao, x.pip_PrevContrato, x.pip_Obs });

            }

            var retorno = retorno_o;

            return base.Json(new { Result = retorno }, 0);
        }

        public JsonResult MantemPilelineObs(int id, string obs)
        {
            var retorno = "";
            int idu = Convert.ToInt32(Session["IDUSUARIO"].ToString());
            Indigo_Usuario user = this.dataInterface.BuscaUsuario().FirstOrDefault(x => x.usr_Id == idu);

            var obj = new Indigo_Pipeline
            {
                pip_Id = id,
                pip_Obs = obs
            };

            if (user.usr_PermissaoPipe == 1)
            {
                retorno = this.dataInterface.MantemPipeline(obj, null, "obs");

            }

            return base.Json(new { Result = retorno }, 0);
        }

        public JsonResult MantemPilelineStatus(int id, int status)
        {
            var retorno = "";
            int idu = Convert.ToInt32(Session["IDUSUARIO"].ToString());
            Indigo_Usuario user = this.dataInterface.BuscaUsuario().FirstOrDefault(x => x.usr_Id == idu);

            var obj = new Indigo_Pipeline();

            obj.pip_Id = id;
            obj.pip_Status = status;

            if (status == 1)
            {
                obj.pip_Aguardando = DateTime.Now;
            }
            else if (status == 2)
            {
                obj.pip_Cancelado = DateTime.Now;
            }
            else if (status == 3)
            {
                obj.pip_Proposta = DateTime.Now;
            }
            else if (status == 4)
            {
                obj.pip_Contrato = DateTime.Now;
            }
            else if (status == 5)
            {
                obj.pip_Contrato = DateTime.Now;
            }

            if (user.usr_PermissaoPipe == 1)
            {

                retorno = this.dataInterface.MantemPipeline(obj, null, "status");

            }


            return base.Json(new { Result = retorno }, 0);
        }


        public JsonResult MantemPilelineTipo(int id, int tipo)
        {
            var retorno = "";
            int idu = Convert.ToInt32(Session["IDUSUARIO"].ToString());
            Indigo_Usuario user = this.dataInterface.BuscaUsuario().FirstOrDefault(x => x.usr_Id == idu);

            var obj = new Indigo_Pipeline
            {
                pip_Id = id,
                pip_Tipo = tipo
            };

            if (user.usr_PermissaoPipe == 1)
            {

                retorno = this.dataInterface.MantemPipeline(obj, null, "tipo");

            }

            return base.Json(new { Result = retorno }, 0);
        }

        public JsonResult ListaPipelineEditarObs(int id)
        {
            List<Indigo_Pipeline> listPipe = this.dataInterface.BuscaPipeline().Where(x => x.pip_Id == id).ToList();

            var retorno = listPipe.Select(x => x.pip_Obs);

            return base.Json(new { Result = retorno }, 0);
        }

        public JsonResult IniciarProjeto(int id, int responsavel, int qtpas, string objprojeto)
        {
            var retorno = "";

            var obj = new Indigo_Pipeline
            {
                pip_Id = id,
                pip_Status = 6,
                pip_userResp = responsavel,
                pip_Qtpas = qtpas,
                pip_DtAprovacao = DateTime.Now,
                pip_Objetivo = objprojeto
            };

            var projetos = this.dataInterface.BuscaProjeto().Count();

            var Id = "";
            var produto = this.dataInterface.BuscaPipeline().OrderByDescending(y => y.pip_Id).FirstOrDefault(x => x.pip_Id == id);
            Id = Id + DateTime.Now.Year + "-" + DateTime.Now.Month.ToString().PadLeft(2, '0') + "-" + produto.Indigo_ClienteFinal.clf_Sigla + "-" + produto.Indigo_Produto.prd_Sigla + "-" + (projetos + 1).ToString().PadLeft(3, '0');

            retorno = this.dataInterface.MantemPipeline(obj, Id, "envia");


            var user = this.dataInterface.BuscaUsuario().FirstOrDefault(x => x.usr_Id == responsavel);
            var pipe = this.dataInterface.BuscaPipeline().FirstOrDefault(x => x.pip_Id == id);
            var userc = this.dataInterface.BuscaUsuario().FirstOrDefault(x => x.usr_Id == pipe.pip_userPipecria);

            StringBuilder pagina = new StringBuilder();

            string trataHora = "";

            if (DateTime.Now.Hour < 12)
            {
                trataHora = "Bom dia";

            }
            else if (DateTime.Now.Hour > 12 && DateTime.Now.Hour < 18)
            {
                trataHora = "Boa tarde";

            }
            else if (DateTime.Now.Hour > 18)
            {
                trataHora = "Boa noite";
            }

            pagina.Append(@"<!DOCTYPE html>
                            <html>
                            <head>
                                <title> Pipeline de projetos </title>
                            </head>
                            <body>
                            <style>

                            .Aceitar {
                                        color: white;
                                            font - size: 16px;
                                            text - transform: uppercase;
                                        background: #1886cf;

                            }

                            .Negar {
                                            margin - top: 40px;
                                        width: 150px;
                                        height: 50px;
                                        color: white;
                                            font - size: 16px;
                                            text - transform: uppercase;
                                        background: #e52525;
	
                            }
                            </style>
                            <p>" + user.usr_Nome + ", " + trataHora + @" </p>
                               <p> Você tem um projeto para iniciar, enviado por " + userc.usr_Nome + @".</p>
                                  <table align = ""center"">
                                            <th> Cliente </th>
                                            <th> Produto </th>
                                            <th> Projeto </th>
                                            <th> Tipo </th>
                                            <th> Objetivo </th>
                                            <tr>
                                            <td>" + pipe.Indigo_ClienteFinal.clf_Descricao + @"</td>
                                            <td>" + pipe.Indigo_Produto.prd_Descricao + @"</td>
                                            <td>" + pipe.pippj_Desc + @"</td>
                                            <td>" + pipe.pip_Tipo.Value.ToString().Replace("0", "PoC").Replace("1", "Try and buy").Replace("2", "Venda") + @"</td>
                                            <td>" + pipe.pip_Objetivo + @"</td>
                                            </tr>
                                            </table>
                                            <table align = ""center"">
                                                 <tr>
                                             <td>
                                             <a class=""Aceitar"" href =""http://admin.indigosoft.biz/Pipeline/Aceitar?id=" + pipe.pip_Id + @"&a=1"" style=""text-decoration:none;"">ACEITAR</a>
                                            </td>
                                            <td>
                                            <a class=""Negar"" href =""http://admin.indigosoft.biz/Pipeline/Aceitar?id=" + pipe.pip_Id + @"&a=0"" style=""text-decoration:none;"">RECUSAR(Necessário inserir texto de justificativa)</a>
                                            </td>
                                            </tr>
                                            </table>
                                            </body>
                                            </html>");


            var respEmail = EnviaEmail("checkinout@indigosoft.com.br", "indigo.2017", user.usr_Email, "Pipeline de projetos", pagina.ToString());


            return base.Json(new { Result = retorno }, 0);
        }


        public ActionResult CarregarArquivos(int id)
        {

            for (int i = 0; i < Request.Files.Count; i++)
            {

                HttpPostedFileBase doc = Request.Files[i];

                var fileName = Path.GetFileName(doc.FileName);

                var path_a = Server.MapPath("~/Documents/Pipeline/Project/" + id);

                if (!Directory.Exists(path_a))
                {
                    DirectoryInfo dir = new DirectoryInfo(path_a);
                    dir.Create();
                }

                var path = Path.Combine(path_a, fileName);

                doc.SaveAs(path);
            }

            return View("Pipeline");
        }

        public ActionResult Arquivos(int projeto)
        {
            if (Directory.Exists(Server.MapPath("~/Documents/Pipeline/Project/" + projeto)))
            {

                DirectoryInfo dirInfo = new DirectoryInfo(Server.MapPath("~/Documents/Pipeline/Project/" + projeto));

                int i = 0;

                List<Model.ArquivoUpload> lista = new List<Model.ArquivoUpload>();

                foreach (var item in dirInfo.GetFiles())
                {
                    lista.Add(new Model.ArquivoUpload()
                    {

                        nome = item.Name,
                        caminho = dirInfo.FullName + @"\" + item.Name
                    });
                    i = i + 1;
                }

                ViewBag.lista = lista;
                ViewBag.pasta = projeto;

                return View("Lista", lista);

            }
            else
            {
                return null;
            }

        }

        public ActionResult Baixar(string pasta, string dir)
        {
            return File(Server.MapPath("~/Documents/Pipeline/Project/" + pasta + "/" + dir), "multipart/form-data", dir);
        }

        private string EnviaEmail(string emailRem, string senhaRem, string emailDest, string assunto, string corpo)
        {
            try
            {

                var service = new Microsoft.Exchange.WebServices.Data.ExchangeService(Microsoft.Exchange.WebServices.Data.ExchangeVersion.Exchange2013_SP1);
                service.Credentials = new Microsoft.Exchange.WebServices.Data.WebCredentials(emailRem, senhaRem);
                service.AutodiscoverUrl(emailRem);
                var email = new Microsoft.Exchange.WebServices.Data.EmailMessage(service);
                email.Subject = assunto;
                email.Body = corpo;
                email.ToRecipients.Add(emailDest);
                email.SendAndSaveCopy();

                return "Justificativa enviada com sucesso para aprovação !";

            }
            catch (Exception)
            {
                return "Ocorreu algum erro ao tentar enviar o email !";
            }

        }


        public ActionResult Aceitar(int id, int a)
        {
            var retorno = "";
            var pipe = this.dataInterface.BuscaPipeline().FirstOrDefault(x => x.pip_Id == id && x.pip_Aceito == null);


            if (pipe != null && a == 1)
            {
                pipe.pip_Aceito = DateTime.Now;
                retorno = this.dataInterface.MantemPipeline(pipe, null,"aceita");

                var produto = this.dataInterface.BuscaProduto().FirstOrDefault(x => x.prd_Id == pipe.pipprd_Id);

                produto.prd_ativo = 1;

                retorno = this.dataInterface.MantemProduto(produto);

                ViewBag.status = "Projeto aceito com sucesso. Projeto disponível no Check-in/out, bom trabalho !";


                var user = this.dataInterface.BuscaUsuario().FirstOrDefault(x => x.usr_Id == pipe.pip_userResp);
                var userc = this.dataInterface.BuscaUsuario().FirstOrDefault(x => x.usr_Id == pipe.pip_userPipecria);

                StringBuilder pagina = new StringBuilder();

                string trataHora = "";

                if (DateTime.Now.Hour < 12)
                {
                    trataHora = "Bom dia";

                }
                else if (DateTime.Now.Hour >= 12 && DateTime.Now.Hour < 18)
                {
                    trataHora = "Boa tarde";

                }
                else if (DateTime.Now.Hour >= 18)
                {
                    trataHora = "Boa noite";
                }

                pagina.Append(@"<!DOCTYPE html>
                            <html>
                            <head>
                                <title> Pipeline de projetos </title>
                            </head>
                            <body>
                            <style>

                            .Aceitar {
                                        color: white;
                                            font - size: 16px;
                                            text - transform: uppercase;
                                        background: #1886cf;

                            }

                            .Negar {
                                            margin - top: 40px;
                                        width: 150px;
                                        height: 50px;
                                        color: white;
                                            font - size: 16px;
                                            text - transform: uppercase;
                                        background: #e52525;
	
                            }
                            </style>
                            <p>" + userc.usr_Nome + ", " + trataHora + @" ! </p>
                               <p> O projeto foi aceito por " + user.usr_Nome + @".</p>
                                  <table align = ""center"">
                                            <th> Cliente </th>
                                            <th> Produto </th>
                                            <th> Projeto </th>
                                            <th> Tipo </th>
                                            <th> Objetivo </th>
                                            <tr>
                                            <td>" + pipe.Indigo_ClienteFinal.clf_Descricao + @"</td>
                                            <td>" + pipe.Indigo_Produto.prd_Descricao + @"</td>
                                            <td>" + pipe.pippj_Desc + @"</td>
                                            <td>" + pipe.pip_Tipo.Value.ToString().Replace("0", "PoC").Replace("1", "Try and buy").Replace("2", "Venda") + @"</td>
                                            <td>" + pipe.pip_Objetivo + @"</td>
                                            </tr>
                                            </table>
                                            </body>
                                            </html>");


                var respEmail = EnviaEmail("checkinout@indigosoft.com.br", "indigo.2017", userc.usr_Email, "Pipeline de projetos", pagina.ToString());


            }
            else if (pipe != null && a == 0)
            {

                ViewBag.status = "Favor justificar";

            }
            else
            {
                ViewBag.status = "Projeto já processado.";
            }

            return View();
        }


        public JsonResult Recusar(int id, string just)
        {

            var pipe = this.dataInterface.BuscaPipeline().OrderByDescending(y => y.pip_Id).FirstOrDefault(x => x.pip_Id == id && x.pip_Aceito == null);
            var user = this.dataInterface.BuscaUsuario().FirstOrDefault(x => x.usr_Id == pipe.pip_userResp);
            var userc = this.dataInterface.BuscaUsuario().FirstOrDefault(x => x.usr_Id == pipe.pip_userPipecria);

            StringBuilder pagina = new StringBuilder();

            string trataHora = "";

            if (DateTime.Now.Hour < 12)
            {
                trataHora = "Bom dia";

            }
            else if (DateTime.Now.Hour > 12 && DateTime.Now.Hour < 18)
            {
                trataHora = "Boa tarde";

            }
            else if (DateTime.Now.Hour > 18)
            {
                trataHora = "Boa noite";
            }

            pagina.Append(@"<!DOCTYPE html>
                                <html>
                                <head>
                                    <title> Pipeline de projetos </title>
                                </head>
                                <body>
                                <style>

                                .Realocar {
                                            color: white;
                                                font - size: 16px;
                                                text - transform: uppercase;
                                            background: #1886cf;

                                }

                                </style>
                                <p>" + userc.usr_Nome + ", " + trataHora + @" ! </p>
                                   <p> O projeto enviado para " + userc.usr_Nome + @" foi recusado.</p>
                                   <p> Justificativa: " + just + @"</p>
                                      <table align = ""center"">
                                                <th> Cliente </th>
                                                <th> Produto </th>
                                                <th> Projeto </th>
                                                <th> Tipo </th>
                                                <th> Objetivo </th>
                                                <tr>
                                                <td>" + pipe.Indigo_ClienteFinal.clf_Descricao + @"</td>
                                                <td>" + pipe.Indigo_Produto.prd_Descricao + @"</td>
                                                <td>" + pipe.pippj_Desc + @"</td>
                                                <td>" + pipe.pip_Tipo.Value.ToString().Replace("0", "PoC").Replace("1", "Try and buy").Replace("2", "Venda") + @"</td>
                                                <td>" + pipe.pip_Objetivo + @"</td>
                                                </tr>
                                                </table>
                                                <table align = ""center"">
                                                     <tr>
                                                         <td>
                                                         <a class=""Realocar"" href =""http://admin.indigosoft.biz/Pipeline/Realocar?id=" + pipe.pip_Id + @""" style =""text-decoration:none;"">REALOCAR</a>
                                                        </td>
                                                    </tr>
                                                </table>
                                                </body>
                                                </html>");


            var respEmail = EnviaEmail("checkinout@indigosoft.com.br", "indigo.2017", user.usr_Email, "Pipeline de projetos", pagina.ToString());

            return base.Json(new { Result = "Projeto recusado, e já foi reenviado ao Controller de projetos !" }, 0);

        }

        public ActionResult Realocar()
        {


            return View();
        }

        public JsonResult RealocarProj(int id, int usuario)
        {
            var pipe = this.dataInterface.BuscaPipeline().OrderByDescending(y => y.pip_Id).FirstOrDefault(x => x.pip_Id == id);
            var user = this.dataInterface.BuscaUsuario().FirstOrDefault(x => x.usr_Id == pipe.pip_userResp);
            var userc = this.dataInterface.BuscaUsuario().FirstOrDefault(x => x.usr_Id == pipe.pip_userPipecria);

            var retorno = "";
            pipe.pip_userResp = usuario;

            retorno = this.dataInterface.MantemPipeline(pipe, null, "salva");

            pipe = this.dataInterface.BuscaPipeline().OrderByDescending(y => y.pip_Id).FirstOrDefault(x => x.pip_Id == id);


            StringBuilder pagina = new StringBuilder();

            string trataHora = "";

            if (DateTime.Now.Hour < 12)
            {
                trataHora = "Bom dia";

            }
            else if (DateTime.Now.Hour > 12 && DateTime.Now.Hour < 18)
            {
                trataHora = "Boa tarde";

            }
            else if (DateTime.Now.Hour > 18)
            {
                trataHora = "Boa noite";
            }

            pagina.Append(@"<!DOCTYPE html>
                            <html>
                            <head>
                                <title> Pipeline de projetos </title>
                            </head>
                            <body>
                            <style>

                            .Aceitar {
                                        color: white;
                                            font - size: 16px;
                                            text - transform: uppercase;
                                        background: #1886cf;

                            }

                            .Negar {
                                            margin - top: 40px;
                                        width: 150px;
                                        height: 50px;
                                        color: white;
                                            font - size: 16px;
                                            text - transform: uppercase;
                                        background: #e52525;
	
                            }
                            </style>
                            <p>" + user.usr_Nome + ", " + trataHora + @" </p>
                               <p> Você tem um projeto para iniciar, enviado por " + userc.usr_Nome + @".</p>
                                  <table align = ""center"">
                                            <th> Cliente </th>
                                            <th> Produto </th>
                                            <th> Projeto </th>
                                            <th> Tipo </th>
                                            <th> Objetivo </th>
                                            <tr>
                                            <td>" + pipe.Indigo_ClienteFinal.clf_Descricao + @"</td>
                                            <td>" + pipe.Indigo_Produto.prd_Descricao + @"</td>
                                            <td>" + pipe.pippj_Desc + @"</td>
                                            <td>" + pipe.pip_Tipo.Value.ToString().Replace("0", "PoC").Replace("1", "Try and buy").Replace("2", "Venda") + @"</td>
                                            <td>" + pipe.pip_Objetivo + @"</td>
                                            </tr>
                                            </table>
                                            <table align = ""center"">
                                                 <tr>
                                             <td>
                                             <a class=""Aceitar"" href =""http://admin.indigosoft.biz/Pipeline/Aceitar?id=" + pipe.pip_Id + @"&a=1"" style=""text-decoration:none;"">ACEITAR</a>
                                            </td>
                                            <td>
                                            <a class=""Negar"" href =""http://admin.indigosoft.biz/Pipeline/Aceitar?id=" + pipe.pip_Id + @"&a=0"" style=""text-decoration:none;"">RECUSAR(Necessário inserir texto de justificativa)</a>
                                            </td>
                                            </tr>
                                            </table>
                                            </body>
                                            </html>");


            var respEmail = EnviaEmail("checkinout@indigosoft.com.br", "indigo.2017", user.usr_Email, "Pipeline de projetos", pagina.ToString());


            return base.Json(new { Result = "Projeto enviado !" }, 0);
        }

        [HttpPost]
        public ActionResult ReportPipeline()
        {

            GridView gv = new GridView();

            gv.DataSource = this.dataInterface.ExportarPipeline();

            List<ExportarPipeline> lista = this.dataInterface.ExportarPipeline();

            gv.AutoGenerateColumns = true;
            gv.DataBind();

            FileInfo fileInfoTemplate = new FileInfo(System.Web.HttpContext.Current.Server.MapPath("~/DocumentsExemplo.xlsx"));

            ExcelPackage excel = new ExcelPackage(fileInfoTemplate);

            ExcelWorksheet worksheet = excel.Workbook.Worksheets.Add("Pipeline");

            DataTable dt = new DataTable();

            dt.Columns.Add("Id");
            dt.Columns.Add("Origem");
            dt.Columns.Add("Cliente");
            dt.Columns.Add("Projeto");
            dt.Columns.Add("Status_Edita");
            dt.Columns.Add("Tipo_Edita");
            dt.Columns.Add("Previsão_Edita");
            dt.Columns.Add("Licença_Edita");
            dt.Columns.Add("Quantidade_Edita");
            dt.Columns.Add("Total_Edita");
            dt.Columns.Add("Observação_Edita");

            foreach (var linha in lista.ToList())
            {

                dt.Rows.Add(linha.Id,linha.Origem, linha.Projeto, linha.Produto, linha.Status_Edita, linha.Tipo_Edita, linha.Previsão_Edita, linha.Licença_Edita, linha.Quantidade_Edita, linha.Total_Edita, linha.Observação_Edita);
               
            }

            worksheet.Cells["A1"].LoadFromDataTable(dt, true);

            string pastaTemp = System.Web.HttpContext.Current.Server.MapPath("~/Documents");

            if(!Directory.Exists(pastaTemp))
            {
                Directory.CreateDirectory(pastaTemp);
            }

            FileInfo fileInfo = new FileInfo(System.IO.Path.Combine(pastaTemp, string.Format("Relatorio_Pipeline_{0}.xlsx", DateTime.Now.ToString("yyyy-MM-dd_HH-mm-ss_fff"))));
            excel.SaveAs(fileInfo);

            return File(fileInfo.FullName, "application/ms-excel", string.Format("Relatorio_Pipeline_{0}.xlsx", DateTime.Now.ToString("yyyy-MM-dd_HH-mm-ss")));

        }

        [HttpPost]
        public ActionResult ImportarPipeline()
        {
            var arquivo = "";

            if (Request != null)
            {
                HttpPostedFileBase file = Request.Files["arquivos"];

                arquivo = Server.MapPath("~/Documents/" + file.FileName);

                file.SaveAs(arquivo);
  

                if ((file != null) && (file.ContentLength > 0) && !string.IsNullOrEmpty(file.FileName))
                {

                    int noOfCol = 0;
                    int noOfRow = 0;

                    string fileName = file.FileName;
                    string fileContentType = file.ContentType;
                    byte[] fileBytes = new byte[Request.ContentLength];
                    var data = Request.InputStream.Read(fileBytes, 0, Convert.ToInt32(Request.ContentLength));

                    var Arquivo = new FileInfo(arquivo);

                    using (var package = new ExcelPackage(Arquivo))
                    {

                        var currentSheet = package.Workbook.Worksheets;
                        var workSheet = currentSheet.First();
                        noOfCol = workSheet.Dimension.End.Column;
                        noOfRow = workSheet.Dimension.End.Row;


                        for (int i = 2; i <= noOfRow; i++)
                        {

                            try
                            {

                                if (workSheet.Cells[i, 1] != null)
                                {

                                    if (workSheet.Cells[i, 1].Value.ToString() != "")
                                    {

                                        var retorno = "";

                                        int status = 0;

                                        if (workSheet.Cells[i, 5].Value.ToString() == "Prospecção")
                                        {
                                            status = 0;
                                        }
                                        else if (workSheet.Cells[i, 5].Value.ToString() == "Aguardando")
                                        {
                                            status = 1;
                                        }
                                        else if (workSheet.Cells[i, 5].Value.ToString() == "Cancelado")
                                        {
                                            status = 2;
                                        }
                                        else if (workSheet.Cells[i, 5].Value.ToString() == "Proposta")
                                        {
                                            status = 3;
                                        }
                                        else if (workSheet.Cells[i, 5].Value.ToString() == "Contrato")
                                        {
                                            status = 4;
                                        }
                                        else if (workSheet.Cells[i, 5].Value.ToString() == "Concluído")
                                        {
                                            status = 5;
                                        }
                                        else if (workSheet.Cells[i, 5].Value.ToString() == "Concluído e aprovado")
                                        {
                                            status = 6;
                                        }


                                        int tipo = 0;

                                        if (workSheet.Cells[i, 6].Value.ToString() == "PoC")
                                        {
                                            tipo = 0;
                                        }
                                        else if (workSheet.Cells[i, 6].Value.ToString() == "Try and Buy")
                                        {
                                            tipo = 1;
                                        }
                                        else if (workSheet.Cells[i, 6].Value.ToString() == "Venda")
                                        {
                                            tipo = 2;
                                        }

                                        decimal ValorLicenca = Convert.ToDecimal(workSheet.Cells[i, 8].Value.ToString());
                                        int QtLicenca = Convert.ToInt32(workSheet.Cells[i, 9].Value.ToString());
                                        decimal TotalLicenca = (Convert.ToInt32(workSheet.Cells[i, 9].Value.ToString()) * Convert.ToDecimal(workSheet.Cells[i, 8].Value.ToString()));

                                        var obj = new Indigo_Pipeline
                                        {
                                            pip_Id = Convert.ToInt32(workSheet.Cells[i, 1].Value),
                                            pip_Status = status,
                                            pip_Tipo = tipo,
                                            pip_PrevContrato = Convert.ToDateTime(workSheet.Cells[i, 7].Value.ToString()),
                                            pip_ValorLicenca = ValorLicenca,
                                            pip_QtLicenca = QtLicenca,
                                            pip_TotalLicenca = TotalLicenca ,
                                            pip_Obs = workSheet.Cells[i, 11].Value.ToString()

                                        };

                                        retorno = this.dataInterface.MantemPipeline(obj, null, "importa");

                                    }

                                }

                            }
                            catch {  }
                        }
                    }

                }

            }

         
            return View("Pipeline");          
            
        }

    }

}