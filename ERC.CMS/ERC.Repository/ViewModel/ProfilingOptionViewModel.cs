using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERC.Repository.ViewModel
{
    public class ProfilingOptionViewModel
    {
        public int ID { get; set; }
        public int QuestionId { get; set; }
        public string Description { get; set; }
        public bool IsActive { get; set; }
        public decimal Point { get; set; }
        public int Sequence { get; set; }
        public int Length { get; set; }
        public int Number { get; set; }
    }
}
