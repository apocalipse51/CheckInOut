using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.Entity.Migrations;
using System.Data.Entity.Validation;
using System.Linq;
using System.Linq.Expressions;
using System.Web.UI.WebControls;
using IndigoSoft.Reports.Fixa.DataBase.DataModel;
using WebGrease.Css.Extensions;
using System.Text;

namespace IndigoSoft.Reports.Fixa.DataBase.DataAccess
{
    public class DataInterface
    {

        #region Login Usuario

        public Indigo_Usuario LoginUsuario(string login, string senha)
        {
            try
            {
                var context = new Indigo_Controle_Licenca();
                return context.Indigo_Usuario.FirstOrDefault(x => x.usr_Login == login && x.usr_Senha == senha);
            }
            catch (Exception)
            {
                throw;
            }
        }

        public bool AlteraSenha(int idUser, string novaSenha)
        {
            try
            {
                var context = new Indigo_Controle_Licenca();
                var user = context.Indigo_Usuario.FirstOrDefault(x => x.usr_Id == idUser);
                user.usr_Senha = novaSenha;
                context.Indigo_Usuario.AddOrUpdate(user);
                context.SaveChanges();
           
            }
            catch (Exception)
            {
                return false;
            }
            return true;
        }

        public Indigo_Telas BuscaTelas(int idTela)
        {
            try
            {
                var context = new Indigo_Controle_Licenca();
                return context.Indigo_Telas.FirstOrDefault(x => x.tel_Id == idTela);
            }
            catch (Exception)
            {
                return null;
            }
        }


        public List<Indigo_TelasUsuario> BuscaTelasUsuario(int usuarioId)
        {
            try
            {
                var context = new Indigo_Controle_Licenca();
                return context.Indigo_TelasUsuario.Where(x => x.Indigo_Usuario.usr_Id == usuarioId).ToList();
            }
            catch (Exception)
            {
                return null;
            }
        }

        public List<Indigo_Telas> BuscaTelas()
        {
            try
            {
                var context = new Indigo_Controle_Licenca();
                return context.Indigo_Telas.ToList();
            }
            catch (Exception)
            {
                return null;
            }
        }

        #endregion

        #region Usuario

        public List<Indigo_Usuario> BuscaUsuario()
        {
            try
            {
                var context = new Indigo_Controle_Licenca();
                return context.Indigo_Usuario.ToList();
            }
            catch (Exception)
            {
                return null;
            }
        }

        public string IniciarAlmoco(int UserID, string operacao)
        {
            try
            {
                var context = new Indigo_Controle_Licenca();
                var retorno = context.STP_INICIO_ALMOCO(UserID, operacao);
                return "1";
            }
            catch (Exception ex)
            {
                return String.Format("Erro: {0}", ex.Message);
            }

        }

        public string MantemAcesso(List<Indigo_TelasUsuario> listTelaUsuario)
        {
            try
            {
                var context = new Indigo_Controle_Licenca();
                var usuario = listTelaUsuario[0].tuo_UsrId;
                var telas = context.Indigo_TelasUsuario.Where(x => x.tuo_UsrId == usuario).ToList();

                foreach (var tela in telas)
                {
                    context.Indigo_TelasUsuario.Remove(tela);
                    context.SaveChanges();
                }
                foreach (var telaUsu in listTelaUsuario)
                {
                    context.Indigo_TelasUsuario.AddOrUpdate(telaUsu);
                    context.SaveChanges();
                }
            }
            catch (Exception ex)
            {
                return "Erro: " + ex.Message;
            }
            return "Sucesso";
        }

