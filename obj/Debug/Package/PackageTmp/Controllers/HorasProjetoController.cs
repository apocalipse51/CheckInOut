using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.UI;
using System.Web.UI.WebControls;
using IndigoSoft.Reports.Fixa.DataBase.DataAccess;
using IndigoSoft.Reports.Fixa.DataBase.DataModel;
using Newtonsoft.Json;
using System.Text;
using Google.Apis.Calendar.v3;
using Google.Apis.Auth.OAuth2;
using System.Threading;
using Google.Apis.Util.Store;
using Google.Apis.Services;
using Google.Apis.Calendar.v3.Data;
using IndigoSoft.Reports.Fixa.helpers;

namespace IndigoSoft.Reports.Fixa.Controllers
{


    public class HorasProjetoController : Controller
    {
        //eventocalendario @gmail.com
        //123456789evento
        //chave secreta 88Ec9d2uQq3-9O4zbdFRT78i
        //id cliente 360297228650-hai1npigli2qlcmm3a1q61kq3c4q7vpd.apps.googleusercontent.com
        //
        // GET: /HorasProjeto/
        static string[] Scopes = { CalendarService.Scope.Calendar };
        static string ApplicationName = "Check-in-out";
        private DataInterface dataInterface = new DataInterface();


        #region Horas Projeto

        public ActionResult HorasProjeto()
        {
            try
            {

                Indigo_ConfigCalendario retorno_calendario = new Indigo_ConfigCalendario();
                List<RetornoTargetUsuario> retorno = new List<RetornoTargetUsuario>();

                int dias_uteis = 0;

                if(DateTime.Now.Day == 1)
                {

                    dias_uteis = DiasUteis();

                }
                else
                {
                    retorno_calendario = dataInterface.BuscaCalendario().FirstOrDefault( x => x.id_qt == 1);
                    dias_uteis = Convert.ToInt32(retorno_calendario.qt_diaUtil);

                }

                ViewBag.carga_horas = dias_uteis * 8;
                int idusuario = Convert.ToInt32(Session["IDUSUARIO"]);
                int target_mes_seg = (dias_uteis * 8) * 3600;

                retorno = dataInterface.RetornaTarget(target_mes_seg, idusuario);

                foreach (var reg in retorno)
                {
                    ViewBag.horas_atual = reg.target_atual;
                    ViewBag.carga_horas = reg.target_total;

                    if (reg.target_atual > 0)
                    {

                        double carga_atuals = Convert.ToDouble(reg.target_atual) / Convert.ToDouble(reg.target_total);
                        carga_atuals = carga_atuals * 100;
                        ViewBag.carga_atuals = string.Format("{0:0.00}", carga_atuals).Replace(",", ".");
                    }
                    else
                    {
                        ViewBag.carga_atuals = "0";
                    }

                }

                return View();

            }
            catch (Exception ex)
            {
                log(ex.Message + " -- " + ex.StackTrace);
                return View();
            }


        }

        public JsonResult ListaHorasProjetosUsuario()
        {
            try
            {
                int usuarioId = Convert.ToInt32(Session["IDUSUARIO"]);

                List<Indigo_HorasProjeto> list = this.dataInterface.BuscaHorasProjeto().Where(x => x.Indigo_Usuario != null && x.Indigo_Usuario.usr_Id == usuarioId && x.hpo_jtfAprovado == null).ToList();
                var retorno = list.Select(x => new
                {
                    x.hpo_Id,
                    x.Indigo_Projeto.Indigo_Produto.Indigo_ClienteFinal.clf_Descricao,
                    x.Indigo_Projeto.Indigo_Produto.prd_Descricao,
                    x.Indigo_Projeto.prj_Descricao,
                    x.Indigo_SubfaseProjeto.Indigo_FaseProjeto.fpo_Descricao,
                    x.Indigo_SubfaseProjeto.sfp_Descricao,
                    x.hpo_DataHoraInicio,
                    x.hpo_DataHoraFim
                });

                retorno = retorno.Reverse().Take(5);


                return base.Json(new { Result = retorno }, 0);

            }
            catch (Exception ex)
            {
                log(ex.Message + " -- " + ex.StackTrace);
                return base.Json(new { Result = ex.Message  + "\r\n" + ex.StackTrace }, 0);
            }
        }

