using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERC.Repository.ViewModel
{
    public class CandidateDependencyViewModel
    {
        public int Id { get; set; }
        public int CandidateId { get; set; }
        public string Status { get; set; }
        public string Name { get; set; }
        public DateTime BirthDate { get; set; }

        //additional untuk validasi data apakah data baru atau bukan
        public string StatusData { get; set; }
    }
}