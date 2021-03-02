using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERC.Repository.ViewModel
{
    public class CandidateKeluargaViewModel
    {
        public int ID { get; set; }
        public string LoginName { get; set; }
        public string Hubungan { get; set; }
        public string NamaLengkap { get; set; }
        public string PendidikanTerakhir { get; set; }
        public string Pekerjaan { get; set; }
        public DateTime? TanggalLahir { get; set; }
        //public string TanggalLahir { get; set; }

        public bool IsDeleted { get; set; }
        public DateTime CreatedWhen { get; set; }
        public DateTime ChangedWhen { get; set; }
    }
}
