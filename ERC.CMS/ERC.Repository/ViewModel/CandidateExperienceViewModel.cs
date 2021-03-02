using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERC.Repository.ViewModel
{
    public class CandidateExperienceViewModel
    {
        public int Id { get; set; }
        public int CandidateId { get; set; }
        public string CompanyName { get; set; }
 
        public string QuitReason { get; set; }
        public string Position { get; set; }
        public string FromDate { get; set; }
        public string ToDate { get; set; }

        //additional untuk validasi data apakah data baru atau bukan
        public string StatusData { get; set; }

        //list data lainnya di halaman data pekerjaan
        public List<CandidateExperiencePekerjaanViewModel> Pekerjaan { get; set; }
        public List<CandidateExperienceOrganisasiViewModel> Organisasi { get; set; }
        public List<CandidateExperiencePrestasiViewModel> Prestasi { get; set; }
        public List<CandidateExperienceBahasaViewModel> Bahasa { get; set; }
        public List<CandidateExperienceKeahlianViewModel> Keahlian { get; set; }
        public List<CandidateExperienceMinatViewModel> Minat { get; set; }
        public List<CandidateExperiencePlusMinViewModel> PlusMin { get; set; }
    }
}
