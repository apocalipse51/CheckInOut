using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace IndigoSoft.Reports.Fixa.Model.Estrutura
{
    public class Estrutura
    {
        public Estrutura (int uId, string nome, List<Recurso> res)
        {
            this.EstruturaNome = nome;
            this.Recursos = res;
            this.UserId = uId;           
        }
        public int UserId { get; set; }
        public string EstruturaNome { get; set; }
        public List<Recurso> Recursos { get; set; }
    }
}