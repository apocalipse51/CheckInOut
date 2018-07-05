using IndigoSoft.Reports.Fixa.DataBase.DataAccess;
using IndigoSoft.Reports.Fixa.DataBase.DataModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace IndigoSoft.Reports.Fixa.Controllers
{
    public class OrganoController : Controller
    {
        private DataInterface dataInterface = new DataInterface();
        //
        // GET: /Organo/

        public ActionResult Organograma()
        {
            return View();
        }

        public List<RetornaEstrutura> EstruturaR(List<RetornaEstrutura> retorna, List<RetornaEstrutura> retorno_final)
        {
            List<RetornaEstrutura> retorna_temp = new List<RetornaEstrutura>();

            foreach (var reg in retorna.ToList())
            {
                retorna_temp = dataInterface.BuscaEstrutura(reg.usr_Id);

                foreach (var item in retorna_temp.ToList())
                {
                    retorno_final.Add(item);

                }
            }

            return retorno_final;
        }

        public List<RetornaEstrutura> retorno_final = new List<RetornaEstrutura>();
        public List<string> HC_ESTRUTURA = new List<string>();
        public int hc_n = 0;
        public List<RetornaEstrutura> InsereExtrutura(int userId, string nos)
        {
            var retorno = new List<RetornaEstrutura>();
            retorno = dataInterface.BuscaEstrutura(userId);


            if (nos != "inicio")
            {

                if (retorno != null)
                {

                    retorno_final.AddRange(retorno);


                    foreach (var user in retorno.ToList())
                    {
                        if (user.usr_Id != userId)
                        {
                            retorno_final.AddRange(InsereExtrutura(user.usr_Id, null));
                        }
                    }
                }
                else
                {
                    retorno = new List<RetornaEstrutura>();
                   
                }

            }
            else
            {
                int hc = 0;

                for (int i = 1; i < retorno.Count; i++)
                {
                    hc += Convert.ToInt32(retorno[i].HC);
                }


                retorno[0].HC = hc +1 ;
                retorno_final.AddRange(retorno);           
                hc = 0;
            }

            return retorno;
        }


        public JsonResult RetornaEstrutura(int usuarioId, string nos)
        {

            try
            {

                var retTeste = dataInterface.BuscaEstrutura(usuarioId);

                if (retTeste != null)
                {
                    InsereExtrutura(usuarioId, nos);
                }

                foreach (var user in retorno_final)
                {
                    RetornaHC(user.usr_Id);

                    if (hc == 0)
                    {
                        hc = 1;
                    }
                    else
                    {
                        hc = hc + 1;
                    }

                    user.HC = hc;
                    hc = 0;
                }

                return base.Json(new { Result = retorno_final.ToList() }, 0);
            }
            catch (Exception ex)
            {
                return base.Json(new { Result = ex.Message }, 0);
            }

        }

        public JsonResult RetornaDetalhesUsuario(int idUsuario)
        {

            try
            {
                List<RetornaDetalhesUsuario> retorno = new List<RetornaDetalhesUsuario>();

                retorno = dataInterface.RetornaDetalhesUsuario(idUsuario);

                retorno.Distinct();

                return base.Json(new { Result = retorno.ToList() }, 0);
            }
            catch (Exception ex)
            {
                return base.Json(new { Result = ex.Message }, 0);
            }

        }



        public List<RetornaEstrutura> retorno_temp = new List<RetornaEstrutura>();
        public List<RetornaEstrutura> retorno_hc = new List<RetornaEstrutura>();
        public int hc = 0;
        public List<RetornaEstrutura> RetornaEstruturaHC(int userId)
        {
            var retorno = new List<RetornaEstrutura>();
            retorno = dataInterface.BuscaEstrutura(userId);


                if (retorno != null)
                {
                    
                    foreach (var user in retorno.ToList())
                    {
                        if (user.usr_Id != userId)
                        {
                            hc++;
                            retorno_temp.AddRange(RetornaEstruturaHC(user.usr_Id));
                        }
     
                    }
                }
                else
                {
                    retorno = new List<RetornaEstrutura>();

                }

   
            return retorno;
        }


        public void RetornaHC(int usuarioId)
        {

            try
            {

                var retTeste = dataInterface.BuscaEstrutura(usuarioId);

                if (retTeste != null)
                {
                    RetornaEstruturaHC(usuarioId);
                }


            }
            catch (Exception)
            {

            }

        }


    }
}