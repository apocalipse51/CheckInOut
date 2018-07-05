using IndigoSoft.Reports.Fixa.DataBase.DataAccess;
using IndigoSoft.Reports.Fixa.DataBase.DataModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace IndigoSoft.Reports.Fixa.Controllers
{
    public class ControleCustosController : Controller
    {
        //
        // GET: /ControleCustos/

        private DataInterface dataInterface = new DataInterface();


        public ActionResult ConfigControleCustos()
        {
            return View();
        }

        public JsonResult ListaConfiguracaoCustos()
        {
            List<Indigo_ConfiguracaoControleCusto> listCustos = this.dataInterface.BuscaControleCusto().ToList();
            var retorno = listCustos.Select(x => new { x.ico_Id, x.ico_LicId, x.ico_Servidor, x.ico_BaseDados, x.ico_Usuario, x.ico_Senha, x.ico_View, x.ico_CampoData, x.ico_CampoIdOperador, x.ico_CampoNomeOperador, x.ico_Ativo });
            return base.Json(new { Result = retorno }, 0);
        }

        public JsonResult ConfiguracaoCustos(int id, string licenca, string servidor, string based, string usuario, string senha, string viewcontrole,string data, string idoperador, string nome,int filtradata, int ativo)
            {
                var retorno = "";
                Guid Licenca = new Guid(licenca);

                bool ATIVO = false;
                bool FILTRA = false;

                if (ativo == 1)
                {
                    ATIVO = true;
                }
                else
                {
                    ATIVO = false;
                }

                if (filtradata == 1)
                {
                    FILTRA = true;
                }
                else
                {
                    FILTRA = false;
                }

                var obj = new Indigo_ConfiguracaoControleCusto
                {
                    ico_Id = id,
                    ico_LicId = Licenca,
                    ico_Servidor = servidor,
                    ico_BaseDados = based,
                    ico_Usuario = usuario,
                    ico_Senha = senha,
                    ico_View = viewcontrole,
                    ico_CampoData = data,
                    ico_FiltraData = FILTRA,
                    ico_CampoIdOperador = idoperador,
                    ico_CampoNomeOperador = nome,
                    ico_Ativo = ATIVO
                };

                retorno = this.dataInterface.MantemConfigCusto(obj);

                return base.Json(new { Result = retorno }, 0);

        }

        public JsonResult BuscaContratos()
        {
            List<Indigo_Licencas> listLicenca= this.dataInterface.BuscaLicenca().ToList();
            var retorno = listLicenca.Select(x => new { x.lic_Id, x.lic_Contrato});
            return base.Json(new { Result = retorno }, 0);
        }

    }
}
