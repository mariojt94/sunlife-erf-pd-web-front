using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERC.Repository.ViewModel
{
    public class DashboardActivitySummaryViewModel
    {
        public int Month { get; set; }
        public int Year { get; set; }
        public int RfSubmit { get; set; }
        public int RfProses { get; set; }
        public int AgentActivated { get; set; } 
    }
}