        public string MantemUsuario(Indigo_Usuario usuario, string[] listTelaUsuario, Indigo_EstruturaFluxo estrutura)
        {
            var retorno = "";
            int estr_id = 0;
            Indigo_EstruturaFluxo estrExiste = new Indigo_EstruturaFluxo();

            try
           {

            var context = new Indigo_Controle_Licenca();
            var usuExiste = context.Indigo_Usuario.FirstOrDefault(x => x.usr_Login == usuario.usr_Login);
        
            if  (usuExiste != null)
                {


                    estrExiste = context.Indigo_EstruturaFluxo.FirstOrDefault(x => x.estr_id == usuExiste.estr_id && x.usr_id == usuExiste.usr_Id);
                    var usuExisteEstrNome = context.Indigo_Usuario.FirstOrDefault(x => x.usr_Id == estrutura.estrusr_id);

                    if (estrExiste != null)
                    {

                        estrExiste.estrusr_id = estrutura.estrusr_id;
                        estrExiste.usr_id = usuExiste.usr_Id;
                        estrExiste.estr_apr = estrutura.estr_apr;
                        estrExiste.estr_Nome = usuExisteEstrNome.usr_Nome;

                        context.Indigo_EstruturaFluxo.AddOrUpdate(estrExiste);
                        context.SaveChanges();
                        estr_id = estrExiste.estr_id;

                    }else
                    {

                        usuExisteEstrNome = context.Indigo_Usuario.FirstOrDefault(x => x.usr_Id == estrutura.estrusr_id);

                        estrutura.estrusr_id = estrutura.estrusr_id;
                        estrutura.usr_id = usuExiste.usr_Id;
                        estrutura.estr_apr = estrutura.estr_apr;
                        estrutura.estr_Nome = usuExisteEstrNome.usr_Nome;

                        context.Indigo_EstruturaFluxo.AddOrUpdate(estrutura);
                        context.SaveChanges();
                        estr_id = estrutura.estr_id;

                    }

                    if (usuario.usr_Senha != null)
                    {
                        usuExiste.usr_Senha = usuario.usr_Senha;

                    }

                    

                    usuExiste.usr_Login = usuario.usr_Login.TrimEnd();
                    usuExiste.usr_Nome = usuario.usr_Nome.TrimEnd();
                    usuExiste.usr_Email = usuario.usr_Email.TrimEnd();
                    usuExiste.usr_Tel = usuario.usr_Tel.TrimEnd();
                    usuExiste.fnc_id = usuario.fnc_id;
                    usuExiste.estr_id = estr_id;
                    usuExiste.usr_VerEstruturas = usuario.usr_VerEstruturas;
                    usuExiste.usr_imagePerfil = usuario.usr_imagePerfil;
                    usuExiste.usr_PermissaoPipe = usuario.usr_PermissaoPipe;

                    context.Indigo_Usuario.AddOrUpdate(usuExiste);
                    context.SaveChanges();

                    retorno = "Usuário alterado com Sucesso !";

                    var atualizaNomeUsuario = context.Indigo_EstruturaFluxo.Where(x => x.estrusr_id == usuExiste.usr_Id).ToList();

                    foreach (var reg in atualizaNomeUsuario)
                    {

                        var estrNomeA = new Indigo_EstruturaFluxo();
                        estrNomeA.estrusr_id = reg.estrusr_id;
                        estrNomeA.estr_Nome = usuario.usr_Nome;
                        estrNomeA.estr_id = reg.estr_id;
                        estrNomeA.usr_id = reg.usr_id;
                        estrNomeA.estr_apr = reg.estr_apr;
                        context.Indigo_EstruturaFluxo.AddOrUpdate(estrNomeA);
                        context.SaveChanges();


                    }

                }
                else
                {

                var usuExisteEstrNome = context.Indigo_Usuario.FirstOrDefault(x => x.usr_Id == estrutura.estrusr_id);

                estrutura.estrusr_id = estrutura.estrusr_id;
                estrutura.usr_id = usuario.usr_Id;
                estrutura.estr_apr = estrutura.estr_apr;
                estrutura.estr_Nome = usuExisteEstrNome.usr_Nome;

                context.Indigo_EstruturaFluxo.AddOrUpdate(estrutura);
                context.SaveChanges();
                estr_id = estrutura.estr_id;


                Random random = new Random();
                    var senha = random.Next(100, 1000);

                    usuario.usr_Senha = senha.ToString();
                    usuario.estr_id = estr_id;

                    context.Indigo_Usuario.AddOrUpdate(usuario);
                    context.SaveChanges();

                    estrutura.usr_id = usuario.usr_Id;

                    context.Indigo_EstruturaFluxo.AddOrUpdate(estrutura);
                    context.SaveChanges();

                    usuario.estr_id = estrutura.estr_id;

                    context.Indigo_Usuario.AddOrUpdate(usuario);

                    context.SaveChanges();

                    retorno = String.Format("Usuário criado com sucesso ! Enviado e-mail com as informações para acesso.", senha.ToString());

                }




            var usuarioNovo = context.Indigo_Usuario.FirstOrDefault(x => x.usr_Login == usuario.usr_Login);
                List<Indigo_TelasUsuario> listTelaUsuarioObj = new List<Indigo_TelasUsuario>();
                foreach (var tela in listTelaUsuario)
                {
                    var telausu = new Indigo_TelasUsuario
                    {
                        tuo_TelId = Convert.ToInt32(tela),
                        tuo_UsrId = usuarioNovo.usr_Id
                    };
                    listTelaUsuarioObj.Add(telausu);
                }
                MantemAcesso(listTelaUsuarioObj);
            }
            catch (Exception ex)
            {
                return String.Format("Erro: {0}", ex.Message);
            }
            return retorno;
        }

