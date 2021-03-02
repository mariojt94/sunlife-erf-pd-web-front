using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERC.Repository.ViewModel
{
    public class CandidateFileViewModel
    {
        public int CandidateId { get; set; }
        public string Type { get; set; }
        public int FileID { get; set; }
        public string FileName { get; set; }
        public string Path { get; set; }
        public string Base64 { get; set; }
    }
}
