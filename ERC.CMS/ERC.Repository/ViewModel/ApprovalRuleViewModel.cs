using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERC.Repository.ViewModel
{
    public class ApprovalRuleViewModel
    {
        public int ID { get; set; }
        public string CandidateLevel { get; set; }
        public string CandidateLevelName { get; set; }
        public int CandidateLevelId { get; set; }
        public int ApprovalLevelId { get; set; }
        public string LastApprover { get; set; }
        public bool IsActive { get; set; }
        public bool IsDelete { get; set; }
        public int Length { get; set; }
    }
}