        public List<Indigo_FuncaoUsuario> BuscaFuncaoUsuario()
        {
            try
            {
                var context = new Indigo_Controle_Licenca();
                return context.Indigo_FuncaoUsuario.ToList();
            }
            catch (Exception)
            {
                return null;
            }
        }

        public List<Indigo_Licencas> BuscaLicenca()
        {
            try
            {
                var context = new Indigo_Controle_Licenca();
                return context.Indigo_Licencas.ToList();
            }
            catch (Exception)
            {
                return null;
            }
        }

        public List<Indigo_JustificaHorasProjeto> BuscaTipoJustificativa()
        {
            try
            {
                var context = new Indigo_Controle_Licenca();
                return context.Indigo_JustificaHorasProjeto.ToList();
            }
            catch (Exception)
            {
                return null;
            }
        }   
        #endregion

        #region Contratante

        public List<Indigo_Contratante> BuscaContratante()
        {
            try
            {
                var context = new Indigo_Controle_Licenca();
                return context.Indigo_Contratante.ToList();
            }
            catch (Exception)
            {
                return null;
            }
        }

        public string MantemContratante(Indigo_Contratante contratante)
        {
            try
            {
                var context = new Indigo_Controle_Licenca();
                context.Indigo_Contratante.AddOrUpdate(contratante);
                context.SaveChanges();
                return "Contratante salvo com sucesso!";
            }
            catch (Exception ex)
            {
                return String.Format("Erro ao salvar o contratante {0}", ex.Message);
            }
        }

        public string MantemConfigCusto(Indigo_ConfiguracaoControleCusto controlecusto)
        {
            try
            {
                var context = new Indigo_Controle_Licenca();
                context.Indigo_ConfiguracaoControleCusto.AddOrUpdate(controlecusto);
                context.SaveChanges();
                return "Configuração salva com sucesso!";
            }
            catch (Exception ex)
            {
                return String.Format("Erro ao salvar o configuração {0}", ex.Message);
            }
        }

        #endregion

        #region Filial

        public List<Indigo_Filial> BuscaFilial()
        {
            try
            {
                var context = new Indigo_Controle_Licenca();
                return context.Indigo_Filial.ToList();
            }
            catch (Exception)
            {
                return null;
            }
        }

        public List<Indigo_ConfiguracaoControleCusto> BuscaControleCusto()
        {
            try
            {
                var context = new Indigo_Controle_Licenca();
                return context.Indigo_ConfiguracaoControleCusto.ToList();
            }
            catch (Exception)
            {
                return null;
            }
        }

        public string MantemFilial(Indigo_Filial filial)
        {
            try
            {
                var context = new Indigo_Controle_Licenca();
                context.Indigo_Filial.AddOrUpdate(filial);
                context.SaveChanges();
                return "Filial salva com sucesso!";
            }
            catch (Exception ex)
            {
                return String.Format("Erro ao salvar a Filial {0}", ex.Message);
            }
        }
        #endregion

        #region Cliente Final

        public List<Indigo_ClienteFinal> BuscaClienteFinal()
        {
            try
            {
                var context = new Indigo_Controle_Licenca();
                return context.Indigo_ClienteFinal.ToList();
            }
            catch (Exception)
            {
                return null;
            }
        }

        public string Addcliente(Indigo_ClienteFinal obj)
        {
            try
            {
                var context = new Indigo_Controle_Licenca();
                context.Indigo_ClienteFinal.AddOrUpdate(obj);
                context.SaveChanges();
                return "sucesso";
            }
            catch (Exception ex)
            {
                return ex.Message +""+ex.StackTrace;
            }
        }

        public string MantemClienteFinal(Indigo_ClienteFinal clienteFinal)
        {
            try
            {
                var context = new Indigo_Controle_Licenca();
                context.Indigo_ClienteFinal.AddOrUpdate(clienteFinal);
                context.SaveChanges();
                return "Cliente final salvo com sucesso!";
            }
            catch (Exception ex)
            {
                return String.Format("Erro ao salvar o Cliente Final {0}", ex.Message);
            }
        }
        #endregion

        #region Produto

        public List<Indigo_Produto> BuscaProduto()
        {
            try
            {
                var context = new Indigo_Controle_Licenca();
                return context.Indigo_Produto.ToList();
            }
            catch (Exception)
            {
                return null;
            }
        }

