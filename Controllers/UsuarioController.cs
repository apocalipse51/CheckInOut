using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Security;
using IndigoSoft.Reports.Fixa.DataBase;
using IndigoSoft.Reports.Fixa.DataBase.DataAccess;
using System.Web.Mvc;
using System.Web.UI.WebControls;
using IndigoSoft.Reports.Fixa.DataBase.DataModel;
using WebGrease.Css.Ast.Selectors;
using System.Text;
using System.IO;
using System.Threading;
using System.Drawing;

namespace IndigoSoft.Reports.Fixa.Controllers
{
    public class UsuarioController : Controller
    {
        private DataInterface dataInterface = new DataInterface();        

        public ActionResult Usuarios()
        {
            return View();
        }

        public JsonResult ListaUsuarios(string idUsuario)
        {
            List<Indigo_Usuario> listUsuarios = this.dataInterface.BuscaUsuario().Where(x => x.usr_Id.ToString() != idUsuario).ToList();
            var retorno = listUsuarios.Select(x => new {
                x.usr_Id,
                x.usr_Login,
                x.usr_Nome,
                x.Indigo_FuncaoUsuario.fnc_Nome,
                x.Indigo_EstruturaFluxo.estr_Nome,
                x.usr_Email,
                x.usr_Tel,
                x.Indigo_EstruturaFluxo.estr_apr,
                x.Indigo_FuncaoUsuario.fnc_Sigla,
                x.usr_VerEstruturas, x.usr_imagePerfil,
                x.usr_PermissaoPipe
            });

            return base.Json(new { Result = retorno }, 0);
        }

        public JsonResult ListaUsuario(string nome)
        {


            List<Indigo_Usuario> listUsuarios = this.dataInterface.BuscaUsuario().Where(x => x.usr_Nome == nome).ToList();
            var retorno = listUsuarios.Select(x => new { x.usr_Id, x.usr_Login, x.usr_Nome, x.Indigo_FuncaoUsuario.fnc_Nome, x.Indigo_EstruturaFluxo.estr_Nome, x.usr_Email, x.usr_Tel, x.Indigo_EstruturaFluxo.estr_apr, x.Indigo_FuncaoUsuario.fnc_Sigla, x.usr_imagePerfil, x.usr_PermissaoPipe });

            return base.Json(new { Result = retorno }, 0);
        }

