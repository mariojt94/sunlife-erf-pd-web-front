using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERC.Repository.ViewModel
{
    public class CandidatePsikotesJawabanViewModel
    {
        public int ID { get; set; }
        public string LoginName { get; set; }
        public int NoPertanyaan { get; set; }
        public int Row { get; set; }
        public int Value { get; set; }
        public DateTime SubmitDate { get; set; }
    }
}
