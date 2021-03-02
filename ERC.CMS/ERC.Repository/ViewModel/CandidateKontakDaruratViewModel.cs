using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERC.Repository.ViewModel
{
    public class CandidateKontakDaruratViewModel
    {
        public int ID { get; set; }
        public string LoginName { get; set; }
        public string NamaLengkap { get; set; }
        public string Alamat { get; set; }
        public string Hubungan { get; set; }
        public string NoTelepon { get; set; }
        public bool IsDeleted { get; set; }
        public DateTime CreatedWhen { get; set; }
        public DateTime ChangedWhen { get; set; }
        public string ChangedBy { get; set; }

        public string NamaLengkap2 { get; set; }
        public string Alamat2 { get; set; }
        public string Hubungan2 { get; set; }
        public string NoTelepon2 { get; set; }
    }
}
