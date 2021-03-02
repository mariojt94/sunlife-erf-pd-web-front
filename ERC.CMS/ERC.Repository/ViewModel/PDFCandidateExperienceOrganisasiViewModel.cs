using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERC.Repository.ViewModel
{
    public class PDFCandidateExperienceOrganisasiViewModel
    {
        public string NamaOrganisasi { get; set; }
        public string Jabatan { get; set; }
        public string Kegiatan { get; set; }
        public DateTime TanggalMasuk { get; set; }
        public DateTime TanggalBerhenti { get; set; }
    }
}
