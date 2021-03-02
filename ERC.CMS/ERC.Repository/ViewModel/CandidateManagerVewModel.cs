using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERC.Repository.ViewModel
{
    public class CandidateManagerVewModel
    {
        public string AgentCode { get; set; }
        public string DisplayName { get; set; }
        public string AgentLocationCode { get; set; }
        public string AgentLocation { get; set; }
        public string ManagerPosition { get; set; }
        public int ManagerHierarki { get; set; }
    }
}
