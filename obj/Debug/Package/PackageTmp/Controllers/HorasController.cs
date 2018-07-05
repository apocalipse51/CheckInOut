using IndigoSoft.Reports.Fixa.DataBase.DataAccess;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using MoreLinq;
using System.IO;
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
using IndigoSoft.Reports.Fixa.Model.Relatorio;
using IndigoSoft.Reports.Fixa.helpers;

namespace IndigoSoft.Reports.Fixa.Controllers
{
    public class HorasController : Controller
    {
        static string[] Scopes = { CalendarService.Scope.Calendar };
        static string ApplicationName = "Check-in-out";
        private DataInterface dataInterface = new DataInterface();

        [HttpGet]
        public JsonResult GetHours()
        {
            //Captura a data e hora da queryString
            DateTime dtInicial = Convert.ToDateTime(Request.QueryString["DtInicio"]);
            DateTime dtFinal = Convert.ToDateTime(Request.QueryString["DtFim"]);
            string res;
            if((dtInicial != null) || (dtFinal != null))
            {
                var list = this.dataInterface.BuscaReportHoras(dtInicial, dtFinal);
                if (list != null)
                {
                    var result = list.Select(x => new { Nome = x.Nome, Tempo = x.Tempo, Estrutura = x.Estrutura, Projeto = x.Projeto });
                    return base.Json(new { result }, JsonRequestBehavior.AllowGet);
                }
            }
            else
            {
                res = "A data inicial e final deve ser informada para pesquisa";
                return base.Json(new { res }, JsonRequestBehavior.AllowGet);
            }
            res = "Error";
            return base.Json(new { res }, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult GetHeads()
        {
            //Pesquisa a estrutura baseado na data
            //Captura a data e hora da queryString
            DateTime dtInicial = Convert.ToDateTime(Request.QueryString["DtInicio"]);
            DateTime dtFinal = Convert.ToDateTime(Request.QueryString["DtFim"]);
            string res;
            if ((dtInicial != null) || (dtFinal != null))
            {
                var list = this.dataInterface.BuscaReportHoras(dtInicial, dtFinal);
                if (list != null)
                {
                    var estrutura = list.Select(x => x.Estrutura).ToList();
                    //Filter the list removing repetitions
                    var result = estrutura.DistinctBy(x => x).ToList();
                    //Retora os resultados em JSON
                    return base.Json(new { result }, JsonRequestBehavior.AllowGet);
                }
            }
            else
            {
                res = "A data inicial e final deve ser informada para pesquisa";
                return base.Json(new { res }, JsonRequestBehavior.AllowGet);
            }
            res = "Error";
            return base.Json(new { res }, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult GetNames()
        {
            //Pesquisa a estrutura baseado na data
            //Captura a data e hora da queryString
            DateTime dtInicial = Convert.ToDateTime(Request.QueryString["DtInicio"]);
            DateTime dtFinal = Convert.ToDateTime(Request.QueryString["DtFim"]);
            string res;
            if((dtInicial != null) || (dtFinal != null))
            {
                var list = this.dataInterface.BuscaReportHoras(dtInicial, dtFinal);
                if (list != null)
                {
                    var estrutura = list.Select(x => new { x.Nome }).ToList();
                    //Filter the list removing repetitions
                    var result = estrutura.DistinctBy(x => new { x }).ToList();
                    //Retora os resultados em JSON
                    return base.Json(new { result }, JsonRequestBehavior.AllowGet);
                }
            }
            else
            {
                res = "A data inicial e final deve ser informada para pesquisa";
                return base.Json(new { res }, JsonRequestBehavior.AllowGet);
            }
            res = "Error";
            return base.Json(new { res }, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult ReportCompleto()
        {
            if ((Request.QueryString["DtInicio"] != null) && (Request.QueryString["DtFim"] != null))
            {
                if ((Request.QueryString["DtInicio"] != "") && (Request.QueryString["DtFim"] != ""))
                {
                    DateTime DtInicio = Convert.ToDateTime(Request.QueryString["DtInicio"]);
                    DateTime DtFim = Convert.ToDateTime(Request.QueryString["DtFim"]);
                    int idUsuario = Convert.ToInt32(Request.QueryString["id"]);
                    //Captura o nome de usuario
                    var estrutura = RetornaEstrutura(idUsuario);
                    //Captura a lista
                    var dados = this.dataInterface.BuscaReportHoras(DtInicio, DtFim);
                    //Valida os campos de pesquisa
                    if (dados != null)
                    {
                        foreach (var c in dados)
                        {
                            c.Nome = (c.Nome == null) ? "" : c.Nome;                            
                            c.Estrutura = (c.Estrutura == null) ? "" : c.Estrutura;
                            c.Funcao = (c.Funcao == null) ? "" : c.Funcao;
                            c.Cliente = (c.Cliente == null) ? "" : c.Cliente;
                            c.Produto = (c.Produto == null) ? "" : c.Produto;
                            c.Id_Projeto = (c.Id_Projeto == null) ? "" : c.Id_Projeto;
                            c.Projeto = (c.Projeto == null) ? "" : c.Projeto;
                            c.Fase_Projeto = (c.Fase_Projeto == null) ? "" : c.Fase_Projeto;
                            c.Atividade = (c.Atividade == null) ? "" : c.Atividade;                            
                            c.Hora_Inicio = (c.Hora_Inicio == null) ? "" : c.Hora_Inicio;
                            c.Data_Fim = (c.Data_Fim == null) ? "" : c.Data_Fim;
                            c.Hora_Fim = (c.Hora_Fim == null) ? "" : c.Hora_Fim;
                            c.HoraDecimal = (c.HoraDecimal == null) ? "" : c.HoraDecimal;
                            c.Observação = (c.Observação == null) ? "" : c.Observação;
                            c.HoraDecimal = (c.HoraDecimal == null) ? "" : c.HoraDecimal;
                            c.Aprovacao = (c.Aprovacao != null) ? c.Aprovacao : "";
                            c.Motivo = (c.Motivo != null) ? c.Motivo : "";
                            c.Data_Inicio = (c.Data_Inicio == null) ? "" : c.Data_Inicio;
                            //Calculo de tempo para o caso de justificativas de mais de 1 dia
                            if(c.Data_Fim != c.Data_Inicio)
                            {
                                int diferenca = (Time.WorkDays(c.Data_Inicio, c.Data_Fim) - 2) * 8;                               
                                var tempos = Time.TimeSpaces(c.Hora_Inicio, c.Hora_Fim);
                                var res = Time.SumTimes(tempos[0], tempos[1]);
                                c.Tempo = Time.AddHours(res, diferenca);
                            }
                            else
                            {
                                c.Tempo = (c.Tempo == null) ? "" : c.Tempo;
                            }                            
                        }
                        dados = dados.ToList();
                        var usr = this.GetUser(idUsuario);
                        var names = dados.Where(x => x.Estrutura.ToLower().Replace(" ", "") == usr.Nome.ToLower().Replace(" ", "")).Select(x => x.Nome).DistinctBy(x => x);
                        var head = usr.Estrutura;
                        var recursos = dados.Where(x => x.Estrutura.ToLower().Replace(" ", "") == usr.Nome.ToLower().Replace(" ", ""));
                        var usuario = dados.Where(x => x.Nome.ToLower().Replace(" ", "") == usr.Nome.ToLower().Replace(" ", ""));
                        return base.Json(new { Estrutura = head, Nomes = names, Recursos = recursos, UsuarioHoras = usuario, UsuarioNome = usr.Nome }, JsonRequestBehavior.AllowGet);
                    }
                    else
                    {
                        return base.Json(new { Content = "" }, JsonRequestBehavior.AllowGet);
                    }
                }
                else
                {
                    return base.Json(new { erro = "Erro" }, JsonRequestBehavior.AllowGet);
                }
            }
            return base.Json(new {erro = "Erro"}, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult GetUserStructure()
        {
            //Captura a data e hora da queryString
            DateTime dtInicial = Convert.ToDateTime(Request.QueryString["DtInicio"]);
            DateTime dtFinal = Convert.ToDateTime(Request.QueryString["DtFim"]);
            string res;
            if((dtInicial != null) || (dtFinal != null))
            {
                var list = this.dataInterface.BuscaReportHoras(dtInicial, dtFinal);
                if (list != null)
                {
                    var listFiltered = list.Select(x => new { x.Nome, x.Estrutura, x.Tempo });
                    return base.Json(new { Content = listFiltered }, JsonRequestBehavior.AllowGet);
                }
            }
            else
            {
                res = "A data inicial e final deve ser informada para pesquisa";
                return base.Json(new { res }, JsonRequestBehavior.AllowGet);
            }
            res = "Error";
            return base.Json(new { res }, JsonRequestBehavior.AllowGet);
        }

        public Usuario GetUser(int id)
        {
            List<Indigo_Usuario> res = this.dataInterface.BuscaUsuario();
            var user = res.Where(x => x.usr_Id == id).Select(x => new { x.usr_Id, x.usr_Login, x.usr_Nome, x.Indigo_FuncaoUsuario.fnc_Nome, x.Indigo_EstruturaFluxo.estr_Nome, x.usr_Email, x.usr_Tel, x.Indigo_EstruturaFluxo.estr_apr, x.Indigo_FuncaoUsuario.fnc_Sigla });
            Usuario usr = new Usuario();
            foreach(var u in user)
            {
                usr.Estrutura = u.estr_Nome;
                usr.Nome = u.usr_Nome;
            }
            return usr;
        }

        public string RetornaEstrutura(int id)
        {
            var idMainUser = id;
            List<Indigo_Usuario> listUsuarios = this.dataInterface.BuscaUsuario();
            if((listUsuarios != null) && (idMainUser != 0))
            {
                var recurso = listUsuarios.Where(x => x.usr_Id == idMainUser).Select(x => new { x.usr_Id, x.usr_Login, x.usr_Nome, x.Indigo_FuncaoUsuario.fnc_Nome, x.Indigo_EstruturaFluxo.estr_Nome, x.usr_Email, x.usr_Tel, x.Indigo_EstruturaFluxo.estr_apr, x.Indigo_FuncaoUsuario.fnc_Sigla }).ToList();
                var nomeRecurso = listUsuarios.Where(x => x.usr_Id == idMainUser).Select(x => x.usr_Nome);
                var nomeEstrutura = nomeRecurso.ToArray();
                string estrutura = nomeEstrutura[0];
                return estrutura;
            }
            else
            {
                return "Erro";
            }
        }

        [HttpGet]
        public JsonResult RetornaUsuarios()
        {
            List<Indigo_Usuario> listUsuarios = this.dataInterface.BuscaUsuario().ToList();
            var retorno = listUsuarios.Select(x => new { x.usr_Id, x.usr_Login, x.usr_Nome, x.Indigo_FuncaoUsuario.fnc_Nome, x.Indigo_EstruturaFluxo.estr_Nome, x.usr_Email, x.usr_Tel, x.Indigo_EstruturaFluxo.estr_apr, x.Indigo_FuncaoUsuario.fnc_Sigla });
            //Retorna a estrutura filtrada por usuário
            return base.Json(new { Result = retorno }, JsonRequestBehavior.AllowGet);
        }             

        public static double Horas(string hora)
        {
            var arrH = hora.Split(':');
            var hra = Convert.ToInt32(arrH[0]);
            var minuto = Convert.ToInt32(arrH[1]);
            var str = string.Format("{0}.{1}", hra, minuto);
            var res = Convert.ToDouble(str);
            return res;
        }

    }
}
