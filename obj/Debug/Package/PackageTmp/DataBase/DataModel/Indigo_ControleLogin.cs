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
    
    public partial class Indigo_ControleLogin
    {
        public long cll_id { get; set; }
        public Nullable<System.Guid> cll_LicId { get; set; }
        public string cll_HostName { get; set; }
        public Nullable<System.DateTime> cll_DataLogin { get; set; }
        public Nullable<System.DateTime> cll_DataPing { get; set; }
    
        public virtual Indigo_Licencas Indigo_Licencas { get; set; }
    }
}