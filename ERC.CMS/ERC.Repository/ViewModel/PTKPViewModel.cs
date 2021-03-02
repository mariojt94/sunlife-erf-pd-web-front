using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERC.Repository.ViewModel
{
    public class PTKPViewModel
    {
        public int Id { get; set; }
        public string Gender { get; set; }
        public string StatusPerkawinan { get; set; }
        public string MaritalStatus { get; set; }
        public string Dependencies { get; set; }
        public string PTKPStatus { get; set; }
        public decimal PTKPPerMonth { get; set; }
        public decimal PTKPPerYear { get; set; }
    }
}
