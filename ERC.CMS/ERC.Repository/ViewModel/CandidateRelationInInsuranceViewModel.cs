using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERC.Repository.ViewModel
{
    public class CandidateRelationInInsuranceViewModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int CandidateId { get; set; }
        public string Relation { get; set; }
        public string CompanyName { get; set; }
        public string Position { get; set; }
        public int Year { get; set; }
        //additional untuk validasi data apakah data baru atau bukan
        public string StatusData { get; set; }
    }
}
