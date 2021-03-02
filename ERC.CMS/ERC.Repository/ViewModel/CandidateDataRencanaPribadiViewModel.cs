using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERC.Repository.ViewModel
{
    public class CandidateDataRencanaPribadiViewModel
    {
        public int ID { get; set; }
        public string LoginName { get; set; }
        public string RencanaMenikah { get; set; }
        public string RencanaPunyaAnak { get; set; }
        public string RencanaLanjutKuliah { get; set; }
        public string RencanaNaikHaji { get; set; }
        public DateTime? TanggalRencanaNaikHaji { get; set; }
        public DateTime? TanggalRencanaKuliah { get; set; }
        public DateTime? TanggalRencanaPunyaAnak { get; set; }
        public DateTime? TanggalRencanaMenikah { get; set; }
        public DateTime TanggalSubmit { get; set; }
        public DateTime TanggalUpdate { get; set; }
    }
}
