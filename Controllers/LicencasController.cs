using System;
using System.Web.Http;
using IndigoSoft.Reports.Fixa.DataBase.DataAccess;
using IndigoSoft.Reports.Fixa.DataBase.DataModel;

namespace IndigoSoft.Reports.Fixa.Controllers
{
    public class LicencasController : ApiController
    {
        private DataInterface dataInterface = new DataInterface();
        public RetornoPermissao Get(string hostname, Guid licenca)
        {
            var retorno = dataInterface.BuscaLogado(hostname, licenca);
            return retorno;
        }


    }
}
