using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERC.Repository.ViewModel
{
    public class CandidatePapikostikSoalViewModel
    {
        public int ID { get; set; }
        public int SoalNo { get; set; }
        public string Pilihan1 { get; set; }
        public string Pilihan2 { get; set; }
        public int IsDelete { get; set; }
    }
}
