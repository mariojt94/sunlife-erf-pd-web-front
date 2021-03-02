using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERC.Repository.ViewModel
{
    public class JadwalInterviewViewModel
    {
        public int ID { get; set; }
        public string LoginName { get; set; }
        public string WaktuInterview1 { get; set; }
        public DateTime TanggalInterview1 { get; set; }
        public string LokasiInterview1 { get; set; }
        public string LokasiInterview2 { get; set; }
        public DateTime TanggalInterview2 { get; set; }
        public string WaktuInterview2 { get; set; }

        public string CatatanInterview1 { get; set; }

        public string CatatanInterview2 { get; set; }
        public string RecruiterAgentCodeInterview2 { get; set; }
        public string RecruiterAgentCodeInterview1 { get; set; }
    }
}