        public string AddProduto(Indigo_Produto obj)
        {
            try
            {
                var context = new Indigo_Controle_Licenca();
                context.Indigo_Produto.AddOrUpdate(obj);
                return "sucesso";
            }
            catch (Exception)
            {
                return null;
            }
        }

        public string MantemProduto(Indigo_Produto produto)
        {
            try
            {
                var context = new Indigo_Controle_Licenca();
                context.Indigo_Produto.AddOrUpdate(produto);
                context.SaveChanges();
                return "Produto salvo com sucesso!";
            }
            catch (Exception ex)
            {
                return String.Format("Erro ao salvar o Produto {0}", ex.Message);
            }
        }

        public string MantemPipeline(Indigo_Pipeline pipeline, string id, string acao)
        {
            try
           {
                var context = new Indigo_Controle_Licenca();
                Indigo_Pipeline pipelineTemp = context.Indigo_Pipeline.FirstOrDefault(x => x.pip_Id == pipeline.pip_Id);
                Indigo_Produto pipelineTempProd = new Indigo_Produto();
                int id_prod = 0;

                if (pipelineTemp != null)
                {

                    pipelineTempProd = context.Indigo_Produto.FirstOrDefault(x => x.prd_ClfId == pipelineTemp.pipCl_Id && x.prd_Descricao == pipelineTemp.Indigo_Produto.prd_Descricao);

                    if (pipelineTempProd != null)
                    {

                        id_prod = pipelineTempProd.prd_Id;

                    }
                }

                if (pipelineTemp != null && acao == "importa")
                {

                    pipelineTemp.pip_Id = pipeline.pip_Id;
                    pipelineTemp.pip_Status = pipeline.pip_Status;
                    pipelineTemp.pip_Tipo = pipeline.pip_Tipo;
                    pipelineTemp.pip_PrevContrato = pipeline.pip_PrevContrato;
                    pipelineTemp.pip_ValorLicenca = pipeline.pip_ValorLicenca;
                    pipelineTemp.pip_QtLicenca = pipeline.pip_QtLicenca;
                    pipelineTemp.pip_TotalLicenca = pipeline.pip_TotalLicenca;
                    pipelineTemp.pip_Obs = pipeline.pip_Obs;
                    context.Indigo_Pipeline.AddOrUpdate(pipelineTemp);
                    context.SaveChanges();

                }
                else if (pipelineTemp != null && acao == "obs")
                {

                    pipelineTemp.pip_Obs = pipeline.pip_Obs;
                    context.Indigo_Pipeline.AddOrUpdate(pipelineTemp);
                    context.SaveChanges();

                }
                else if (pipelineTemp != null && acao == "status")
                {

                    pipelineTemp.pip_Status = pipeline.pip_Status;

                    if (pipeline.pip_Status == 1 && pipelineTemp.pip_Aguardando == null)
                    {
                        pipelineTemp.pip_Aguardando = DateTime.Now;
                    }
                    else if (pipeline.pip_Status == 2 && pipelineTemp.pip_Cancelado == null)
                    {
                        pipelineTemp.pip_Cancelado = DateTime.Now;
                    }
                    else if (pipeline.pip_Status == 3 && pipelineTemp.pip_Proposta == null)
                    {
                        pipelineTemp.pip_Proposta = DateTime.Now;
                    }
                    else if (pipeline.pip_Status == 4 && pipelineTemp.pip_Contrato == null)
                    {
                        pipelineTemp.pip_Contrato = DateTime.Now;
                    }
                    else if (pipeline.pip_Status == 5 && pipelineTemp.pip_Concluido == null)
                    {
                        pipelineTemp.pip_Concluido = DateTime.Now;
                    }

                    context.Indigo_Pipeline.AddOrUpdate(pipelineTemp);
                    context.SaveChanges();

                }
                else if (pipelineTemp != null && acao == "tipo")
                {

                    pipelineTemp.pip_Tipo = pipeline.pip_Tipo;
                    context.Indigo_Pipeline.AddOrUpdate(pipelineTemp);
                    context.SaveChanges();

                }
                else if (pipelineTemp != null && acao == "aceita")
                {
                    context.Indigo_Pipeline.AddOrUpdate(pipeline);
                    context.SaveChanges();

                } else if (pipelineTemp == null && acao == "salva")
                {
                    context.Indigo_Pipeline.AddOrUpdate(pipeline);
                    context.SaveChanges();
                }
                else if (pipelineTemp != null && acao == "envia")
                {
                    pipelineTemp.pip_Status = pipeline.pip_Status;
                    pipelineTemp.pip_userResp = pipeline.pip_userResp;
                    pipelineTemp.pip_Qtpas = pipeline.pip_Qtpas;

                    if (pipelineTemp.pip_DtAprovacao == null)
                    {
                        pipelineTemp.pip_DtAprovacao = pipeline.pip_DtAprovacao;
                    }

                    pipelineTemp.pip_Objetivo = pipeline.pip_Objetivo;

                    context.Indigo_Pipeline.AddOrUpdate(pipelineTemp);
                    context.SaveChanges();

                    

                    if (pipelineTempProd == null)
                    {

                        var obj_pd = new Indigo_Produto
                        {
                            prd_ClfId = pipelineTemp.pipCl_Id,
                            prd_Descricao = pipelineTemp.Indigo_Produto.prd_Descricao,
                            prd_ativo = 0

                        };

                        context.Indigo_Produto.AddOrUpdate(obj_pd);
                        context.SaveChanges();

                        id_prod = obj_pd.prd_Id;
                    }
                    

                   


                    var obj_pj = new Indigo_Projeto
                    {
                        prj_idusr = pipelineTemp.pip_userResp,
                        prj_Descricao = pipelineTemp.pippj_Desc,
                        prj_PrdId = id_prod,
                        prj_IdControle = id

                    };
         

                    context.Indigo_Projeto.AddOrUpdate(obj_pj);
                    context.SaveChanges();

                    pipelineTemp.pipprd_Id = id_prod;
                    context.Indigo_Pipeline.AddOrUpdate(pipelineTemp);
                    context.SaveChanges();
                }
                else if (pipelineTemp != null && acao == "inicia")
                {
                    pipeline.pip_Aceito = DateTime.Now;
                    context.Indigo_Pipeline.AddOrUpdate(pipeline);
                    context.SaveChanges();

                }


                return "sucesso";
            }
            catch (Exception ex)
            {
                return String.Format("Erro ao salvar o Produto {0}", ex.Message);
            }
        }

