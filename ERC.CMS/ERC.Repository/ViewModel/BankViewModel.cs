using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERC.Repository.ViewModel
{
    public class BankViewModel
    {
        public int ID { get; set; }
        public string BankCode { get; set; }
        public string BankName { get; set; }
        public DateTime CreatedWhen { get; set; }
        public string CreatedBy { get; set; }
        public DateTime ChangedWhen { get; set; }
        public string ChangedBy { get; set; }
        public bool IsActive { get; set; }
        public bool IsDelete { get; set; }
        public string Url { get; set; }

        public int Length { get; set; }

    }
}
