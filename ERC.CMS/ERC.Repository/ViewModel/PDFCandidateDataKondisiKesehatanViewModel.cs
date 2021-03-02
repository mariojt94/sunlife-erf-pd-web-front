using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERC.Repository.ViewModel
{
   public class PDFCandidateDataKondisiKesehatanViewModel
    {
        public int ID { get; set; }
        public string LoginName { get; set; }
        public string KondisiKesehatan { get; set; }

        public string IsSehat { get; set; }
        public bool YaSehat { get; set; }
        public bool TidakSehat { get; set; }

        public string IsPernahDirawat { get; set; }
        public bool YaPernahDirawat { get; set; }
        public bool TidakPernahDirawat { get; set; }


        public string Penyakit { get; set; }
        public DateTime TanggalSakit { get; set; }
        public string TanggalSakitConvert { get; set; }
        public string RS { get; set; }
        public string LamaDirawat { get; set; }
        
        public string IsKambuh { get; set; }
        public bool YaKambuh { get; set; }
        public bool TidakKambuh { get; set; }


        public string IsHamil { get; set; }
        public bool YaHamil { get; set; }
        public bool TidakHamil { get; set; }

    }
}