        #endregion

        #region Projeto

        public List<Indigo_HorasProjeto> BuscaHorasProjeto()
        {
            try
            {
                var context = new Indigo_Controle_Licenca();
                return context.Indigo_HorasProjeto.ToList();
            }
            catch
            {
                throw;
            }
        }

        public List<Indigo_Pipeline> BuscaPipeline()
        {
            try
            {
                var context = new Indigo_Controle_Licenca();
                return context.Indigo_Pipeline.ToList();
            }
            catch
            {
                throw;
            }
        }

        public List<Indigo_HorasProjetoAtalho> BuscaHorasProjetoAtalho()
        {
            try
            {
                var context = new Indigo_Controle_Licenca();
                return context.Indigo_HorasProjetoAtalho.ToList();
            }
            catch
            {
                throw;
            }
        }

        public List<Indigo_HorasNTrab> BuscaHorasNtrab()
        {
            try
            {
                var context = new Indigo_Controle_Licenca();
                return context.Indigo_HorasNTrab.ToList();
            }
            catch
            {
                throw;
            }
        }

        public string MantemHorasProjeto(Indigo_HorasProjeto horasProjeto)
        {
            try
            {
                var context = new Indigo_Controle_Licenca();
                context.Indigo_HorasProjeto.AddOrUpdate(horasProjeto);
                context.SaveChanges();

                return "Horas em projeto iniciada com sucesso!";
            }
            catch (Exception)
            {
                return null;
            }
        }


        public string MantemHorasNTrab(Indigo_HorasNTrab horasNTrab)
        {
            try
            {
                var context = new Indigo_Controle_Licenca();
                context.Indigo_HorasNTrab.AddOrUpdate(horasNTrab);
                context.SaveChanges();
                return "Horas em projeto iniciada com sucesso!";
            }
            catch (Exception)
            {
                return "";
            }
        }

        public string MantemHorasJustificativa(Indigo_JustificaHorasProjeto justificativa)
        {
            try
            {
                var context = new Indigo_Controle_Licenca();
                context.Indigo_JustificaHorasProjeto.AddOrUpdate(justificativa);

                context.SaveChanges();
                return "Horas em projeto iniciada com sucesso!";
            }
            catch (Exception)
            {
                return "";
            }
        }


        public void JustificativaUsuario(Indigo_JustificaHorasUsuario ObsUsuario)
        {
            try
            {
                var context = new Indigo_Controle_Licenca();
                context.Indigo_JustificaHorasUsuario.AddOrUpdate(ObsUsuario);
                context.SaveChanges();
            }
            catch (Exception) { }      
           
        }

        public List<RetornaTopProjeto> TopProjetos()
        {
            try
            {
                var context = new Indigo_Controle_Licenca();
                return context.STP_RETORNA_TOP_PROJETOS().ToList();
            }
            catch (Exception)
            {
                throw;
            }

        }

