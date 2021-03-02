using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERC.Repository.ViewModel
{
    public class CandidateExperienceBahasaViewModel
    {
        public int ID { get; set; }
        public string LoginName { get; set; }
        public string Bahasa { get; set; }
        public string Membaca { get; set; }
        public string Berbicara { get; set; }
        public string Menulis { get; set; }
        public bool IsDeleted { get; set; }
        public DateTime CreatedWhen { get; set; }
        public DateTime ChangedWhen { get; set; }
    }
}
