using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERC.Repository.ViewModel
{
public class CandidateExperienceMinatViewModel
    {
        public int ID { get; set; }
        public string LoginName { get; set; }
        public int? Sales { get; set; }
        public int? Computer { get; set; }
        public int? Training { get; set; }
        public int? Accounting { get; set; }
        public int? Engineering { get; set; }
        public int? Law { get; set; }
        public int? Administration { get; set; }
        public int? Manufacture { get; set; }
        public int? SDM { get; set; }
        public int? FrontLiners { get; set; }
        public int? Advertising { get; set; }
        public int? Research { get; set; }
        public int? Other { get; set; }
    }
}