        public List<RetornaHC> RetornaHCProjeto(int idprojeto)
        {
            try
            {
                var context = new Indigo_Controle_Licenca();
                return context.STP_RETORNA_HC(idprojeto).ToList();
            }
            catch (Exception)
            {
                throw;
            }

        }

        public List<RetornaDetalhesUsuario> RetornaDetalhesUsuario(int usuarioid)
        {
            try
            {
                var context = new Indigo_Controle_Licenca();
                return context.STP_RETORNA_DETALHES_PROJETO_USUARIO(usuarioid).ToList();
            }
            catch (Exception)
            {
                throw;
            }

        }

        public string IniciaHoras(Indigo_HorasProjeto horasProjeto)
        {
            try
            {
               var context = new Indigo_Controle_Licenca();
               context.STP_INICIO_TAREFA(horasProjeto.hpo_prjId, horasProjeto.hpo_sfpId, horasProjeto.hpo_usrId, horasProjeto.hpo_DataHoraInicio, horasProjeto.hpo_DataHoraFim, horasProjeto.hpo_Observacao);

                return "Horas registradas com sucesso";
            }
            catch (Exception ex)
            {
                return String.Format(ex.Message +"\r\n" + ex.StackTrace);
            }
        }

        public string SalvaAtalho(Indigo_HorasProjetoAtalho horasProjeto)
        {
            try
            {
                var context = new Indigo_Controle_Licenca();
                context.Indigo_HorasProjetoAtalho.AddOrUpdate(horasProjeto);
                context.SaveChanges();

                return "Atalho registrado com sucesso";
            }
            catch (Exception ex)
            {
                return String.Format(ex.Message + "\r\n" + ex.StackTrace);
            }
        }

        public List<RetornoEstruturaJustifica> IniciaHorasJust(Indigo_HorasProjeto horasProjeto, int justifica)
        {
            try
            {
                var context = new Indigo_Controle_Licenca();
                return context.STP_INICIO_TAREFA_JUST(horasProjeto.hpo_prjId, horasProjeto.hpo_sfpId, horasProjeto.hpo_usrId, horasProjeto.hpo_DataHoraInicio, horasProjeto.hpo_DataHoraFim, horasProjeto.hpo_Observacao, horasProjeto.hpo_jtfAprovado, justifica).ToList();
            }
            catch (Exception)
            {
                return null;
            }
        }

        public List<ListaJustifica> RetornaListaJustifica(int usuarioId, DateTime DataInicio, DateTime DataFim)
        {
            try
            {
                var context = new Indigo_Controle_Licenca();
                return context.STP_LISTA_JUSTIFICATIVA(DataInicio, DataFim, usuarioId).ToList();
            }
            catch (Exception)
            {
                throw;
            }
        }

        public List<RetornaProjetoFiltro> RetornaFiltroProjeto(int mes, int ano, int idusuario, int idprojeto)
        {
            try
            {
                var context = new Indigo_Controle_Licenca();
                return context.STP_FILTRO_PROJETOS(mes, ano, idusuario, idprojeto).ToList();
            }
            catch (Exception)
            {
                throw;
            }
        }


        public void JustData(int hpo_id, int aprova)
        {
            try
            {
                var context = new Indigo_Controle_Licenca();
                context.STP_JUSTIFICA_ATIVIDADE(hpo_id,aprova);
            }
            catch (Exception)
            {
                throw;
            }
        }

        public List<Indigo_FaseProjeto> BuscaFaseProjeto()
        {
            try
            {
                var context = new Indigo_Controle_Licenca();
                return context.Indigo_FaseProjeto.ToList();
            }
            catch (Exception)
            {
                return null;
            }
        }

        public List<Indigo_EstruturaFluxo> BuscaEstruturaFluxo()
        {
            try
            {
                var context = new Indigo_Controle_Licenca();
                return context.Indigo_EstruturaFluxo.ToList();
            }
            catch (Exception)
            {
                return null;
            }

        }

        public List<Indigo_JustificaHorasUsuario> BuscaJustificaHorasUsuario()
        {
            try
            {
                var context = new Indigo_Controle_Licenca();
                return context.Indigo_JustificaHorasUsuario.ToList();
            }
            catch (Exception)
            {
                return null;
            }

        }


        public List<Indigo_SubfaseProjeto> BuscaSubfaseProjeto()
        {
            try
            {
                var context = new Indigo_Controle_Licenca();
                return context.Indigo_SubfaseProjeto.ToList();
            }
            catch (Exception)
            {
                return null;
            }
        }


