using IndigoSoft.Reports.Fixa.Model.Controle_Ponto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace IndigoSoft.Reports.Fixa.Model
{
    public class Resource
    {
        public Resource(string Nome, string Estrutura)
        {
            this.Nome = Nome;
            this.Estrutura = Estrutura;
        }

        public string Nome { get; set; }
        public string Estrutura { get; set; }                
        public List<Data> Datas { get; set; }
        public List<Horas> Horas { get; set; }
    }
}