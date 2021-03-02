using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERC.Repository.ViewModel
{
    public class CandidateReferenceViewModel
    {
        public int Id { get; set; }
        public int CandidateId { get; set; }
        public string Name { get; set; }
        public string Organization { get; set; }
        public string Relation { get; set; }
        public string PhoneNumber { get; set; }
        public string HasKnownFor { get; set; }
        //additional untuk validasi data apakah data baru atau bukan
        public string StatusData { get; set; }
    }
}
