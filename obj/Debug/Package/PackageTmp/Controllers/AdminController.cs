using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using IndigoSoft.Reports.Fixa.DataBase.DataAccess;
using IndigoSoft.Reports.Fixa.DataBase.DataModel;

namespace IndigoSoft.Reports.Fixa.Controllers
{
    public class AdminController : Controller
    {
        //
        // GET: /Admin/
        private DataInterface dataInterface = new DataInterface();
        #region Contratante
        public ActionResult Contratante()
        {
            return View();
        }

        public JsonResult ListaContratante()
        {
            List<Indigo_Contratante> listContratante = this.dataInterface.BuscaContratante().ToList();
            var retorno = listContratante.Select(x => new { x.con_Id, x.con_CNPJ, x.con_Email, x.con_Nome, x.con_Responsavel, x.con_Telefone, x.con_Sigla });
            return base.Json(new { Result = retorno }, 0);
        }

        public JsonResult MantemContratante(int id, string nome, string cnpj, string responsavel, string telefone, string email, string sigla)
        {
            var retorno = "";
            var contratante = new Indigo_Contratante
            {
                con_CNPJ = cnpj,
                con_Email = email,
                con_Id = id,
                con_Nome = nome,
                con_Telefone = telefone,
                con_Responsavel = responsavel,
                con_Sigla = sigla
            };
            retorno = this.dataInterface.MantemContratante(contratante);
            return base.Json(new { Result = retorno }, 0);
        }

        #endregion

        #region Filial
        public ActionResult Filial()
        {
            return View();
        }

        public JsonResult ListaFilial()
        {
            List<Indigo_Filial> listFilial = this.dataInterface.BuscaFilial().ToList();
            var retorno = listFilial.Select(x => new { x.fil_Id, x.fil_Descricao, x.fil_CNPJ, x.fil_Responsavel, x.fil_Telefone, x.fil_Email, x.Indigo_Contratante.con_Nome, x.Indigo_Contratante.con_Id });
            return base.Json(new { Result = retorno }, 0);
        }

        public JsonResult ListaFilialPorContratante(int contratante)
        {
            List<Indigo_Filial> listFilial = this.dataInterface.BuscaFilial().Where(x => x.fil_ConId == contratante).ToList();
            var retorno = listFilial.Select(x => new { x.fil_Id, x.fil_Descricao, x.fil_CNPJ, x.fil_Responsavel, x.fil_Telefone, x.fil_Email, x.Indigo_Contratante.con_Nome, x.Indigo_Contratante.con_Id });
            return base.Json(new { Result = retorno }, 0);
        }


        public JsonResult MantemFilial(int id, string descricao, string cnpj, string responsavel, string telefone, string email, int idContratante)
        {
            var retorno = "";
            var filial = new Indigo_Filial
            {
                fil_Telefone = telefone,
                fil_Descricao = descricao,
                fil_Responsavel = responsavel,
                fil_Email = email,
                fil_CNPJ = cnpj,
                fil_ConId = idContratante,
                fil_Id = id
            };
            retorno = this.dataInterface.MantemFilial(filial);
            return base.Json(new { Result = retorno }, 0);
        }

        #endregion

        #region Cliente Final
        public ActionResult ClienteFinal()
        {
            return View();
        }

        public JsonResult ListaClienteFinal()
        {
            List<Indigo_ClienteFinal> list = this.dataInterface.BuscaClienteFinal();
            var retorno = list.Select(x => new { x.clf_id, x.clf_Descricao, x.clf_Sigla });
            return base.Json(new { Result = retorno }, 0);
        }

        public JsonResult MantemClienteFinal(int id, string descricao, string sigla)
        {
            var retorno = "";
            var obj = new Indigo_ClienteFinal
            {
                clf_id = id,
                clf_Descricao = descricao,
                clf_Sigla = sigla
            };
            retorno = this.dataInterface.MantemClienteFinal(obj);
            return base.Json(new { Result = retorno }, 0);
        }

        public JsonResult AdicionarCliente(string nome, string sigla)
        {
            var retorno = "";

            var obj = new Indigo_ClienteFinal
            {
                clf_id = 0,
                clf_Descricao = nome,
                clf_Sigla = sigla
            };

            retorno = this.dataInterface.Addcliente(obj);

            return base.Json(new { Result = retorno }, 0);
        }

        #endregion

        #region Produto
        public ActionResult Produto()
        {
            return View();
        }

        public JsonResult ListaProduto()
        {
            List<Indigo_Produto> list = this.dataInterface.BuscaProduto();
            var retorno = list.Select(x => new { x.Indigo_ClienteFinal.clf_Descricao, x.Indigo_ClienteFinal.clf_id, x.prd_Descricao, x.prd_Id, x.prd_Sigla });
            return base.Json(new { Result = retorno }, 0);
        }


