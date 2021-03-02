using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERC.Repository.ViewModel
{
    public class HierarkiViewModel
    {
        public int ID { get; set; }
        public string AgentCode { get; set; }
        public string AgentName { get; set; }
        public string RoleRecruiter { get; set; }
        public string ApproverCode { get; set; }
        public string ApproverName { get; set; }
        public int LevelId { get; set; }
        public string RoleName { get; set; }
        public int Sequence { get; set; }
        public bool IsActive { get; set; }
        public bool IsDelete { get; set; }
        public int Length { get; set; }
        public string LocationCode { get; set; }
        public string BranchName { get; set; }
    }
    public class HierarkiTemplateViewModel {
        public String AgentCode { get; set; }
        public String AM { get; set; }
        public String SAM { get; set; }
        public String AD { get; set; }
        public String NAD { get; set; }
        public String Location { get; set; }
        public String SDM { get; set; }
        public String RSDH { get; set; }
        public String NSH { get; set; }
        public String CAO { get; set; }
    }
}
