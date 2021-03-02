using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERC.Repository.ViewModel
{
public class CandidateExperienceKeahlianViewModel
    {
        public int ID { get; set; }
        public string LoginName { get; set; }
        public string NamaKeahlian { get; set; }
        public string Sertifikasi { get; set; }
        public bool IsDeleted { get; set; }
        public DateTime CreatedWhen { get; set; }
        public DateTime ChangedWhen { get; set; }
    }
}