        public JsonResult BuscaProduto()
        {
            List<Indigo_Produto> list = this.dataInterface.BuscaProduto();
            var retorno = list.Select(x => new { x.prd_Id, x.prd_Descricao });
            return base.Json(new { Result = retorno }, 0);
        }

        public JsonResult ListaProdutoCliente(int clienteFinalId)
        {
            List<Indigo_Produto> list = this.dataInterface.BuscaProduto().Where(x => x.Indigo_ClienteFinal.clf_id == clienteFinalId && x.prd_ativo == 1).ToList();
            var retorno = list.Select(x => new { x.Indigo_ClienteFinal.clf_Descricao, x.Indigo_ClienteFinal.clf_id, x.prd_Descricao, x.prd_Id, x.prd_Sigla });
            return base.Json(new { Result = retorno }, 0);
        }

        public JsonResult MantemProduto(int id, int clienteFinalId, string descricao, string sigla)
        {
            var retorno = "";
            var obj = new Indigo_Produto
            {
                prd_Id = id,
                prd_Descricao = descricao,
                prd_ClfId = clienteFinalId,
                prd_Sigla = sigla,
                prd_ativo = 1
               
            };
            retorno = this.dataInterface.MantemProduto(obj);
            return base.Json(new { Result = retorno }, 0);
        }


        #endregion

        #region Projeto
        public ActionResult Projeto()
        {
            return View();
        }

        public JsonResult ListaProjeto()
        {
            List<Indigo_Projeto> list = this.dataInterface.BuscaProjeto();
            var retorno = list.Select(x => new
            {
                x.Indigo_Produto.prd_Id,
                x.Indigo_Produto.prd_Descricao,
                x.prj_Id,
                x.prj_Descricao,
                x.prj_IdControle,
                x.Indigo_Produto.Indigo_ClienteFinal.clf_Sigla,
                x.Indigo_Produto.prd_Sigla,
                x.Indigo_Usuario.usr_Nome
            });
            return base.Json(new { Result = retorno }, 0);
        }

        public JsonResult ListaProjetoPorProduto(int produtoId)
        {
            List<Indigo_Projeto> list = this.dataInterface.BuscaProjeto().Where(x => x.Indigo_Produto.prd_Id.ToString() == produtoId.ToString()).ToList();
            var retorno = list.Select(x => new { x.Indigo_Produto.prd_Id, x.Indigo_Produto.prd_Descricao, x.prj_Id, x.prj_Descricao, x.prj_IdControle });
            return base.Json(new { Result = retorno }, 0);
        }

        public JsonResult MantemProjeto(int id, int produtoId, string descricao, string idControle , int idusrResponsavel)
        {
            var retorno = "";
            var obj = new Indigo_Projeto
            {
                prj_Id = id,
                prj_IdControle = idControle,
                prj_Descricao = descricao,
                prj_PrdId = produtoId,
                prj_idusr = idusrResponsavel
            };
            retorno = this.dataInterface.MantemProjeto(obj);
            return base.Json(new { Result = retorno }, 0);
        }

        #endregion

        #region Licencas
        public ActionResult Licencas()
        {
            return View();
        }

        public JsonResult ListaLicencas()
        {
            List<Indigo_Licencas> list = this.dataInterface.BuscaLicencas();
            var retorno = list.Select(x => new
            {
                x.Indigo_Produto.prd_Descricao,
                x.Indigo_Filial.fil_Descricao,
                x.Indigo_Filial.Indigo_Contratante.con_Id,
                x.Indigo_Filial.Indigo_Contratante.con_Nome,
                x.lic_Id,
                x.lic_Qtde,
                x.lic_DataContratacao,
                x.lic_Contrato,
                x.lic_ValidadeLicenca
            });
            return base.Json(new { Result = retorno }, 0);
        }


