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
    
    public partial class Indigo_HorasNTrab
    {
        public int hnt_Id { get; set; }
        public Nullable<int> hnt_prjId { get; set; }
        public Nullable<int> hnt_sfpId { get; set; }
        public Nullable<System.DateTime> hnt_DataHoraInicio { get; set; }
        public Nullable<System.DateTime> hnt_DataHoraFim { get; set; }
        public Nullable<int> hnt_usrId { get; set; }
        public string hnt_Observacao { get; set; }
        public Nullable<int> hnt_jtfAprovado { get; set; }
        public Nullable<int> hnt_jtfSequencia { get; set; }
        public string hnt_jtfNome { get; set; }
    
        public virtual Indigo_Projeto Indigo_Projeto { get; set; }
        public virtual Indigo_SubfaseProjeto Indigo_SubfaseProjeto { get; set; }
        public virtual Indigo_Usuario Indigo_Usuario { get; set; }
    }
}
