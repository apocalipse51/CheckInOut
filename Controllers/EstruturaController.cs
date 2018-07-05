using IndigoSoft.Reports.Fixa.DataBase.DataAccess;
using IndigoSoft.Reports.Fixa.DataBase.DataModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using Google.Apis.Calendar.v3;
using Google.Apis.Auth.OAuth2;
using System.IO;
using System.Threading;
using Google.Apis.Util.Store;
using Google.Apis.Calendar.v3.Data;
using Google.Apis.Services;
using Newtonsoft.Json;

namespace IndigoSoft.Reports.Fixa.Controllers
{
    public class EstruturaController : Controller
    {
        //
        // GET: /Estrutura/
        private DataInterface dataInterface = new DataInterface();

        public ActionResult Estrutura()
        {           
            return View();

        }

        public JsonResult AlterarEstrutura(string Nome, int fnc_id, int estr_id, int Aprova)
        {
            try
            {

                var user = dataInterface.BuscaUsuario().FirstOrDefault(x => x.usr_Nome == Nome);
                var user_estr = dataInterface.BuscaEstruturaFluxo().FirstOrDefault(x => x.estr_id == user.estr_id);
                var estr_user = dataInterface.BuscaUsuario().FirstOrDefault(x => x.usr_Id == estr_id);


                user.fnc_id = fnc_id;

                var retorno_u = dataInterface.MantemUsuario(user);

                user_estr.estr_Nome = estr_user.usr_Nome;
                user_estr.estrusr_id = estr_id;
                user_estr.estr_apr = Aprova;

                var retorno_e = dataInterface.CriaEstrutura(user_estr);

                return base.Json(new { Result = "Estrutura alterada com sucesso !" }, 0);

            }
            catch (Exception ex)
            {
                return base.Json(new { Result = ex.Message }, 0);
            }
        }


        public List<RetornaEstrutura> EstruturaR(List<RetornaEstrutura> retorna, List<RetornaEstrutura> retorno_final)
        {
            List<RetornaEstrutura> retorna_temp = new List<DataBase.DataModel.RetornaEstrutura>();

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
        public List<RetornaEstrutura> retorno_temp = new List<RetornaEstrutura>();
        public List<RetornaEstrutura> InsereExtrutura(int userId)
        {
            var retorno = new List<RetornaEstrutura>();
            retorno = dataInterface.BuscaEstrutura(userId);


                if (retorno != null)
                {
                    retorno_final.AddRange(retorno);
                    foreach (var user in retorno.ToList())
                    {
                        if (user.usr_Id != userId)
                        {
                            retorno_final.AddRange(InsereExtrutura(user.usr_Id));
                        }
                    }
                }
                else
                {
                    retorno = new List<RetornaEstrutura>();
                }

            return retorno;
        }


        public JsonResult FiltrarEstrutura(int usuarioId, int estruturaId)
        {

            var usuario = dataInterface.BuscaUsuario().FirstOrDefault(x => x.usr_Id == usuarioId);

            if (usuario.usr_VerEstruturas == 1 && estruturaId != 0)
            {
                usuarioId = estruturaId;
            }


            var retTeste = dataInterface.BuscaEstrutura(usuarioId);
            if (retTeste != null)
            {
                InsereExtrutura(usuarioId);
            }

            retorno_temp = retorno_final;

            foreach (var reg in retorno_temp.ToList())
            {

                if(reg.NomeEstr == "")
                {
                    retorno_final.Remove(reg);
                }

                 var target = this.dataInterface.RetornaTarget(Convert.ToInt32(reg.TargetTotal * 3600), reg.usr_Id);

                foreach (var t in target)
                {
                    reg.TargetAtual = t.target_atual;
                    reg.TargetTotal = t.target_total;
                }
        
            }

            return base.Json(new { Result = retorno_final.ToList().Distinct() }, 0);
        }

    }
}