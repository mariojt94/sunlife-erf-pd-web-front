using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERC.Repository.ViewModel
{
    public class DetailApprovalFormViewModel
    {
        public int Id { get; set; }
        public string TemporaryAgentCode { get; set; }
        public string Name { get; set; }
        public string Level { get; set; }
        public string TeamName { get; set; }
        public string Location { get; set; }
        public string Manager { get; set; }
        public string RecruiterName { get; set; }
        public string Photo { get; set; }
    }
}
