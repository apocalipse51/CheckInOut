using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace IndigoSoft.Reports.Fixa.Model
{
    public class Head
    {
        public Head(string Nome)
        {
            this.Nome = Nome;
        }

        public string Nome { get; set; }
    }
}