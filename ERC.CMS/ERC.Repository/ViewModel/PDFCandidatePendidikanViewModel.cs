using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERC.Repository.ViewModel
{
    public class PDFCandidatePendidikanViewModel
    {
        public string Jenis { get; set; }
        public string NamaInstitusi { get; set; }
        public string Kota { get; set; }
        public string Jurusan { get; set; }
        public string Gelar { get; set; }
        public double IPK { get; set; }
        public DateTime TanggalMasuk { get; set; }
        public DateTime TanggalLulus { get; set; }
        public string Lembaga { get; set; }
        public string Sertifikasi { get; set; }
        public string LevelPendidikan { get; set; }
        public string TopikPelatihan { get; set; }
    }
}
