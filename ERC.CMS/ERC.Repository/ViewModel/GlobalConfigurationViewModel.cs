using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERC.Repository.ViewModel
{
    public class GlobalConfigurationViewModel
    {
        public string Keyword { get; set; }
        public string KeyGroup { get; set; }
        public string Value { get; set; }
        public string CreatedBy { get; set; }
        public DateTime CreatedWhen { get; set; }
        public string ChangedBy { get; set; }
        public DateTime ChangedWhen { get; set; }
        public int Length { get; set; }
        public string Url { get; set; }
    }
}
