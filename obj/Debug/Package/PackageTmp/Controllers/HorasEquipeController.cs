using IndigoSoft.Reports.Fixa.DataBase.DataAccess;
using IndigoSoft.Reports.Fixa.DataBase.DataModel;
using IndigoSoft.Reports.Fixa.helpers;
using IndigoSoft.Reports.Fixa.Model.Estrutura;
using MoreLinq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Mvc;

namespace IndigoSoft.Reports.Fixa.Controllers
{
    public class HorasEquipeController : Controller
    {
        static string ApplicationName = "Check-in-out";
        //Interface de conexão com o banco de dados
        private DataInterface dataInterface = new DataInterface();
        //Contexto de conexão com o banco de dados
        private Indigo_Controle_Licenca ctx = new Indigo_Controle_Licenca();

        public ActionResult Index()
        {
            return View();
        }

        public JsonResult RemportHorasEstrutura()
        {
            DateTime DtInicio = Convert.ToDateTime(Request.QueryString["DtInicio"]);
            DateTime DtFim = Convert.ToDateTime(Request.QueryString["DtFim"]);
            var dados = this.dataInterface.BuscaReportHoras(DtInicio, DtFim);
            //Valida os campos de pesquisa
            if (dados != null)
            {
                foreach (var c in dados)
                {
                    c.Nome = (c.Nome == null) ? "" : c.Nome;
                    c.Tempo = (c.Tempo == null) ? "" : c.Tempo;
                    c.Estrutura = (c.Estrutura == null) ? "" : c.Estrutura;
                    c.Funcao = (c.Funcao == null) ? "" : c.Funcao;
                    c.Cliente = (c.Cliente == null) ? "" : c.Cliente;
                    c.Produto = (c.Produto == null) ? "" : c.Produto;
                    c.Id_Projeto = (c.Id_Projeto == null) ? "" : c.Id_Projeto;
                    c.Projeto = (c.Projeto == null) ? "" : c.Projeto;
                    c.Fase_Projeto = (c.Projeto == null) ? "" : c.Projeto;
                    c.Atividade = (c.Atividade == null) ? "" : c.Atividade;
                    c.Data_Inicio = (c.Data_Inicio == null) ? "" : c.Data_Inicio;
                    c.Hora_Inicio = (c.Hora_Inicio == null) ? "" : c.Hora_Inicio;
                    c.Data_Fim = (c.Data_Fim == null) ? "" : c.Data_Fim;
                    c.Hora_Fim = (c.Hora_Fim == null) ? "" : c.Hora_Fim;
                    c.HoraDecimal = (c.HoraDecimal == null) ? "" : c.HoraDecimal;
                    c.Observação = (c.Observação == null) ? "" : c.Observação;
                    c.Aprovacao = (c.Aprovacao == null) ? "" : c.Aprovacao;
                    c.Motivo = (c.Motivo == null) ? "" : c.Motivo;
                }
                return base.Json(new { Result = dados }, JsonRequestBehavior.AllowGet);
            }
            else
            {
                return base.Json(new { Result = "Erro" }, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult ReportHorasCompleto()
        {
            DateTime DtInicio = Convert.ToDateTime(Request.QueryString["DtInicio"]);
            DateTime DtFim = Convert.ToDateTime(Request.QueryString["DtFim"]);
            int Tipo = Convert.ToInt32(Request.QueryString["Tipo"]);
            if (Tipo == 0)
            {
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
                        c.Fase_Projeto = (c.Projeto == null) ? "" : c.Projeto;
                        c.Atividade = (c.Atividade == null) ? "" : c.Atividade;
                        c.Data_Inicio = (c.Data_Inicio == null) ? "" : c.Data_Inicio;
                        c.Hora_Inicio = (c.Hora_Inicio == null) ? "" : c.Hora_Inicio;
                        c.Data_Fim = (c.Data_Fim == null) ? "" : c.Data_Fim;
                        c.Hora_Fim = (c.Hora_Fim == null) ? "" : c.Hora_Fim;
                        c.HoraDecimal = (c.HoraDecimal == null) ? "" : c.HoraDecimal;
                        c.Observação = (c.Observação == null) ? "" : c.Observação;
                        c.Aprovacao = (c.Aprovacao == null) ? "" : c.Aprovacao;
                        c.Motivo = (c.Motivo == null) ? "" : c.Motivo;
                        //Calculo de tempo para o caso de justificativas de mais de 1 dia
                        if (c.Data_Fim != c.Data_Inicio)
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
                    return base.Json(new { Result = dados }, JsonRequestBehavior.AllowGet);
                }
                else if (Tipo == 1)
                {
                    var tipoUm = this.dataInterface.BuscaReportControleCusto(DtInicio, DtFim);
                    return base.Json(new { Content = tipoUm }, JsonRequestBehavior.AllowGet);
                }
                else if (Tipo == 2)
                {
                    var tipoDois = this.dataInterface.BuscaReportlog(DtInicio, DtFim);
                    return base.Json(new { Content = tipoDois }, JsonRequestBehavior.AllowGet);
                }
            }
            return base.Json(new { erro = "Erro" }, JsonRequestBehavior.AllowGet);
        }

        public JsonResult ReportEstrutura()
        {
            if ((Request.QueryString["DtInicio"] != null) && (Request.QueryString["DtFim"] != null) && (Request.QueryString["Tipo"] != null))
            {
                if ((Request.QueryString["DtInicio"] != "") && (Request.QueryString["DtFim"] != ""))
                {
                    DateTime DtInicio = Convert.ToDateTime(Request.QueryString["DtInicio"]);
                    DateTime DtFim = Convert.ToDateTime(Request.QueryString["DtFim"]);
                    int idUsuario = Convert.ToInt32(Request.QueryString["id"]);
                    int Tipo = Convert.ToInt32(Request.QueryString["Tipo"]);
                    if (Tipo == 0)
                    {
                        //Captura o nome de usuario
                        var estrutura = RetornaEstrutura(idUsuario);
                        //Captura a lista
                        var dados = this.dataInterface.BuscaReportHoras(DtInicio, DtFim).ToList();
                        var recursos = dados.Where(x => x.Estrutura == estrutura).DistinctBy(x => new { x }).ToList();
                        var usuario = dados.Where(x => x.Nome == estrutura).DistinctBy(x => new { x }).ToList();
                        //Valida os campos de pesquisa
                        if (dados != null)
                        {
                            foreach (var c in dados)
                            {
                                c.Nome = (c.Nome == null) ? "" : c.Nome;
                                c.Tempo = (c.Tempo == null) ? "" : c.Tempo;
                                c.Estrutura = (c.Estrutura == null) ? "" : c.Estrutura;
                                c.Funcao = (c.Funcao == null) ? "" : c.Funcao;
                                c.Cliente = (c.Cliente == null) ? "" : c.Cliente;
                                c.Produto = (c.Produto == null) ? "" : c.Produto;
                                c.Id_Projeto = (c.Id_Projeto == null) ? "" : c.Id_Projeto;
                                c.Projeto = (c.Projeto == null) ? "" : c.Projeto;
                                c.Fase_Projeto = (c.Projeto == null) ? "" : c.Projeto;
                                c.Atividade = (c.Atividade == null) ? "" : c.Atividade;
                                c.Data_Inicio = (c.Data_Inicio == null) ? "" : c.Data_Inicio;
                                c.Hora_Inicio = (c.Hora_Inicio == null) ? "" : c.Hora_Inicio;
                                c.Data_Fim = (c.Data_Fim == null) ? "" : c.Data_Fim;
                                c.Hora_Fim = (c.Hora_Fim == null) ? "" : c.Hora_Fim;
                                c.HoraDecimal = (c.HoraDecimal == null) ? "" : c.HoraDecimal;
                                c.Observação = (c.Observação == null) ? "" : c.Observação;
                                c.Aprovacao = (c.Aprovacao == null) ? "" : c.Aprovacao;
                                c.Motivo = (c.Motivo == null) ? "" : c.Motivo;
                            }
                            return base.Json(new { Estrutura = usuario, Recursos = recursos }, JsonRequestBehavior.AllowGet);
                        }
                        else
                        {
                            return base.Json(new { Content = "" }, JsonRequestBehavior.AllowGet);
                        }
                    }
                    else if (Tipo == 1)
                    {
                        var dados = this.dataInterface.BuscaReportControleCusto(DtInicio, DtFim);
                        return base.Json(new { Content = dados }, JsonRequestBehavior.AllowGet);
                    }
                    else if (Tipo == 2)
                    {
                        var dados = this.dataInterface.BuscaReportlog(DtInicio, DtFim);
                        return base.Json(new { Content = dados }, JsonRequestBehavior.AllowGet);
                    }
                }
                else
                {
                    return base.Json(new { erro = "Erro" }, JsonRequestBehavior.AllowGet);
                }
            }
            return base.Json(new { erro = "Erro" }, JsonRequestBehavior.AllowGet);
        }

        public JsonResult ReportCompleto()
        {
            DateTime DtInicio = Convert.ToDateTime(Request.QueryString["DtInicio"]);
            DateTime DtFim = Convert.ToDateTime(Request.QueryString["DtFim"]);
            int Tipo = Convert.ToInt32(Request.QueryString["Tipo"]);
            if (Tipo == 0)
            {
                var dados = this.dataInterface.BuscaReportHoras(DtInicio, DtFim);
                //Valida os campos de pesquisa
                if (dados != null)
                {
                    foreach (var c in dados)
                    {
                        c.Nome = (c.Nome == null) ? "" : c.Nome;
                        c.Tempo = (c.Tempo == null) ? "" : c.Tempo;
                        c.Estrutura = (c.Estrutura == null) ? "" : c.Estrutura;
                        c.Funcao = (c.Funcao == null) ? "" : c.Funcao;
                        c.Cliente = (c.Cliente == null) ? "" : c.Cliente;
                        c.Produto = (c.Produto == null) ? "" : c.Produto;
                        c.Id_Projeto = (c.Id_Projeto == null) ? "" : c.Id_Projeto;
                        c.Projeto = (c.Projeto == null) ? "" : c.Projeto;
                        c.Fase_Projeto = (c.Projeto == null) ? "" : c.Projeto;
                        c.Atividade = (c.Atividade == null) ? "" : c.Atividade;
                        c.Data_Inicio = (c.Data_Inicio == null) ? "" : c.Data_Inicio;
                        c.Hora_Inicio = (c.Hora_Inicio == null) ? "" : c.Hora_Inicio;
                        c.Data_Fim = (c.Data_Fim == null) ? "" : c.Data_Fim;
                        c.Hora_Fim = (c.Hora_Fim == null) ? "" : c.Hora_Fim;
                        c.HoraDecimal = (c.HoraDecimal == null) ? "" : c.HoraDecimal;
                        c.Observação = (c.Observação == null) ? "" : c.Observação;
                        c.Aprovacao = (c.Aprovacao == null) ? "" : c.Aprovacao;
                        c.Motivo = (c.Motivo == null) ? "" : c.Motivo;
                    }
                    return base.Json(new { Result = dados }, JsonRequestBehavior.AllowGet);
                }
                else if (Tipo == 1)
                {
                    var tipoUm = this.dataInterface.BuscaReportControleCusto(DtInicio, DtFim);
                    return base.Json(new { Content = tipoUm }, JsonRequestBehavior.AllowGet);
                }
                else if (Tipo == 2)
                {
                    var tipoDois = this.dataInterface.BuscaReportlog(DtInicio, DtFim);
                    return base.Json(new { Content = tipoDois }, JsonRequestBehavior.AllowGet);
                }
            }
            return base.Json(new { erro = "Erro" }, JsonRequestBehavior.AllowGet);
        }

        public JsonResult Estrutura()
        {
            //verifica e consolida a estrutura de usuários
            var usuarios = this.ctx.Indigo_Usuario;
            var estruturas = this.ctx.Indigo_EstruturaFluxo;

            //Instância a lista de estruturas
            var lista = new List<Estrutura>();
            //Executa a consolidação das estruturas
            foreach (var est in estruturas)
            {
                var usrs = new List<Recurso>();
                foreach (var usr in usuarios)
                {
                    if (Convert.ToInt32(usr.estr_id) == est.estr_id)
                    {
                        var usuario = new Recurso(usr.usr_Nome, usr.usr_Id, Convert.ToInt32(usr.estr_id));
                        usrs.Add(usuario);
                    }
                }
                var estr = new Estrutura(Convert.ToInt32(est.estrusr_id), est.estr_Nome, usrs);
                lista.Add(estr);
            }

            return base.Json(new { Result = lista }, JsonRequestBehavior.AllowGet);
        }

        public JsonResult Heads()
        {
            var estruturas = this.ctx.Indigo_EstruturaFluxo;
            var ids = estruturas.Select(x => x.estr_Nome);
            return base.Json(new { Result = ids }, JsonRequestBehavior.AllowGet);
        }

        public JsonResult HeadsFind()
        {
            DateTime DtInicio = Convert.ToDateTime(Request.QueryString["DtInicio"]);
            DateTime DtFim = Convert.ToDateTime(Request.QueryString["DtFim"]);
            string head = Request.QueryString["head"];
            var dados = this.dataInterface.BuscaReportHoras(DtInicio, DtFim);
            //Valida os campos de pesquisa
            if (dados != null)
            {
                foreach (var c in dados)
                {
                    c.Nome = (c.Nome == null) ? "" : c.Nome;
                    c.Tempo = (c.Tempo == null) ? "" : c.Tempo;
                    c.Estrutura = (c.Estrutura == null) ? "" : c.Estrutura;
                    c.Funcao = (c.Funcao == null) ? "" : c.Funcao;
                    c.Cliente = (c.Cliente == null) ? "" : c.Cliente;
                    c.Produto = (c.Produto == null) ? "" : c.Produto;
                    c.Id_Projeto = (c.Id_Projeto == null) ? "" : c.Id_Projeto;
                    c.Projeto = (c.Projeto == null) ? "" : c.Projeto;
                    c.Fase_Projeto = (c.Projeto == null) ? "" : c.Projeto;
                    c.Atividade = (c.Atividade == null) ? "" : c.Atividade;
                    c.Data_Inicio = (c.Data_Inicio == null) ? "" : c.Data_Inicio;
                    c.Hora_Inicio = (c.Hora_Inicio == null) ? "" : c.Hora_Inicio;
                    c.Data_Fim = (c.Data_Fim == null) ? "" : c.Data_Fim;
                    c.Hora_Fim = (c.Hora_Fim == null) ? "" : c.Hora_Fim;
                    c.HoraDecimal = (c.HoraDecimal == null) ? "" : c.HoraDecimal;
                    c.Observação = (c.Observação == null) ? "" : c.Observação;
                    c.Aprovacao = (c.Aprovacao == null) ? "" : c.Aprovacao;
                    c.Motivo = (c.Motivo == null) ? "" : c.Motivo;
                }
                var lista = dados.Where(x => x.Estrutura.ToLower().Replace(" ", "") == head.ToLower().Replace(" ", ""));
                return base.Json(new { Result = lista }, JsonRequestBehavior.AllowGet);
            }
            else
            {
                return base.Json(new { erro = "Erro" }, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult HeadsId()
        {
            var estruturas = this.ctx.Indigo_EstruturaFluxo;
            var ids = estruturas.Select(x => x.estrusr_id);
            return base.Json(new { Result = ids }, JsonRequestBehavior.AllowGet);
        }

        public JsonResult Produtos()
        {
            DateTime DtInicio = Convert.ToDateTime(Request.QueryString["DtInicio"]);
            DateTime DtFim = Convert.ToDateTime(Request.QueryString["DtFim"]);
            var dados = this.dataInterface.BuscaReportHoras(DtInicio, DtFim);
            if (dados != null)
            {
                var ids = dados.Select(x => x.Produto);
                return base.Json(new { Result = ids }, JsonRequestBehavior.AllowGet);
            }
            else
            {
                return base.Json(new { Result = "" }, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult ProdutosFind()
        {
            DateTime DtInicio = Convert.ToDateTime(Request.QueryString["DtInicio"]);
            DateTime DtFim = Convert.ToDateTime(Request.QueryString["DtFim"]);
            string produto = Request.QueryString["produto"];
            var dados = this.dataInterface.BuscaReportHoras(DtInicio, DtFim);
            //Valida os campos de pesquisa
            if (dados != null)
            {
                foreach (var c in dados)
                {
                    c.Nome = (c.Nome == null) ? "" : c.Nome;
                    c.Tempo = (c.Tempo == null) ? "" : c.Tempo;
                    c.Estrutura = (c.Estrutura == null) ? "" : c.Estrutura;
                    c.Funcao = (c.Funcao == null) ? "" : c.Funcao;
                    c.Cliente = (c.Cliente == null) ? "" : c.Cliente;
                    c.Produto = (c.Produto == null) ? "" : c.Produto;
                    c.Id_Projeto = (c.Id_Projeto == null) ? "" : c.Id_Projeto;
                    c.Projeto = (c.Projeto == null) ? "" : c.Projeto;
                    c.Fase_Projeto = (c.Projeto == null) ? "" : c.Projeto;
                    c.Atividade = (c.Atividade == null) ? "" : c.Atividade;
                    c.Data_Inicio = (c.Data_Inicio == null) ? "" : c.Data_Inicio;
                    c.Hora_Inicio = (c.Hora_Inicio == null) ? "" : c.Hora_Inicio;
                    c.Data_Fim = (c.Data_Fim == null) ? "" : c.Data_Fim;
                    c.Hora_Fim = (c.Hora_Fim == null) ? "" : c.Hora_Fim;
                    c.HoraDecimal = (c.HoraDecimal == null) ? "" : c.HoraDecimal;
                    c.Observação = (c.Observação == null) ? "" : c.Observação;
                    c.Aprovacao = (c.Aprovacao == null) ? "" : c.Aprovacao;
                    c.Motivo = (c.Motivo == null) ? "" : c.Motivo;
                }
                var lista = dados.Where(x => x.Produto.ToLower().Replace(" ", "") == produto.ToLower().Replace(" ", ""));
                return base.Json(new { Result = lista }, JsonRequestBehavior.AllowGet);
            }
            else
            {
                return base.Json(new { erro = "Erro" }, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult Clientes()
        {
            DateTime DtInicio = Convert.ToDateTime(Request.QueryString["DtInicio"]);
            DateTime DtFim = Convert.ToDateTime(Request.QueryString["DtFim"]);
            var dados = this.dataInterface.BuscaReportHoras(DtInicio, DtFim);
            if (dados != null)
            {
                var ids = dados.Select(x => x.Cliente);
                return base.Json(new { Result = ids }, JsonRequestBehavior.AllowGet);
            }
            else
            {
                return base.Json(new { Result = "" }, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult ClientesFind()
        {
            DateTime DtInicio = Convert.ToDateTime(Request.QueryString["DtInicio"]);
            DateTime DtFim = Convert.ToDateTime(Request.QueryString["DtFim"]);
            string cliente = Request.QueryString["cliente"];   
            var dados = this.dataInterface.BuscaReportHoras(DtInicio, DtFim);
            //Valida os campos de pesquisa
            if (dados != null)
            {
                foreach (var c in dados)
                {
                    c.Nome = (c.Nome == null) ? "" : c.Nome;
                    c.Tempo = (c.Tempo == null) ? "" : c.Tempo;
                    c.Estrutura = (c.Estrutura == null) ? "" : c.Estrutura;
                    c.Funcao = (c.Funcao == null) ? "" : c.Funcao;
                    c.Cliente = (c.Cliente == null) ? "" : c.Cliente;
                    c.Produto = (c.Produto == null) ? "" : c.Produto;
                    c.Id_Projeto = (c.Id_Projeto == null) ? "" : c.Id_Projeto;
                    c.Projeto = (c.Projeto == null) ? "" : c.Projeto;
                    c.Fase_Projeto = (c.Projeto == null) ? "" : c.Projeto;
                    c.Atividade = (c.Atividade == null) ? "" : c.Atividade;
                    c.Data_Inicio = (c.Data_Inicio == null) ? "" : c.Data_Inicio;
                    c.Hora_Inicio = (c.Hora_Inicio == null) ? "" : c.Hora_Inicio;
                    c.Data_Fim = (c.Data_Fim == null) ? "" : c.Data_Fim;
                    c.Hora_Fim = (c.Hora_Fim == null) ? "" : c.Hora_Fim;
                    c.HoraDecimal = (c.HoraDecimal == null) ? "" : c.HoraDecimal;
                    c.Observação = (c.Observação == null) ? "" : c.Observação;
                    c.Aprovacao = (c.Aprovacao == null) ? "" : c.Aprovacao;
                    c.Motivo = (c.Motivo == null) ? "" : c.Motivo;
                }
                var lista = dados.Where(x => x.Cliente.ToLower().Replace(" ", "") == cliente.ToLower().Replace(" ", ""));
                return base.Json(new { Result = lista }, JsonRequestBehavior.AllowGet);
            }               
            else
            {
                return base.Json(new { erro = "Erro" }, JsonRequestBehavior.AllowGet);
            }            
        }
        
        public JsonResult Projetos()
        {
            DateTime DtInicio = Convert.ToDateTime(Request.QueryString["DtInicio"]);
            DateTime DtFim = Convert.ToDateTime(Request.QueryString["DtFim"]);
            var dados = this.dataInterface.BuscaReportHoras(DtInicio, DtFim);
            if(dados != null)
            {
                var ids = dados.Select(x => x.Projeto);
                return base.Json(new { Result = ids }, JsonRequestBehavior.AllowGet);
            }            
            else
            {
                return base.Json(new { Result = "" }, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult ProjetosFind()
        {
            DateTime DtInicio = Convert.ToDateTime(Request.QueryString["DtInicio"]);
            DateTime DtFim = Convert.ToDateTime(Request.QueryString["DtFim"]);
            string projeto = Request.QueryString["projeto"];
            var dados = this.dataInterface.BuscaReportHoras(DtInicio, DtFim);
            //Valida os campos de pesquisa
            if (dados != null)
            {
                foreach (var c in dados)
                {
                    c.Nome = (c.Nome == null) ? "" : c.Nome;
                    c.Tempo = (c.Tempo == null) ? "" : c.Tempo;
                    c.Estrutura = (c.Estrutura == null) ? "" : c.Estrutura;
                    c.Funcao = (c.Funcao == null) ? "" : c.Funcao;
                    c.Cliente = (c.Cliente == null) ? "" : c.Cliente;
                    c.Produto = (c.Produto == null) ? "" : c.Produto;
                    c.Id_Projeto = (c.Id_Projeto == null) ? "" : c.Id_Projeto;
                    c.Projeto = (c.Projeto == null) ? "" : c.Projeto;
                    c.Fase_Projeto = (c.Projeto == null) ? "" : c.Projeto;
                    c.Atividade = (c.Atividade == null) ? "" : c.Atividade;
                    c.Data_Inicio = (c.Data_Inicio == null) ? "" : c.Data_Inicio;
                    c.Hora_Inicio = (c.Hora_Inicio == null) ? "" : c.Hora_Inicio;
                    c.Data_Fim = (c.Data_Fim == null) ? "" : c.Data_Fim;
                    c.Hora_Fim = (c.Hora_Fim == null) ? "" : c.Hora_Fim;
                    c.HoraDecimal = (c.HoraDecimal == null) ? "" : c.HoraDecimal;
                    c.Observação = (c.Observação == null) ? "" : c.Observação;
                    c.Aprovacao = (c.Aprovacao == null) ? "" : c.Aprovacao;
                    c.Motivo = (c.Motivo == null) ? "" : c.Motivo;
                }                
                var lista = dados.Where(x => x.Projeto.ToLower().Replace(" ", "") == projeto.ToLower().Replace(" ", ""));
                return base.Json(new { Result = lista, Search = projeto.ToLower().Replace(" ", "") }, JsonRequestBehavior.AllowGet);
            }
            else
            {
                return base.Json(new { erro = "Erro" }, JsonRequestBehavior.AllowGet);
            }
        }

        private string RetornaEstrutura(int id)
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
        
    }
}