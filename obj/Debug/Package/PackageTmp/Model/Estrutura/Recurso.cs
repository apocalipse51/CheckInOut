using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace IndigoSoft.Reports.Fixa.Model.Estrutura
{
    public class Recurso
    {
        public Recurso(string nome, int id, int eId)
        {
            this.Nome = nome;
            this.Id = id;
            this.EstruturaId = eId;
        }

        public int Id { get; set; }

        public int EstruturaId { get; set; }

        public string Nome { get; set; }
    }
}