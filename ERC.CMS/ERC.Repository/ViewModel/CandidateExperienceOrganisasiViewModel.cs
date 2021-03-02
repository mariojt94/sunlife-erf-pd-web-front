    using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERC.Repository.ViewModel
{
public class CandidateExperienceOrganisasiViewModel
    {
        public int ID { get; set; }
        public string LoginName { get; set; }
        public string NamaOrganisasi { get; set; }
        public string Jabatan { get; set; }
        public string Kegiatan { get; set; }
        public int TanggalMasuk { get; set; }
        public int TanggalBerhenti { get; set; }
        public bool IsDeleted { get; set; }
        public DateTime CreatedWhen { get; set; }
        public DateTime ChangedWhen { get; set; }
    }
}
