using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace IndigoSoft.Reports.Fixa.Model.Controle_Ponto
{
    public class Data
    {
        public Data(string dia)
        {
            this.Dia = dia;            
        }
        
        public string Dia { get; set; }
        public List<string> Horas { get; set; }
        public string Tempo { get; set; }
    }
}