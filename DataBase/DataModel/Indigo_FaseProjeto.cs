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
    
    public partial class Indigo_FaseProjeto
    {
        public Indigo_FaseProjeto()
        {
            this.Indigo_SubfaseProjeto = new HashSet<Indigo_SubfaseProjeto>();
        }
    
        public int fpo_Id { get; set; }
        public string fpo_Descricao { get; set; }
    
        public virtual ICollection<Indigo_SubfaseProjeto> Indigo_SubfaseProjeto { get; set; }
    }
}