        public JsonResult ListaHorasProjetosUsuarioAtalho()
        {
            try
            {
                int usuarioId = Convert.ToInt32(Session["IDUSUARIO"]);
                List<Indigo_HorasProjetoAtalho> list = this.dataInterface.BuscaHorasProjetoAtalho().Where(x => x.Indigo_Usuario != null && x.Indigo_Usuario.usr_Id == usuarioId).ToList();
                var retorno = list.Select(x => new
                {
                    x.Indigo_Projeto.prj_Descricao,
                    x.Indigo_SubfaseProjeto.sfp_Descricao,
                    x.hpoa_Atalho
                });
                return base.Json(new { Result = retorno }, 0);
            }
            catch (Exception ex)
            {
                log(ex.Message + " -- " + ex.StackTrace);
                return base.Json(new { Result = ex.Message + "\r\n" + ex.StackTrace }, 0);
            }
        }

        public JsonResult IniciaHorasProjetosUsuarioAtalho(string atalho)
        {
            try
            {
                int usuarioId = Convert.ToInt32(Session["IDUSUARIO"]);
                var  list = this.dataInterface.BuscaHorasProjetoAtalho().FirstOrDefault(x => x.hpoa_usrId != null && x.hpoa_usrId == usuarioId && x.hpoa_Atalho.TrimEnd() == atalho);
                var retorno = "";
                var obj = new Indigo_HorasProjeto
                {
                    hpo_Id = 0,
                    hpo_prjId = list.hpoa_prjId,
                    hpo_sfpId = list.hpoa_sfpId,
                    hpo_usrId = usuarioId,
                    hpo_DataHoraInicio = DateTime.Now,
                    hpo_DataHoraFim = DateTime.Now,
                    hpo_Observacao = list.hpoa_Observacao
                };
                retorno = this.dataInterface.IniciaHoras(obj);
                return base.Json(new { Result = retorno }, 0);
            }
            catch (Exception ex)
            {
                log(ex.Message + " -- " + ex.StackTrace);
                return base.Json(new { Result = ex.Message + "\r\n" + ex.StackTrace }, 0);
            }
        }

        public JsonResult EditarHorasProjetosUsuarioAtalho(string atalho)
        {
            try
            {
                int usuarioId = Convert.ToInt32(Session["IDUSUARIO"]);

                var retorno = this.dataInterface.BuscaHorasProjetoAtalho().FirstOrDefault(x => x.hpoa_usrId != null && x.hpoa_usrId == usuarioId && x.hpoa_Atalho.TrimEnd() == atalho);
                return base.Json(new { Result = retorno }, 0);
            }
            catch (Exception ex)
            {
                log(ex.Message + " -- " + ex.StackTrace);
                return base.Json(new { Result = ex.Message + "\r\n" + ex.StackTrace }, 0);
            }
        }

        public JsonResult MantemHoraProjeto(int id, int projetoId, int subFaseProjetoId, DateTime dataInicio, DateTime dataFim, string obs, string atalho)
        {
            try
            {
                int usuarioId = Convert.ToInt32(Session["IDUSUARIO"]);

                var retorno = "";

                var obj = new Indigo_HorasProjeto
                {
                    hpo_Id = id,
                    hpo_prjId = projetoId,
                    hpo_sfpId = subFaseProjetoId,
                    hpo_usrId = usuarioId,
                    hpo_DataHoraInicio = dataInicio,
                    hpo_DataHoraFim = dataFim,
                    hpo_Observacao = obs
                };

                retorno = this.dataInterface.IniciaHoras(obj);

                return base.Json(new { Result = retorno }, 0);

            }
            catch (Exception ex)
            {
                log(ex.Message + " -- " + ex.StackTrace);
                return base.Json(new { Result = ex.Message + " -- " + ex.StackTrace }, 0);
            }
        }

