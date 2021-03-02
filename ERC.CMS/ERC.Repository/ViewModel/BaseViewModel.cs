using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERC.Repository.ViewModel
{
    public abstract class BaseViewModel
    {
        public bool IsActive { get; set; }
        public DateTime CreatedWhen { get; set; }
        public string CreatedBy { get; set; }
        public DateTime ChangedWhen { get; set; }
        public string ChangedBy { get; set; }
    }
}
