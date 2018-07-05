using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace IndigoSoft.Reports.Fixa.Model.Estrutura
{
    public class Head
    {
        public Head(int id, string nome)
        {
            this.Id = id;
            this.Nome = nome;
        }

        public int Id { get; set; }
        public string Nome { get; set; }
    }
}