        public JsonResult MantemHoraProjetoAtalho(int id, int projetoId, int subFaseProjetoId, string obs, string atalho)
        {
            try
            {
                int usuarioId = Convert.ToInt32(Session["IDUSUARIO"]);

                var AtalhoExistente = this.dataInterface.BuscaHorasProjetoAtalho().FirstOrDefault(x => x.hpoa_usrId != null && x.hpoa_usrId == usuarioId && x.hpoa_Atalho.TrimEnd() == atalho);

                if(AtalhoExistente != null)
                {
                    id = AtalhoExistente.hpoa_Id;
                }

                var retorno = "";

                var obj = new Indigo_HorasProjetoAtalho
                {
                    hpoa_Id = id,
                    hpoa_prjId = projetoId,
                    hpoa_sfpId = subFaseProjetoId,
                    hpoa_usrId = usuarioId,
                    hpoa_Observacao = obs,
                    hpoa_Atalho = atalho
                };

                retorno = this.dataInterface.SalvaAtalho(obj);

                return base.Json(new { Result = retorno }, 0);

            }
            catch (Exception ex)
            {
                log(ex.Message + " -- " + ex.StackTrace);
                return base.Json(new { Result = ex.Message + " -- " + ex.StackTrace }, 0);
            }
        }

        public JsonResult FiltrarHoraProjeto( DateTime DataInicio, DateTime DataFim)
        {
            try
            {
                int usuarioId = Convert.ToInt32(Session["IDUSUARIO"]);

                List<Indigo_HorasProjeto> list = this.dataInterface.BuscaHorasProjeto().Where(x => x.Indigo_Usuario.usr_Id == usuarioId && x.hpo_DataHoraInicio >= DataInicio && x.hpo_DataHoraFim <= DataFim).OrderByDescending(x => x.hpo_Id).ToList();
                var retorno = list.Select(x => new
                {
                    x.hpo_Id,
                    x.Indigo_Projeto.Indigo_Produto.Indigo_ClienteFinal.clf_Descricao,
                    x.Indigo_Projeto.Indigo_Produto.prd_Descricao,
                    x.Indigo_Projeto.prj_Descricao,
                    x.Indigo_SubfaseProjeto.Indigo_FaseProjeto.fpo_Descricao,
                    x.Indigo_SubfaseProjeto.sfp_Descricao,
                    x.hpo_DataHoraInicio,
                    x.hpo_DataHoraFim,
                    x.hpo_jtfAprovado
                });

                return base.Json(new { Result = retorno }, 0);
            }
            catch (Exception ex)
            {
                log(ex.Message + " -- " + ex.StackTrace);
                return base.Json(new { Result = ex.Message + " -- " + ex.StackTrace }, 0);
            }

        }

        public JsonResult FiltrarHoraProjetoJust(DateTime DataInicio, DateTime DataFim)
        {
            try
            {
                int usuarioId = Convert.ToInt32(Session["IDUSUARIO"]);

                List<ListaJustifica> retorno = new List<ListaJustifica>();
                retorno = this.dataInterface.RetornaListaJustifica(usuarioId, DataInicio, DataFim);
                return base.Json(new { Result = retorno }, 0);

            }
            catch (Exception ex)
            {
                log(ex.Message + " -- " + ex.StackTrace);
                return base.Json(new { Result = ex.Message }, 0);

            }

        }

        public JsonResult AlmocoHoraProjeto(string operacao)
        {
            int usuarioId = Convert.ToInt32(Session["IDUSUARIO"]);
            string retorno = "";
            if (operacao == "finaliza")
            {
                dataInterface.IniciarAlmoco(usuarioId, operacao);
            }
            else if(operacao == "")
            {
               dataInterface.IniciarAlmoco(usuarioId, null);
            }
            var obj = dataInterface.BuscaHorasProjeto().LastOrDefault(x => x.hpo_usrId == usuarioId);
            try
            {
                if (obj.hpo_DataHoraFim == obj.hpo_DataHoraInicio)
                {
                    if (obj.Indigo_Projeto.prj_Descricao == "Almoço")
                    {
                        retorno = "Atividade atual: " + obj.Indigo_Projeto.prj_Descricao;
                    }
                    else
                    {
                        retorno = "Atividade atual: " + obj.Indigo_Projeto.prj_Descricao + " > " + obj.Indigo_SubfaseProjeto.sfp_Descricao;
                    }                
                }
                else
                {
                    retorno = "Nenhuma atividade em progresso";
                }
                return base.Json(new { Result = retorno }, 0);
            }
            catch (Exception ex)
            {
                retorno = "Nenhuma atividade em progresso";
                log(ex.Message + " -- " + ex.StackTrace);
                return base.Json(new { Result = retorno }, 0);
            }
        }

