using IndigoSoft.Reports.Fixa.DataBase.DataAccess;
using IndigoSoft.Reports.Fixa.DataBase.DataModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace IndigoSoft.Reports.Fixa.Controllers
{
    public class TopProjetosController : Controller
    {
        //
        // GET: /TopProjetos/
        private DataInterface dataInterface = new DataInterface();

        public ActionResult TopProjetos()
        {
            return View();
        }


        public JsonResult RetornaTopProjetos(int linhas)
        {
            try
            {

                List<RetornaTopProjeto> retorno = new List<RetornaTopProjeto>();
                List<RetornaHC> retorno_hc = new List<RetornaHC>();
                retorno = this.dataInterface.TopProjetos();
                
                if(linhas == 15)
                {
                    retorno = retorno.Take(linhas).ToList();
                }

                for (int i = 0; i < retorno.Count; i++)
                {
                    retorno_hc = dataInterface.RetornaHCProjeto(Convert.ToInt32(retorno[i].ID)).ToList();
                    retorno[i].HC = Convert.ToString(retorno_hc[0].HC);
                }

                retorno = retorno.OrderByDescending(x => x.TempoTotal).ToList();

                return base.Json(new { Result = retorno }, 0);

           }
            catch (Exception ex)
            {
                return base.Json(new { Result = ex.Message }, 0);

            }

        }


        public JsonResult RetornaDetalhes(int mes, int ano, int idusuario, int idprojeto)
        {
            try
            {

                List<RetornaProjetoFiltro> retorno = new List<RetornaProjetoFiltro>();
                retorno = this.dataInterface.RetornaFiltroProjeto(mes, ano, idusuario, idprojeto).ToList();
                return base.Json(new { Result = retorno }, 0);

            }
            catch (Exception ex)
            {
                return base.Json(new { Result = ex.Message }, 0);
            }

        }


    }
}
