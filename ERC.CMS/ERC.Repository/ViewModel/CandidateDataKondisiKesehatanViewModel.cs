using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERC.Repository.ViewModel
{
    public class CandidateDataKondisiKesehatanViewModel
    {
        public int ID { get; set; }
        public string LoginName { get; set; }
        public string IsSehat { get; set; }
        public string KondisiKesehatan { get; set; }
        public string IsPernahDirawat { get; set; }
        public string Penyakit { get; set; }
        public DateTime? TanggalSakit { get; set; }
        public string RS { get; set; }
        public string LamaDirawat { get; set; }
        public string IsKambuh { get; set; }
        public string IsHamil { get; set; }
        public DateTime TanggalSubmit { get; set; }
        public DateTime TanggalUpdate { get; set; }
    }
}
