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
    
    public partial class Indigo_HorasProjetoAtalho
    {
        public int hpoa_Id { get; set; }
        public Nullable<int> hpoa_prjId { get; set; }
        public Nullable<int> hpoa_sfpId { get; set; }
        public Nullable<int> hpoa_usrId { get; set; }
        public string hpoa_Observacao { get; set; }
        public string hpoa_Atalho { get; set; }
    
        public virtual Indigo_Projeto Indigo_Projeto { get; set; }
        public virtual Indigo_SubfaseProjeto Indigo_SubfaseProjeto { get; set; }
        public virtual Indigo_Usuario Indigo_Usuario { get; set; }
    }
}
