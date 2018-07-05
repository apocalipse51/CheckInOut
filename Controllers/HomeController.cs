using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using IndigoSoft.Reports.Fixa.DataBase.DataAccess;
using IndigoSoft.Reports.Fixa.DataBase.DataModel;
using Microsoft.Data.Edm.Expressions;
using Newtonsoft.Json;
using Google.Apis.Auth.OAuth2;
using System.IO;
using Google.Apis.Calendar.v3;
using System.Threading;
using Google.Apis.Util.Store;
using Google.Apis.Services;
using Google.Apis.Calendar.v3.Data;

namespace IndigoSoft.Reports.Fixa.Controllers
{
    public class HomeController : Controller
    {
        //
        // GET: /Home/
       
        private DataInterface dataInterface = new DataInterface();
        public ActionResult Index()
        {
           
            return View();
        }


        #region DashBoard
        public JsonResult TabelaRealTime(DateTime dtInicial, DateTime dtFinal)
        {
            List<DashBoardOnLine> list = this.dataInterface.BuscaControleLogin(dtInicial, dtFinal);
            var retorno = list.Select(x => new
            {
                x.con_Nome,
                x.fil_Descricao,
                x.lic_Id,
                x.lic_Qtde,
                x.Logdados,
                x.prd_Descricao
            });
            return base.Json(new { Result = retorno }, 0);
        }

        [HttpPost]
        public string DashBoardRealTime(DateTime dtInicial, DateTime dtFinal)
        {
            return JsonConvert.SerializeObject(this.dataInterface.BuscaControleLogin(dtInicial, dtFinal));
        }
        #endregion



    }
}