        public JsonResult FechaHorario(int id)
        {
            try
            {
                var retorno = "";                
                var obj = dataInterface.BuscaHorasProjeto().FirstOrDefault(x => x.hpo_Id == id);
                obj.hpo_DataHoraFim = DateTime.Now;
                retorno = this.dataInterface.MantemHorasProjeto(obj);
                return base.Json(new { Result = retorno }, 0);

            }
            catch (Exception ex)
            {
                log(ex.Message + " -- " + ex.StackTrace);
                return base.Json(new { Result = ex.Message + " -- " + ex.StackTrace }, 0);
            }


        }
        #endregion

        #region Report Horas Completo
        public ActionResult ReportHorasCompleto()
        {
            return View();
        }

        [HttpPost]
        public ActionResult ReportHorasCompleto(DateTime DtInicio, DateTime DtFim, int Tipo)
        {
            List<ReportHorasCompleto> data = null;
            string nomearq = "";

            GridView gv = new GridView();

            if (Tipo == 0)
            {
                nomearq = "Relatorio_Horas_Usuario_";
                gv.DataSource = this.dataInterface.BuscaReportHoras(DtInicio, DtFim);
            }
            else if (Tipo == 1)
            {
                nomearq = "Relatorio_Controle_Custos_";
                gv.DataSource = this.dataInterface.BuscaReportControleCusto(DtInicio, DtFim);

            }
            else if (Tipo == 2)
            {
                nomearq = "Relatorio_Log_Bases_";
                gv.DataSource = this.dataInterface.BuscaReportlog(DtInicio, DtFim);
            }


            gv.AutoGenerateColumns = true;
            gv.DataBind();

            HttpContext curContext = System.Web.HttpContext.Current;
            curContext.Response.Clear();

            curContext.Response.AddHeader("content-disposition", "attachment;filename=" + nomearq + DateTime.Now.ToString("dd-MM-yyyy HH:mm:ss") + ".xls");
            curContext.Response.Charset = "";
            curContext.Response.Cache.SetCacheability(HttpCacheability.NoCache);
            curContext.Response.ContentType = "application/vnd.ms-excel";

            //Convert the rendering of the gridview to a string representation
            StringWriter sw = new StringWriter();
            HtmlTextWriter htw = new HtmlTextWriter(sw);
            gv.RenderControl(htw);

            //Write the stream back to the response
            curContext.Response.Write(sw.ToString());
            curContext.Response.End();
            return View("~/Views/HorasProjeto/ReportHorasCompleto.cshtml", data);

        }

        [HttpGet]
        public ActionResult ReportExcel()
        {
            DateTime DtInicio = Convert.ToDateTime(Request.QueryString["DtInicio"]);
            DateTime DtFim = Convert.ToDateTime(Request.QueryString["DtFim"]);
            int Tipo = Convert.ToInt32(Request.QueryString["Tipo"]);

            List<ReportHorasCompleto> data = null;
            string nomearq = "";

            GridView gv = new GridView();

            if (Tipo == 0)
            {
                nomearq = "Relatorio_Horas_Usuario_";
                gv.DataSource = this.dataInterface.BuscaReportHoras(DtInicio, DtFim);
            }
            else if (Tipo == 1)
            {
                nomearq = "Relatorio_Controle_Custos_";
                gv.DataSource = this.dataInterface.BuscaReportControleCusto(DtInicio, DtFim);
                ViewBag.Error = "Não foi possivel fazer a busca para esta opção.";
                return View();
            }
            else if (Tipo == 2)
            {
                nomearq = "Relatorio_Log_Bases_";
                gv.DataSource = this.dataInterface.BuscaReportlog(DtInicio, DtFim);
                ViewBag.Error = "Não foi possivel fazer a busca para esta opção.";
                return View();
            }


            gv.AutoGenerateColumns = true;
            gv.DataBind();

            HttpContext curContext = System.Web.HttpContext.Current;
            curContext.Response.Clear();

            curContext.Response.AddHeader("content-disposition", "attachment;filename=" + nomearq + DateTime.Now.ToString("dd-MM-yyyy HH:mm:ss") + ".xls");
            curContext.Response.Charset = "";
            curContext.Response.Cache.SetCacheability(HttpCacheability.NoCache);
            curContext.Response.ContentType = "application/vnd.ms-excel";

            //Convert the rendering of the gridview to a string representation
            StringWriter sw = new StringWriter();
            HtmlTextWriter htw = new HtmlTextWriter(sw);
            gv.RenderControl(htw);

            //Write the stream back to the response
            curContext.Response.Write(sw.ToString());
            curContext.Response.End();
            return View("~/Views/HorasProjeto/ReportHorasCompleto.cshtml", data);
        }

