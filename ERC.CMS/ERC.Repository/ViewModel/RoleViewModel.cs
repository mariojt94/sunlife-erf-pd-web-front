using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERC.Repository.ViewModel
{
    public class RoleViewModel
    {
        public int Id { get; set; }
        public string RoleName { get; set; }
        public int GroupId { get; set; }
        public string GroupName { get; set; }
        public bool IsHO { get; set; }
        public bool IsActive { get; set; }
        public bool IsDelete { get; set; }
        public int Length { get; set; }
        public string Url { get; set; }
    }
}
