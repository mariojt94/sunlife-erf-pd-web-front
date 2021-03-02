using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERC.Repository.ViewModel
{
    public class SunAdvisorResult
    {
        public string result { get; set; }
        public string message { get; set; }
        public string agentCode { get; set; }
        public string agentName { get; set; }
        public bool IsTokenExists { get; set; }
        public bool IsDataExist { get; set; }
        public bool IsSucced { get; set; }
        public string ErfToken { get; set; }
        public string ElearningToken { get; set; }
    }
}
