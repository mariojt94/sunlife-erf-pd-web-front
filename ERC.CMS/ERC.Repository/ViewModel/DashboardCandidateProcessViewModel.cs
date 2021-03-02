using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERC.Repository.ViewModel
{
    public class DashboardCandidateProcessViewModel
    {

        public int Id { get; set; }
        public string Name { get; set; }
        public string Level { get; set; }
        public string Status { get; set; }
        public int Month { get; set; }
        public int Year { get; set; }
        public DateTime? LastUpdate { get; set; }
        public int Length { get; set; }
    }
}
