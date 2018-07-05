using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace IndigoSoft.Reports.Fixa.Models
{
    public class CsvUsuario
    {
        public string Login { set; get; }
        public int PerfilId { set; get; }
        public int FilialId { set; get; }
        public string NomeUsuario { set; get; }
        public string LoginAvaya { set; get; }
        public string UsuarioSiebel { set; get; }
        public string SenhaSiebel { set; get; }
        public string Usuario360 { set; get; }
        public string Senha360 { set; get; }
        public int Area { set; get; }
    }
}

