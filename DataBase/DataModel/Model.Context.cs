﻿//------------------------------------------------------------------------------
// <auto-generated>
//    O código foi gerado a partir de um modelo.
//
//    Alterações manuais neste arquivo podem provocar comportamento inesperado no aplicativo.
//    Alterações manuais neste arquivo serão substituídas se o código for gerado novamente.
// </auto-generated>
//------------------------------------------------------------------------------

namespace IndigoSoft.Reports.Fixa.DataBase.DataModel
{
    using System;
    using System.Data.Entity;
    using System.Data.Entity.Infrastructure;
    using System.Data.Objects;
    using System.Data.Objects.DataClasses;
    using System.Linq;
    
    public partial class Indigo_Controle_Licenca : DbContext
    {
        public Indigo_Controle_Licenca()
            : base("name=Indigo_Controle_Licenca")
        {
        }
    
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            throw new UnintentionalCodeFirstException();
        }
    
        public DbSet<Indigo_ClienteFinal> Indigo_ClienteFinal { get; set; }
        public DbSet<Indigo_Contratante> Indigo_Contratante { get; set; }
        public DbSet<Indigo_ControleLogin> Indigo_ControleLogin { get; set; }
        public DbSet<Indigo_FaseProjeto> Indigo_FaseProjeto { get; set; }
        public DbSet<Indigo_Filial> Indigo_Filial { get; set; }
        public DbSet<Indigo_HorasProjeto> Indigo_HorasProjeto { get; set; }
        public DbSet<Indigo_Licencas> Indigo_Licencas { get; set; }
        public DbSet<Indigo_NotaFiscal> Indigo_NotaFiscal { get; set; }
        public DbSet<Indigo_Produto> Indigo_Produto { get; set; }
        public DbSet<Indigo_Projeto> Indigo_Projeto { get; set; }
        public DbSet<Indigo_SubfaseProjeto> Indigo_SubfaseProjeto { get; set; }
        public DbSet<Indigo_Telas> Indigo_Telas { get; set; }
        public DbSet<Indigo_TelasUsuario> Indigo_TelasUsuario { get; set; }
        public DbSet<Indigo_Usuario> Indigo_Usuario { get; set; }
        public DbSet<Indigo_JustificaHorasProjeto> Indigo_JustificaHorasProjeto { get; set; }
        public DbSet<Indigo_JustificaHorasUsuario> Indigo_JustificaHorasUsuario { get; set; }
        public DbSet<Indigo_EstruturaFluxo> Indigo_EstruturaFluxo { get; set; }
        public DbSet<Indigo_FuncaoUsuario> Indigo_FuncaoUsuario { get; set; }
        public DbSet<Indigo_HorasNTrab> Indigo_HorasNTrab { get; set; }
        public DbSet<Indigo_ConfigCalendario> Indigo_ConfigCalendario { get; set; }
        public DbSet<Indigo_Calendario> Indigo_Calendario { get; set; }
        public DbSet<Indigo_UtilizacaoPa> Indigo_UtilizacaoPa { get; set; }
        public DbSet<Indigo_HorasProjetoAtalho> Indigo_HorasProjetoAtalho { get; set; }
        public DbSet<Indigo_ConfiguracaoControleCusto> Indigo_ConfiguracaoControleCusto { get; set; }
        public DbSet<Indigo_Pipeline> Indigo_Pipeline { get; set; }
        public DbSet<Indigo_ControleCusto> Indigo_ControleCusto { get; set; }
        public DbSet<Indigo_LogControleCusto> Indigo_LogControleCusto { get; set; }
        public DbSet<sysdiagram> sysdiagrams { get; set; }
    
        public virtual ObjectResult<DashBoardOnLine> STP_BUSCA_LOGADOS_ONLINE(Nullable<System.DateTime> dtInicial, Nullable<System.DateTime> dtFinal)
        {
            var dtInicialParameter = dtInicial.HasValue ?
                new ObjectParameter("dtInicial", dtInicial) :
                new ObjectParameter("dtInicial", typeof(System.DateTime));
    
            var dtFinalParameter = dtFinal.HasValue ?
                new ObjectParameter("dtFinal", dtFinal) :
                new ObjectParameter("dtFinal", typeof(System.DateTime));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction<DashBoardOnLine>("STP_BUSCA_LOGADOS_ONLINE", dtInicialParameter, dtFinalParameter);
        }
    
