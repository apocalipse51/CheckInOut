using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace IndigoSoft.Reports.Fixa.Model
{
    public class Team
    {
        public Team(Head head, List<Resource> Resources, int Meta) 
        {
            this.Head = head;
            this.Resources = Resources;
            this.Meta = Meta;
        }
        public Head Head { get; set; }
        public List<Resource> Resources { get; set; }
        public int Meta { get; set; }
    }
}