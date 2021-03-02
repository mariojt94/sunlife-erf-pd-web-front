using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERC.Repository.ViewModel
{
    public class CandidateStatusViewModel
    {
        public DateTime Date { get; set; }
        public int CandidateID { get; set; }
        public string RecruiterLoginName { get; set; }
        public string ManagerLoginName { get; set; }
        public string Status { get; set; } 
    }
}