        public virtual ObjectResult<ReportHorasCompleto> STP_BUSCA_RELATORIO_HORAS_COMPLETO(Nullable<System.DateTime> dtInicio, Nullable<System.DateTime> dtFim)
        {
            var dtInicioParameter = dtInicio.HasValue ?
                new ObjectParameter("dtInicio", dtInicio) :
                new ObjectParameter("dtInicio", typeof(System.DateTime));
    
            var dtFimParameter = dtFim.HasValue ?
                new ObjectParameter("dtFim", dtFim) :
                new ObjectParameter("dtFim", typeof(System.DateTime));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction<ReportHorasCompleto>("STP_BUSCA_RELATORIO_HORAS_COMPLETO", dtInicioParameter, dtFimParameter);
        }
    
        public virtual ObjectResult<ReportHorasCompacto> STP_RELATORIO_HORAS_COMPACTO(Nullable<System.DateTime> dtInicio, Nullable<System.DateTime> dtFim, Nullable<int> projetoId)
        {
            var dtInicioParameter = dtInicio.HasValue ?
                new ObjectParameter("dtInicio", dtInicio) :
                new ObjectParameter("dtInicio", typeof(System.DateTime));
    
            var dtFimParameter = dtFim.HasValue ?
                new ObjectParameter("dtFim", dtFim) :
                new ObjectParameter("dtFim", typeof(System.DateTime));
    
            var projetoIdParameter = projetoId.HasValue ?
                new ObjectParameter("projetoId", projetoId) :
                new ObjectParameter("projetoId", typeof(int));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction<ReportHorasCompacto>("STP_RELATORIO_HORAS_COMPACTO", dtInicioParameter, dtFimParameter, projetoIdParameter);
        }
    
        public virtual ObjectResult<ReportHorasTimeLine> STP_RELATORIO_HORAS_COMPACTO_TIMELINE(Nullable<System.DateTime> dtInicio, Nullable<System.DateTime> dtFim, Nullable<int> projetoId)
        {
            var dtInicioParameter = dtInicio.HasValue ?
                new ObjectParameter("dtInicio", dtInicio) :
                new ObjectParameter("dtInicio", typeof(System.DateTime));
    
            var dtFimParameter = dtFim.HasValue ?
                new ObjectParameter("dtFim", dtFim) :
                new ObjectParameter("dtFim", typeof(System.DateTime));
    
            var projetoIdParameter = projetoId.HasValue ?
                new ObjectParameter("projetoId", projetoId) :
                new ObjectParameter("projetoId", typeof(int));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction<ReportHorasTimeLine>("STP_RELATORIO_HORAS_COMPACTO_TIMELINE", dtInicioParameter, dtFimParameter, projetoIdParameter);
        }
    
        public virtual ObjectResult<RetornoPermissao> STP_CONTROLE_HORAS(string hostName, Nullable<System.Guid> licenca)
        {
            var hostNameParameter = hostName != null ?
                new ObjectParameter("HostName", hostName) :
                new ObjectParameter("HostName", typeof(string));
    
            var licencaParameter = licenca.HasValue ?
                new ObjectParameter("Licenca", licenca) :
                new ObjectParameter("Licenca", typeof(System.Guid));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction<RetornoPermissao>("STP_CONTROLE_HORAS", hostNameParameter, licencaParameter);
        }
    
        public virtual ObjectResult<string> STP_INICIO_ALMOCO(Nullable<int> uSUARIOID, string oPERACAO)
        {
            var uSUARIOIDParameter = uSUARIOID.HasValue ?
                new ObjectParameter("USUARIOID", uSUARIOID) :
                new ObjectParameter("USUARIOID", typeof(int));
    
            var oPERACAOParameter = oPERACAO != null ?
                new ObjectParameter("OPERACAO", oPERACAO) :
                new ObjectParameter("OPERACAO", typeof(string));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction<string>("STP_INICIO_ALMOCO", uSUARIOIDParameter, oPERACAOParameter);
        }
    
        public virtual int STP_INICIO_TAREFA(Nullable<int> projetoId, Nullable<int> subFaseProjetoId, Nullable<int> usuarioId, Nullable<System.DateTime> dataInicio, Nullable<System.DateTime> dataFim, string obs)
        {
            var projetoIdParameter = projetoId.HasValue ?
                new ObjectParameter("projetoId", projetoId) :
                new ObjectParameter("projetoId", typeof(int));
    
            var subFaseProjetoIdParameter = subFaseProjetoId.HasValue ?
                new ObjectParameter("subFaseProjetoId", subFaseProjetoId) :
                new ObjectParameter("subFaseProjetoId", typeof(int));
    
            var usuarioIdParameter = usuarioId.HasValue ?
                new ObjectParameter("usuarioId", usuarioId) :
                new ObjectParameter("usuarioId", typeof(int));
    
            var dataInicioParameter = dataInicio.HasValue ?
                new ObjectParameter("dataInicio", dataInicio) :
                new ObjectParameter("dataInicio", typeof(System.DateTime));
    
            var dataFimParameter = dataFim.HasValue ?
                new ObjectParameter("dataFim", dataFim) :
                new ObjectParameter("dataFim", typeof(System.DateTime));
    
            var obsParameter = obs != null ?
                new ObjectParameter("obs", obs) :
                new ObjectParameter("obs", typeof(string));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction("STP_INICIO_TAREFA", projetoIdParameter, subFaseProjetoIdParameter, usuarioIdParameter, dataInicioParameter, dataFimParameter, obsParameter);
        }
    
