using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERC.Repository.ViewModel
{
    public class CandidateDokumenViewModel
    {
        public int ID { get; set; }
        public string LoginName { get; set; }
        public string FileName { get; set; }
        public string Path { get; set; }
        public string Type { get; set; }
        public DateTime CreateDate { get; set; }
        public DateTime ChangedDate { get; set; }
        public bool IsDeleted { get; set; }

        //supaya bisa kirim email
        public string Email { get; set; }
    }
}