        #endregion

        #region Report Horas Compacto
        public ActionResult ReportHorasCompacto()
        {
            return View();
        }

        public JsonResult TabelaHorasCompacto(DateTime dtInicial, DateTime dtFinal, int projetoId)
        {
            List<ReportHorasCompacto> list = this.dataInterface.BuscaReportHorasCompacto(dtInicial, dtFinal, projetoId);
            var retorno = list.Select(x => new
            {
                x.Nome,
                x.Tempo
            });
            return base.Json(new { Result = retorno }, 0);
        }

        [HttpPost]
        public string DashBoardHorasCompacto(DateTime dtInicial, DateTime dtFinal, int projetoId)
        {
            return JsonConvert.SerializeObject(this.dataInterface.BuscaReportHorasCompacto(dtInicial, dtFinal, projetoId));
        }

        [HttpPost]
        public string DashBoardHorasTimeLine(DateTime dtInicial, DateTime dtFinal, int projetoId)
        {
            return JsonConvert.SerializeObject(this.dataInterface.BuscaReportHorasTimeLine(dtInicial, dtFinal, projetoId));
        }
        #endregion

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
            catch (Exception ex)
            {
                log(ex.Message + " -- " + ex.StackTrace);
                return "Ocorreu algum erro ao tentar enviar o email !";
            }

        }

        public JsonResult BuscaTipoJustificativa()
        {
            List<Indigo_JustificaHorasProjeto> list = this.dataInterface.BuscaTipoJustificativa();
            var retorno = list.Select(x => new { x.jtf_Id, x.jtf_Nome});
            return base.Json(new { Result = retorno }, 0);
        }

