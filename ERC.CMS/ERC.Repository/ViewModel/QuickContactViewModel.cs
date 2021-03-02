using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERC.Repository.ViewModel
{
    public class QuickContactViewModel
    {
        public string RecruiterAgentCode { get; set; }
        public int Level { get; set; }
        public int Id { get; set; }
        public string Name { get; set; }
        public string CityCode { get; set; }
        public int GroupLevel { get; set; }
        public string Gender { get; set; }
        public string PhoneNo { get; set; }
        public DateTime BirthDate { get; set; }
        public string Profession { get; set; }
        public string Status { get; set; }
        public DateTime? JoinDate { get; set; }
        public DateTime? CreatedWhen { get; set; }
        public int Length { get; set; }
        public string Photo { get; set; }
        public string IDFromMobile { get; set; }
    }
}
