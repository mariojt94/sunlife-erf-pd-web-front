using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERC.Repository.ViewModel
{
    public class ProfilingQuetionViewModel
    {
        public int ID { get; set; }
        public string Description { get; set; }
        public int GroupID { get; set; }
        public string GroupName { get; set; }
        public bool IsActive { get; set; }
        public bool IsDelete { get; set; }
        public int Length { get; set; }
        public List<ProfilingOptionViewModel> Option { get; set; }
        public int Number { get; set; }
        public decimal Point { get; set; }
        public int Answer { get; set; }
        public string Url { get; set; }
    }
}