        public List<Indigo_Projeto> BuscaProjeto()
        {
            try
            {
                var context = new Indigo_Controle_Licenca();
                return context.Indigo_Projeto.ToList();
            }
            catch (Exception)
            {
                return null;
            }
        }


        public List<Indigo_ConfigCalendario> BuscaCalendario()
        {
            try
            {
                var context = new Indigo_Controle_Licenca();
                return context.Indigo_ConfigCalendario.ToList();
            }
            catch (Exception)
            {
                return null;
            }
        }


        public string MantemProjeto(Indigo_Projeto projeto)
        {
            try
            {
                var context = new Indigo_Controle_Licenca();
                context.Indigo_Projeto.AddOrUpdate(projeto);
                context.SaveChanges();
                return "Projeto salvo com sucesso!";
            }
            catch (Exception ex)
            {
                return String.Format("Erro ao salvar o Projeto {0}", ex.Message);
            }
        }

        public string CriaEstrutura(Indigo_EstruturaFluxo estrutura)
        {
            try
            {
                var context = new Indigo_Controle_Licenca();
                context.Indigo_EstruturaFluxo.AddOrUpdate(estrutura);
                context.SaveChanges();
                return "Estrutura salva com sucesso!";
            }
            catch (Exception ex)
            {
                return String.Format("Erro ao salvar o Projeto {0}", ex.Message);
            }
        }

        public string MantemUsuario(Indigo_Usuario usuario)
        {
            var retorno = "";
            Indigo_EstruturaFluxo estrExiste = new Indigo_EstruturaFluxo();

            try
            {

                var context = new Indigo_Controle_Licenca();
                var usuExiste = context.Indigo_Usuario.FirstOrDefault(x => x.usr_Login == usuario.usr_Login);

                if (usuExiste != null)
                {
              

                    if (usuario.usr_Senha != null)
                    {
                        usuExiste.usr_Senha = usuario.usr_Senha;

                    }

                    usuExiste.usr_Login = usuario.usr_Login.TrimEnd();
                    usuExiste.usr_Nome = usuario.usr_Nome.TrimEnd();
                    usuExiste.usr_Email = usuario.usr_Email.TrimEnd();
                    usuExiste.usr_Tel = usuario.usr_Tel.TrimEnd();
                    usuExiste.fnc_id = usuario.fnc_id;
                    usuExiste.usr_imagePerfil = usuario.usr_imagePerfil;

                    context.Indigo_Usuario.AddOrUpdate(usuExiste);
                    context.SaveChanges();

                    var atualizaNomeUsuario = context.Indigo_EstruturaFluxo.Where(x => x.estrusr_id == usuExiste.usr_Id).ToList();

                    foreach (var reg in atualizaNomeUsuario)
                    {

                        var estrNomeA = new Indigo_EstruturaFluxo();
                        estrNomeA.estrusr_id = reg.estrusr_id;
                        estrNomeA.estr_Nome = usuario.usr_Nome;
                        estrNomeA.estr_id = reg.estr_id;
                        estrNomeA.usr_id = reg.usr_id;
                        estrNomeA.estr_apr = reg.estr_apr;
                        context.Indigo_EstruturaFluxo.AddOrUpdate(estrNomeA);
                        context.SaveChanges();


                    }


                    retorno = "Usuário alterado com Sucesso !";

                }

            }
            catch (Exception ex)
            {
                return String.Format("Erro: {0}", ex.Message);
            }

            return retorno;
        }

        #endregion

        #region Licencas

        public List<Indigo_Licencas> BuscaLicencas()
        {
            try
            {
                var context = new Indigo_Controle_Licenca();
                return context.Indigo_Licencas.ToList();
            }
            catch (Exception)
            {
                return null;
            }
        }

        public string MantemLicencas(Indigo_Licencas licencas)
        {
            try
            {
                var context = new Indigo_Controle_Licenca();
                context.Indigo_Licencas.AddOrUpdate(licencas);
                context.SaveChanges();
                return "Nova licenca salva com sucesso!";
            }
            catch (Exception ex)
            {
                return String.Format("Erro ao salvar o licenca {0}", ex.Message);
            }
        }
        #endregion

        #region Licencas

        public List<Indigo_NotaFiscal> BuscaNotaFiscal()
        {
            try
            {
                var context = new Indigo_Controle_Licenca();
                return context.Indigo_NotaFiscal.ToList();
            }
            catch (Exception)
            {
                return null;
            }
        }