        public virtual int STP_JUSTIFICA_ATIVIDADE(Nullable<int> hpoid, Nullable<int> aprova)
        {
            var hpoidParameter = hpoid.HasValue ?
                new ObjectParameter("hpoid", hpoid) :
                new ObjectParameter("hpoid", typeof(int));
    
            var aprovaParameter = aprova.HasValue ?
                new ObjectParameter("aprova", aprova) :
                new ObjectParameter("aprova", typeof(int));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction("STP_JUSTIFICA_ATIVIDADE", hpoidParameter, aprovaParameter);
        }
    
        public virtual ObjectResult<RetornoEstruturaJustifica> STP_INICIO_TAREFA_JUST(Nullable<int> projetoId, Nullable<int> subFaseProjetoId, Nullable<int> usuarioId, Nullable<System.DateTime> dataInicio, Nullable<System.DateTime> dataFim, string obs, Nullable<int> aprova, Nullable<int> justifica)
        {
            var projetoIdParameter = projetoId.HasValue ?
                new ObjectParameter("projetoId", projetoId) :
                new ObjectParameter("projetoId", typeof(int));
    
            var subFaseProjetoIdParameter = subFaseProjetoId.HasValue ?
                new ObjectParameter("subFaseProjetoId", subFaseProjetoId) :
                new ObjectParameter("subFaseProjetoId", typeof(int));
    
            var usuarioIdParameter = usuarioId.HasValue ?
                new ObjectParameter("usuarioId", usuarioId) :
                new ObjectParameter("usuarioId", typeof(int));
    
            var dataInicioParameter = dataInicio.HasValue ?
                new ObjectParameter("dataInicio", dataInicio) :
                new ObjectParameter("dataInicio", typeof(System.DateTime));
    
            var dataFimParameter = dataFim.HasValue ?
                new ObjectParameter("dataFim", dataFim) :
                new ObjectParameter("dataFim", typeof(System.DateTime));
    
            var obsParameter = obs != null ?
                new ObjectParameter("obs", obs) :
                new ObjectParameter("obs", typeof(string));
    
            var aprovaParameter = aprova.HasValue ?
                new ObjectParameter("aprova", aprova) :
                new ObjectParameter("aprova", typeof(int));
    
            var justificaParameter = justifica.HasValue ?
                new ObjectParameter("justifica", justifica) :
                new ObjectParameter("justifica", typeof(int));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction<RetornoEstruturaJustifica>("STP_INICIO_TAREFA_JUST", projetoIdParameter, subFaseProjetoIdParameter, usuarioIdParameter, dataInicioParameter, dataFimParameter, obsParameter, aprovaParameter, justificaParameter);
        }
    
        public virtual ObjectResult<RetornaEstrutura> STP_RETORNA_ESTRUTURA(Nullable<int> id_estrparam)
        {
            var id_estrparamParameter = id_estrparam.HasValue ?
                new ObjectParameter("id_estrparam", id_estrparam) :
                new ObjectParameter("id_estrparam", typeof(int));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction<RetornaEstrutura>("STP_RETORNA_ESTRUTURA", id_estrparamParameter);
        }
    
        public virtual ObjectResult<RetornoTargetUsuario> STP_RETORNA_TARGET(Nullable<int> segundos_target_total, Nullable<int> idusuario)
        {
            var segundos_target_totalParameter = segundos_target_total.HasValue ?
                new ObjectParameter("segundos_target_total", segundos_target_total) :
                new ObjectParameter("segundos_target_total", typeof(int));
    
            var idusuarioParameter = idusuario.HasValue ?
                new ObjectParameter("idusuario", idusuario) :
                new ObjectParameter("idusuario", typeof(int));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction<RetornoTargetUsuario>("STP_RETORNA_TARGET", segundos_target_totalParameter, idusuarioParameter);
        }
    
