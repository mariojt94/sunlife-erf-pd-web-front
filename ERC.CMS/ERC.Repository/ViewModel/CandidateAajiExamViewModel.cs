using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERC.Repository.ViewModel
{
    public class CandidateAajiExamViewModel
    {
        public int AajiExamId { get; set; }
        public DateTime AajiExamDate { get; set; }
        public string ExamType { get; set; }
        public string ExamLocationId { get; set; }
        public string ExamLocationName { get; set; }
        public string CandidateId { get; set; }
        public bool IsReschedule { get; set; }
        public string ProductType { get; set; }
    }
}
