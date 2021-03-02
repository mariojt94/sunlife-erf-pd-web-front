using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERC.Repository.ViewModel
{
    public class DetailContactViewModel
    {
        //wildan additional for display information in detail contact
        public int CandidateId { get; set; }
        public string Name { get; set; }
        public string Level { get; set; }
        public string SubmitDate { get; set; }
        public string StatusAgency { get; set; }
        public string Location { get; set; }
        public string Status { get; set; }
        public string VirtualAccount { get; set; }
        public bool ProfillingCheck { get; set; }
        public string DocumentCheck { get; set; }
        public int GroupId { get; set; }
        public string TemporaryAgentCode { get; set; }
        public string AgentCode { get; set; }
        public String Photo { get; set; }
    }
}