        public virtual ObjectResult<ListaJustifica> STP_LISTA_JUSTIFICATIVA(Nullable<System.DateTime> dtInicio, Nullable<System.DateTime> dtFim, Nullable<int> idusuario)
        {
            var dtInicioParameter = dtInicio.HasValue ?
                new ObjectParameter("dtInicio", dtInicio) :
                new ObjectParameter("dtInicio", typeof(System.DateTime));
    
            var dtFimParameter = dtFim.HasValue ?
                new ObjectParameter("dtFim", dtFim) :
                new ObjectParameter("dtFim", typeof(System.DateTime));
    
            var idusuarioParameter = idusuario.HasValue ?
                new ObjectParameter("Idusuario", idusuario) :
                new ObjectParameter("Idusuario", typeof(int));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction<ListaJustifica>("STP_LISTA_JUSTIFICATIVA", dtInicioParameter, dtFimParameter, idusuarioParameter);
        }
    
        public virtual ObjectResult<RetornaTopProjeto> STP_RETORNA_TOP_PROJETOS()
        {
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction<RetornaTopProjeto>("STP_RETORNA_TOP_PROJETOS");
        }
    
        public virtual ObjectResult<RetornaDetalhesUsuario> STP_RETORNA_DETALHES_PROJETO_USUARIO(Nullable<int> idusuario)
        {
            var idusuarioParameter = idusuario.HasValue ?
                new ObjectParameter("idusuario", idusuario) :
                new ObjectParameter("idusuario", typeof(int));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction<RetornaDetalhesUsuario>("STP_RETORNA_DETALHES_PROJETO_USUARIO", idusuarioParameter);
        }
    
        public virtual ObjectResult<RetornaHC> STP_RETORNA_HC(Nullable<int> idprojeto)
        {
            var idprojetoParameter = idprojeto.HasValue ?
                new ObjectParameter("idprojeto", idprojeto) :
                new ObjectParameter("idprojeto", typeof(int));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction<RetornaHC>("STP_RETORNA_HC", idprojetoParameter);
        }
    
        public virtual ObjectResult<RetornaProjetoFiltro> STP_FILTRO_PROJETOS(Nullable<int> mes, Nullable<int> ano, Nullable<int> idusuario, Nullable<int> idprojeto)
        {
            var mesParameter = mes.HasValue ?
                new ObjectParameter("mes", mes) :
                new ObjectParameter("mes", typeof(int));
    
            var anoParameter = ano.HasValue ?
                new ObjectParameter("ano", ano) :
                new ObjectParameter("ano", typeof(int));
    
            var idusuarioParameter = idusuario.HasValue ?
                new ObjectParameter("idusuario", idusuario) :
                new ObjectParameter("idusuario", typeof(int));
    
            var idprojetoParameter = idprojeto.HasValue ?
                new ObjectParameter("idprojeto", idprojeto) :
                new ObjectParameter("idprojeto", typeof(int));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction<RetornaProjetoFiltro>("STP_FILTRO_PROJETOS", mesParameter, anoParameter, idusuarioParameter, idprojetoParameter);
        }
    
        public virtual ObjectResult<RetornoLogBase> STP_BUSCA_RELATORIO_LOG_BASE(Nullable<System.DateTime> dtInicio, Nullable<System.DateTime> dtFim)
        {
            var dtInicioParameter = dtInicio.HasValue ?
                new ObjectParameter("dtInicio", dtInicio) :
                new ObjectParameter("dtInicio", typeof(System.DateTime));
    
            var dtFimParameter = dtFim.HasValue ?
                new ObjectParameter("dtFim", dtFim) :
                new ObjectParameter("dtFim", typeof(System.DateTime));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction<RetornoLogBase>("STP_BUSCA_RELATORIO_LOG_BASE", dtInicioParameter, dtFimParameter);
        }
    
        public virtual ObjectResult<RetornoControleCusto> STP_BUSCA_RELATORIO_CONTROLE_CUSTOS(Nullable<System.DateTime> dtInicio, Nullable<System.DateTime> dtFim)
        {
            var dtInicioParameter = dtInicio.HasValue ?
                new ObjectParameter("dtInicio", dtInicio) :
                new ObjectParameter("dtInicio", typeof(System.DateTime));
    
            var dtFimParameter = dtFim.HasValue ?
                new ObjectParameter("dtFim", dtFim) :
                new ObjectParameter("dtFim", typeof(System.DateTime));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction<RetornoControleCusto>("STP_BUSCA_RELATORIO_CONTROLE_CUSTOS", dtInicioParameter, dtFimParameter);
        }
    
        public virtual ObjectResult<ExportarPipeline> STP_EXPORTAR_PIPELINE()
        {
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction<ExportarPipeline>("STP_EXPORTAR_PIPELINE");
        }
    }
}
