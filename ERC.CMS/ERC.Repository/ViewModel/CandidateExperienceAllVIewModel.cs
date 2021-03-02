using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERC.Repository.ViewModel
{
public class CandidateExperienceAllVIewModel
    {
        public List<CandidateExperiencePekerjaanViewModel> Pekerjaan { get; set; }
        public List<CandidateExperienceOrganisasiViewModel> Organisasi { get; set; }
        public List<CandidateExperiencePrestasiViewModel> Prestasi { get; set; }
        public List<CandidateExperienceBahasaViewModel> Bahasa { get; set; }
        public List<CandidateExperienceKeahlianViewModel> Keahlian { get; set; }
        public List<CandidateExperienceMinatViewModel> Minat { get; set; }
        public List<CandidateExperiencePlusMinViewModel> PlusMin { get; set; }
    }
}
