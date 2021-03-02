using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERC.Repository.ViewModel
{
    public class CandidateEducationViewModel
    {
        public int Id { get; set; }
        public string InstitutionName { get; set; }
        public int CandidateId { get; set; }
        public string YearFrom { get; set; }
        public string YearTo { get; set; }
        public string Level { get; set; }
        //additional untuk validasi data apakah data baru atau bukan
        public string StatusData { get; set; }
    }
}
