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
    
    public partial class Indigo_Telas
    {
        public Indigo_Telas()
        {
            this.Indigo_TelasUsuario = new HashSet<Indigo_TelasUsuario>();
        }
    
        public int tel_Id { get; set; }
        public string tel_Descricao { get; set; }
        public string tel_Icone { get; set; }
        public string tel_Controller { get; set; }
        public string tel_Metodo { get; set; }
    
        public virtual ICollection<Indigo_TelasUsuario> Indigo_TelasUsuario { get; set; }
    }
}