        [HttpPost]
        public ActionResult MantemUsuario(string nome, string login, int funcao, string acessos, string email, int estrutura, string Tel, int Aprova, int visualizaEstr, string ImagemPerfil, int pipe, string perfil)
        {
            string path_img = "";
            try
            {
                if (ImagemPerfil != "")
                {
                    char[] dado = ImagemPerfil.ToCharArray();
                    string extensao = "";
                    for (int i = 0; i < dado.Length; i++)
                    {
                        if (dado[i] != ',')
                        {
                            extensao += dado[i];
                        }
                        else
                        {
                            break;
                        }
                    }
                    char[] dado_ex = extensao.ToArray();
                    string tipo = "";
                    for (int i = 0; i < dado_ex.Length; i++)
                    {
                        if (dado_ex[i] != '/')
                        {
                            tipo += dado_ex[i];
                        }
                        else
                        {
                            break;
                        }
                    }
                    ImagemPerfil = ImagemPerfil.Replace(extensao + ",", "");
                    byte[] imagebytes = Convert.FromBase64String(ImagemPerfil);
                    using (MemoryStream ms = new MemoryStream(imagebytes, 0, imagebytes.Length))
                    {
                        ms.Write(imagebytes, 0, imagebytes.Length);
                        System.Drawing.Image image = System.Drawing.Image.FromStream(ms, true);
                        path_img = "../Images/Perfil/" + login + "." + extensao.Replace(tipo + "/", "").Replace(";base64", "");
                        Bitmap bmp = new Bitmap(image);
                        bmp.Save(Server.MapPath(path_img));
                    }
                }
                var context = new Indigo_Controle_Licenca();
                var usuExiste = context.Indigo_Usuario.FirstOrDefault(x => x.usr_Login == login);
                bool existe = false;
                if (usuExiste != null)
                {
                    existe = true;
                }
                var user = new Indigo_Usuario
                {
                    usr_Login = login,
                    usr_Nome = nome,
                    usr_Email = email,
                    fnc_id = funcao,
                    usr_Tel = Tel,
                    estr_id = estrutura,
                    usr_VerEstruturas = visualizaEstr,
                    usr_imagePerfil = path_img,
                    usr_PermissaoPipe = pipe,
                    usr_Perfil = perfil
                };
                //Acessos -> need to be modified
                if (acessos == null)
                {
                    return base.Json(new { Result = "Selecione pelo menos um acesso para o usuário!" }, 0);
                }
                var listAcesso = acessos.Split(',');
                var usuEstr = context.Indigo_Usuario.FirstOrDefault(x => x.usr_Id == estrutura);
                if (estrutura == 0)
                {
                    return base.Json(new { Result = "Selecione o mesmo usuário caso ele não tenha estrutura!" }, 0);
                }
                if (estrutura == 0)
                {
                    estrutura = user.usr_Id;
                    usuEstr = context.Indigo_Usuario.FirstOrDefault(x => x.usr_Id == estrutura);
                }
                var estr = new Indigo_EstruturaFluxo();
                estr.estrusr_id = estrutura;
                estr.estr_Nome = usuEstr.usr_Nome;
                estr.estr_apr = Aprova;
                var retorno = dataInterface.MantemUsuario(user, listAcesso, estr);
                if (existe == false)
                {
                    NovoUsuario(user);
                }
                return base.Json(new { Result = retorno }, 0);
            }
            catch (Exception ex)
            {
                return base.Json(new { Result = ex.Message + "---" + ex.StackTrace + "---" + Server.MapPath(path_img) }, 0);
            }
        }

        public JsonResult BuscaTelas()
        {
            var idUser = Convert.ToInt32(Request.QueryString["id"]);
            Session["HORASPROJETO"] = false;
            //List<Indigo_Telas> telas = new List<Indigo_Telas>();
            var usuarioTelas = dataInterface.BuscaTelasUsuario(idUser).Select(x => x.Indigo_Telas);
            //Define telas
            var telas = usuarioTelas.Select(x => new { x.tel_Controller, x.tel_Descricao, x.tel_Icone, x.tel_Metodo, x.tel_Id });
            if (telas.FirstOrDefault(x => x.tel_Metodo == "HorasProjeto") != null)
            {
                Session["HORASPROJETO"] = true;
            }
            return base.Json(new { Result = telas }, JsonRequestBehavior.AllowGet);
        }

        public JsonResult BuscaTelasTodas()
        {
            //List<Indigo_Telas> telas = new List<Indigo_Telas>();
            var buscaTelas = dataInterface.BuscaTelas().Select(x => new { x.tel_Descricao, x.tel_Id });
            return base.Json(new { Result = buscaTelas }, 0);
        }

        public JsonResult ResetarSenhaUsuario(int idUsuario, string novaSenha)
        {
            var retorno = false;
            try
            {
                retorno = dataInterface.AlteraSenha(idUsuario, novaSenha);
                var context = new Indigo_Controle_Licenca();
                var usuario = context.Indigo_Usuario.FirstOrDefault(x => x.usr_Id == idUsuario);
                NovaSenha(usuario);
            }
            catch (Exception)
            {
                retorno = false;
            }
            return base.Json(new { Result = retorno }, 0);
        }

        public ActionResult Login()
        {
            //Log.Log.GeraLog("Retornando a Página");
            return base.View();
        }

