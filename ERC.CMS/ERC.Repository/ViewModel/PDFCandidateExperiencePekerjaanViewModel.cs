using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERC.Repository.ViewModel
{
    public class PDFCandidateExperiencePekerjaanViewModel
    {
        public string NamaPerusahaan { get; set; }
        public string JenisUsaha { get; set; }
        public string Posisi { get; set; }
        public DateTime TanggalMasuk { get; set; }
        public DateTime TanggalResign { get; set; }
        public string TelpKantor { get; set; }
        public int Gaji { get; set; }
        public string Tugas { get; set; }
        public string AlasanBerhenti { get; set; }
    }
}
