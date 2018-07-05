using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace IndigoSoft.Reports.Fixa.Model
{
    public class Horas
    {        
        public Horas(string tempo, string horaInicio, string horaFim, string dataInicio, string dataFim)
        {
            this.Tempo = tempo;
            this.HoraFim = horaFim;
            this.HoraInicio = horaInicio;
            this.DataFim = dataFim;
            this.DataInicio = dataInicio;
        }
        public string Tempo { get; set; }
        public string DataInicio { get; set; }
        public string DataFim { get; set; }
        public string HoraInicio { get; set; }
        public string HoraFim { get; set; }        
    }
}