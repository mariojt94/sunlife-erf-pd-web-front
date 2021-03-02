using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERC.Repository.ViewModel
{
    public class ApprovalFormViewModel
    {
        public int Id { get; set; }
        public int CandidateId { get; set; }
        public string RecruiterName { get; set; }
        public string Name { get; set; }
        public string Level { get; set; }
        public string Location { get; set; }
        public string CandidateStatus { get; set; }
        public string Photo { get; set; }
        public int Length { get; set; }
    }
    public class ApprovalProgressViewModel
    {
        public int ID { get; set; }
        public int CandidateId { get; set; }
        public string CandidateName { get; set; }
        public string RecruiterCode { get; set; }
        public string RecruiterName { get; set; }
        public string ApproverCode { get; set; }
        public string ApproverName { get; set; }
        public string StatusApproval { get; set; }
        public string Reason { get; set; }
        public DateTime? ApprovalDate { get; set; }
        public string RoleName { get; set; }
        public int Length { get; set; }
        public int CandidateLevel { get; set; }
    }
}