        public JsonResult ListaLicencasPorFilial(int filialId)
        {
            List<Indigo_Licencas> list = this.dataInterface.BuscaLicencas().Where(x => x.lic_FilId == filialId).ToList();
            var retorno = list.Select(x => new
            {
                x.Indigo_Produto.prd_Descricao,
                x.Indigo_Filial.fil_Descricao,
                x.Indigo_Filial.Indigo_Contratante.con_Nome,
                x.lic_Id,
                x.lic_Qtde,
                x.lic_DataContratacao,
                x.lic_Contrato,
                x.lic_ValidadeLicenca
            });
            return base.Json(new { Result = retorno }, 0);
        }
        public JsonResult MantemLicencas(Guid id, int idProduto, int idFilial, int qtde, DateTime dataContratacao, string contrato, DateTime validadeLicenca)
        {
            var retorno = "";
            var obj = new Indigo_Licencas
            {
                lic_Id = id,
                lic_Qtde = qtde,
                lic_DataContratacao = dataContratacao,
                lic_Contrato = contrato,
                lic_FilId = idFilial,
                lic_PrdId = idProduto,
                lic_ValidadeLicenca = validadeLicenca
            };
            if (id == new Guid("00000000-0000-0000-0000-000000000000"))
            {
                obj.lic_Id = Guid.NewGuid();
            }
            retorno = this.dataInterface.MantemLicencas(obj);
            return base.Json(new { Result = retorno }, 0);
        }

        public JsonResult AlteraVencimento(Guid id, DateTime validadeLicenca)
        {
            var retorno = "";
            var obj = this.dataInterface.BuscaLicencas().FirstOrDefault(x => x.lic_Id == id);
            obj.lic_ValidadeLicenca = validadeLicenca;
            retorno = this.dataInterface.MantemLicencas(obj);
            return base.Json(new { Result = retorno }, 0);
        }


        #endregion

        #region NotaFiscal

        public ActionResult NotaFiscal()
        {
            return View();
        }

        public JsonResult ListaNotaFiscal()
        {
            List<Indigo_NotaFiscal> list = this.dataInterface.BuscaNotaFiscal();
            var retorno = list.Select(x => new
            {
                x.Indigo_Licencas.lic_Id,
                x.Indigo_Licencas.Indigo_Filial.fil_Descricao,
                x.Indigo_Licencas.Indigo_Filial.Indigo_Contratante.con_Nome,
                x.ntf_DataEmissao,
                x.ntf_NumeroNotaFiscal,
                x.ntf_Valor,
                x.ntf_id
            });
            return base.Json(new { Result = retorno }, 0);
        }

        public JsonResult MantemNotaFiscal(int id, string numeroNota, decimal valor, DateTime dataEmissao, Guid licencaId)
        {
            var retorno = "";
            var obj = new Indigo_NotaFiscal
            {
                ntf_id = id,
                ntf_NumeroNotaFiscal = numeroNota,
                ntf_Valor = valor,
                ntf_DataEmissao = dataEmissao,
                ntf_LicId = licencaId
            };

            retorno = this.dataInterface.MantemNotaFiscal(obj);
            return base.Json(new { Result = retorno }, 0);
        }

        #endregion

        #region Fase Projeto
        public JsonResult ListaFaseProjeto()
        {
            List<Indigo_FaseProjeto> list = this.dataInterface.BuscaFaseProjeto();
            var retorno = list.Select(x => new
            {
                x.fpo_Id,
                x.fpo_Descricao
            });
            return base.Json(new { Result = retorno }, 0);
        }

        public JsonResult ListaSubFaseProjeto(int faseId)
        {
            List<Indigo_SubfaseProjeto> list = this.dataInterface.BuscaSubfaseProjeto().Where(x=> x.sfp_fpoId== faseId).ToList();
            var retorno = list.Select(x => new
            {
                x.sfp_Id,
                x.sfp_Descricao
            });
            return base.Json(new { Result = retorno }, 0);
        }

        #endregion

        #region Calcula Id Projeto

        public JsonResult CalculaIdProjeto(int produtoId)
        {
            //yyyy(4) - mm(2) - CF(2 / 3) - EPS(2 / 3) - Prod(3) - DerPROD(3) - Sequencial(3)
            var projetos = this.dataInterface.BuscaProjeto().Count();

            var Id = "";
            var produto = this.dataInterface.BuscaProduto().OrderByDescending(y=> y.prd_Id).FirstOrDefault(x=> x.prd_Id == produtoId);
            Id = Id + DateTime.Now.Year + "-" + DateTime.Now.Month.ToString().PadLeft(2,'0')+ "-" + produto.Indigo_ClienteFinal.clf_Sigla + "-" + produto.prd_Sigla + "-" + (projetos + 1).ToString().PadLeft(3, '0');

            return base.Json(new { Result = Id }, 0);
        }
        #endregion

        public JsonResult BuscaResponsavel()
        {

            List<Indigo_Usuario> list = this.dataInterface.BuscaUsuario().Where(x => x.Indigo_FuncaoUsuario.fnc_id != 40).ToList();
            var retorno = list.Select(x => new { x.usr_Id, x.usr_Nome });
            return base.Json(new { Result = retorno }, 0);

        }
    }
}
