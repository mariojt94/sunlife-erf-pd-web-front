using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERC.Repository.ViewModel
{
    public class CandidateDataRekeningNpwpViewModel
    {
        public int ID { get; set; }
        public string LoginName { get; set; }
        public string NamaBank { get; set; }
        public string CabangBank { get; set; }
        public string NomorRekening { get; set; }
        public string NamaDiRekening { get; set; }
        public string NomorNPWP { get; set; }
        public string NamaWajibPajak { get; set; }
        public string HubunganDgWajibPajak { get; set; }
        public string AlamatNpwp { get; set; }
        public DateTime TanggalSubmit { get; set; }
        public DateTime TanggalUpdate { get; set; }
    }
}