        public string MantemNotaFiscal(Indigo_NotaFiscal licencas)
        {
            try
            {
                var context = new Indigo_Controle_Licenca();
                context.Indigo_NotaFiscal.AddOrUpdate(licencas);
                context.SaveChanges();
                return "Nova nota fiscal salva com sucesso!";
            }
            catch (Exception ex)
            {
                return String.Format("Erro ao salvar a nota fiscal {0}", ex.Message);
            }
        }
        #endregion

        #region DashBoard

        public List<DashBoardOnLine> BuscaControleLogin(DateTime dtInicial, DateTime dtFinal)
        {
            try
            {
                var context = new Indigo_Controle_Licenca();
                return
                    context.STP_BUSCA_LOGADOS_ONLINE(dtInicial, dtFinal).ToList();
            }
            catch (Exception ex)
            {
                var teste = ex.Message;
                return null;
            }
        }

        public List<ReportHorasCompleto> BuscaReportHoras(DateTime dtInicial, DateTime dtFinal)
        {
            try
            {
                var context = new Indigo_Controle_Licenca();
                return
                    context.STP_BUSCA_RELATORIO_HORAS_COMPLETO(dtInicial, dtFinal).ToList();
            }
            catch (Exception)
            {
                return null;
            }
        }

        public List<ExportarPipeline> ExportarPipeline()
        {
            try
            {
                var context = new Indigo_Controle_Licenca();
                return context.STP_EXPORTAR_PIPELINE().ToList();
            }
            catch (Exception)
            {
                return null;
            }
        }

        public List<RetornoLogBase> BuscaReportlog(DateTime dtInicial, DateTime dtFinal)
        {
            try
            {
                var context = new Indigo_Controle_Licenca();
                return
                    context.STP_BUSCA_RELATORIO_LOG_BASE(dtInicial, dtFinal).ToList();
            }
            catch (Exception)
            {
                return null;
            }
        }

        public List<RetornoControleCusto> BuscaReportControleCusto(DateTime dtInicial, DateTime dtFinal)
        {
            try
            {
                var context = new Indigo_Controle_Licenca();
                return
                    context.STP_BUSCA_RELATORIO_CONTROLE_CUSTOS(dtInicial, dtFinal).ToList();
            }
            catch (Exception)
            {
                return null;
            }
        }

        public List<ReportHorasCompacto> BuscaReportHorasCompacto(DateTime dtInicial, DateTime dtFinal,int projetoId)
        {
            try
            {
                var context = new Indigo_Controle_Licenca();
                return
                    context.STP_RELATORIO_HORAS_COMPACTO(dtInicial, dtFinal, projetoId).ToList();
            }
            catch (Exception)
            {
                return null;
            }
        }

        public List<ReportHorasTimeLine> BuscaReportHorasTimeLine(DateTime dtInicial, DateTime dtFinal, int projetoId)
        {
            try
            {
                var context = new Indigo_Controle_Licenca();
                return
                    context.STP_RELATORIO_HORAS_COMPACTO_TIMELINE(dtInicial, dtFinal, projetoId).ToList();
            }
            catch (Exception)
            {
                return null;
            }
        }

        public RetornoPermissao BuscaLogado(string hostname, Guid licenca)
        {
            try
            {
                var context = new Indigo_Controle_Licenca();
                var ret = 
                    context.STP_CONTROLE_HORAS(hostname, licenca);
                return ret.FirstOrDefault();
            }
            catch (Exception)
            {
                return new RetornoPermissao();
            }
        }
        #endregion

        public List<RetornaEstrutura> BuscaEstrutura(int idusuario)
        {
            try
            {
                var context = new Indigo_Controle_Licenca();
                return context.STP_RETORNA_ESTRUTURA(idusuario).ToList();
            }
            catch (Exception)
            {
                return null;
            }
        }

        public List<RetornoTargetUsuario> RetornaTarget(int target, int id)
        {
            try
            {
                var context = new Indigo_Controle_Licenca();
                return context.STP_RETORNA_TARGET(target, id).ToList();
            }
            catch (Exception)
            {
                return null;
            }
        }

        public void ConfigCalendario(Indigo_ConfigCalendario calendario)
        {
            try
            {
                var context = new Indigo_Controle_Licenca();
                context.Indigo_ConfigCalendario.AddOrUpdate(calendario);
                context.SaveChanges();

            }
            catch (Exception) { }
        }


        public void Calendario(Indigo_Calendario calendario)
        {
            try
            {
                var context = new Indigo_Controle_Licenca();
                context.Indigo_Calendario.AddOrUpdate(calendario);
                context.SaveChanges();

            }
            catch (Exception) { }
        }


    }
}
