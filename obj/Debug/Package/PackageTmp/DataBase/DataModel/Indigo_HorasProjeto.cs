//------------------------------------------------------------------------------
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
    using System.Collections.Generic;
    
    public partial class Indigo_HorasProjeto
    {
        public int hpo_Id { get; set; }
        public Nullable<int> hpo_prjId { get; set; }
        public Nullable<int> hpo_sfpId { get; set; }
        public Nullable<System.DateTime> hpo_DataHoraInicio { get; set; }
        public Nullable<System.DateTime> hpo_DataHoraFim { get; set; }
        public Nullable<int> hpo_usrId { get; set; }
        public string hpo_Observacao { get; set; }
        public Nullable<int> hpo_jtfAprovado { get; set; }
        public Nullable<int> hpo_jtfSequencia { get; set; }
        public string hpo_jtfNome { get; set; }
    
        public virtual Indigo_Projeto Indigo_Projeto { get; set; }
        public virtual Indigo_SubfaseProjeto Indigo_SubfaseProjeto { get; set; }
        public virtual Indigo_Usuario Indigo_Usuario { get; set; }
    }
}