        [HttpPost]
        public string Login(string login, string senha)
        {

            try
            {
                var user = dataInterface.LoginUsuario(login, senha);
                if (user != null)
                {
                    Session["IDUSUARIO"] = user.usr_Id;
                    Session["USUARIO"] = user.usr_Nome;
                    Session["IMGUSUARIO"] = user.usr_imagePerfil;
                    Session["PERFIL"] = user.usr_Perfil;
                    var usuarioTelas = dataInterface.BuscaTelasUsuario(user.usr_Id).Select(x => x.Indigo_Telas);
                    if (usuarioTelas.FirstOrDefault(x => x.tel_Metodo == "HorasProjeto") != null)
                    {
                        return base.Url.Action("HorasProjeto", "HorasProjeto");
                    }
                    else
                    {
                        return base.Url.Action("Index", "Home");
                    }
                }
                else
                {
                    return "Erro - Não encontrado na lista / perfil";
                }
            }
            catch (Exception e)
            {
                return "Erro - " + e.Message;

            }
        }

        public JsonResult BuscaFuncaoUsuario()
        {
            List<Indigo_FuncaoUsuario> list = this.dataInterface.BuscaFuncaoUsuario();
            var retorno = list.Select(x => new { x.fnc_id, x.fnc_Nome, x.fnc_valor });
            return base.Json(new { Result = retorno }, 0);
        }

        public ActionResult Logout()
        {
            Session["USUARIO"] = null;
            return base.RedirectToAction("Login");
        }

        public void NovaSenha(Indigo_Usuario user)
        {

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
                                    <p>" + user.usr_Nome + @", " + trataHora + @" !</p>
                                    <p>Sua senha para acessar à ferramenta check in/out foi resetada.</p>
                                    <p>Sua nova senha é <b>" + user.usr_Senha + @"</b>
                                    </div>
                                    <p>Segue o link da página.</ p>
                                    </br>
                                    </br>
                                    <a href = ""http://admin.indigosoft.biz/"">http://admin.indigosoft.biz/</a>
                                    </body>
                                    </html>");

            var email = EnviaEmail("checkinout@indigosoft.com.br", "indigo.2017", user.usr_Email, "Ferramenta Check in/out - Nova senha", pagina);

        }

        public void NovoUsuario(Indigo_Usuario usuario)
        {

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
                            <p>" + usuario.usr_Nome + @", " + trataHora + @" !</p>
                            <p>Segue o usuário e a senha para acessar à ferramenta check in/out.</p>
                            <p>Seu usuário é <b>" + usuario.usr_Login + @"</b> e sua senha para logar é <b>" + usuario.usr_Senha + @"</b>
                            </div>
                            <p>Segue o link da página.</ p>
                            </br>
                            </br>
                            <a href = ""http://admin.indigosoft.biz/"">http://admin.indigosoft.biz/</a>
                            </body>
                            </html>");

            var email = EnviaEmail("checkinout@indigosoft.com.br", "indigo.2017", usuario.usr_Email, "Ferramenta Check in/out - Dados de acesso", pagina);

        }

        private string EnviaEmail(string emailRem, string senhaRem, string emailDest, string assunto, StringBuilder corpo)
        {
            try
            {

                var service = new Microsoft.Exchange.WebServices.Data.ExchangeService(Microsoft.Exchange.WebServices.Data.ExchangeVersion.Exchange2013_SP1);
                service.Credentials = new Microsoft.Exchange.WebServices.Data.WebCredentials(emailRem, senhaRem);
                service.AutodiscoverUrl(emailRem);
                var email = new Microsoft.Exchange.WebServices.Data.EmailMessage(service);
                email.Subject = assunto;
                email.Body = corpo.ToString();
                email.ToRecipients.Add(emailDest);
                email.SendAndSaveCopy();

                return "E-mail enviado com sucesso !";

            }
            catch (Exception ex)
            {
                return "Ocorreu algum erro, " + ex;
            }

        }

    }
}
