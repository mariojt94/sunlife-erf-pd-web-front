using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERC.Repository.ViewModel
{
    public class LocationViewModel
    {
        public int Id { get; set; }
        public string AgentLocationCode { get; set; }
        public string AgentLocation { get; set; } //INI BUAT NAME BRANCH
        public string Url { get; set; }
        public bool IsActive { get; set; }
        public bool IsDelete { get; set; }
        //aditional untuk insert location di recruitment form
        public int CandidateId { get; set; }
        public bool IsApproved { get; set; }

        public int Length { get; set; }

        //after mom uat
        public string Type { get; set; }
        public string PhoneNumber { get; set; }
        public string Email { get; set; }
        public string NameBranch { get; set; }
        public string KPMOwnerName { get; set; }
        public string CreatedBy { get; set; }
        public string BranchAdmin { get; set; }

        public string PemilikKPM { get; set; }
        public string NamaPemilikKPM { get; set; }
    }
}
