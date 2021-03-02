using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERC.Repository.ViewModel
{
    public class DocumentCheckViewModel
    {
        public int NUMBER { get; set; }
        public int CandidateId { get; set; }
        public string CandidateName { get; set; }
        public string AgentLocation { get; set; }
        public string NamaBranch { get; set; }
        public string Status { get; set; }
        public string Reason { get; set; }
        public string RecruiterAgentCode { get; set; }
        public string RecruiterName { get; set; }
        public string TeamCode { get; set; }
        public string TeamName { get; set; }
        public string SubmitDate { get; set; }
        public string UpdateDate { get; set; }
        public string TemporaryAgentCode { get; set; }
        public string Level { get; set; }
        public int AmlPathId { get; set; }
        public int AtfPathId { get; set; }
        public int GooglePathId { get; set; }
        public int ATFAMLGOOGLE { get; set; }
        public int Length { get; set; }
        public string CandidateStatus { get; set; }
        public string StatusApproval { get; set; }
        public string DocumentStatus { get; set; }
        public string ReasonStatus { get; set; }
    }
}