        public JsonResult JustificaPonto(int justificativa, int id, int projetoId, int subFaseProjetoId, DateTime dataInicio, DateTime dataFim, string obs)
        {

            try
            {
                int usuarioId = Convert.ToInt32(Session["IDUSUARIO"]);

                List<Indigo_HorasProjeto> objn = dataInterface.BuscaHorasProjeto().Where(x => x.hpo_usrId == usuarioId && x.hpo_jtfAprovado == 1 && x.hpo_DataHoraInicio.Value.Month == DateTime.Now.Month).ToList();

                var numero = objn.GroupBy(x => x.hpo_jtfSequencia).ToList();
                string respEmail = "";

                if (numero.Count <= 12)
                {

                    List<RetornoEstruturaJustifica> retorno = new List<RetornoEstruturaJustifica>();

                    var obj = new Indigo_HorasProjeto
                    {
                       // hpo_Id = id,
                        hpo_prjId = projetoId,
                        hpo_sfpId = subFaseProjetoId,
                        hpo_usrId = usuarioId,
                        hpo_DataHoraInicio = dataInicio,
                        hpo_DataHoraFim = dataFim,
                        hpo_Observacao = obs,
                        hpo_jtfAprovado = 0
                    };

                    retorno = this.dataInterface.IniciaHorasJust(obj, justificativa);

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


                    foreach (var just in retorno)
                    {
                        if (just.DataInicio != just.DataFim)
                        {
                            int diferenca = (Time.WorkDays(just.DataInicio, just.DataFim) - 2) * 8;
                            var tempos = Time.TimeSpaces(just.HoraInicio, just.HoraFim);
                            var res = Time.SumTimes(tempos[0], tempos[1]);
                            just.Tempo = Time.AddHours(res, diferenca);
                        }
                        else
                        {
                            just.Tempo = (just.Tempo == null) ? "" : just.Tempo;
                        }

                        StringBuilder pagina = new StringBuilder();

                        pagina.Append(@"<!DOCTYPE html>
                            <html>
                            <head>
                                <title> Ponto justificado</title>
                            </head>
                            <body>
                            <style>
                                .Aprova {
                                    background: #1886cf;
                                }
                                .Negar {
                                    background: #e52525;
                                }
                                table {
                                    font-family: 'Helvetica Neue', sans-serif;
                                    border-bottom: 1px solid #555;
                                    border-top: 1px solid black;
                                }
                                table td {
                                    color: #555;
                                    padding: 1em;
                                }
                                .btn-container {
                                    text-align: center;
                                    margin-top: 1em;
                                }
                                .btn-container a {
                                    padding: 1em;
                                    border-radius: 3px;
                                    margin-top: 1em;
                                    color: white;
                                    font - size: 16px;
                                    text - transform: uppercase;
                                }
                                table th {
                                    font-weight: bolder;
                                }
                            </style>
                            <p>" + just.NomeEstrutura + ", " + trataHora + @" </p>
                               <p> Você tem uma justificativa de horas de projetos registrada por " + just.Nome + @", abaixo detalhes:</p>
                                  <table align = ""center"">
                                            <th> Nome </th>
                                            <th> Justificativa </th>
                                            <th> Data Início </th>
                                            <th> Hora Início </th>
                                            <th> Data Fim </th>
                                            <th> Hora Fim </th>
                                            <th> Tempo </th>
                                            <th> Cliente </th>
                                            <th> Produto </th>
                                            <th> Projeto </th>
                                            <th> Fase Projeto </th>
                                            <th> Atividade </th>
                                            <th> Observação </th>
                                            <tr>
                                            <td>" + just.Nome + @"</td>
                                            <td>" + just.Justificativa + @"</td>
                                            <td>" + just.DataInicio + @"</td>
                                            <td>" + just.HoraInicio + @"</td>
                                            <td>" + just.DataFim + @"</td>
                                            <td>" + just.HoraFim + @"</td>
                                            <td>" + just.Tempo + @"</td>
                                            <td>" + just.Cliente + @"</td>
                                            <td>" + just.Produto + @"</td>
                                            <td>" + just.Projeto + @"</td>
                                            <td>" + just.Fase_Projeto + @"</td>
                                            <td>" + just.Atividade + @"</td>
                                            <td>" + just.Observacao + @"</td>
                                            </tr>
                                            </table>
                                            <div class=""btn-container"">
                                            <a class=""Aprova"" href =""http://admin.indigosoft.biz/HorasProjeto/ProcessaJustificativa?id=" + usuarioId + "&jtfid=1&dao=" + dataInicio.ToString("yyyy-MM-dd") + "&daf=" + dataFim.ToString("yyyy-MM-dd") + "&justid=" + justificativa + @""" style=""text-decoration:none;"">APROVAR</a>
                                             <a class=""Negar"" href =""http://admin.indigosoft.biz/HorasProjeto/ProcessaJustificativa?id=" + usuarioId + "&jtfid=0&dao=" + dataInicio.ToString("yyyy-MM-dd") + "&daf=" + dataFim.ToString("yyyy-MM-dd") + @"&justid=" + justificativa + @""" style=""text-decoration:none;"">RECUSAR</a>
                                            </div>
                                            </body>
                                            </html>");


                        respEmail = EnviaEmail("checkinout@indigosoft.com.br", "indigo.2017", just.EmailEstrutura.ToString(), "Ferramenta Check in/out", pagina.ToString());



                    }

                    return base.Json(new { Result = respEmail }, 0);

                }
                else
                {
                    return base.Json(new { Result = "Você não pode justificar mais ausência esse mês !" }, 0);

                }
            }
            catch (Exception ex)
            {
                log(ex.Message + " -- " + ex.StackTrace);
                return base.Json(new { Result = ex.Message + " -- " + ex.StackTrace }, 0);
            }

        }

        [HttpGet]
        public ActionResult ProcessaJustificativa(int id, int jtfid, DateTime dao, DateTime daf, int justid)
        {
            try
            {
                Indigo_JustificaHorasUsuario objJust = dataInterface.BuscaJustificaHorasUsuario().FirstOrDefault(x => x.usr_id == id && x.jtf_data == null && x.usrjtf_id == justid && x.jft_dataReg != null);
                Indigo_JustificaHorasProjeto objJustDesc = dataInterface.BuscaTipoJustificativa().FirstOrDefault(x => x.jtf_Id == justid);
                Indigo_Usuario objUsuario = dataInterface.BuscaUsuario().FirstOrDefault(x => x.usr_Id == id);
                Indigo_HorasProjeto HorasProjeto = new Indigo_HorasProjeto();
                Indigo_HorasNTrab HorasNtrab = new Indigo_HorasNTrab();
                var retorno = "";
            if (objJust != null)
            {
                objJust.jtf_Aprova = jtfid;
                objJust.jtf_data = DateTime.Now;
                dataInterface.JustificativaUsuario(objJust);
                if (objJust.jft_Tipo == "HNormal")
                {
                    Indigo_HorasProjeto objHorasProj = dataInterface.BuscaHorasProjeto().FirstOrDefault(x => x.hpo_Id == objJust.hpo_id);
                    objHorasProj.hpo_jtfAprovado = jtfid;
                    retorno = dataInterface.MantemHorasProjeto(objHorasProj);
                }
                else if (objJust.jft_Tipo == "HNTrab")
                {
                    Indigo_HorasNTrab objHorasProj = dataInterface.BuscaHorasNtrab().FirstOrDefault(x => x.hnt_Id == objJust.hpo_id);
                    objHorasProj.hnt_jtfAprovado = jtfid;
                    retorno = dataInterface.MantemHorasNTrab(objHorasProj);
                }
                if (retorno != "")
                {
                    string trataHora = "", strAprova = "";
                    if (jtfid == 1)
                    {
                        strAprova = "aprovada";
                        ViewBag.status = "Justificativa aprovada com sucesso !";
                    }
                    else if (jtfid == 0)
                    {
                        strAprova = "negada";
                        ViewBag.status = "Justificativa negada com sucesso !";
                    }

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

                    StringBuilder pagina = new StringBuilder();

                    pagina.Append(@"<!DOCTYPE html>
                                        <html>
                                        <head>
                                            <title>Ferramenta Check-in / Check-out</title>
                                        </head>
                                        <body>
                                        <style>
                                        body
                                        {
                                        background-color:aliceblue;
                                        }
                                        @font-face
                                     {font-family:Calibri;
                                     panose-1:2 15 5 2 2 2 4 3 2 4;}
                                        @font-face
                                     {font-family:Verdana;
                                     panose-1:2 11 6 4 3 5 4 4 2 4;}
                                        table, td {s
                                        border:1px solid black;
                                        border-collapse: collapse;
                                        }
                                        </style>
                                        <p>" + objUsuario.usr_Nome + @", " + trataHora + @" !</p>
                                        <p>Sua justificativa <b>" + objJustDesc.jtf_Nome + @"</b>, foi " + strAprova + @" pelo seu gestor.</p>
                                        </div>
                                        <p>Segue o link da página.</ p>
                                        </br>
                                        </br>
                                        <a href = ""http://admin.indigosoft.biz/"">http://admin.indigosoft.biz/</a>
                                        </body>
                                        </html>");

                    var email = EnviaEmail("checkinout@indigosoft.com.br", "indigo.2017", objUsuario.usr_Email, "Ferramenta Check-in/out - Aprovação de justificativa", pagina.ToString());

                    return View();
                    }
                    else
                    {
                        ViewBag.status = "Ocorreu algum erro, tente novamente !";
                        return View();
                    }
                }
                else
                {
                    ViewBag.status = "Justificativa já processada !";
                    return View();
                }
            }
            catch (Exception ex)
            {
                log(ex.Message + " -- " + ex.StackTrace);
                return View();
            }
        }

        public JsonResult JustificativaTextoHpo(int id, int justid, string Justexto)
        {
            try
            {
                Indigo_JustificaHorasUsuario objJust = dataInterface.BuscaJustificaHorasUsuario().FirstOrDefault(x => x.usr_id == id && x.usrjtf_id == justid);
                objJust.jft_Texto = Justexto;
                objJust.jtf_Aprova = 0;
                dataInterface.JustificativaUsuario(objJust);
                ViewBag.status = "Observação registrada com sucesso !";
                return base.Json(new { Result = "Observação registrada com sucesso  !" }, 0);
            }
            catch(Exception ex)
            {
                log(ex.Message + " -- " + ex.StackTrace);
                return base.Json(new { Result = ex.Message + " -- " + ex.StackTrace }, 0);
            }
        }

        public JsonResult VerificaJustUsuario()
        {
            int usuarioId = Convert.ToInt32(Session["IDUSUARIO"]);
            var retorno = "";
            List<Indigo_HorasProjeto> justh = dataInterface.BuscaHorasProjeto().Where(x => x.hpo_usrId == usuarioId && x.hpo_jtfAprovado == 1 && x.hpo_DataHoraInicio.Value.Month == DateTime.Now.Month).ToList();
            List<Indigo_HorasNTrab> justnt = dataInterface.BuscaHorasNtrab().Where(x => x.hnt_usrId == usuarioId && x.hnt_jtfAprovado == 1 && x.hnt_DataHoraInicio.Value.Month == DateTime.Now.Month).ToList();
            var numero_h = justh.GroupBy(x => x.hpo_jtfSequencia).ToList();
            var numero_nt = justnt.GroupBy(x => x.hnt_jtfSequencia).ToList();
            retorno = (numero_h.Count + numero_nt.Count).ToString();
            return base.Json(new { Result = retorno }, 0);
        }

        public int RetornarDiasNutil(int dias)
        {
            string data = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
            DateTime Inicio = Convert.ToDateTime(data);
            int dias_nuteis = 0;

            while (dias_nuteis <= dias)
            {

                if (Inicio.DayOfWeek == DayOfWeek.Saturday || Inicio.DayOfWeek == DayOfWeek.Sunday)
                {
                    dias_nuteis++;

                    var calendar = new Indigo_Calendario();
                    calendar.id_data = Inicio.Day;
                    calendar.data = Inicio;
                    dataInterface.Calendario(calendar);

                }
                else
                {
                    dias--;
                }

                Inicio = Inicio.AddDays(1);

            }

            return dias_nuteis;
        }

        public int DiasUteis()
        {

            UserCredential credential;

            string path = Server.MapPath(@"~/Scripts/Google/").ToString();

            using (var stream =
                new FileStream(path + "client_secret.json", FileMode.Open, FileAccess.Read))
            {

                credential = GoogleWebAuthorizationBroker.AuthorizeAsync(
                    GoogleClientSecrets.Load(stream).Secrets,
                    Scopes,
                    "Check-in-out",
                    CancellationToken.None,
                    new FileDataStore(path, true)).Result;
            }


            // Create Google Calendar API service.
            var service = new CalendarService(new BaseClientService.Initializer()
            {
                HttpClientInitializer = credential,
                ApplicationName = ApplicationName,
            });

            // Define parameters of request.
            EventsResource.ListRequest request = service.Events.List("en.brazilian#holiday@group.v.calendar.google.com");
            //request.TimeMin = DateTime.Now;
            request.ShowDeleted = false;
            request.SingleEvents = true;
            request.MaxResults = 100;
            request.OrderBy = EventsResource.ListRequest.OrderByEnum.StartTime;
            request.TimeZone = "America/Sao_Paulo";

            // List events.
            Events events = new Events();

            events = request.Execute();

            List<string> h = new List<string>();

            if (events.Items != null && events.Items.Count > 0)
            {
                foreach (var eventItem in events.Items)
                {
                    if (eventItem.Start.Date.ToString().Contains(DateTime.Now.ToString("yyyy-MM")))
                    {

                        h.Add(eventItem.Description);

                        DateTime data = Convert.ToDateTime(eventItem.Start.Date);

                        if (data.Day == 1)
                        {

                            var calendar = new Indigo_Calendario();
                            calendar.id_data = data.Day;
                            calendar.data = Convert.ToDateTime(eventItem.Start.Date);
                            dataInterface.Calendario(calendar);

                        }
                    }

                }
            }

            int dias = DateTime.DaysInMonth(DateTime.Now.Year, DateTime.Now.Month);
            int dias_uteis = 0;


            dias_uteis = dias - RetornarDiasNutil(dias);

            var calendario = new Indigo_ConfigCalendario();

            calendario.id_qt = 1;
            calendario.qt_diaUtil = dias_uteis;
            calendario.qt_diaFeriado = h.Count;
            calendario.qt_FimDeSemana = dias - dias_uteis;
            calendario.qt_targetTotal = (dias_uteis - h.Count()) * 8;

            dataInterface.ConfigCalendario(calendario);

            return dias_uteis - h.Count();

        }

        public void log(string linha)
        {
            linha = linha + System.Environment.NewLine;
            var caminho = Server.MapPath("~/log.txt");
            System.IO.File.AppendAllText(caminho, linha);
        }

    }
}
