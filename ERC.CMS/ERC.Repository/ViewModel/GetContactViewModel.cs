using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERC.Repository.ViewModel
{
    public class GetContactViewModel
    {
        public string agentCode { get; set; }
        public string excludeContact { get; set; }
        public int limit { get; set; }
    }
}
