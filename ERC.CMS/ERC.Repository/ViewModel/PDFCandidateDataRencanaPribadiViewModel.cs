using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERC.Repository.ViewModel
{
    public class PDFCandidateDataRencanaPribadiViewModel
    {
        public int ID { get; set; }
        public string LoginName { get; set; }

        public string RencanaMenikah { get; set; }
        public bool YaBerencanaMenikah { get; set; }
        public bool TidakBerencanaMenikah { get; set; }

        public string RencanaPunyaAnak { get; set; }
        public bool YaBerencanaPunyaAnak { get; set; }
        public bool TidakBerencanaPunyaAnak { get; set; }

        public string RencanaLanjutKuliah { get; set; }
        public bool YaBerencanaLanjutKuliah { get; set; }
        public bool TidakBerencanaLanjutKuliah { get; set; }

        public string RencanaNaikHaji { get; set; }
        public bool YaBerencanaNaikHaji { get; set; }
        public bool TidakBerencanaNaikHaji { get; set; }

        public DateTime TanggalRencanaNaikHaji { get; set; }
        public string TanggalRencanaNaikHajiConvert { get; set; }
        public DateTime TanggalRencanaKuliah { get; set; }
        public string TanggalRencanaKuliahConvert { get; set; }
        public DateTime TanggalRencanaPunyaAnak { get; set; }
        public string TanggalRencanaPunyaAnakConvert { get; set; }
        public DateTime TanggalRencanaMenikah { get; set; }
        public string TanggalRencanaMenikahConvert { get; set; }
    }
}
